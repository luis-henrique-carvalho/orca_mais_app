import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "~/models/user/schemas/userSchema";
import { useRouter } from "expo-router";

interface UserFormProps {
    defaultValues?: UserFormData;
    onSubmit: (data: FormData) => Promise<void>;
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

    const [avatar, setAvatar] = useState<string | null>(defaultValues?.avatar || null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Atualizado para usar o novo padrão
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleFormSubmit = async (data: UserFormData) => {
        const formData = new FormData();

        formData.append("user[full_name]", data.full_name);
        formData.append("user[email]", data.email);
        formData.append("user[cpf]", data.cpf);

        if (avatar) {
            const fileName = avatar.split("/").pop();
            const fileType = fileName?.split(".").pop();
            formData.append("user[avatar]", {
                uri: avatar,
                name: fileName,
                type: `image/${fileType}`,
            } as any);
        }

        setLoading(true);

        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="gap-4">
                <View className="items-center mb-4">
                    <Label className="font-semibold mb-2">Avatar</Label>
                    <TouchableWithoutFeedback onPress={handlePickImage}>
                        <Avatar className="h-24 w-24" alt="Profile Avatar">
                            {avatar ? (
                                <AvatarImage source={{ uri: avatar }} />
                            ) : (
                                <AvatarFallback>
                                    <Text className="text-lg font-bold">A</Text>
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </TouchableWithoutFeedback>
                    <Text className="text-sm text-muted-foreground mt-2">Toque para alterar o avatar</Text>
                </View>

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
                                className={`border rounded-lg p-3 ${errors.full_name ? "border-destructive" : "border-primary"}`}
                            />
                        )}
                    />
                    {errors.full_name && <Text className="text-destructive text-xs mt-1">{errors.full_name.message}</Text>}
                </View>

                <View>
                    <Label className="font-semibold mb-1" nativeID="email">Email</Label>
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

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Button onPress={handleSubmit(handleFormSubmit)} className="bg-primary p-3 rounded-lg flex items-center justify-center">
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
                    </>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}
