import { z } from "zod";
import { TASK_STATUS } from "../constants/taskStatus";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description too long").optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1, "Title cannot be empty").max(100).optional(),
    description: z.string().max(500).optional(),
    status: z
      .enum([TASK_STATUS.PENDING, TASK_STATUS.COMPLETED], {
        message: "Status must be pending or completed",
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });