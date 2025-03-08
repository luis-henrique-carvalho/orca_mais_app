import { View, Text } from "react-native";
import TransactionForm from "../components/forms/TransactionForm";
import { useTransactions } from "../hooks/useTransactions";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { TransactionType } from "../schemas/transactionSchema";

export default function EditTransactionScreen() {
    const { insets, fetchTransactionDetails, transaction } = useTransactions();
    const { id } = useLocalSearchParams();

    useEffect(() => {
        if (id) {
            fetchTransactionDetails(id as string);
        }
    }, [id]);

    if (!transaction) {
        return (
            <View className="flex-1 p-4 bg-gray-100" style={{ paddingTop: insets.top }}>
                <Text className="text-2xl font-bold mb-4">Carregando...</Text>
            </View>
        );
    }

    const editValues = {
        name: transaction.name,
        description: transaction.description,
        amount: Number(transaction.amount),
        category_id: transaction.category.id,
        transaction_type: transaction.transaction_type as TransactionType,
    };

    return (
        <View className="flex-1 p-4 bg-gray-100" style={{ paddingTop: insets.top }}>
            <Text className="text-2xl font-bold mb-4">Editar Transação</Text>
            <TransactionForm defaultValues={editValues} id={transaction.id} editCategory={transaction.category} />
        </View>
    );
}
