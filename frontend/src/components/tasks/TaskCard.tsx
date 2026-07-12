import { useState } from "react";
import type { Task } from "../../types/models";
import { TASK_STATUS } from "../../constants/app.constants";
import { Badge, Button } from "../ui";
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiLock,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  showOwner?: boolean;
}

const TaskCard = ({ task, onEdit, onDelete, showOwner = false }: Props) => {
  const isCompleted = task.status === TASK_STATUS.COMPLETED;
  const [expanded, setExpanded] = useState(false);

  const isLong = (task.description?.length ?? 0) > 120;

  const formattedCreatedAt = new Date(task.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  // Reliable update signal: updatedBy is only set when a user explicitly edits the task.
  // Don't rely on updatedAt timestamp comparison — Prisma @updatedAt sets it on creation too.
  const wasUpdated = !!task.updatedBy && !!task.updatedByName;


  return (
    <div
      className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col
        hover:shadow-md hover:border-slate-300 transition-all duration-150
        ${isCompleted ? "border-slate-200 opacity-80" : "border-slate-200"}`}
      style={{ minHeight: "220px" }}
    >
      {/* Title + badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-sm leading-snug flex-1 text-slate-800 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isCompleted && <FiLock size={11} className="text-slate-400" />}
          <Badge color={isCompleted ? "green" : "yellow"}>{task.status}</Badge>
        </div>
      </div>

      {/* Description with View More / View Less */}
      <div className="flex-1 mb-3">
        {task.description ? (
          <div>
            <p
              className={`text-sm text-slate-500 leading-relaxed transition-all duration-150 ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {task.description}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 flex items-center gap-0.5 text-[11px] font-medium text-indigo-500
                  hover:text-indigo-700 transition-colors"
              >
                {expanded ? (
                  <>View Less <FiChevronUp size={11} /></>
                ) : (
                  <>View More <FiChevronDown size={11} /></>
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-300 italic">No description</p>
        )}
      </div>

      {/* Meta row — date + assigned user (admin view only) */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
        <span className="flex items-center gap-1.5">
          <FiCalendar size={11} />
          {formattedCreatedAt}
        </span>
        {showOwner && task.user && (
          <span className="flex items-center gap-1.5">
            <FiUser size={11} />
            {task.user.name}
          </span>
        )}
      </div>

      {/* Audit row — createdByName shown only in user view (admin view already shows owner above) */}
      {(!showOwner && task.createdByName || (wasUpdated && task.updatedByName)) && (
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 mb-3">
          {!showOwner && task.createdByName && (
            <span>
              Created by:{" "}
              <span className="font-medium text-slate-500">{task.createdByName}</span>
            </span>
          )}
          {wasUpdated && task.updatedByName && (
            <span>
              Updated by:{" "}
              <span className="font-medium text-slate-500">{task.updatedByName}</span>
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-slate-100 mt-auto">
        {!isCompleted ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <FiEdit2 size={13} /> Edit
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 cursor-not-allowed">
            <FiLock size={11} /> Locked
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50"
        >
          <FiTrash2 size={13} /> Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;