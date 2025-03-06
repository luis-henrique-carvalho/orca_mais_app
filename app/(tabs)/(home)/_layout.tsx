import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Início", headerShown: false }} />
            <Stack.Screen name="details" options={{ title: "Detalhes da Transação", headerShown: false }} />
        </Stack>
    );
}
