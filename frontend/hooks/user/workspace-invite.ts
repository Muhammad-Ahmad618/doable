import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useIsLoggedIn = () => {
  return useQuery({
    queryKey: ["loggged-In"],
    queryFn: async () => {
      const response = await api.get("user/me");
      return response.data.data;
    },
    retry: false,
  });
};

export const useGetWorkspacePreview = (token: string) => {
  return useQuery({
    queryKey: ["workspace-preview", token],
    queryFn: async () => {
      const response = await api.get(`workspace/invite-preview/${token}`);
      return response.data.data;
    },
    enabled: !!token,
    retry: false,
  });
};
