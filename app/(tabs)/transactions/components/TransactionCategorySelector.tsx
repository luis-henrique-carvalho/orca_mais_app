import { View } from "react-native";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ScrollView } from "react-native-gesture-handler";
import { Link } from "expo-router";
import { Category } from "../types";

interface ContentInsets {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

interface TransactionCategorySelectorProps {
    categories: Category[];
    setSelectedCategory: (value: string | undefined) => void;
    contentInsets: ContentInsets;
    withCreateTransaction?: boolean;
    withCreateLink?: boolean;
}

export function TransactionCategorySelector({ categories, setSelectedCategory, contentInsets, withCreateLink }: TransactionCategorySelectorProps) {
    return (
        <View className="mb-4 flex flex-row items-center justify-between w-full">
            <Select
                onValueChange={(option) => setSelectedCategory(option?.value)}
            >
                <SelectTrigger className={withCreateLink ? "w-[250px]" : "w-full"}>
                    <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className={withCreateLink ? "w-[250px]" : "w-full"}>
                    <ScrollView className="max-h-72 w-full">
                        <SelectGroup>
                            <SelectLabel>Categorias</SelectLabel>
                            <SelectItem value="" label="Todas as categorias">Todas as categorias</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id} label={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </ScrollView>
                </SelectContent>
            </Select>

            {
                withCreateLink && (
                    <Link href="/(tabs)/transactions/create" className="text-primary text-md">
                        Criar transação
                    </Link>
                )
            }
        </View >
    );
}
