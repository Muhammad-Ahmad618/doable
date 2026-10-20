import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TasksResponse,
  CreateTaskPayload,
  UpdateTaskPayload,
  Priority,
  GeneratedSubTask,
} from "@/types/task";
import api from "@/lib/axios";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

export const useGetAllTasks = (page: number = 1, limit: number = 10) => {
  return useQuery<TasksResponse>({
    queryKey: ["tasks", page, limit],
    queryFn: async () => {
      const { data } = await api.get(
        `/task/my-tasks?page=${page}&limit=${limit}`,
      );
      return data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useCreateTask = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: CreateTaskPayload) => {
      const response = await api.post("/task", task);
      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      QueryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      toast.success("Task created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: UpdateTaskPayload) => {
      const response = await api.put(`/task/${task?.task_id}`, task);
      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      QueryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
      toast.success("Task updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update task");
    },
  });
};

export const useRemoveTask = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task_id: number) => {
      const response = await api.delete(`/task/${task_id}`);
      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      QueryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
      toast.success("Task deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to delete task");
    },
  });
};

export const useUpdateTaskStatus = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      status,
    }: {
      task_id: number;
      status: string;
    }) => {
      const response = await api.patch(`/task/${task_id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      QueryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      toast.success("Task status updated successfully");
    },

    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update task status");
    },
  });
};

export const useUpdateTaskDueDate = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      due_date,
    }: {
      task_id: number;
      due_date: string;
    }) => {
      const response = await api.patch(`/task/${task_id}/due-date`, {
        due_date,
      });
      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      QueryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      toast.success("Task due date updated successfully");
    },

    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update task due date");
    },
  });
};

export const useUpdatePriority = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      priority,
    }: {
      task_id: number;
      priority: Priority;
    }) => {
      const response = await api.patch(`/task/${task_id}/priority`, {
        priority,
      });

      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      QueryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      toast.success("Task priority updated successfully");
    },

    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update task priority");
    },
  });
};

// subtask - hooks

export const useGenerateTaskBreakDown = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      regen,
    }: {
      task_id: number;
      regen?: boolean;
    }) => {
      const response = await api.post(`/task/${task_id}/breakdown`, { regen });
      const subtasksData = response.data?.data || response.data || [];
      return Array.isArray(subtasksData) ? subtasksData : [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subtasks"],
      });
      toast.success("Subtasks generated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to generate subtasks");
    },
  });
};

export const useSaveSubtasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      subtasks,
    }: {
      task_id: number;
      subtasks: GeneratedSubTask[];
    }) => {
      const response = await api.post(`/task/${task_id}/breakdown/save`, {
        subtasks,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-breakdown"],
      });
      toast.success("Subtasks saved successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to save subtasks");
    },
  });
};

export const useGetSubTasks = (task_id: number) => {
  return useQuery<GeneratedSubTask[]>({
    queryKey: ["task-breakdown", task_id],
    queryFn: async () => {
      const response = await api.get(`/task/${task_id}/subtasks`);
      const subtasksData = response.data?.data || response.data || [];
      return Array.isArray(subtasksData) ? subtasksData : [];
    },
  });
};

export const useToggleSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      subtask_id,
      status,
    }: {
      task_id: number;
      subtask_id: number;
      status: string;
    }) => {
      const response = await api.patch(
        `/task/${task_id}/subtask/${subtask_id}`,
        { status },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-breakdown"],
      });
      toast.success("Subtask status updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update subtask");
    },
  });
};

export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      subtask_id,
    }: {
      task_id: number;
      subtask_id: number;
    }) => {
      const response = await api.patch(
        `/task/${task_id}/subtask/${subtask_id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-breakdown"],
      });
      toast.success("Subtask deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to delete subtask");
    },
  });
};
