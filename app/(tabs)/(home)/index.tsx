import { View, ScrollView, RefreshControl } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useTransactions } from "~/app/(tabs)/transactions/hooks/useTransactions";
import { useEffect } from "react";
import { Transaction } from "../transactions/types";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
    const {
        transactions,
        fetchTransactions,
        onRefresh,
        refreshing,
        loading,
    } = useTransactions();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const expenses = transactions.filter(t => t.transaction_type === "expense");
    const incomes = transactions.filter(t => t.transaction_type === "income");
    const totalExpenses = expenses.reduce((acc, t) => acc + Number(t.amount), 0);
    const totalIncome = incomes.reduce((acc, t) => acc + Number(t.amount), 0);
    const balance = totalIncome - Math.abs(totalExpenses);

    const expensivesList = transactions
        .filter(t => t.transaction_type === "expense")
        .map((transaction: Transaction) => ({
            value: Math.abs(Number(transaction.amount)),
            label: transaction.category.name,
        }));

    const incomesList = transactions
        .filter(t => t.transaction_type === "income")
        .map((transaction: Transaction) => ({
            value: Number(transaction.amount),
            label: transaction.category.name,
        }));

    const latestTransactions = transactions.slice(0, 5);

    return (
        <ScrollView
            className="flex-1 p-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text className="text-lg font-bold  mb-4">Resumo Financeiro</Text>

            <Card className="p-4 rounded-lg shadow-md mb-4">
                <Text className="text=primary">Saldo Total</Text>
                <Text className="text-2xl font-bold ">R$ {balance.toFixed(2)}</Text>
                <View className="flex-row justify-between mt-2">
                    <Text className="text-green-500">Receitas: R$ {totalIncome.toFixed(2)}</Text>
                    <Text className="text-red-500">Despesas: R$ {Math.abs(totalExpenses).toFixed(2)}</Text>
                </View>
            </Card>

            <Card className="p-4 rounded-lg shadow-md mb-4">
                <Text className=" mb-2">Gastos por Categoria</Text>
                {expensivesList.length > 0 ? (
                    <BarChart
                        data={expensivesList}
                        barWidth={30}
                        barBorderRadius={5}
                        frontColor="#EF4444"
                        yAxisLabelWidth={40}
                    />
                ) : (
                    <Text className="text-center ">Nenhuma despesa registrada.</Text>
                )}
            </Card>

            <Card className="p-4 rounded-lg shadow-md mb-4">
                <Text className=" mb-2">Receita por Categoria</Text>
                {incomesList.length > 0 ? (
                    <BarChart
                        data={incomesList}
                        barWidth={30}
                        barBorderRadius={5}
                        frontColor="#10B981"
                        yAxisLabelWidth={40}
                    />
                ) : (
                    <Text className="text-center ">Nenhuma receita registrada.</Text>
                )}
            </Card>

            <Card className="p-4 rounded-lg shadow-md">
                <Text className=" mb-2">Últimas Transações</Text>
                {latestTransactions.length > 0 ? (
                    latestTransactions.map((t, index) => (
                        <View key={index} className="flex-row justify-between border-b py-2 last:border-b-0">
                            <Text className="">{t.category.name}</Text>
                            <Text className={t.transaction_type === "expense" ? "text-red-500" : "text-green-500"}>R$ {Number(t.amount).toFixed(2)}</Text>
                        </View>
                    ))
                ) : (
                    <Text className="text-center ">Nenhuma transação recente.</Text>
                )}
            </Card>
        </ScrollView>
    );
}
