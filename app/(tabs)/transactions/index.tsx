import { View, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { TransactionItem } from "~/models/transaction/components/TransactionItem";
import { TransactionCategorySelector } from "~/models/transaction/components/TransactionCategorySelector";
import { TransactionSeach } from "~/models/transaction/components/TransactionSeach";
import { useTransactions } from "~/models/transaction/hooks/useTransactions";
import { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { useInsects } from "~/lib/utils";

export default function TransactionsScreen() {
    const router = useRouter();
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
        onRefresh,
        refreshing,
    } = useTransactions();

    const { insets, contentInsets } = useInsects();

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, [search, selectedCategory]);

    return (
        <SafeAreaView className="flex-1 p-4 gap-4" style={{ paddingTop: insets.top }}>
            <View className="flex-row items-center justify-between gap-2">
                <Text className="text-3xl font-bold">Transações</Text>
                <Button onPress={() => router.push(`/transactions/create`)} variant={"default"} className="w-1/4">
                    <Text>Criar</Text>
                </Button>
            </View>
            <View className="flex-row items-center justify-between gap-2">
                <View className="flex-1">
                    <TransactionSeach search={search} setSearch={setSearch} />
                </View>
                <View className="flex-1">
                    <TransactionCategorySelector categories={categories} setSelectedCategory={setSelectedCategory} />
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
        </SafeAreaView>
    );
}
