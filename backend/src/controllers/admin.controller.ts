import { Response } from "express";
import { AuthRequest } from "../types/user.types";
import { sendSuccess, sendError } from "../utils/response";
import { getUsersUnifiedService, getUserByIdService, deleteUserService } from "../services/admin.service";
import { HTTP_STATUS } from "../constants/httpStatus";

// Issue #10: unified GET /admin/users with page, limit, search, role query params
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = (req.query.search as string) || "";
    const role = (req.query.role as string) || "";

    const result = await getUsersUnifiedService({ page, limit, search, role });
    sendSuccess(res, "Users fetched successfully", result);
  } catch {
    sendError(res, "Failed to fetch users", HTTP_STATUS.SERVER_ERROR);
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId) || userId <= 0) {
      sendError(res, "Invalid user ID", HTTP_STATUS.BAD_REQUEST);
      return;
    }
    const user = await getUserByIdService(userId);
    sendSuccess(res, "User fetched successfully", user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    const statusCode = message === "User not found" ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.SERVER_ERROR;
    sendError(res, message, statusCode);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetId = parseInt(req.params.id);
    const adminId = req.user!.id;

    if (isNaN(targetId) || targetId <= 0) {
      sendError(res, "Invalid user ID", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    if (targetId === adminId) {
      sendError(res, "You cannot delete your own account", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const deleted = await deleteUserService(targetId, adminId);
    sendSuccess(res, "User deleted successfully", deleted);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    const statusCode = message === "User not found" ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.SERVER_ERROR;
    sendError(res, message, statusCode);
  }
};