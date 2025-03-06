import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";

export default function TransactionsScreen() {
    return (
        <View>
            <Text>TransactionsScreen</Text>
            <Link href="/(tabs)/transactions/create">Criar Transação</Link>
        </View>
    );
}
