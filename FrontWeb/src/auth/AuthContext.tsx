import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define el tipo de datos que almacenará tu contexto
interface AuthContextType {
    user: any;
    login: (username: string, password: string) => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;  
    }

// Componente proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    const login = (username: string, password: string) => {
    setUser({ username, password }); 
    };

    const logout = () => {
    setUser(null);
    };

    return (
    <AuthContext.Provider value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe estar dentro del proveedor AuthProvider');
    }
    return context;
};