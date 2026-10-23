import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Workspace, WorkspaceCreatePayload } from "@/types/workspace";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

export const useGetMyWorkspaces = () => {
  return useQuery<Workspace[]>({
    queryKey: ["my-workspaces"],
    queryFn: async () => {
      const { data } = await api.get("/workspace/my-workspaces");
      return data?.data ?? [];
    },
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: WorkspaceCreatePayload) => {
      const formData = new FormData();

      formData.append("workspace_name", payload.workspace_name);
      formData.append("workspace_description", payload.workspace_description);
      if (payload.logo_url) {
        formData.append("workspace_logo", payload.logo_url);
      }

      const response = await api.post("/workspace/create", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-workspaces"],
      });

      toast.success("Workspace created successfully");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to create workspace"));
    },
  });
};

export const useLeaveWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspace_id: string | number) => {
      const response = await api.post(`/workspace/leave`, { workspace_id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-workspaces"],
      });

      toast.success("You are now not a member of this workspace");
    },
  });
};

export const useGetWorkspaceInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspace_id: string) => {
      const response = await api.post(`/workspace/${workspace_id}/invite`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-invite"],
      });

      toast.success("Invitation link generated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to generate invitation"));
    },
  });
};
