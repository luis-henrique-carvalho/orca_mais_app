import { createContext, useContext, useEffect, useState } from 'react';
import api from '~/lib/api';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface AuthContextData {
    authStage: { token: string | null, authenticated: boolean };
    onRegister: (email: string, password: string, full_name: string) => Promise<void>;
    onLogin: (email: string, password: string) => Promise<void>;
    onLogout: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const AuthContext = createContext<AuthContextData>({
    authStage: { token: null, authenticated: false },
    onRegister: async () => { },
    onLogin: async () => { },
    onLogout: async () => { }
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authStage, setAuthStage] = useState<{ token: string | null, authenticated: boolean }>({ token: null, authenticated: false });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (token) {
                const parsedToken = JSON.parse(token);
                console.log(`Bearer ${parsedToken}`);
                api.defaults.headers.common["Authorization"] = `Bearer ${parsedToken}`;
                setAuthStage({ token: parsedToken, authenticated: true });
            }
        };

        loadToken();
    }, []);

    const register = async (email: string, password: string, full_name: string) => {
        const user = {
            email: email,
            password: password,
            full_name: full_name
        }
        try {
            const { data } = await api.post('/api/auth/signup', { user });

            setAuthStage({ token: data.token, authenticated: true });

            api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data.token));
        } catch (error) {
            console.error('Failed to register', error);
        }
    }

    const login = async (email: string, password: string) => {
        const user = {
            email: email,
            password: password
        }
        try {
            console.log("login", email, password);
            const { data } = await api.post('/api/auth/login', { user });

            setAuthStage({ token: data.token, authenticated: true });

            api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data.token));
        } catch (error) {
            console.error('Failed to login', error);
        }
    }

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);

            api.defaults.headers.common.Authorization = '';

            setAuthStage({ token: null, authenticated: false });
        } catch (error) {
            console.error('Failed to logout', error);
        }
    }

    const values = {
        authStage,
        onRegister: register,
        onLogin: login,
        onLogout: logout
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}
