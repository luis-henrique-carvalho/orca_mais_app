import { useState, useCallback, Dispatch, SetStateAction } from "react";
import api from "~/lib/api";
import { Category, Transaction } from "../types";
import { useRouter } from "expo-router";
import { TransactionFormData } from "../schemas/transactionSchema";

interface UseTransactionsReturn {
    transactions: Transaction[];
    categories: Category[];
    transaction: Transaction | null;
    loading: boolean;
    error: string | null;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    selectedCategory: string | undefined;
    setSelectedCategory: Dispatch<SetStateAction<string | undefined>>;
    fetchTransactionDetails: (id: string) => Promise<void>;
    fetchTransactions: (page?: number) => Promise<void>;
    fetchCategories: () => Promise<void>;
    createTransaction: (data: TransactionFormData) => Promise<void>;
    loadMoreTransactions: () => Promise<void>;
    hasMore: boolean;
    loadingMore: boolean;
    onRefresh: () => Promise<void>;
    refreshing: boolean;
    updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
};

export function useTransactions(): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();

    // ------------------- Fetching Functions -------------------

    const fetchTransactions = useCallback(async (page: number = 1) => {
        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const response = await api.get("/api/v1/transactions", {
                params: { search, "q[category_id_eq]": selectedCategory, page }
            });
            setTransactions((prevTransactions) => page === 1 ? response.data.data : [...prevTransactions, ...response.data.data]);
            setCurrentPage(page);
            setTotalPages(response.data.meta.total_pages);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            setError("Falha ao carregar transações. Tente novamente.");
        } finally {
            page === 1 ? setLoading(false) : setLoadingMore(false);
        }
    }, [search, selectedCategory]);

    const fetchCategories = useCallback(async () => {
        setError(null);
        try {
            const response = await api.get("/api/v1/categories");
            setCategories(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            setError("Falha ao carregar categorias. Tente novamente.");
        }
    }, []);

    const fetchTransactionDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/transactions/${id}`);
            setTransaction(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar detalhes da transação:", error);
            setError("Falha ao carregar detalhes da transação.");
        } finally {
            setLoading(false);
        }
    }, []);

    // ------------------- Mutation Functions -------------------

    const createTransaction = async (data: TransactionFormData) => {
        setLoading(true);
        setError(null);
        try {
            await api.post("/api/v1/transactions", data);
            router.replace("/(tabs)/transactions");
        } catch (error) {
            console.error("Erro ao criar transação:", error);
            setError("Falha ao criar transação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    const updateTransaction = async (id: string, data: TransactionFormData) => {
        setLoading(true);
        setError(null);
        try {
            await api.put(`/api/v1/transactions/${id}`, data);
            router.replace("/(tabs)/transactions");
        } catch (error) {
            console.error("Erro ao atualizar transação:", error);
            setError("Falha ao atualizar transação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    const deleteTransaction = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/v1/transactions/${id}`);
            // TODO: Remove transaction from list
            router.replace("/(tabs)/transactions");
        } catch (error) {
            console.error("Erro ao deletar transação:", error);
            setError("Falha ao deletar transação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    // ------------------- Helper Functions -------------------

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTransactions(1);
        setRefreshing(false);
    };

    const loadMoreTransactions = async () => {
        if (currentPage < totalPages) {
            await fetchTransactions(currentPage + 1);
        }
    };

    // ------------------- Return -------------------

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
        loadMoreTransactions,
        hasMore: currentPage < totalPages,
        loadingMore,
        onRefresh,
        refreshing,
        updateTransaction,
        deleteTransaction
    };
}
