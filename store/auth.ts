import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import api from "~/lib/api";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", {
        user: { email, password },
      });

      const { token, user } = response.data.data;

      if (!token || !user) {
        console.error("Invalid response from server");
      }

      set({ token, user });

      await SecureStore.setItem("token", token);
      await SecureStore.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },
  signup: async (email: string, password: string, name: string) => {
    await api.post("/api/auth/signup", {
      user: { email, password, full_name: name },
    });
  },
  logout: async () => {
    await api.delete("/api/auth/logout", {
      headers: { Authorization: `Bearer ${get().token}` },
    });
    set({ token: null, user: null });
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
  },
  setToken: (token: string) => set({ token }),
  setUser: (user: User) => set({ user }),
}));

(async () => {
  const token = await SecureStore.getItem("token");
  const user = await SecureStore.getItem("user");

  if (token && user) {
    useAuthStore.getState().setToken(token);
    useAuthStore.getState().setUser(JSON.parse(user));
  }
})();
