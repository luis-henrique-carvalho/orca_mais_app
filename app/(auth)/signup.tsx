import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const signup = useAuthStore((state) => state.signup);
    const router = useRouter();

    const handleSignup = async () => {
        try {
            await signup(email, password, name);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    return (
        <View>
            <Text>Signup</Text>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Signup" onPress={handleSignup} />
        </View>
    );
}
