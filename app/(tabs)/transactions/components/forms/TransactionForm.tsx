import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { transactionSchema, TransactionFormData, TransactionType } from "~/app/(tabs)/transactions/schemas/transactionSchema";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useTransactions } from "../../hooks/useTransactions";
import { Textarea } from "~/components/ui/textarea";
import { TransactionCategorySelector } from "../TransactionCategorySelector";
import { Link, useRouter } from "expo-router";

export default function TransactionForm() {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
    });

    const { createTransaction, categories, contentInsets, fetchCategories } = useTransactions();

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (data: TransactionFormData) => {
        console.log(data);
        await createTransaction(data);
    };

    return (
        <View className="flex flex-col gap-5">
            {/* Campo Nome */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1">Nome</Label>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder="Digite o nome da transação"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            className={errors.name ? "border-red-500" : "border-gray-300"}
                        />
                    )}
                />
                {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>}
            </View>

            {/* Campo Valor */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1">Valor</Label>
                <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder="Digite o valor da transação"
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(parseFloat(text) || 0)}
                            value={value ? value.toString() : ""}
                            keyboardType="decimal-pad"
                            className={errors.amount ? "border-red-500" : "border-gray-300"}
                        />
                    )}
                />
                {errors.amount && <Text className="text-red-500 text-xs mt-1">{errors.amount.message}</Text>}
            </View>

            {/* Campo Categoria */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1">Categoria</Label>
                <Controller
                    control={control}
                    name="category_id"
                    render={({ field: { onChange, value } }) => (
                        <TransactionCategorySelector categories={categories} setSelectedCategory={onChange} contentInsets={contentInsets} />
                    )}
                />
                {errors.category_id && <Text className="text-red-500 text-xs mt-1">{errors.category_id.message}</Text>}
            </View>

            {/* Campo Description */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1">Descrição</Label>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Textarea
                            placeholder="Digite a descrição da transação"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            className={errors.description ? "border-red-500" : "border-gray-300"}
                        />
                    )}
                />
                {errors.description && <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>}
            </View>

            {/* Campo Tipo de Transação */}
            <View>
                <Label className="text-gray-700 font-semibold mb-1">Tipo de Transação</Label>
                <Controller
                    control={control}
                    name="transaction_type"
                    render={({ field: { onChange, value } }) => (
                        <Select onValueChange={(option) => option && onChange(option.value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo de transação" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectGroup>
                                    <SelectLabel>Tipo de Transação</SelectLabel>
                                    <SelectItem value={TransactionType.income} label={TransactionType.income}>Receita</SelectItem>
                                    <SelectItem value={TransactionType.expense} label={TransactionType.expense}>Despesa</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.transaction_type && <Text className="text-red-500 text-xs mt-1">{errors.transaction_type.message}</Text>}
            </View>

            <View className="flex-1" />
            <Button onPress={handleSubmit(onSubmit)} className="bg-blue-600 p-3 rounded-lg flex items-center justify-center">
                <Text className="text-white font-bold">Criar Transação</Text>
            </Button>

            <Link href="/(tabs)/transactions" className="text-blue-600 text-center mt-4">
                Voltar
            </Link>
        </View >
    );
}
