import React from "react";
import { View } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { Link } from "expo-router";
import { Transaction } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

interface TransactionItemProps {
    transaction: Transaction;
}

const TransactionItemComponent: React.FC<TransactionItemProps> = ({ transaction }) => {
    return (
        <Card className="mb-4" key={transaction.id}>
            <CardHeader className="flex-row justify-between items-center">
                <CardTitle className="text-lg">{transaction.name}</CardTitle>
                <Link href={{ pathname: "/(tabs)/transactions/[id]", params: { id: transaction.id } }} className="text-primary text-md">
                    Ver detalhes
                </Link>
            </CardHeader>
            <CardContent className="flex-row justify-between items-center">
                <View>
                    <Text className="">{transaction.category.name}</Text>
                    <Text className="text-sm ">{new Date(transaction.created_at).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row items-center">
                    {transaction.transaction_type === "income" ? (
                        <TrendingUp size={20} color="green" />
                    ) : (
                        <TrendingDown size={20} color="red" />
                    )}
                    <Text className={`${transaction.transaction_type === "income" ? "text-primary" : "text-destructive"} text-lg font-bold ml-2`}>
                        R$ {parseFloat(transaction.amount).toFixed(2)}
                    </Text>
                </View>
            </CardContent>
        </Card>
    );
};

export const TransactionItem = React.memo(TransactionItemComponent);
