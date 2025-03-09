import { Stack, useRouter } from "expo-router";
import React from "react";
import { useAuthStore } from '~/store/auth';

export default function AuthLayout() {
    const { token } = useAuthStore();
    const router = useRouter();
    const hasMounted = React.useRef(false);

    React.useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        if (token) {
            router.replace('/(tabs)/(home)');
        }
    }, [token]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="signup" options={{ title: "Cadastro" }} />
        </Stack>
    );
}
