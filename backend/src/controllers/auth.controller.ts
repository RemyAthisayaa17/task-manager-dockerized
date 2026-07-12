import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../types/user.types";
import { HTTP_STATUS } from "../constants/httpStatus";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await registerService(req.body);
    sendSuccess(res, "User registered successfully", user, HTTP_STATUS.CREATED);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    const statusCode =
      message === "Email already registered"
        ? HTTP_STATUS.CONFLICT
        : HTTP_STATUS.SERVER_ERROR;
    sendError(res, message, statusCode);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginService(req.body);
    sendSuccess(res, "Login successful", result, HTTP_STATUS.OK);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    const statusCode =
      message === "Invalid credentials"
        ? HTTP_STATUS.UNAUTHORIZED
        : HTTP_STATUS.SERVER_ERROR;
    sendError(res, message, statusCode);
  }
};

export const getProfile = (req: AuthRequest, res: Response): void => {
  sendSuccess(res, "Profile fetched successfully", req.user ?? null, HTTP_STATUS.OK);
};