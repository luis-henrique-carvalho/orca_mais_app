import { createContext, useContext, useEffect, useState } from 'react';
import api from '~/lib/api';
import * as SecureStore from 'expo-secure-store';
import { User } from '~/models/user/types';

interface AuthContextData {
    authStage: { token: string | null, authenticated: boolean, user: User | null };
    onRegister: (email: string, password: string, full_name: string) => Promise<void>;
    onLogin: (email: string, password: string) => Promise<void>;
    onLogout: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

const AuthContext = createContext<AuthContextData>({
    authStage: { token: null, authenticated: false, user: null },
    onRegister: async () => { },
    onLogin: async () => { },
    onLogout: async () => { }
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authStage, setAuthStage] = useState<{ token: string | null, authenticated: boolean, user: User | null }>({
        token: null,
        authenticated: false,
        user: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const user = await SecureStore.getItemAsync(USER_KEY);

            if (token && user) {
                const parsedToken = JSON.parse(token);
                const parsedUser = JSON.parse(user);
                api.defaults.headers.common["Authorization"] = `Bearer ${parsedToken}`;

                setAuthStage({ token: parsedToken, authenticated: true, user: parsedUser });
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

            api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, JSON.stringify(data.refresh_token));
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data.token));
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));

            setAuthStage({ token: data.token, authenticated: true, user: data.user });
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
            const response = await api.post('/api/auth/login', { user });
            const data = response.data;

            api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, JSON.stringify(data.refresh_token));
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(data.token));
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));

            setAuthStage({ token: data.token, authenticated: true, user: data.user });
        } catch (error) {
            console.error('Failed to login', error);
        }
    }

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

            api.defaults.headers.common.Authorization = '';

            setAuthStage({ token: null, authenticated: false, user: null });
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
