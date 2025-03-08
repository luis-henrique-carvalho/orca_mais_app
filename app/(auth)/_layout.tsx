import { Stack, Redirect } from "expo-router";
import { useAuthStore } from '~/store/auth';

export default function AuthLayout() {
    const { token } = useAuthStore();

    if (token) {
        return <Redirect href="/(tabs)/(home)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="signup" options={{ title: "Cadastro" }} />
        </Stack>
    );
}
