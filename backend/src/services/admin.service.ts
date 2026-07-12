import prisma from "../config/db";
import { ROLES } from "../constants/roles";
import { UserQueryParams } from "../types/user.types";

async function resolveUserName(id: number | null | undefined): Promise<string | null> {
  if (!id) return null;
  const u = await prisma.user.findFirst({ where: { id }, select: { name: true, role: true } });
  if (!u) return null;
  return u.role === ROLES.ADMIN ? "Admin" : u.name;
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  gender: true,
  role: true,
  isActive: true,
  createdAt: true,
  createdBy: true,
  updatedBy: true,
  _count: { select: { tasks: { where: { isVoid: false } } } },
};

async function mapUser(u: any) {
  const createdByName = await resolveUserName(u.createdBy);
  const updatedByName = await resolveUserName(u.updatedBy);
  return { ...u, createdByName, updatedByName };
}

export const getUsersUnifiedService = async (params: UserQueryParams) => {
  const { page = 1, limit = 10, search } = params;
  const scopeWhere: any = { isVoid: false };

  // Global stats — always full unfiltered scope, never changes across pages
  const [globalTotal, globalAdmins, globalMembers] = await prisma.$transaction([
    prisma.user.count({ where: scopeWhere }),
    prisma.user.count({ where: { ...scopeWhere, role: ROLES.ADMIN } }),
    prisma.user.count({ where: { ...scopeWhere, role: ROLES.USER } }),
  ]);

  const isSearching = !!search?.trim();

  if (isSearching) {
    // Search: return all matches, admins naturally first via orderBy
    const users = await prisma.user.findMany({
      where: {
        ...scopeWhere,
        OR: [
          { name: { contains: search!.trim(), mode: "insensitive" } },
          { email: { contains: search!.trim(), mode: "insensitive" } },
        ],
      },
      select: userSelect,
      orderBy: [{ role: "desc" }, { name: "asc" }],
    });
    const mapped = await Promise.all(users.map(mapUser));
    return {
      users: mapped,
      stats: { total: globalTotal, admins: globalAdmins, members: globalMembers },
      pagination: { total: users.length, page: 1, limit: users.length || limit, totalPages: 1 },
    };
  }

  
  const [allAdmins, totalMembers] = await prisma.$transaction([
    prisma.user.findMany({
      where: { ...scopeWhere, role: ROLES.ADMIN },
      select: userSelect,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where: { ...scopeWhere, role: ROLES.USER } }),
  ]);

  const adminCount = allAdmins.length;
  const totalRecords = adminCount + totalMembers;
  const totalPages = Math.ceil(totalRecords / limit) || 1;

  // Virtual window for this page
  const windowStart = (page - 1) * limit; // inclusive
  const windowEnd = page * limit;          // exclusive

  // Admins that fall inside this window
  const adminsForPage = allAdmins.slice(windowStart, Math.min(windowEnd, adminCount));

  // Members that fall inside this window
  // Members start at virtual index adminCount
  const memberWindowStart = Math.max(0, windowStart - adminCount);
  const memberWindowEnd = Math.max(0, windowEnd - adminCount);
  const memberCount = memberWindowEnd - memberWindowStart;

  const members =
    memberCount > 0
      ? await prisma.user.findMany({
          where: { ...scopeWhere, role: ROLES.USER },
          select: userSelect,
          orderBy: { name: "asc" },
          skip: memberWindowStart,
          take: memberCount,
        })
      : [];

  const combined = [...adminsForPage, ...members];
  const mapped = await Promise.all(combined.map(mapUser));

  return {
    users: mapped,
    stats: { total: globalTotal, admins: globalAdmins, members: globalMembers },
    pagination: { total: totalRecords, page, limit, totalPages },
  };
};

export const getUserByIdService = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isVoid: false },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gender: true,
      role: true,
      isActive: true,
      createdAt: true,
      createdBy: true,
      tasks: {
        where: { isVoid: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!user) throw new Error("User not found");
  return mapUser(user);
};

export const deleteUserService = async (userId: number, adminId: number) => {
  const user = await prisma.user.findFirst({ where: { id: userId, isVoid: false } });
  if (!user) throw new Error("User not found");

  await prisma.task.updateMany({
    where: { userId, isVoid: false },
    data: { isVoid: true, isActive: false, updatedBy: adminId },
  });

  return await prisma.user.update({
    where: { id: userId },
    data: { isVoid: true, isActive: false, updatedBy: adminId },
    select: { id: true, name: true, email: true },
  });
};