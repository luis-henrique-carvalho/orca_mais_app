import { View, ScrollView, RefreshControl } from "react-native";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useDashboards } from "~/models/dashboard/hooks/useDashboards";
import CategoryBarChart from "~/models/dashboard/components/CategoryBarChart";
import MonthlyResultsChart from "~/models/dashboard/components/MonthlyResultsChart";
import { useSegments } from "expo-router";

export default function HomeScreen() {
    const {
        dashboardData,
        fetchDashboardData,
        onRefresh,
        refreshing,
    } = useDashboards();

    const segments = useSegments();

    // TODO: Fetch data only when user creates or deletes a transaction
    useEffect(() => {
        if (segments[1] === "(home)") {
            fetchDashboardData();
        }
    }, [segments]);

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
                    <CardDescription className={`text-md ${(Number(total_balance) || 0) < 0 ? "text-destructive" : "text-primary"}`}>
                        R$ {total_balance ?? 0}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-row justify-between mt-2">
                    <View>
                        <Text className="text-md text-muted-foreground">Receitas</Text>
                        <Text className="text-primary">R${total_income}</Text>
                    </View>
                    <View>
                        <Text className="text-md text-muted-foreground">Despesas</Text>
                        <Text className="text-destructive">R${total_expense}</Text>
                    </View>
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
