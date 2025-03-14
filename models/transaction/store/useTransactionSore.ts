import { create } from "zustand";
import api from "~/lib/api";
import { Category, Transaction } from "~/models/transaction/types";
import { TransactionFormData } from "~/models/transaction/schemas/transactionSchema";

interface TransactionStore {
  transactions: Transaction[];
  categories: Category[];
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
  search: string;
  selectedCategory: string | undefined;
  currentPage: number;
  totalPages: number;
  loadingMore: boolean;
  refreshing: boolean;
  setSearch: (search: string) => void;
  setSelectedCategory: (category: string | undefined) => void;
  fetchTransactions: (page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTransactionDetails: (id: string) => Promise<void>;
  createTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  onRefresh: () => Promise<void>;
  hasMore: () => boolean;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  categories: [],
  transaction: null,
  loading: false,
  error: null,
  search: "",
  selectedCategory: undefined,
  currentPage: 1,
  totalPages: 1,
  loadingMore: false,
  refreshing: false,

  setSearch: (search) => set({ search }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  fetchTransactions: async (page = 1) => {
    const { search, selectedCategory } = get();
    set({ loading: page === 1, loadingMore: page > 1, error: null });

    try {
      const response = await api.get("/api/v1/transactions", {
        params: { search, "q[category_id_eq]": selectedCategory, page },
      });

      set((state) => ({
        transactions:
          page === 1
            ? response.data.data
            : [...state.transactions, ...response.data.data],
        currentPage: page,
        totalPages: response.data.meta.total_pages,
        loading: false,
        loadingMore: false,
      }));
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      set({
        error: "Falha ao carregar transações. Tente novamente.",
        loading: false,
        loadingMore: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ error: null });
    try {
      const response = await api.get("/api/v1/categories");
      set({ categories: response.data.data });
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      set({ error: "Falha ao carregar categorias. Tente novamente." });
    }
  },

  fetchTransactionDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/v1/transactions/${id}`);
      set({ transaction: response.data.data, loading: false });
    } catch (error) {
      console.error("Erro ao buscar detalhes da transação:", error);
      set({
        error: "Falha ao carregar detalhes da transação.",
        loading: false,
      });
    }
  },

  createTransaction: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post("/api/v1/transactions", data);
      get().fetchTransactions(1); // Recarregar lista
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      set({ error: "Falha ao criar transação. Tente novamente." });
    } finally {
      set({ loading: false });
    }
  },

  updateTransaction: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/api/v1/transactions/${id}`, data);
      get().fetchTransactions(1);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      set({ error: "Falha ao atualizar transação. Tente novamente." });
    } finally {
      set({ loading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/v1/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      set({ error: "Falha ao deletar transação. Tente novamente." });
    } finally {
      set({ loading: false });
    }
  },

  loadMoreTransactions: async () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      await get().fetchTransactions(currentPage + 1);
    }
  },

  onRefresh: async () => {
    set({ refreshing: true });
    await get().fetchTransactions(1);
    set({ refreshing: false });
  },

  hasMore: () => get().currentPage < get().totalPages,
}));
