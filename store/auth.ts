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
        throw new Error("Invalid response from server");
      }

      set({ token, user });

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    } catch (error: any) {
      console.log(error.message);
    }
  },
  signup: async (email: string, password: string, name: string) => {
    try {
      const response = await api.post("/api/auth/signup", {
        user: { email, password, full_name: name },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "Signup failed:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  },
  logout: async () => {
    if (!get().token) return; // Evita requisições desnecessárias

    try {
      await api.delete("/api/auth/logout", {
        headers: { Authorization: `Bearer ${get().token}` },
      });
    } catch (error: any) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }

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
