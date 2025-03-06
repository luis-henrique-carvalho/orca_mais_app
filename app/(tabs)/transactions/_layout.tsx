import { Stack } from "expo-router";

export default function TransactionsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "app/(tabs)/transactions/_layout.tsx", headerShown: false }} />
            <Stack.Screen name="create" options={{ title: "Nova Transação", headerShown: false }} />
            <Stack.Screen name="edit" options={{ title: "Editar Transação", headerShown: false }} />
        </Stack>
    );
}
