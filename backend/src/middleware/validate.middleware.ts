import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { sendError } from "../utils/response";
import { HTTP_STATUS } from "../constants/httpStatus";

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e: any) => e.message);
      sendError(res, "Validation failed", HTTP_STATUS.BAD_REQUEST, errors);
      return;
    }
    req.body = result.data;
    next();
  };

export const validateTaskId = (req: Request, res: Response, next: NextFunction): void => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    sendError(res, "Invalid task ID", HTTP_STATUS.BAD_REQUEST);
    return;
  }
  next();
};