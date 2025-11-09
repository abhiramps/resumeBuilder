/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient, setAuthToken, clearAuthToken } from '../utils/axios';
import { API_CONFIG, STORAGE_KEYS } from '../config/api.config';
import type {
    SignUpRequest,
    SignInRequest,
    AuthResponse,
    SessionResponse,
} from '../types/api.types';

export const authService = {
    /**
     * Sign up a new user
     */
    async signUp(data: SignUpRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
            data
        );

        // Store token and user data
        if (response.data.session) {
            setAuthToken(response.data.session.access_token);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.session.refresh_token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response.data;
    },

    /**
     * Sign in an existing user
     */
    async signIn(data: SignInRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH.SIGNIN,
            data
        );

        // Store token and user data
        if (response.data.session) {
            setAuthToken(response.data.session.access_token);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.session.refresh_token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response.data;
    },

    /**
     * Sign out the current user
     */
    async signOut(): Promise<void> {
        try {
            await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.SIGNOUT);
        } finally {
            // Always clear local storage even if API call fails
            clearAuthToken();
        }
    },

    /**
     * Get current session
     */
    async getSession(): Promise<SessionResponse> {
        const response = await apiClient.get<SessionResponse>(
            API_CONFIG.ENDPOINTS.AUTH.SESSION
        );

        // Update stored user data
        if (response.data.user) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response.data;
    },

    /**
     * OAuth sign in with Google
     */
    async signInWithGoogle(): Promise<{ url: string }> {
        const response = await apiClient.post<{ url: string }>(
            API_CONFIG.ENDPOINTS.AUTH.GOOGLE
        );
        return response.data;
    },

    /**
     * OAuth sign in with GitHub
     */
    async signInWithGithub(): Promise<{ url: string }> {
        const response = await apiClient.post<{ url: string }>(
            API_CONFIG.ENDPOINTS.AUTH.GITHUB
        );
        return response.data;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    /**
     * Get stored user data
     */
    getStoredUser(): SessionResponse['user'] | null {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
};
