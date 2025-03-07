import { TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { Input } from "~/components/ui/input";

interface TransactionSeachProps {
    search: string;
    setSearch: (value: string) => void;
}

export function TransactionSeach({ search, setSearch }: TransactionSeachProps) {
    return (
        <View className="flex-row items-center bg-white rounded-lg shadow-sm mb-4">
            <Search size={20} color="gray" className="mr-2" />
            <TextInput
                className="flex-1 text-gray-800"
                placeholder="Buscar transações..."
                value={search}
                onChangeText={setSearch}
            />
        </View>
    );
}
