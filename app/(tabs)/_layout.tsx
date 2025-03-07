import { Redirect, Tabs } from "expo-router";
import * as React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'expo-router';
import { WalletMinimal, Home } from "lucide-react-native";

export default function TabLayout() {
    const { token } = useAuthStore();

    if (!token) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Início",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: "Transações",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <WalletMinimal color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
