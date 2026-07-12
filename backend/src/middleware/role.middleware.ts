import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/user.types";
import { sendError } from "../utils/response";
import { ROLES } from "../constants/roles";
import { HTTP_STATUS } from "../constants/httpStatus";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== ROLES.ADMIN) {
    sendError(res, "Access denied: Admins only", HTTP_STATUS.FORBIDDEN);
    return;
  }
  next();
};