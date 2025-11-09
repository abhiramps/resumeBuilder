/**
 * React Query Configuration
 * Global configuration for data fetching and caching
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time: 5 minutes
            staleTime: 5 * 60 * 1000,

            // Cache time: 10 minutes
            gcTime: 10 * 60 * 1000,

            // Retry failed requests
            retry: 1,

            // Refetch on window focus
            refetchOnWindowFocus: false,

            // Refetch on reconnect
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry failed mutations
            retry: 0,
        },
    },
});

// Query keys for consistent cache management
export const QUERY_KEYS = {
    // Auth
    SESSION: ['session'],

    // User
    USER_PROFILE: ['user', 'profile'],

    // Resumes
    RESUMES: ['resumes'],
    RESUME: (id: string) => ['resumes', id],
    RESUME_VERSIONS: (id: string) => ['resumes', id, 'versions'],
    RESUME_VERSION: (id: string, versionId: string) => ['resumes', id, 'versions', versionId],
    PUBLIC_RESUME: (slug: string) => ['resumes', 'public', slug],
} as const;
