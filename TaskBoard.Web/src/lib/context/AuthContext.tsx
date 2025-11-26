import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DecodedJwtPayload } from '../types/DecodedJwtPayload';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (userData: User, userToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [token, user]);

    const login = (userToken: string) => {
        const decodedPayload: DecodedJwtPayload = jwtDecode(userToken);
        setUser({name: decodedPayload.name, email: decodedPayload.email});
        setToken(userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const value = { token, login, logout, user, isAuthenticated: !!user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
