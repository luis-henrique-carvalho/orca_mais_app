import React from 'react';
import { Button } from '~/components/ui/button';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'expo-router';
import { Text } from './ui/text';

export default function LogoutButton() {
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/login');
        } catch (error) {
            console.log('Logout failed', error);
        }
    };

    return (
        <Button onPress={handleLogout} variant={'destructive'} className='mr-4'>
            <Text>Logout</Text>
        </Button>
    )
}
