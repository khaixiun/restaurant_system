'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

export interface User {
    id: number;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            const decoded = decodeURIComponent(userCookie);
            setUser(JSON.parse(decoded));
        }
        } catch {
        Cookies.remove("user");
        } finally {
        setLoading(false);
        }
    }, []);

    const login = (token: string, userData: User) => {
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("user", JSON.stringify(userData), { expires: 1 });
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}