import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import { TrashTask, RecoverTaskResponse } from "@/types/trash";

export const useGetTrashTasks = () => {
  return useQuery<TrashTask[]>({
    queryKey: ["trash-tasks"],
    queryFn: async () => {
      const { data } = await api.get("/task/trash-tasks");
      const list = data?.data ?? [];
      return Array.isArray(list) ? list : [];
    },
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useRecoverTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number): Promise<RecoverTaskResponse> => {
      const response = await api.post(`/task/recover/${taskId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["trash-tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
      toast.success(data?.message || "Task restored successfully");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to restore task"));
    },
  });
};

export const useRestoreTask = useRecoverTask;

