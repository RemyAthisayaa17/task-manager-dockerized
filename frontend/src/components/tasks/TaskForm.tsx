import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../../types/models";
import { TASK_STATUS } from "../../constants/app.constants";
import { createTaskSchema, updateTaskSchema } from "../../validation/schemas";
import { Input, Textarea, Select, Button, Alert } from "../ui";

interface Props {
  task?: Task | null;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

type CreateFormValues = {
  title: string;
  description?: string;
};

type UpdateFormValues = {
  title?: string;
  description?: string;
  status?: string;
};

const TaskForm = ({ task, onSubmit, onCancel, loading = false }: Props) => {
  const isEdit = !!task;
  // Issue #6: completed tasks cannot be edited
  const isCompleted = task?.status === TASK_STATUS.COMPLETED;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormValues | UpdateFormValues>({
    resolver: yupResolver(isEdit ? (updateTaskSchema as any) : (createTaskSchema as any)),
    defaultValues: isEdit
      ? { title: task.title, description: task.description ?? "", status: task.status }
      : { title: "", description: "" },
  });

  useEffect(() => {
    if (task) {
      reset({ title: task.title, description: task.description ?? "", status: task.status });
    } else {
      reset({ title: "", description: "" });
    }
  }, [task, reset]);

  if (isCompleted) {
    return (
      <div className="flex flex-col gap-4">
        <Alert type="info">
          This task is completed and cannot be edited.
        </Alert>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full">
          Close
        </Button>
      </div>
    );
  }

  const handleFormSubmit = async (data: CreateFormValues | UpdateFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Title"
        required
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description"
        placeholder="Optional details..."
        rows={3}
        error={errors.description?.message}
        {...register("description")}
      />

      {isEdit && (
        <Select
          label="Status"
          error={(errors as any).status?.message}
          {...register("status")}
        >
          <option value={TASK_STATUS.PENDING}>Pending</option>
          <option value={TASK_STATUS.COMPLETED}>Completed</option>
        </Select>
      )}

      <div className="flex gap-2.5 pt-1">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {isEdit ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;