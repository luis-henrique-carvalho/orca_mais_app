import React from "react";
import { useForm, Controller } from "react-hook-form";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "~/models/user/schemas/userSchema";
import { useRouter } from "expo-router";

interface UserFormProps {
    defaultValues?: UserFormData;
    onSubmit: (data: UserFormData) => Promise<void>;
}

export default function UserForm({ defaultValues, onSubmit }: UserFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues,
    });

    const router = useRouter();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="gap-4">
                <View>
                    <Label className="font-semibold mb-1" nativeID="full_name">Nome Completo</Label>
                    <Controller
                        control={control}
                        name="full_name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Digite seu nome completo"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                className={`border rounded-lg p-3 ${errors.email ? "border-destructive" : "border-primary"}`}
                            />
                        )}
                    />
                    {errors.full_name && <Text className="text-destructive text-xs mt-1">{errors.full_name.message}</Text>}
                </View>
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

                {/* cpf */}
                <View>
                    <Label className="font-semibold mb-1" nativeID="cpf">CPF</Label>
                    <Controller
                        control={control}
                        name="cpf"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Digite seu CPF"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="numeric"
                                className={`border rounded-lg p-3 ${errors.cpf ? "border-destructive" : "border-primary"}`}
                            />
                        )}
                    />
                    {errors.cpf && <Text className="text-destructive text-xs mt-1">{errors.cpf.message}</Text>}
                </View>

                <Button onPress={handleSubmit(onSubmit)} className="bg-primary p-3 rounded-lg flex items-center justify-center">
                    <Text className="font-bold">Salvar</Text>
                </Button>

                <Button
                    onPress={() => {
                        router.back();
                    }}
                    variant="outline"
                    className="bg-secondary p-3 rounded-lg flex items-center justify-center"
                >
                    <Text className="font-bold">Cancelar</Text>
                </Button>
            </View>
        </TouchableWithoutFeedback>
    );
}
