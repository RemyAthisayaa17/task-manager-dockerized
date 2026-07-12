// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: string;
  role: string;
  isActive?: boolean;

  createdAt?: string;
  createdBy?: number;
  createdByName?: string | null;
  updatedAt?: string;
  updatedBy?: number;
  updatedByName?: string | null;

  /** Returned by admin service: prisma _count relation */
  _count?: { tasks: number };
}

/**
 * Stored in AuthContext after login.
 * Backend loginService returns: { id, name, email, role }
 */
export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  userId: number;

  createdAt: string;
  updatedAt: string;

  createdBy?: number;
  createdByName?: string | null;
  updatedBy?: number;
  updatedByName?: string | null;

  user?: {
    id: number;
    name: string;
    email: string;
  };
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
}

export interface UserStats {
  total: number;
  admins: number;
  members: number;
}

export interface UnifiedTasksResponse {
  tasks: Task[];
  stats: TaskStats;
  pagination: PaginationMeta;
  isFiltered: boolean;
}

export interface UnifiedUsersResponse {
  users: User[];
  stats: UserStats;
  pagination: PaginationMeta;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  errors?: string[];
}

// ─── Form Inputs ──────────────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  password: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
}