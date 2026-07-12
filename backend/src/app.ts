import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { HTTP_STATUS } from "./constants/httpStatus";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
export default app;