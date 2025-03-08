import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionItem } from "./components/TransactionItem";
import { TransactionCategorySelector } from "./components/TransactionCategorySelector";
import { TransactionSeach } from "./components/TransactionSeach";
import { useTransactions } from "./hooks/useTransactions";
import { useEffect, useState } from "react";

export default function TransactionsScreen() {
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
        token,
        contentInsets,
        insets
    } = useTransactions();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, [token, search, selectedCategory]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTransactions();
        setRefreshing(false);
    };

    return (
        <View className="flex-1 p-4 bg-gray-100" style={{ paddingTop: insets.top }}>
            <Text className="text-2xl font-bold text-gray-800 mb-4">Transações</Text>
            <TransactionSeach search={search} setSearch={setSearch} />
            <TransactionCategorySelector categories={categories} setSelectedCategory={setSelectedCategory} contentInsets={contentInsets} withCreateLink />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionItem transaction={item} />}
                    ListEmptyComponent={<Text className="text-center text-gray-500">Nenhuma transação encontrada</Text>}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </View>
    );
}
