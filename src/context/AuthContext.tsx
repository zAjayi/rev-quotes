import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isLoadingUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

    // Fetch user profile from /auth/me endpoint
    const fetchUserProfile = async () => {
        if (!token) return;

        setIsLoadingUser(true);
        try {
            const response = await api.get('/auth/me');
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            console.error('Failed to fetch user profile:', error);
            // If 401 or authentication error, logout the user
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setIsLoadingUser(false);
        }
    };

    // Fetch user profile on mount if token exists
    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const refreshUser = async () => {
        await fetchUserProfile();
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isAuthenticated, isLoadingUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
