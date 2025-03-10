import { View, Text } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BarChart } from "react-native-gifted-charts";
import { useColorScheme } from "~/lib/useColorScheme";
import { TransactionByCategory, TransactionsByMonth } from "../types";

interface MonthlyResultsChartProps {
    transactionsByMonth: TransactionsByMonth[];
}

export const MonthlyResultsChart = ({ transactionsByMonth }: MonthlyResultsChartProps) => {
    const { isDarkColorScheme } = useColorScheme();

    return (
        <Card className="rounded-lg shadow-md mb-4">
            <CardHeader>
                <CardTitle>Resultados por Mês</CardTitle>
            </CardHeader>
            <CardContent>
                {transactionsByMonth.length > 0 ? (
                    <BarChart
                        data={transactionsByMonth.map((item) => ({
                            value: Number(item.total_amount),
                            label: new Date(item.month).toLocaleDateString("pt-BR", {
                                month: "2-digit",
                                year: "2-digit",
                            }),
                            topLabelComponent: () => (
                                <Text className="text-foreground text-xs">
                                    {Number(item.total_amount).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </Text>
                            ),
                            frontColor: item.total_amount < "0" ? "#ff0000" : "#16A34A",
                        }))}
                        barWidth={60}
                        width={300}
                        yAxisLabelWidth={50}
                        stepHeight={25}
                        yAxisTextStyle={{ color: isDarkColorScheme ? "#fff" : "#000" }}
                        xAxisLabelTextStyle={{ color: isDarkColorScheme ? "#fff" : "#000" }}
                    />
                ) : (
                    <Text className="text-center">Nenhum dado de resultados mensais disponível.</Text>
                )}
            </CardContent>
        </Card>
    );
};

export default MonthlyResultsChart;
