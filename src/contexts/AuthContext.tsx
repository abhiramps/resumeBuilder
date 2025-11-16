/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import type { User, AuthState } from '../types/auth.types';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, fullName?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check if user is authenticated
                if (authService.isAuthenticated()) {
                    // Try to get current session
                    const session = await authService.getSession();
                    setUser(session.user);
                } else {
                    // Check for stored user data
                    const storedUser = authService.getStoredUser();
                    if (storedUser) {
                        setUser(storedUser);
                    }
                }
            } catch (err) {
                // If session check fails, clear auth
                await authService.signOut();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Login user
     */
    const login = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.signIn({ email, password });

            if (response.user) {
                setUser(response.user);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Signup new user
     */
    const signup = useCallback(async (email: string, password: string, fullName?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.signUp({ email, password, fullName });

            if (response.user) {
                setUser(response.user);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || 'Signup failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await authService.signOut();
            setUser(null);
            setError(null);
        } catch (err: any) {
            console.error('Logout error:', err);
            // Still clear user state even if API call fails
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh authentication state
     */
    const refreshAuth = useCallback(async () => {
        try {
            const session = await authService.getSession();
            setUser(session.user);
            setError(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || 'Failed to refresh session.';
            setError(errorMessage);
            // If refresh fails, logout
            await logout();
        }
    }, [logout]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        refreshAuth,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
