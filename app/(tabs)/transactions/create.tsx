import { SafeAreaView } from "react-native";
import TransactionForm from "~/models/transaction/components/forms/TransactionForm";
import { useTransactions } from "~/models/transaction/hooks/useTransactions";
import { Text } from "~/components/ui/text";

import { useInsects } from "~/lib/utils";

export default function CreateTransactionScreen() {
    const { insets } = useInsects();

    return (
        <SafeAreaView className="flex-1 p-4 " style={{ paddingTop: insets.top }}>
            <Text className="text-2xl font-bold mb-4">Nova Transação</Text>
            <TransactionForm />
        </SafeAreaView >
    );
}
