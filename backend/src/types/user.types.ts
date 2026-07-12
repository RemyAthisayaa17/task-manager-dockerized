import { Request } from "express";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}