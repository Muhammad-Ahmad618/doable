import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/types/error";
import {
  forgotPasswordPayload,
  forgotPasswordResponse,
  resetPasswordPayload,
} from "@/types/auth";
import { toast } from "sonner";
import api from "@/lib/axios";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: forgotPasswordPayload) => {
      const res = await api.post<forgotPasswordResponse>(
        "/auth/forgot-password",
        data,
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to Send Reset Link Please Try Again",
      );
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: resetPasswordPayload) => {
      const res = await api.post("/auth/reset-password", payload);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to Reset Password Please Try Again",
      );
    },
  });
};
