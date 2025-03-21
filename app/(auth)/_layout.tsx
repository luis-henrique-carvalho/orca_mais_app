import { Stack, useRouter } from "expo-router";
import React from "react";
import { useAuth } from "~/context/AuthContext";

export default function AuthLayout() {
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
            if (authStage.authenticated) {
                router.replace("/(tabs)/(home)");
            }
        }
    }, [authStage.authenticated, isMounted]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="signup" options={{ title: "Cadastro" }} />
        </Stack>
    )
}
