export const TASK_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// API base URL
// Override via VITE_API_BASE_URL in .env
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "/api";

export const PAGINATION_LIMIT = 10;