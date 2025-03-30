import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { transactionSchema, TransactionFormData, TransactionType, transactionTypeLabels } from "~/models/transaction/schemas/transactionSchema";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useTransactions } from "~/models/transaction/hooks/useTransactions";
import { Textarea } from "~/components/ui/textarea";
import { TransactionCategorySelector } from "../TransactionCategorySelector";
import { Link } from "expo-router";
import { Category } from "../../types";

interface TransactionFormProps {
    defaultValues?: TransactionFormData;
    id?: string;
    editCategory?: Category
}

export default function TransactionForm({ defaultValues, id, editCategory }: TransactionFormProps) {
    defaultValues = {
        ...defaultValues,
        name: defaultValues?.name || "",
        amount: Math.abs(defaultValues?.amount ?? 0),
        category_id: defaultValues?.category_id || "",
        transaction_type: defaultValues?.transaction_type ?? TransactionType.expense,
        description: defaultValues?.description || ""
    };

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues,
    });

    const { createTransaction, updateTransaction, categories, fetchCategories } = useTransactions();

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (data: TransactionFormData) => {
        if (defaultValues && id) {
            await updateTransaction(id, data);
            return;
        }

        await createTransaction(data);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{ gap: 10 }}>
                {/* Campo Nome */}
                <View>
                    <Label className=" font-semibold mb-1">Nome</Label>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Digite o nome da transação"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                className={errors.name ? "border-destructive" : "border-primary"}
                            />
                        )}
                    />
                    {errors.name && <Text className="text-destructive text-xs mt-1">{errors.name.message}</Text>}
                </View>

                {/* Campo Valor */}
                <View>
                    <Label className=" font-semibold mb-1">Valor</Label>
                    <Controller
                        control={control}
                        name="amount"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Digite o valor da transação"
                                onBlur={onBlur}
                                onChangeText={(text) => onChange(Number(text))}
                                value={value.toString()}
                                keyboardType="decimal-pad"
                                className={errors.amount ? "border-destructive" : "border-primary"}
                            />
                        )}
                    />
                    {errors.amount && <Text className="text-destructive text-xs mt-1">{errors.amount.message}</Text>}
                </View>

                {/* Campo Categoria */}
                <View>
                    <Label className=" font-semibold mb-1">Categoria</Label>
                    <Controller
                        control={control}
                        name="category_id"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-1">
                                <TransactionCategorySelector categories={categories} setSelectedCategory={onChange} default_Category={editCategory} />
                            </View>
                        )}
                    />
                    {errors.category_id && <Text className="text-destructive text-xs mt-1">{errors.category_id.message}</Text>}
                </View>

                {/* Campo Description */}
                <View>
                    <Label className=" font-semibold mb-1">Descrição</Label>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Textarea
                                placeholder="Digite a descrição da transação"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                className={errors.description ? "border-destructive" : "border-primary"}
                            />
                        )}
                    />
                    {errors.description && <Text className="text-destructive text-xs mt-1">{errors.description.message}</Text>}
                </View>

                {/* Campo Tipo de Transação */}
                <View>
                    <Label className=" font-semibold mb-1">Tipo de Transação</Label>
                    <Controller
                        control={control}
                        name="transaction_type"
                        render={({ field: { onChange, value } }) => (
                            <Select
                                onValueChange={(option) => option && onChange(option.value)}
                                defaultValue={value ? { value, label: transactionTypeLabels[value] } : undefined}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o tipo de transação" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectGroup>
                                        {Object.entries(transactionTypeLabels).map(([typeValue, label]) => (
                                            <SelectItem key={typeValue} value={typeValue} label={label}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.transaction_type && <Text className="text-destructive text-xs mt-1">{errors.transaction_type.message}</Text>}
                </View>

                <Button onPress={handleSubmit(onSubmit)} className="bg-primary p-3 rounded-lg flex items-center justify-center">
                    <Text className=" font-bold">
                        {defaultValues ? "Editar Transação" : "Criar Transação"}
                    </Text>
                </Button>

                <Link href="/(tabs)/transactions" className="text-primary text-center mt-4">
                    Voltar
                </Link>
            </ScrollView>
        </TouchableWithoutFeedback >
    );
}
