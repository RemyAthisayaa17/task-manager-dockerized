import { Response } from "express";
import { AuthRequest } from "../types/user.types";
import { sendSuccess, sendError } from "../utils/response";
import {
  createTaskService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  getTasksUnifiedService,
} from "../services/task.service";
import { HTTP_STATUS, HttpStatusValue } from "../constants/httpStatus";

const getErrorStatus = (message: string): HttpStatusValue => {
  if (message === "Task not found") return HTTP_STATUS.NOT_FOUND;
  if (message === "Forbidden") return HTTP_STATUS.FORBIDDEN;
  if (message === "Completed tasks cannot be edited") return HTTP_STATUS.BAD_REQUEST;
  return HTTP_STATUS.SERVER_ERROR;
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await createTaskService({
      title: req.body.title,
      description: req.body.description,
      userId: req.user!.id,
    });
    sendSuccess(res, "Task created successfully", task, HTTP_STATUS.CREATED);
  } catch {
    sendError(res, "Failed to create task", HTTP_STATUS.SERVER_ERROR);
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    // FIX #2: admin role-based task filter
    const userRole = (req.query.userRole as string) || "";

    const result = await getTasksUnifiedService(userId, role, {
      page,
      limit,
      search,
      status,
      userRole,
    });
    sendSuccess(res, "Tasks fetched successfully", result);
  } catch {
    sendError(res, "Failed to fetch tasks", HTTP_STATUS.SERVER_ERROR);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const task = await getTaskByIdService(parseInt(req.params.id), userId, role);
    sendSuccess(res, "Task fetched successfully", task);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch task";
    sendError(res, message, getErrorStatus(message));
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const task = await updateTaskService(parseInt(req.params.id), userId, role, req.body);
    sendSuccess(res, "Task updated successfully", task);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update task";
    sendError(res, message, getErrorStatus(message));
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    await deleteTaskService(parseInt(req.params.id), userId, role);
    sendSuccess(res, "Task deleted successfully", null);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    sendError(res, message, getErrorStatus(message));
  }
};