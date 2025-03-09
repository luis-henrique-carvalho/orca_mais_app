import { Tabs, useRouter } from "expo-router";
import * as React from 'react';
import { WalletMinimal, Home } from "lucide-react-native";
import { useAuthStore } from "~/store/auth";

export default function TabLayout() {
    const hasMounted = React.useRef(false);
    const { token } = useAuthStore();
    const router = useRouter(); // Corrigido erro de digitação

    React.useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        if (!token) {
            router.replace('/(auth)/login');
        }
    }, [token]);

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
