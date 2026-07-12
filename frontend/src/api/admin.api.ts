import api from "./axios";
import type { ApiResponse, User, UnifiedUsersResponse } from "../types/models";

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

// Issue #10: single unified endpoint GET /admin/users?page=&limit=&search=&role=
export const getUsersApi = async (
  params: UserQueryParams = {}
): Promise<ApiResponse<UnifiedUsersResponse>> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.role) query.set("role", params.role);
  const res = await api.get(`/admin/users?${query.toString()}`);
  return res.data;
};

// Keep for backward compatibility
export const getAllUsersApi = async (): Promise<ApiResponse<{ count: number; users: User[] }>> => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getUserByIdApi = async (id: number): Promise<ApiResponse<User>> => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const deleteUserApi = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};