import { create } from "zustand";
import api from "~/lib/api";

interface User {
  id: string;
  full_name: string;
  email: string;
  cpf: string;
  avatar: {
    url: string | null;
  };
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/v1/users/${id}`);
      set({ user: response.data.data, loading: false });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      set({ error: "Falha ao carregar dados do usuário.", loading: false });
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/api/v1/users/${id}`, data);
      set({ user: response.data.data, loading: false });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      set({ error: "Falha ao atualizar dados do usuário.", loading: false });
    }
  },
}));
