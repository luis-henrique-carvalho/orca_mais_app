import { useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTransactions } from "./hooks/useTransactions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useRouter } from "expo-router";

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
            <View className="flex-1 justify-center items-center bg-gray-100 p-4">
                <ActivityIndicator size="large" color="#6200EE" />
                <Text className="mt-4 text-lg text-gray-700">Carregando detalhes da transação...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100 p-4">
                <Text className="text-lg text-red-600">{error}</Text>
                <TouchableOpacity onPress={() => fetchTransactionDetails(id as string)} className="mt-4 bg-blue-500 p-2 rounded">
                    <Text className="text-white">Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!transaction) {
        return <Text className="text-lg text-center mt-4">Transação não encontrada</Text>;
    }

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">{transaction.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Text className="text-lg text-gray-700">Categoria: <Text className="font-semibold">{transaction.category.name}</Text></Text>
                    <Text className="text-lg text-gray-700 mt-2">Tipo: <Text className="font-semibold">{transaction.transaction_type}</Text></Text>
                    <Text className="text-lg text-gray-700 mt-2">Descrição: <Text className="font-semibold">{transaction.description || 'Nenhuma descrição disponível'}</Text></Text>
                    <Text className="text-lg text-gray-700 mt-2">Valor: <Text className="font-semibold">R$ {parseFloat(transaction.amount).toFixed(2)}</Text></Text>
                    <Text className="text-lg text-gray-700 mt-2">Data: <Text className="font-semibold">{new Date(transaction.created_at).toLocaleDateString()}</Text></Text>
                </CardContent>
                <CardFooter className="flex justify-end mt-4">
                    <TouchableOpacity onPress={() => router.back()} className="bg-blue-500 py-2 px-6 rounded-full">
                        <Text className="text-white font-semibold">Voltar</Text>
                    </TouchableOpacity>
                </CardFooter>
            </Card>
        </View>
    );
}
