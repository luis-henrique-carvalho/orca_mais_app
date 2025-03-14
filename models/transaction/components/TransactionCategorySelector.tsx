import { View } from "react-native";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ScrollView } from "react-native-gesture-handler";
import { Category } from "../types";
import { useInsects } from "~/lib/utils";

interface TransactionCategorySelectorProps {
    categories: Category[];
    setSelectedCategory: (value: string | undefined) => void;
    withCreateTransaction?: boolean;
    default_Category?: Category
}

export function TransactionCategorySelector({ categories, setSelectedCategory, default_Category }: TransactionCategorySelectorProps) {
    const { contentInsets } = useInsects();

    return (
        <View className="w-full">
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
