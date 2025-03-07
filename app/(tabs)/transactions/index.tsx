import { View, Text, FlatList, ActivityIndicator, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionItem } from "./components/TransactionItem";
import { TransactionFilter } from "./components/TransactionFilter";
import { TransactionSeach } from "./components/TransactionSeach";
import { useTransactions } from "./hooks/useTransactions";
import { useEffect } from "react";

export default function TransactionsScreen() {
    const insets = useSafeAreaInsets();
    const contentInsets = { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };

    const {
        transactions,
        categories,
        loading,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        fetchCategories,
        fetchTransactions,
        token
    } = useTransactions();

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, [token, search, selectedCategory]);

    return (
        <View className="flex-1 p-4 bg-gray-100" style={{ paddingTop: insets.top }}>
            <Text className="text-2xl font-bold text-gray-800 mb-4">Transações</Text>
            <TransactionSeach search={search} setSearch={setSearch} />
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
