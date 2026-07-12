import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(HTTP_STATUS.SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    code: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    data: null,
  });
};
