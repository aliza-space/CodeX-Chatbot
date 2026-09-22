import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios.js";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      loginWithGoogle: async (googleToken) => {
        const { data } = await api.post("/api/auth/google", { token: googleToken });
        set({ token: data.token, user: data.user, isAuthenticated: true });
        return data.user;
      },
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: "codebuddy-auth" }
  )
);

