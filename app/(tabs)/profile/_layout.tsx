import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Perfil", headerShown: false }} />
            <Stack.Screen name="edit" options={{ title: "Editar Perfil", headerShown: false }} />
        </Stack>
    );
}
