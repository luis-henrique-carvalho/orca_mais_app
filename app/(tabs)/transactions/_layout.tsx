import { Stack } from "expo-router";

export default function TransactionsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Transações", headerShown: false }} />
            <Stack.Screen name="[id]" options={{ title: "Detalhes da Transação", headerShown: false }} />
            <Stack.Screen name="create" options={{ title: "Nova Transação", headerShown: false }} />
            <Stack.Screen name="edit/[id]" options={{ title: "Editar Transação", headerShown: false }} />
        </Stack>
    );
}
