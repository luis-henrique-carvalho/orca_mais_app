import { router, Tabs, useRouter } from "expo-router";
import * as React from 'react';
import { WalletMinimal, Home } from "lucide-react-native";
import { useAuth } from "~/context/AuthContext";

export default function TabLayout() {
    return (
        <MainLayout />
    );
}

const MainLayout = () => {
    const { authStage } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            console.log("leyout de tabs", !authStage.authenticated);

            if (!authStage.authenticated) {
                console.log("User is not authenticated, redirecting to login");
                router.replace("/(auth)/login");
            }
        }
    }, [authStage.authenticated, isMounted]);

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
    )
}
