import { useState, useEffect, useCallback } from "react";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  PaginationMeta,
  TaskStats,
} from "../types/models";
import { PAGINATION_LIMIT } from "../constants/app.constants";
import { showToast } from "../utils/toast";
import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from "../api/task.api";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string;
  pagination: PaginationMeta | null;
  stats: TaskStats;
  searchQuery: string;
  draftSearch: string;
  statusFilter: string;
  /** Admin only: filter by owner role (admin | user | "") */
  userRoleFilter: string;
  page: number;
  setDraftSearch: (v: string) => void;
  setPage: (v: number) => void;
  submitSearch: () => void;
  applyStatusFilter: (status: string) => void;
  applyUserRoleFilter: (role: string) => void;
  clearFilters: () => void;
  createTask: (data: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: number, data: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;
  refresh: () => void;
}

const DEFAULT_STATS: TaskStats = { total: 0, pending: 0, completed: 0 };

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState<TaskStats>(DEFAULT_STATS);

  const [searchQuery, setSearchQuery] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTasksApi({
        page,
        limit: PAGINATION_LIMIT,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        userRole: userRoleFilter || undefined,
      });
      const data = res.data;
      setTasks(data?.tasks ?? []);
      if (data?.stats) setStats(data.stats);
      if (data?.pagination) setPagination(data.pagination);
      else setPagination(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load tasks";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, userRoleFilter, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const submitSearch = useCallback(() => {
    setStatusFilter("");
    setUserRoleFilter("");
    setPage(1);
    setSearchQuery(draftSearch.trim());
  }, [draftSearch]);

  const applyStatusFilter = useCallback((status: string) => {
    setUserRoleFilter("");
    setSearchQuery("");
    setDraftSearch("");
    setPage(1);
    setStatusFilter((prev) => (prev === status ? "" : status));
  }, []);

  const applyUserRoleFilter = useCallback((role: string) => {
    setStatusFilter("");
    setSearchQuery("");
    setDraftSearch("");
    setPage(1);
    setUserRoleFilter((prev) => (prev === role ? "" : role));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDraftSearch("");
    setStatusFilter("");
    setUserRoleFilter("");
    setPage(1);
  }, []);

  const createTask = async (data: CreateTaskInput): Promise<boolean> => {
    try {
      await createTaskApi(data);
      showToast("Task created successfully", "success");
      fetchTasks();
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create task";
      showToast(msg, "error");
      setError(msg);
      return false;
    }
  };

  const updateTask = async (id: number, data: UpdateTaskInput): Promise<boolean> => {
    try {
      await updateTaskApi(id, data);
      showToast("Task updated successfully", "success");
      fetchTasks();
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update task";
      showToast(msg, "error");
      setError(msg);
      return false;
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await deleteTaskApi(id);
      showToast("Task deleted successfully", "success");
      if (tasks.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchTasks();
      }
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete task";
      showToast(msg, "error");
      setError(msg);
      return false;
    }
  };

  const refresh = useCallback(() => fetchTasks(), [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    pagination,
    stats,
    searchQuery,
    draftSearch,
    statusFilter,
    userRoleFilter,
    page,
    setDraftSearch,
    setPage,
    submitSearch,
    applyStatusFilter,
    applyUserRoleFilter,
    clearFilters,
    createTask,
    updateTask,
    deleteTask,
    refresh,
  };
};