import { useQuery } from "@tanstack/react-query";
import {
  DashboardStatsResponse,
  AtriskTaskItem,
  DashboardTrends,
  recentTasks,
} from "@/types/dashboard";
import api from "@/lib/axios";

export const useGetDashboardStats = () => {
  return useQuery<DashboardStatsResponse>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/stats");
      return data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useGetTaskTrends = (mode: "weekly" | "monthly") => {
  return useQuery<DashboardTrends[]>({
    queryKey: ["dashboard", "trends", mode],
    queryFn: async () => {
      const { data: response } = await api.get(
        `/dashboard/trends?mode=${mode}`,
      );
      return response.data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useGetAtRiskTasks = () => {
  return useQuery<AtriskTaskItem[]>({
    queryKey: ["dashboard", "at-risk-tasks"],
    queryFn: async () => {
      const { data: response } = await api.get("/dashboard/atrisk-tasks");
      return response.data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useGetRecentTasks = () => {
  return useQuery<recentTasks[]>({
    queryKey: ["dashboard", "recent-tasks"],
    queryFn: async () => {
      const { data: response } = await api.get("/dashboard/recent-tasks");
      return response.data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useGetDailyFocus = () => {
  return useQuery({
    queryKey: ["daily-focus"],
    queryFn: async () => {
      const { data: response } = await api.get("/task/focus");
      return response;
    },
  });
};
