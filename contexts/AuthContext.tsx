import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Cargar usuario desde localStorage al iniciar
        const storedUser = localStorage.getItem('electrostore_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Obtener usuarios registrados
        const usersJson = localStorage.getItem('electrostore_users');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // Buscar usuario
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
            setUser(userData);
            localStorage.setItem('electrostore_user', JSON.stringify(userData));
            return true;
        }

        return false;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // Obtener usuarios existentes
        const usersJson = localStorage.getItem('electrostore_users');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // Verificar si el email ya existe
        if (users.some((u: any) => u.email === email)) {
            return false;
        }

        // Crear nuevo usuario
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // En producción, esto debería estar hasheado
        };

        users.push(newUser);
        localStorage.setItem('electrostore_users', JSON.stringify(users));

        // Auto-login después del registro
        const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
        setUser(userData);
        localStorage.setItem('electrostore_user', JSON.stringify(userData));

        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('electrostore_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
