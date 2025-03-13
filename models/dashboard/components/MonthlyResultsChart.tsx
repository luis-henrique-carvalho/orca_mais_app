import { Text } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BarChart } from "react-native-gifted-charts";
import { useColorScheme } from "~/lib/useColorScheme";
import { TransactionsByMonth } from "../types";
import { useMemo } from "react";

interface MonthlyResultsChartProps {
    transactionsByMonth: TransactionsByMonth[];
}

export const MonthlyResultsChart = ({ transactionsByMonth }: MonthlyResultsChartProps) => {
    const { isDarkColorScheme } = useColorScheme();

    const data = useMemo(() => {
        return transactionsByMonth.map((item) => {
            const totalAmount = Number(item.total_amount);
            const date_label = new Date(item.month).toLocaleDateString("pt-BR", {
                month: "2-digit",
                year: "2-digit",
            });
            const frontColor = totalAmount < 0 ? "#ff0000" : "#16A34A";

            return {
                value: totalAmount,
                label: date_label,
                onPress: () => {
                    console.log("clicked");
                },
                topLabelComponent: () => (
                    <Text className="text-foreground text-xs">{totalAmount}</Text>
                ),
                frontColor: frontColor,
            };
        });
    }, [transactionsByMonth]);

    const maxValueAbs = useMemo(() => {
        const values = data.map(item => item.value);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);

        return Math.max(Math.abs(maxValue), Math.abs(minValue));
    }, [data]);

    return (
        <Card className="rounded-lg shadow-md mb-4">
            <CardHeader>
                <CardTitle>Resultados por Mês</CardTitle>
            </CardHeader>
            <CardContent>
                {transactionsByMonth.length > 0 ? (
                    <BarChart
                        data={data}
                        barWidth={70}
                        yAxisLabelWidth={40}
                        width={300}
                        autoShiftLabels
                        stepHeight={25}
                        maxValue={maxValueAbs}
                        yAxisTextStyle={{ color: isDarkColorScheme ? "#fff" : "#000" }}
                        xAxisLabelTextStyle={{ color: isDarkColorScheme ? "#fff" : "#000" }}
                        rulesType="solid"
                    />
                ) : (
                    <Text className="text-center">Nenhum dado de resultados mensais disponível.</Text>
                )}
            </CardContent>
        </Card>
    );
};

export default MonthlyResultsChart;
