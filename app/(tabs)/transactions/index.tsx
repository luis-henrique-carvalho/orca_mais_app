import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
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
