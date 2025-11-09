/**
 * Authentication Hooks
 * React Query hooks for authentication operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { QUERY_KEYS } from '../config/react-query.config';
import type { SignUpRequest, SignInRequest } from '../types/api.types';

/**
 * Hook to get current session
 */
export const useSession = () => {
    return useQuery({
        queryKey: QUERY_KEYS.SESSION,
        queryFn: () => authService.getSession(),
        enabled: authService.isAuthenticated(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to sign up a new user
 */
export const useSignUp = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignUpRequest) => authService.signUp(data),
        onSuccess: (data) => {
            // Set session data in cache
            queryClient.setQueryData(QUERY_KEYS.SESSION, {
                user: data.user,
            });
        },
    });
};

/**
 * Hook to sign in an existing user
 */
export const useSignIn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignInRequest) => authService.signIn(data),
        onSuccess: (data) => {
            // Set session data in cache
            queryClient.setQueryData(QUERY_KEYS.SESSION, {
                user: data.user,
            });
        },
    });
};

/**
 * Hook to sign out the current user
 */
export const useSignOut = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.signOut(),
        onSuccess: () => {
            // Clear all cached data
            queryClient.clear();
        },
    });
};

/**
 * Hook to sign in with Google OAuth
 */
export const useGoogleSignIn = () => {
    return useMutation({
        mutationFn: () => authService.signInWithGoogle(),
        onSuccess: (data) => {
            // Redirect to Google OAuth URL
            window.location.href = data.url;
        },
    });
};

/**
 * Hook to sign in with GitHub OAuth
 */
export const useGithubSignIn = () => {
    return useMutation({
        mutationFn: () => authService.signInWithGithub(),
        onSuccess: (data) => {
            // Redirect to GitHub OAuth URL
            window.location.href = data.url;
        },
    });
};

/**
 * Combined auth hook with all auth state and methods
 */
export const useAuth = () => {
    const { data: session, isLoading, error } = useSession();
    const signUp = useSignUp();
    const signIn = useSignIn();
    const signOut = useSignOut();
    const googleSignIn = useGoogleSignIn();
    const githubSignIn = useGithubSignIn();

    return {
        // State
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        isLoading,
        error,

        // Methods
        signUp: signUp.mutate,
        signIn: signIn.mutate,
        signOut: signOut.mutate,
        signInWithGoogle: googleSignIn.mutate,
        signInWithGithub: githubSignIn.mutate,

        // Mutation states
        isSigningUp: signUp.isPending,
        isSigningIn: signIn.isPending,
        isSigningOut: signOut.isPending,
        signUpError: signUp.error,
        signInError: signIn.error,
        signOutError: signOut.error,
    };
};
