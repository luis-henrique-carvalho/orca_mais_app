import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Início",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: "Transações",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
