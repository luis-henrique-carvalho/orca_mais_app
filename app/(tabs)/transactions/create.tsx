import { View, Text } from "react-native";
import TransactionForm from "./components/forms/TransactionForm";
import { useTransactions } from "./hooks/useTransactions";

export default function CreateTransactionScreen() {

    const {
        insets
    } = useTransactions();

    return (
        <View className="flex-1 p-4 bg-gray-100" style={{ paddingTop: insets.top }}>
            <Text className="text-2xl font-bold mb-4">Nova Transação</Text>
            <TransactionForm />
        </View >
    );
}
