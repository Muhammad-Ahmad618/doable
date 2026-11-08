import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joinWorkspaceResponse } from "@/types/workspace-invite";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import useAuthStore from "@/context/authStore";

export const useIsLoggedIn = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["logged-in-user"],
    queryFn: async () => {
      const response = await api.get("/user/me");
      return response.data.data;
    },
    enabled: Boolean(user),
    retry: false,
    initialData: user,
  });
};

export const useGetWorkspacePreview = (token: string) => {
  return useQuery({
    queryKey: ["workspace-preview", token],
    queryFn: async () => {
      const response = await api.get(`/workspace/invite-preview/${token}`);
      return response.data.data;
    },
    enabled: Boolean(token),
    retry: false,
  });
};

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string): Promise<joinWorkspaceResponse> => {
      const response = await api.post(`/workspace/join/${token}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-workspaces"] });
      toast.success(data?.message || "Workspace joined successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Error while joining workspace"));
    },
  });
};
