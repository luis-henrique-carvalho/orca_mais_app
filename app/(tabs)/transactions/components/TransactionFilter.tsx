import { View } from "react-native";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ScrollView } from "react-native-gesture-handler";
import { Link } from "expo-router";

interface Category {
    id: string;
    name: string;
}

interface TransactionFilterProps {
    categories: Category[];
    selectedCategory: string | undefined;
    setSelectedCategory: (value: string | undefined) => void;
    contentInsets: object;
}

export function TransactionFilter({ categories, selectedCategory, setSelectedCategory, contentInsets }: TransactionFilterProps) {
    return (
        <View className="mb-4 flex flex-row items-center justify-between w-full">
            <Select
                onValueChange={(option) => option && setSelectedCategory(option.value)}
                value={{ value: selectedCategory || "", label: "" }}
                defaultValue={{ value: "", label: "Selecione uma categoria" }}
            >
                <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className="w-[250px]">
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
            <Link href="/(tabs)/transactions/create" className="text-primary text-md">
                Criar transação
            </Link>
        </View>
    );
}
