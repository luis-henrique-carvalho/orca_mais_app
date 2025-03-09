import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import RegisterForm from '~/models/auth/components/forms/RegisterForm';

export default function SignupScreen() {
    return (
        <View>
            <Text>Signup</Text>
            <RegisterForm />
            <Link href="/(auth)/login">Login</Link>
        </View>
    );
}
