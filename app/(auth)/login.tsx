import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuthStore } from '~/store/auth';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await login(email, password);
            router.replace('/(tabs)/(home)');
        } catch (error) {
            Alert.alert('Login failed', 'Invalid email or password');
        }
    };

    return (
        <View>
            <Text>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Link href="/(auth)/signup">Create an account</Link>
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}
