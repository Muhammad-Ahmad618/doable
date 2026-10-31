import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import useAuthStore from "@/context/authStore";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  UserProfile,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  UserPreferences,
  UpdatePreferencesPayload,
  UserProfileResponse,
  UserPreferencesResponse,
  SettingsApiResponse,
} from "@/types/settings";

export const useGetCurrentUser = () => {
  return useQuery<UserProfile>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await api.get<UserProfileResponse>("/user/me");
      return response.data.data;
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const formData = new FormData();
      formData.append("username", payload.username);
      if (payload.bio !== undefined) {
        formData.append("bio", payload.bio);
      }
      if (payload.avatar) {
        formData.append("avatar", payload.avatar);
      }

      const response = await api.patch<UserProfileResponse>(
        "/user/me",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      if (currentUser && response.data) {
        setUser({
          ...currentUser,
          username: response.data.username ?? currentUser.username,
        });
      }

      toast.success(response.message || "Profile updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to update profile"));
    },
  });
};

export const useUpdateUserPassword = () => {
  return useMutation({
    mutationFn: async (payload: UpdatePasswordPayload) => {
      const response = await api.patch<SettingsApiResponse>(
        "/user/me/password",
        payload,
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Password updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to update password"));
    },
  });
};

export const useGetUserPreferences = () => {
  return useQuery<UserPreferences>({
    queryKey: ["user-preferences"],
    queryFn: async () => {
      const response = await api.get<UserPreferencesResponse>(
        "/user/me/preferences",
      );
      return response.data.data;
    },
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePreferencesPayload) => {
      const response = await api.patch<UserPreferencesResponse>(
        "/user/me/preferences",
        payload,
      );
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["user-preferences"],
      });
      toast.success(response.message || "Preferences updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to update preferences"));
    },
  });
};

export const useDeleteMyAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<SettingsApiResponse>("/user/me");
      return response.data;
    },
    onSuccess: (response) => {
      clearUser();
      queryClient.clear();
      toast.success(response.message || "Account deleted successfully");
      router.replace("/login");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to delete account"));
    },
  });
};
