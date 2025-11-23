/**
 * React Query Configuration
 * Global configuration for data fetching and caching
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time: 2 minutes (reduced for fresher data)
            staleTime: 2 * 60 * 1000,

            // Cache time: 10 minutes
            gcTime: 10 * 60 * 1000,

            // Retry failed requests
            retry: 1,

            // Refetch on window focus
            refetchOnWindowFocus: false,

            // Refetch on reconnect
            refetchOnReconnect: true,

            // Network mode for better offline handling
            networkMode: 'online',

            // Placeholders while loading
            placeholderData: (previousData: unknown) => previousData,
        },
        mutations: {
            // Retry failed mutations
            retry: 0,

            // Network mode for mutations
            networkMode: 'online',
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
