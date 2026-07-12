import { Response } from "express";
import { HTTP_STATUS, HttpStatusValue } from "../constants/httpStatus";

export const sendSuccess = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode: HttpStatusValue = HTTP_STATUS.OK
): void => {
  res.status(statusCode).json({
    code: statusCode,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: HttpStatusValue = HTTP_STATUS.SERVER_ERROR,
  errors: unknown = null
): void => {
  const body: Record<string, unknown> = {
    code: statusCode,
    message,
    data: null,
  };

  if (errors !== null) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
};