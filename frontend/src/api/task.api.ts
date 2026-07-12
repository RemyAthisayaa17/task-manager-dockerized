import api from "./axios";
import type {
  ApiResponse,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  UnifiedTasksResponse,
} from "../types/models";

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  /** Admin only: filter tasks by the role of their owner (admin | user) */
  userRole?: string;
}

export const getTasksApi = async (
  params: TaskQueryParams = {}
): Promise<ApiResponse<UnifiedTasksResponse>> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.userRole) query.set("userRole", params.userRole);
  const res = await api.get(`/tasks?${query.toString()}`);
  return res.data;
};

export const getTaskByIdApi = async (id: number): Promise<ApiResponse<Task>> => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTaskApi = async (
  data: CreateTaskInput
): Promise<ApiResponse<Task>> => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTaskApi = async (
  id: number,
  data: UpdateTaskInput
): Promise<ApiResponse<Task>> => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTaskApi = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};