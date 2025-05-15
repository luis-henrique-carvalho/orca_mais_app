import { SafeAreaView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useUserStore } from "~/models/user/store/useUserStore";
import { useAuth } from "~/context/AuthContext";

export default function ProfileScreen() {
  const { user, fetchUser, loading, error } = useUserStore();
  const { authStage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authStage.user?.id) {
      fetchUser(authStage.user.id);
    }
  }, [authStage.user?.id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-lg">Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-lg text-destructive">{error}</Text>
        <Button onPress={() => fetchUser(authStage.user?.id || "")} className="mt-4">
          <Text>Tentar Novamente</Text>
        </Button>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-lg">
          Nenhuma informação do usuário disponível.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <Card className="p-4">
        <CardContent>
          <View className="flex-row items-center gap-4 mb-6">
            <Avatar alt={"Profile "} className="h-24 w-24">
              {user?.avatar && user?.avatar.url ? (
                <AvatarImage source={{ uri: user.avatar.url }} />
              ) : (
                <AvatarFallback>
                  <Text className="text-lg font-bold">{user?.full_name[0]}</Text>
                </AvatarFallback>
              )}
            </Avatar>
            <View>
              <Text className="text-2xl font-bold">{user.full_name}</Text>
              <Text className="text-md text-muted-foreground">{user.email}</Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold mb-2">Detalhes do Usuário</Text>
            <Text className="text-md">ID: {user.id}</Text>
            <Text className="text-md">Email: {user.email}</Text>
            <Text className="text-md">CPF: {user.cpf ? user.cpf : "Não informado"}</Text>
          </View>

          <Button
            onPress={() => router.push("/profile/edit")}
            variant="default"
            className="w-full"
          >
            <Text>Editar Perfil</Text>
          </Button>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
