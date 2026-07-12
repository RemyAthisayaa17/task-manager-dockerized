export interface CreateTaskInput {
  title: string;
  description?: string;
  userId: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  /** Admin-only: filter tasks by the role of the user they belong to */
  userRole?: string;
}