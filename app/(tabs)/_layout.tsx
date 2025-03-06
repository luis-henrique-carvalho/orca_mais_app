import { Redirect, Tabs } from "expo-router";
import * as React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'expo-router';

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
