import { View } from "react-native";
import { Search } from "lucide-react-native";
import { Input } from "~/components/ui/input";

interface TransactionSeachProps {
    search: string;
    setSearch: (value: string) => void;
}

export function TransactionSeach({ search, setSearch }: TransactionSeachProps) {
    return (
        <View className="flex-row items-center rounded-lg shadow-sm">
            <View className="flex-row items-center">
                <Search size={20} color="gray" />
                <Input
                    className="flex-1 border-none"
                    placeholder="Buscar transações..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
        </View>
    );
}
