import { View, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { TransactionItem } from "./components/TransactionItem";
import { TransactionCategorySelector } from "./components/TransactionCategorySelector";
import { TransactionSeach } from "./components/TransactionSeach";
import { useTransactions } from "./hooks/useTransactions";
import { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";

export default function TransactionsScreen() {
    const {
        transactions,
        categories,
        loading,
        loadingMore,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        fetchCategories,
        fetchTransactions,
        loadMoreTransactions,
        hasMore,
        contentInsets,
        insets,
        onRefresh,
        refreshing,
        token,
    } = useTransactions();

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, [token, search, selectedCategory]);

    return (
        <View className="flex-1 p-4 gap-4" style={{ paddingTop: insets.top }}>
            <Text className="text-2xl font-bold">Transações</Text>
            <View className="flex-row items-center justify-between gap-2">
                <View className="flex-1">
                    <TransactionSeach search={search} setSearch={setSearch} />
                </View>
                <View className="flex-1">
                    <TransactionCategorySelector categories={categories} setSelectedCategory={setSelectedCategory} contentInsets={contentInsets} />
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionItem transaction={item} />}
                    ListEmptyComponent={<Text className="text-center">Nenhuma transação encontrada</Text>}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    onEndReached={() => {
                        if (hasMore && !loadingMore) loadMoreTransactions();
                    }}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#0000ff" className="mt-4" /> : null}
                />
            )}
        </View>
    );
}
