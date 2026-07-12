import { Router } from "express";
import { getAllUsers, getUserById, deleteUser } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware, isAdmin);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

export default router;