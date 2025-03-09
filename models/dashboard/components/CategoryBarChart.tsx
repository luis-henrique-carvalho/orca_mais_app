import { View, Text } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BarChart } from "react-native-gifted-charts";
import { useColorScheme } from "~/lib/useColorScheme";
import { DashboardData, TransactionByCategory } from "../types";

interface CategoryBarChartProps {
    title: string;
    data: TransactionByCategory[];
    color: string;
}

const CategoryBarChart = ({ title, data, color }: CategoryBarChartProps) => {
    const { colorScheme, isDarkColorScheme } = useColorScheme();

    return (
        <Card className="rounded-lg shadow-md mb-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {data && data.length > 0 ? (
                    <View>
                        <BarChart
                            data={data.map(item => ({
                                value: Math.abs(Number(item.total_amount)),
                                label: item.category_name,
                                topLabelComponent: () => (
                                    <Text className="text-primary text-xs">{`${item.total_amount}`}</Text>
                                ),
                            }))}
                            barWidth={60}
                            frontColor={color}
                            width={300}
                            yAxisLabelWidth={40}
                            stepHeight={25}
                            yAxisTextStyle={{ color: isDarkColorScheme ? "#fff" : "#000" }}
                            xAxisLabelTextStyle={{ color: isDarkColorScheme ? "#fff" : "#000" }}
                        />
                    </View>
                ) : (
                    <Text className="text-center">Nenhuma {title.toLowerCase()} registrada.</Text>
                )}
            </CardContent>
        </Card>
    );
};

export default CategoryBarChart;
