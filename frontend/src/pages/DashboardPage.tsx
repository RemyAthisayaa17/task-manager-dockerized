import { useState } from "react";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/models";
import { TASK_STATUS, ROLES } from "../constants/app.constants";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import DeleteTaskModal from "../components/ui/DeleteTaskModal";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { Modal, Button, Spinner, EmptyState, Badge } from "../components/ui";
import { FiPlus, FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DashboardPage = () => {
  const { isAdmin, user } = useAuth();

  const {
    tasks, loading, pagination, stats,
    draftSearch, statusFilter, userRoleFilter, page,
    setDraftSearch, setPage,
    submitSearch, applyStatusFilter, applyUserRoleFilter, clearFilters,
    createTask, updateTask, deleteTask,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: CreateTaskInput | UpdateTaskInput) => {
    setFormLoading(true);
    const ok = await createTask(data as CreateTaskInput);
    setFormLoading(false);
    if (ok) setShowForm(false);
  };

  const handleUpdate = async (data: CreateTaskInput | UpdateTaskInput) => {
    if (!editingTask) return;
    setFormLoading(true);
    const ok = await updateTask(editingTask.id, data as UpdateTaskInput);
    setFormLoading(false);
    if (ok) {
      setEditingTask(null);
      setShowForm(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTaskId) return;
    const ok = await deleteTask(deleteTaskId);
    if (ok) setDeleteTaskId(null);
  };

  const openCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openEdit = (task: Task) => {
    if (task.status === TASK_STATUS.COMPLETED) return;
    setEditingTask(task);
    setShowForm(true);
  };

  const totalPages = pagination?.totalPages ?? 0;
  const activeFilter = statusFilter || userRoleFilter;
  const isFiltered = !!activeFilter || !!draftSearch;

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isAdmin ? "All Tasks" : "My Tasks"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Welcome back, <span className="font-medium text-slate-700">{user?.name}</span>
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="flex items-center gap-1.5 flex-shrink-0">
            <FiPlus size={14} />
            New Task
          </Button>
        </div>

        {/* Global stats — constant across all pages */}
        {!loading && stats.total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total, color: "text-slate-700", bg: "bg-white" },
              { label: "Pending", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Completed", value: stats.completed, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-200 text-center`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search & filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={draftSearch}
                  onChange={(e) => setDraftSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
                    placeholder-slate-400 bg-white"
                />
              </div>
              <Button onClick={submitSearch} size="sm" variant="secondary">
                Search
              </Button>
            </div>

            {/* FIX #2: Admin sees role-based filter; regular users see status filter */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin ? (
                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) clearFilters();
                    else applyUserRoleFilter(val);
                  }}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium
                    bg-white text-slate-700 focus:outline-none focus:ring-2
                    focus:ring-indigo-500/40 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                  <option value={ROLES.USER}>User</option>
                </select>
              ) : (
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) clearFilters();
                    else applyStatusFilter(val);
                  }}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium
                    bg-white text-slate-700 focus:outline-none focus:ring-2
                    focus:ring-indigo-500/40 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value={TASK_STATUS.PENDING}>Pending</option>
                  <option value={TASK_STATUS.COMPLETED}>Completed</option>
                </select>
              )}

              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-500
                    hover:bg-slate-100 transition-colors flex items-center gap-1 border border-slate-200"
                  title="Clear filters"
                >
                  <FiX size={12} />
                </button>
              )}
            </div>
          </div>

          {isFiltered && (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-slate-400">Filtered by:</span>
              {userRoleFilter && (
                <Badge color={userRoleFilter === ROLES.ADMIN ? "purple" : "indigo"}>
                  {userRoleFilter}
                </Badge>
              )}
              {statusFilter && (
                <Badge color={statusFilter === TASK_STATUS.PENDING ? "yellow" : "green"}>
                  {statusFilter}
                </Badge>
              )}
              {draftSearch && !activeFilter && (
                <Badge color="indigo">"{draftSearch}"</Badge>
              )}
            </div>
          )}
        </div>

        {/* Tasks grid */}
        {loading ? (
          <Spinner text="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            subtitle={
              userRoleFilter
                ? `No tasks found for ${userRoleFilter} role.`
                : statusFilter
                ? `No ${statusFilter} tasks.`
                : draftSearch
                ? "No tasks match your search."
                : "Create your first task using the New Task button above."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={(id) => setDeleteTaskId(id)}
                showOwner={isAdmin}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1"
            >
              <FiChevronLeft size={13} /> Previous
            </Button>
            <span className="px-3 py-1.5 text-xs text-slate-500 font-medium bg-white border border-slate-200 rounded-lg">
              {page} / {totalPages} · {stats.total} total
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1"
            >
              Next <FiChevronRight size={13} />
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <Modal
          title={editingTask ? "Edit Task" : "New Task"}
          subtitle={editingTask ? "Update task details" : "Add a new task to your list"}
          onClose={() => setShowForm(false)}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        </Modal>
      )}

      {deleteTaskId !== null && (
        <DeleteTaskModal
          onConfirm={confirmDelete}
          onClose={() => setDeleteTaskId(null)}
        />
      )}
    </Sidebar>
  );
};

export default DashboardPage;