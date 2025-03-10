import { View, ScrollView, RefreshControl } from "react-native";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useDashboards } from "~/models/dashboard/hooks/useDashboards";
import CategoryBarChart from "~/models/dashboard/components/CategoryBarChart";
import MonthlyResultsChart from "~/models/dashboard/components/MonthlyResultsChart";

export default function HomeScreen() {
    const {
        dashboardData,
        fetchDashboardData,
        onRefresh,
        refreshing,
        loading,
    } = useDashboards();


    useEffect(() => {
        fetchDashboardData();
    }, []);

    const { total_balance, total_expense, total_income, expenses_by_category, incomes_by_category, transactions_by_month } = dashboardData || {};

    return (
        <ScrollView
            className="flex-1 p-4 pb-10"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text className="text-lg font-bold  mb-4">Resumo Financeiro</Text>

            <Card className="rounded-lg shadow-md mb-4">
                <CardHeader>
                    <CardTitle>Saldo Total</CardTitle>
                    <CardDescription>R$ {total_balance}</CardDescription>
                </CardHeader>
                <CardContent className="flex-row justify-between mt-2">
                    <Text className="text-primary">Receitas: R$ {total_income}</Text>
                    <Text className="text-destructive">Despesas: R$ {total_expense}</Text>
                </CardContent>
            </Card>

            <CategoryBarChart
                title="Receitas por Categoria"
                data={incomes_by_category || []}
                color="#16A34A"
            />

            <CategoryBarChart
                title="Despesas por Categoria"
                data={expenses_by_category || []}
                color="#ff0000"
            />

            <MonthlyResultsChart transactionsByMonth={transactions_by_month || []} />

        </ScrollView>
    );
}
