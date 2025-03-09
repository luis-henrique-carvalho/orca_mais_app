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
  message: { type: "error" | "success" | "warning"; text: string };
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  message: { type: "success", text: "" },
  isLoading: false,
  login: async (email: string, password: string) => {
    set({ isLoading: true, message: { type: "success", text: "" } });
    try {
      const response = await api.post("/api/auth/login", {
        user: { email, password },
      });

      const { token, user } = response.data.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      set({ token, user, isLoading: false });

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    } catch (error: any) {
      set({
        message: {
          type: "error",
          text: "Falha no login. Verifique suas credenciais e tente novamente.",
        },
        isLoading: false,
      });
      throw new Error(
        error.response?.data?.message || error.message || "Erro no cadastro"
      );
    }
  },
  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, message: { type: "success", text: "" } });
    try {
      const response = await api.post("/api/auth/signup", {
        user: { email, password, full_name: name },
      });

      const { token, user } = response.data.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      set({ token, user, isLoading: false });

      return response.data;
    } catch (error: any) {
      set({
        message: {
          type: "error",
          text: "Falha no cadastro. Verifique suas credenciais e tente novamente.",
        },
        isLoading: false,
      });
      throw new Error(
        error.response?.data?.errors ||
          error.response?.data?.error ||
          error.message ||
          "Erro no cadastro"
      );
    }
  },
  logout: async () => {
    try {
      await api.delete("/api/auth/logout", {
        headers: { Authorization: `Bearer ${get().token}` },
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Erro no logout"
      );
    }

    set({ token: null, user: null });
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
