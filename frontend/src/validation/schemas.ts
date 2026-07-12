import * as yup from "yup";

// ─── Shared password rule — matches backend Zod schema exactly ────────────────
// Backend: min 8, 1 uppercase, 1 number, 1 special character
const strongPasswordRule = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Must contain at least 1 uppercase letter")
  .matches(/[0-9]/, "Must contain at least 1 number")
  .matches(/[^A-Za-z0-9]/, "Must contain at least 1 special character")
  .required("Password is required");

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  // Login only needs non-empty — the server validates credentials
  password: yup.string().min(1, "Password is required").required("Password is required"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .min(7, "Phone number is too short")
    .max(10, "Phone number is too long")
    .required("Phone is required"),
  address: yup
    .string()
    .min(3, "Address is required")
    .required("Address is required"),
  
  gender: yup
    .string()
    .oneOf(["male", "female"], "Please select a valid gender")
    .required("Gender is required"),
  password: strongPasswordRule,
});

// ─── Task Schemas ─────────────────────────────────────────────────────────────

export const createTaskSchema = yup.object({
  title: yup
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters")
    .required("Title is required"),
  description: yup
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),
});

export const updateTaskSchema = yup.object({
  title: yup
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be under 100 characters")
    .optional(),
  description: yup
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),
  status: yup
    .string()
    .oneOf(["pending", "completed"], "Status must be pending or completed")
    .optional(),
});

// ─── Types inferred from schemas ─────────────────────────────────────────────

export type LoginFormValues      = yup.InferType<typeof loginSchema>;
export type RegisterFormValues   = yup.InferType<typeof registerSchema>;
export type CreateTaskFormValues = yup.InferType<typeof createTaskSchema>;
export type UpdateTaskFormValues = yup.InferType<typeof updateTaskSchema>;