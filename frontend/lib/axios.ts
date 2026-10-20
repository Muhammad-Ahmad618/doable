import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // _retry is not present in the config object
    // originalRequest._retry === undefined => !undefined => true
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/refresh")) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await api.post("/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
