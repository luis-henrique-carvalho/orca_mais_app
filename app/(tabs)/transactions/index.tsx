import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "~/lib/api";
import { useAuthStore } from "~/store/auth";
import { Search } from "lucide-react-native";
import { TransactionItem } from "./components/TransactionItem";
import { TransactionFilter } from "./components/TransactionFilter";

interface Transaction {
    id: string;
    amount: string;
    category: { id: string; name: string };
    created_at: string;
    description: string;
    name: string;
    transaction_type: "income" | "expense";
}

interface Category {
    id: string;
    name: string;
}

export default function TransactionsScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const { token } = useAuthStore();
    const insets = useSafeAreaInsets();
    const contentInsets = { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, [token, search, selectedCategory]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/transactions", {
                headers: { Authorization: `Bearer ${token}` },
                params: { search, "q[category_id_eq]": selectedCategory }
            });
            setTransactions(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/api/v1/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-100" style={{ paddingTop: insets.top }}>
            <Text className="text-2xl font-bold text-gray-800 mb-4">Transações</Text>
            <TransactionFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} contentInsets={contentInsets} />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList data={transactions} keyExtractor={(item) => item.id} renderItem={({ item }) =>
                    <TransactionItem transaction={item} />}
                />
            )}
        </View>
    );
}
