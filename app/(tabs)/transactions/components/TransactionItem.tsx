import { View, Text } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { Link } from "expo-router";
import { Transaction } from "../types";

interface TransactionItemProps {
    transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
    return (
        <Card className="mb-4">
            <CardHeader className="flex-row justify-between items-center">
                <CardTitle className="text-lg">{transaction.name}</CardTitle>
                <Link href={{ pathname: "/(tabs)/transactions/[id]", params: { id: transaction.id } }} className="text-primary text-md">
                    Ver detalhes
                </Link>
            </CardHeader>
            <CardContent className="flex-row justify-between items-center">
                <View>
                    <Text className="text-gray-600">{transaction.category.name}</Text>
                    <Text className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row items-center">
                    {transaction.transaction_type === "income" ? (
                        <TrendingUp size={20} color="green" />
                    ) : (
                        <TrendingDown size={20} color="red" />
                    )}
                    <Text className="text-lg font-semibold ml-2">
                        R$ {parseFloat(transaction.amount).toFixed(2)}
                    </Text>
                </View>
            </CardContent>
        </Card>
    );
}
