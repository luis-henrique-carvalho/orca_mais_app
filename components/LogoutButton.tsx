import React from 'react';
import { Button } from '~/components/ui/button';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '~/context/AuthContext';

export default function LogoutButton() {
    const { onLogout } = useAuth();

    const handleLogout = async () => {
        try {
            await onLogout();
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
