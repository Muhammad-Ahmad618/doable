import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";
import { Comment } from "@/types/comments";

export const useGetTaskComments = (task_id: number | undefined) => {
  return useQuery<Comment[]>({
    queryKey: ["task-comments", task_id],
    queryFn: async () => {
      const response = await api.get(`/tasks/${task_id}/comments`);
      return response.data.data;
    },
    refetchInterval: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreateTaskComment = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { task_id: number; content: string }) => {
      const response = await api.post(
        `/tasks/${payload.task_id}/comments`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["task-comments"],
      });
      toast.success("Comment created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to create comment");
    },
  });
};
