import { useMutation } from "@tanstack/react-query";
import { registerPayload, loginPayload } from "@/types/auth";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import useAuthStore from "@/context/authStore";
import { authUser } from "@/types/auth";
import { ApiError } from "@/types/error";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: registerPayload) => {
      const res = await api.post("/auth/register", data);
      return { ...res.data, redirect: data.redirect };
    },
    onSuccess: (data) => {
      toast.success("Registered successfully");

      const safeRedirect =
        data.redirect?.startsWith("/") && !data.redirect?.startsWith("//")
          ? data.redirect
          : null;

      if (safeRedirect) {
        router.replace(safeRedirect);
      } else {
        router.replace("/login");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: loginPayload) => {
      const res = await api.post("/auth/login", data);
      return { ...res.data, redirect: data.redirect };
    },
    onSuccess: (data) => {
      setUser(data.user as authUser);
      toast.success("Login successful");

      const safeRedirect =
        data.redirect?.startsWith("/") && !data.redirect?.startsWith("//")
          ? data.redirect
          : null;

      if (safeRedirect) {
        router.replace(safeRedirect);
      } else if (data.user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useSignOut = () => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      clearUser();
      toast.success("Logout successful");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });
};
