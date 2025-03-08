import { useState, useCallback } from "react";
import api from "~/lib/api";
import { useAuthStore } from "~/store/auth";
import { Category, Transaction } from "../types";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionFormData } from "../schemas/transactionSchema";

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const { token } = useAuthStore();
    const router = useRouter();

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 14,
        right: 14,
    };

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
            console.log("Erro ao buscar transações:", error);
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
            console.log("Erro ao buscar categorias:", error);
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
            console.log("Erro ao buscar detalhes da transação:", error);
            setError("Falha ao carregar detalhes da transação.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    const createTransaction = async (data: TransactionFormData) => {
        setLoading(true);
        setError(null);
        try {
            await api.post("/api/v1/transactions", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.replace("/(tabs)/transactions");
        } catch (error) {
            console.log("Erro ao criar transação:", error);
            setError("Falha ao criar transação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    const resetFilters = () => {
        setSearch("");
        setSelectedCategory(undefined);
    }

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
        createTransaction,
        resetFilters,
        contentInsets,
        insets,
        token
    };
}
