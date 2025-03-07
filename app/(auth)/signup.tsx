import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuthStore } from '~/store/auth';
import { Link, useRouter } from 'expo-router';
import RegisterForm from './components/forms/RegisterForm';

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
            <RegisterForm />
            <Link href="/(auth)/login">Login</Link>
        </View>
    );
}
