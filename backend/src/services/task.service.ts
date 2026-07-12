import prisma from "../config/db";
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from "../types/task.types";
import { ROLES } from "../constants/roles";
import { TASK_STATUS } from "../constants/taskStatus";

const adminInclude = { user: { select: { id: true, name: true, email: true } } };

async function resolveCreatedByName(createdBy: number | null | undefined): Promise<string | null> {
  if (!createdBy) return null;
  const creator = await prisma.user.findFirst({
    where: { id: createdBy },
    select: { name: true, role: true },
  });
  if (!creator) return null;
  return creator.role === ROLES.ADMIN ? "Admin" : creator.name;
}

async function mapTask(task: any): Promise<any> {
  const createdByName = await resolveCreatedByName(task.createdBy);
  const updatedByName = await resolveCreatedByName(task.updatedBy);
  return { ...task, createdByName, updatedByName };
}

async function mapTasks(tasks: any[]): Promise<any[]> {
  return Promise.all(tasks.map(mapTask));
}

export const createTaskService = async (data: CreateTaskInput) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: TASK_STATUS.PENDING,
      isVoid: false,
      userId: data.userId,
      createdBy: data.userId,
    },
  });
  return mapTask(task);
};

export const getTaskByIdService = async (taskId: number, userId: number, role: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, isVoid: false },
    include: adminInclude,
  });
  if (!task) throw new Error("Task not found");
  if (role !== ROLES.ADMIN && task.userId !== userId) throw new Error("Forbidden");
  return mapTask(task);
};

export const updateTaskService = async (
  taskId: number,
  userId: number,
  role: string,
  updates: UpdateTaskInput
) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, isVoid: false } });
  if (!task) throw new Error("Task not found");
  if (role !== ROLES.ADMIN && task.userId !== userId) throw new Error("Forbidden");
  if (task.status === TASK_STATUS.COMPLETED) {
    throw new Error("Completed tasks cannot be edited");
  }
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(updates.title && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.status && { status: updates.status }),
      updatedBy: userId,
    },
  });
  return mapTask(updated);
};

export const deleteTaskService = async (taskId: number, userId: number, role: string) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, isVoid: false } });
  if (!task) throw new Error("Task not found");
  if (role !== ROLES.ADMIN && task.userId !== userId) throw new Error("Forbidden");
  return await prisma.task.update({
    where: { id: taskId },
    data: { isVoid: true, isActive: false, updatedBy: userId },
  });
};

export const getTasksUnifiedService = async (
  userId: number,
  role: string,
  params: TaskQueryParams
) => {
  const { page = 1, limit = 10, search, status, userRole } = params;
  const skip = (page - 1) * limit;

  // Base scope — admin sees all, user sees own
  const scopeWhere: any = {
    isVoid: false,
    ...(role !== ROLES.ADMIN && { userId }),
  };

  // Global stats always from full unfiltered scope
  const [globalTotal, globalPending, globalCompleted] = await prisma.$transaction([
    prisma.task.count({ where: scopeWhere }),
    prisma.task.count({ where: { ...scopeWhere, status: TASK_STATUS.PENDING } }),
    prisma.task.count({ where: { ...scopeWhere, status: TASK_STATUS.COMPLETED } }),
  ]);

  // Build filtered where for paginated data
  const filteredWhere: any = { ...scopeWhere };

  if (search?.trim()) {
    filteredWhere.title = { contains: search.trim(), mode: "insensitive" };
  }

  if (status && (status === TASK_STATUS.PENDING || status === TASK_STATUS.COMPLETED)) {
    filteredWhere.status = status;
  }

  // FIX #2: Admin role-based task filter — filter tasks by the owner's role
  if (role === ROLES.ADMIN && userRole && (userRole === ROLES.ADMIN || userRole === ROLES.USER)) {
    filteredWhere.user = { role: userRole };
  }

  const isFiltered = !!(search?.trim() || status || userRole);

  let tasks: any[];
  let filteredTotal: number;

  if (isFiltered) {
    tasks = await prisma.task.findMany({
      where: filteredWhere,
      orderBy: { createdAt: "desc" },
      include: role === ROLES.ADMIN ? adminInclude : undefined,
    });
    filteredTotal = tasks.length;
  } else {
    [tasks, filteredTotal] = await prisma.$transaction([
      prisma.task.findMany({
        where: filteredWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: role === ROLES.ADMIN ? adminInclude : undefined,
      }),
      prisma.task.count({ where: filteredWhere }),
    ]);
  }

  const mapped = await mapTasks(tasks);

  return {
    tasks: mapped,
    stats: {
      total: globalTotal,
      pending: globalPending,
      completed: globalCompleted,
    },
    pagination: {
      total: filteredTotal,
      page: isFiltered ? 1 : page,
      limit: isFiltered ? filteredTotal || limit : limit,
      totalPages: isFiltered ? 1 : Math.ceil(filteredTotal / limit),
    },
    isFiltered,
  };
};