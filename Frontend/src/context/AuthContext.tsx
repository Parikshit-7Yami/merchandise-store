import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { loginStudentApi, registerStudentApi } from '@/lib/api';

export type UserRole = 'admin' | 'student' | null;

export interface AuthUser {
    role: UserRole;
    name?: string;
    email?: string;
    adminKey?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loginStudent: (email: string, password: string) => Promise<void>;
    registerStudent: (name: string, email: string, password: string) => Promise<void>;
    loginAdmin: (adminKey: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(() => {
        // Try to load from session storage first (for admins/transient logins)
        const sessionUser = sessionStorage.getItem('authUser');
        if (sessionUser) return JSON.parse(sessionUser);

        // Fallback to local storage
        const localUser = localStorage.getItem('authUser');
        if (localUser) return JSON.parse(localUser);

        // Check old admin auth for backwards compatibility and migrate
        const oldAdminAuth = localStorage.getItem('adminAuth') === 'true';
        if (oldAdminAuth) {
            const key = sessionStorage.getItem('adminKey') || 'admin123';
            const migratedUser: AuthUser = { role: 'admin', adminKey: key };
            sessionStorage.setItem('authUser', JSON.stringify(migratedUser));
            return migratedUser;
        }

        return null;
    });

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                sessionStorage.setItem('authUser', JSON.stringify(user));
                localStorage.removeItem('authUser'); // don't persist admin to local
            } else {
                localStorage.setItem('authUser', JSON.stringify(user));
                sessionStorage.removeItem('authUser');
            }
        } else {
            localStorage.removeItem('authUser');
            sessionStorage.removeItem('authUser');
        }
    }, [user]);

    const loginStudent = async (email: string, password: string) => {
        const result = await loginStudentApi({ email, password });
        setUser({ role: 'student', name: result.name, email: result.email });
        toast.success(`Welcome back, ${result.name}!`);
    };

    const registerStudent = async (name: string, email: string, password: string) => {
        const result = await registerStudentApi({ name, email, password });
        setUser({ role: 'student', name: result.name, email: result.email });
        toast.success(`Account created! Welcome, ${result.name}!`);
    };

    const loginAdmin = (adminKey: string) => {
        // Simple demo auth - in production this would validate against an API endpoint
        if (adminKey === 'admin123') {
            setUser({ role: 'admin', adminKey });
            sessionStorage.setItem('adminKey', adminKey); // Set for API calls backwards compatibility
            toast.success('Admin access granted');
        } else {
            toast.error('Invalid admin credentials');
            throw new Error('Invalid credentials');
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('adminKey'); // Clear old backwards compatible key
        toast.info('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: user !== null,
            isAdmin: user?.role === 'admin',
            loginStudent,
            registerStudent,
            loginAdmin,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
