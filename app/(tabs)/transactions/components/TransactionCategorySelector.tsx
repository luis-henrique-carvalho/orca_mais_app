import { View } from "react-native";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ScrollView } from "react-native-gesture-handler";
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
    default_Category?: Category
}

export function TransactionCategorySelector({ categories, setSelectedCategory, contentInsets, default_Category }: TransactionCategorySelectorProps) {
    return (
        <View className="flex flex-row items-center justify-between w-full">
            <Select
                onValueChange={(option) => setSelectedCategory(option?.value)}
                defaultValue={default_Category ? { value: default_Category.id, label: default_Category.name } : undefined}

            >
                <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className={"w-full"}>
                    <ScrollView className="max-h-72 w-full">
                        <SelectGroup className="text-primary">
                            <SelectLabel >Categorias</SelectLabel>
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
        </View >
    );
}
