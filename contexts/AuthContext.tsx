'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createdInstance } from '@/hooks/useApi';
import { getCookie, removeCookie, setCookie } from '@/secure/cookies';

interface StsTokenManager {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
}

interface IResponseUser {
    uid: string;
    email: string;
    name: string;
}

interface ISignInWithEmailAndPassword {
    token: StsTokenManager;
    user: IResponseUser;
    type: "seller" | "customer" | "collaborator"
}

interface AuthContextType {
    user: IResponseUser | null;
    isLoading: boolean;
    isLoggedIn: boolean
    error: string | null;
    login: (email: string, password: string) => Promise<"seller" | "customer" | "collaborator" | boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IResponseUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {

            const token = getCookie("access");
            if (token) {
                setIsLoggedIn(true);  // Usuário está logado
            } else {
                setIsLoggedIn(false);
            }
        };
        checkLogin();
    }, []); // Rodar apenas no primeiro carregamento

    const loadUserFromSession = useCallback(async () => {
        const storedUser = getCookie('secure-user')
        if (storedUser) {
            setUser(storedUser)
        }
    }, []);

   // Update login method
const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await createdInstance.post('/login', { email, password });
        if (response.status === 200) {
            const { token, user, type } = response.data.record as ISignInWithEmailAndPassword;

            setCookie('access', token.accessToken);
            setCookie('expires-access', token.expirationTime.toString());
            setCookie('refresh-access', token.refreshToken);
            setCookie('secure-user', user);
            setCookie('user-type', type);

            setUser(user);
            setIsLoggedIn(true);
            return type;
        }
        return false;
    } catch (err) {
        setError('Erro ao fazer login!');
        return false;
    } finally {
        setIsLoading(false);
    }
}, []);


    const logout = useCallback(async () => {
        removeCookie('access')
        removeCookie('expires-access')
        removeCookie('refresh-access')
        removeCookie('secure-user')
        setUser(null)
    }, []);

    useEffect(() => {
        loadUserFromSession();  // Attempt to load user info on mount
    }, [loadUserFromSession]);

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
