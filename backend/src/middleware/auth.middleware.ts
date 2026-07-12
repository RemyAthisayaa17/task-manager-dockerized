import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types/user.types";
import { sendError } from "../utils/response";
import { HTTP_STATUS } from "../constants/httpStatus";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "No token provided", HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    sendError(res, "Invalid or expired token", HTTP_STATUS.UNAUTHORIZED);
  }
};