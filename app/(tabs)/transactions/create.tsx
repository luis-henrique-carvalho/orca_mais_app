import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";

export default function CreateTransactionScreen() {
    return (
        <View>
            <Text>Create Transaction</Text>
            <Link href="/(auth)/login">Login</Link>
        </View>
    )
}
