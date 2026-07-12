import { useState, useEffect, useCallback } from "react";
import type { User, PaginationMeta, UserStats } from "../types/models";
import { getUsersApi, deleteUserApi } from "../api/admin.api";
import { showToast } from "../utils/toast";
import { PAGINATION_LIMIT } from "../constants/app.constants";

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string;
  success: string;
  pagination: PaginationMeta | null;
  stats: UserStats;
  page: number;
  setPage: (v: number) => void;
  draftSearch: string;
  setDraftSearch: (v: string) => void;
  submitSearch: () => void;
  clearFilters: () => void;
  deleteUser: (id: number) => Promise<boolean>;
  refresh: () => void;
}

const DEFAULT_STATS: UserStats = { total: 0, admins: 0, members: 0 };

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [draftSearch, setDraftSearch] = useState("");

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsersApi({
        page,
        limit: PAGINATION_LIMIT,
        search: searchQuery || undefined,
      });
      const data = res.data;
      setUsers(data?.users ?? []);
      if (data?.stats) setStats(data.stats);
      setPagination(data?.pagination ?? null);
    } catch {
      const msg = "Failed to load users.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const submitSearch = useCallback(() => {
    setPage(1);
    setSearchQuery(draftSearch.trim());
  }, [draftSearch]);

  const clearFilters = useCallback(() => {
    setDraftSearch("");
    setSearchQuery("");
    setPage(1);
  }, []);

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      await deleteUserApi(id);
      const msg = "User removed successfully.";
      setSuccess(msg);
      showToast(msg, "success");
      if (users.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchUsers();
      }
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to delete user.";
      setError(msg);
      showToast(msg, "error");
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    success,
    pagination,
    stats,
    page,
    setPage,
    draftSearch,
    setDraftSearch,
    submitSearch,
    clearFilters,
    deleteUser,
    refresh: fetchUsers,
  };
};