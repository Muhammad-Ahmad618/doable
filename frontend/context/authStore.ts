import { authStore } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create<authStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      isAuthenticated: () => get().user !== null,
    }),
    {
      name: "doable-auth",
    },
  ),
);

export default useAuthStore;
