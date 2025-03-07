import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { signUpSchema, signUpFormData } from "~/app/(auth)/schemas/signUpSchema";
import { useAuthStore } from "~/store/auth";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export default function RegisterForm() {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<signUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const { signup, message, isLoading } = useAuthStore();
    const router = useRouter();

    const onSubmit = async (data: signUpFormData) => {
        try {
            await signup(data.email, data.password, data.name);
            router.replace("/(tabs)/(home)");
        } catch (error) {
            console.log("Erro no cadastro:", error);
        }
    };

    return (
        <View className="p-6 flex flex-col gap-5">
            {/* Campo Nome */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1" nativeID="name">Nome</Label>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder="Digite seu nome"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            className={`border rounded-lg p-3 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                        />
                    )}
                />
                {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>}
            </View>

            {/* Campo Email */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1" nativeID="email">Email</Label>
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
                            className={`border rounded-lg p-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        />
                    )}
                />
                {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
            </View>

            {/* Campo Senha */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1" nativeID="password">Senha</Label>
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
                            className={`border rounded-lg p-3 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                        />
                    )}
                />
                {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
            </View>

            {/* Mensagem de erro no cadastro */}
            {message.text && message.type == "error" && <Text className="text-red-500 text-sm text-center">{message.text}</Text>}

            {/* Botão de Cadastro */}
            <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className={`bg-blue-600 p-3 rounded-lg flex items-center justify-center ${isLoading ? "opacity-50" : ""}`}
            >
                <Text className="text-white font-bold">{isLoading ? "Cadastrando..." : "Cadastrar"}</Text>
            </Button>
        </View>
    );
}
