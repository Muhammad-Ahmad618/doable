import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/error";
import {
  clearAllNotificationsResponse,
  deleteNotificationResponse,
  markAllReadResponse,
  markReadResponse,
  notificationResponse,
} from "@/types/notifications";
import api from "@/lib/axios";
import { toast } from "sonner";

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

export const useMarkAsRead = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification_id: number): Promise<markReadResponse> => {
      const response = await api.put(`/notifications/mark-read`, {
        notification_id,
      });
      return response.data;
    },

    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.log("error occured please try again!", error);
      toast.error("error please try again !");
    },
  });
};

export const useMarkAllRead = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<markAllReadResponse> => {
      const response = await api.put("/notifications/mark-all-read");
      return response.data;
    },

    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["notifications"] });
    },

    onError: (error) => {
      console.log("error while reading", error);
      toast.error("Error please try again !");
    },
  });
};

export const useDeleteNotification = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      notification_id: number,
    ): Promise<deleteNotificationResponse> => {
      const response = await api.delete("/notifications/clear", {
        data: { notification_id },
      });
      return response.data;
    },

    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["notifications"] });
    },

    onError: (error) => {
      console.log("error deleting notification", error);
      toast.error("Error deleting notification, please try again!");
    },
  });
};

export const useClearAllNotifications = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<clearAllNotificationsResponse> => {
      const response = await api.delete("/notifications/clear-all");
      return response.data;
    },

    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["notifications"] });
    },

    onError: (error) => {
      console.log("error clearing notifications", error);
      toast.error("Error clearing notifications, please try again!");
    },
  });
};
