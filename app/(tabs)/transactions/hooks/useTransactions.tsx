import { useEffect, useState, useCallback } from "react";
import api from "~/lib/api";
import { useAuthStore } from "~/store/auth";
import { Category, Transaction } from "../types";

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const { token } = useAuthStore();

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/v1/transactions", {
                headers: { Authorization: `Bearer ${token}` },
                params: { search, "q[category_id_eq]": selectedCategory }
            });
            setTransactions(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            setError("Falha ao carregar transações. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, [token, search, selectedCategory]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get("/api/v1/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            setError("Falha ao carregar categorias. Tente novamente.");
        }
    }, [token]);

    const fetchTransactionDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransaction(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar detalhes da transação:", error);
            setError("Falha ao carregar detalhes da transação.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    return {
        transactions,
        categories,
        transaction,
        loading,
        error,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        fetchTransactionDetails,
        fetchTransactions,
        fetchCategories,
        token
    };
}
