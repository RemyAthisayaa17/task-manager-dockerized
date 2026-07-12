import api from "./axios";
import type { ApiResponse, LoginInput, RegisterInput, User, JwtPayload } from "../types/models";

export const registerApi = async (
  data: RegisterInput
): Promise<ApiResponse<User>> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginApi = async (
  data: LoginInput
): Promise<ApiResponse<{ token: string; user: JwtPayload }>> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getProfileApi = async (): Promise<ApiResponse<JwtPayload>> => {
  const res = await api.get("/auth/profile");
  return res.data;
};
