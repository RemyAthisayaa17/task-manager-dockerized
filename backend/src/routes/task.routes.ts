import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../validation/task.validation";
import { validateTaskId } from "../middleware/validate.middleware";

const router = Router();

router.use(authMiddleware);

// Issue #10: single unified GET /tasks?page=&limit=&search=&status=
router.get("/", getTasks);

// CRUD routes
router.post("/", validate(createTaskSchema), createTask);
router.get("/:id", validateTaskId, getTaskById);
router.put("/:id", validateTaskId, validate(updateTaskSchema), updateTask);
router.delete("/:id", validateTaskId, deleteTask);

export default router;