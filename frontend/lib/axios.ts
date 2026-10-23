import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const url = original?.url ?? "";
    const isAuthRoute = AUTH_ROUTES.some((r) => url.includes(r));

    if (
      error.response?.status !== 401 ||
      !original ||
      isAuthRoute ||
      original._retry
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      // Share one refresh across concurrent 401s
      refreshPromise ??= api
        .post("/auth/refresh")
        .finally(() => (refreshPromise = null));
      await refreshPromise;
      return api(original);
    } catch (refreshError) {
      // Only redirect if we're not already on the login page
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.assign("/login");
      }
      return Promise.reject(refreshError);
    }
  },
);

export default api;
