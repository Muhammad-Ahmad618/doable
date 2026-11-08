import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/error";
import { notificationResponse } from "@/types/notifications";
import api from "@/lib/axios";

export const useFetchAllNotifications = () => {
  return useQuery<notificationResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};
