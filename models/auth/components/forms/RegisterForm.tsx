import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { signUpSchema, signUpFormData } from "~/models/auth/schemas/signUpSchema";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/context/AuthContext";

export default function RegisterForm() {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<signUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const { onRegister } = useAuth();

    const onSubmit = async (data: signUpFormData) => {
        try {
            await onRegister(data.email, data.password, data.name);
        } catch (error) {
            console.log("Erro no cadastro:", error);
        }
    };

    return (
        <View className="p-6 flex flex-col gap-5">
            {/* Campo Nome */}
            <View>
                <Label className=" font-semibold mb-1" nativeID="name">Nome</Label>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder="Digite seu nome"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            className={`border rounded-lg p-3 ${errors.name ? "border-destructive" : "border-primary"}`}
                        />
                    )}
                />
                {errors.name && <Text className="text-destructive text-xs mt-1">{errors.name.message}</Text>}
            </View>

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

            {/* Mensagem de erro no cadastro */}

            {/* Botão de Cadastro */}
            <Button
                onPress={handleSubmit(onSubmit)}
                className={`bg-primary p-3 rounded-lg flex items-center justify-center`}
            >
                <Text className=" font-bold">Cadastrar</Text>
            </Button>
        </View>
    );
}
