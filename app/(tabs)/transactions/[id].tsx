import { useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useTransactions } from "./hooks/useTransactions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button"; // Supondo que você tenha o componente Button

export default function TransactionDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { transaction, loading, error, fetchTransactionDetails } = useTransactions();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            fetchTransactionDetails(id as string);
        }
    }, [id, fetchTransactionDetails]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <ActivityIndicator size="large" color="#6200EE" />
                <Text className="mt-4 text-lg text-center">Carregando detalhes da transação...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-lg text-red-600 text-center">{error}</Text>
                <Button onPress={() => fetchTransactionDetails(id as string)} className="mt-4 w-3/4">
                    <Text>Tentar novamente</Text>
                </Button>
            </View>
        );
    }

    if (!transaction) {
        return <Text className="text-lg text-center mt-6">Transação não encontrada</Text>;
    }

    return (
        <View className="flex-1 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{transaction.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Text className="text-lg">
                        Categoria: <Text className="font-semibold">{transaction.category.name}</Text>
                    </Text>
                    <Text className="text-lg">
                        Tipo: <Text className="font-semibold">{transaction.transaction_type}</Text>
                    </Text>
                    <Text className="text-lg">
                        Descrição:{" "}
                        <Text className="font-semibold">
                            {transaction.description || 'Nenhuma descrição disponível'}
                        </Text>
                    </Text>
                    <Text className="text-lg">
                        Valor:{" "}
                        <Text className="font-semibold">
                            R$ {parseFloat(transaction.amount).toFixed(2)}
                        </Text>
                    </Text>
                    <Text className="text-lg">
                        Data:{" "}
                        <Text className="font-semibold">{new Date(transaction.created_at).toLocaleDateString()}</Text>
                    </Text>
                </CardContent>
                <CardFooter className="flex justify-between gap-4 mt-6">
                    <Button onPress={() => router.push(`/transactions/edit/${transaction.id}`)} variant={"secondary"} className="w-2/5">
                        <Text>Editar</Text>
                    </Button>

                    <Button onPress={() => router.back()} className="w-2/5" variant={"default"}>
                        <Text>Voltar</Text>
                    </Button>
                </CardFooter>
            </Card>
        </View>
    );
}
