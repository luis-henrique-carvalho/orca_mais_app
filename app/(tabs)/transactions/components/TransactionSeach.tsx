import { TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { Input } from "~/components/ui/input";

interface TransactionSeachProps {
    search: string;
    setSearch: (value: string) => void;
}

export function TransactionSeach({ search, setSearch }: TransactionSeachProps) {
    return (
        <Input
            className="flex-1"
            placeholder="Buscar transações..."
            value={search}
            onChangeText={setSearch}
        />
    );
}
