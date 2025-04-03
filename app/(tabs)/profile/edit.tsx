import { SafeAreaView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import UserForm from "~/models/user/components/forms/UserForm";
import { useUserStore } from "~/models/user/store/useUserStore";
import { useState } from "react";

export default function EditProfileScreen() {
    const { user, updateUser, error } = useUserStore();
    const [updateError, setUpdateError] = useState<string | null>(null);
    const router = useRouter();

    const handleSave = async (data: { full_name: string; email: string; cpf: string }) => {
        if (user?.id) {
            try {
                await updateUser(user.id, data);
                router.back();
            } catch (err) {
                setUpdateError("Falha ao atualizar os dados. Tente novamente.");
            }
        }
    };

    if (!user) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-lg">Carregando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 p-4">
            <View className="mb-4">
                <Text className="text-lg font-bold mb-2">Editar Perfil</Text>
                {updateError && <Text className="text-destructive mb-2">{updateError}</Text>}
                {error && <Text className="text-destructive mb-2">{error}</Text>}
                <UserForm
                    defaultValues={{
                        full_name: user.full_name,
                        email: user.email,
                        cpf: user.cpf || "",
                    }}
                    onSubmit={handleSave}
                />
            </View>
        </SafeAreaView>
    );
}
