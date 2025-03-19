import React from "react";
import { View } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { Transaction } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Trash2, Info } from "lucide-react-native";
import { useTransactionStore } from "../store/useTransactionSore";

interface TransactionItemProps {
    transaction: Transaction;
}

const TransactionItemComponent: React.FC<TransactionItemProps> = ({ transaction }) => {
    const router = useRouter();

    const { deleteTransaction } = useTransactionStore()

    return (
        <Card className="mb-4" key={transaction.id}>
            <CardHeader className="flex-row justify-between items-center">
                <CardTitle className="text-lg">{transaction.name}</CardTitle>
                <View className="flex-row items-center gap-2">
                    <Button onPress={() => deleteTransaction(transaction.id)} variant={"destructive"}>
                        <Trash2 size={20} color={"white"} />
                    </Button>
                    <Button onPress={() => router.push(`/transactions/${transaction.id}`)} variant="default">
                        <Info size={20} color={"white"} />
                    </Button>
                </View>
            </CardHeader>
            <CardContent className="flex-row justify-between items-center">
                <View>
                    <Text className="text-md">{transaction.category.name}</Text>
                    <Text className="text-sm text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row items-center gap-2">
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
