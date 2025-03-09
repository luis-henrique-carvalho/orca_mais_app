import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { signInSchema, signInFormData } from "~/app/(auth)/schemas/signInSchema";
import { useAuthStore } from "~/store/auth";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export default function LoginForm() {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<signInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const { login, message, isLoading } = useAuthStore();
    const router = useRouter();

    const onSubmit = async (data: signInFormData) => {
        try {
            await login(data.email, data.password);
            router.replace("/(tabs)/(home)");
        } catch (error) {
            console.log("Erro no login:", error);
        }
    };

    return (
        <View className="p-6 flex flex-col gap-5">
            {/* Campo Email */}
            <View>
                <Label className=" font-semibold mb-1" nativeID="email">Email</Label>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder="Digite seu email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className={`border rounded-lg p-3 ${errors.email ? "border-destructive" : "border-primary"}`}
                        />
                    )}
                />
                {errors.email && <Text className="text-destructive text-xs mt-1">{errors.email.message}</Text>}
            </View>

            {/* Campo Senha */}
            <View>
                <Label className=" font-semibold mb-1" nativeID="password">Senha</Label>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder="Digite sua senha"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize="none"
                            className={`border rounded-lg p-3 ${errors.password ? "border-destructive" : "border-primary"}`}
                        />
                    )}
                />
                {errors.password && <Text className="text-destructive text-xs mt-1">{errors.password.message}</Text>}
            </View>

            {/* Mensagem de erro de login */}
            {message.text && message.type == "error" && <Text className="text-destructive text-sm text-center">{message.text}</Text>}

            {/* Botão de Login */}
            <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className={`bg-primary p-3 rounded-lg flex items-center justify-center ${isLoading ? "opacity-50" : ""}`}
            >
                <Text className=" font-bold">{isLoading ? "Entrando..." : "Entrar"}</Text>

            </Button>
        </View>
    );
}
