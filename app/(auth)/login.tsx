import { View, Text } from 'react-native';
import LoginForm from '~/models/auth/components/forms/LoginForm';
import { Link } from 'expo-router';

export default function LoginScreen() {
    return (
        <View>
            <Text>Login</Text>
            <LoginForm />
            <Link href="/(auth)/signup">Create an account</Link>
        </View>
    );
}
