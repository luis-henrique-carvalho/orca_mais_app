import React from 'react';
import { Button } from '~/components/ui/button';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'expo-router';
import { Text } from './ui/text';
import { LogOut } from 'lucide-react-native';

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
        <Button onPress={handleLogout} variant={'ghost'} className='mr-4'>
            <LogOut size={20} color={"red"} />
        </Button >
    )
}
