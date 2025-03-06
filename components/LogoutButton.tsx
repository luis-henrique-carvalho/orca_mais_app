import React from 'react';
import { Button } from 'react-native';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'expo-router';

export default function LogoutButton() {
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return <Button title="Logout" onPress={handleLogout} />;
}
