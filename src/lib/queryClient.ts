/**
 * React Query Client Configuration
 * Centralized configuration for data fetching and caching
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes - cache time (formerly cacheTime)
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: true, // Refetch on reconnect
            refetchOnMount: true, // Refetch on component mount
        },
        mutations: {
            retry: 0, // Don't retry mutations
        },
    },
});

/**
 * Query keys for consistent cache management
 */
export const QUERY_KEYS = {
    // Resume queries
    resumes: (filters?: any) => ['resumes', filters] as const,
    resume: (id: string) => ['resume', id] as const,
    publicResume: (slug: string) => ['publicResume', slug] as const,

    // Version queries
    versions: (resumeId: string) => ['versions', resumeId] as const,
    version: (resumeId: string, versionId: string) => ['version', resumeId, versionId] as const,

    // Sharing queries
    analytics: (resumeId: string) => ['analytics', resumeId] as const,

    // User queries
    user: ['user'] as const,
    userProfile: ['userProfile'] as const,
} as const;
