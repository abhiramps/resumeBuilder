/**
 * Sharing and Analytics Hooks
 * React Query hooks for resume sharing and analytics
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sharingService } from '../services/sharing.service';
import { QUERY_KEYS } from '../lib/queryClient';
import { RESUME_KEYS } from './useResume';
import type { UpdateShareSettingsRequest } from '../types/sharing.types';

/**
 * Hook to fetch public resume by slug
 */
export const usePublicResume = (slug: string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.publicResume(slug || ''),
        queryFn: () => sharingService.getPublicResume(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Hook to fetch resume analytics
 */
export const useResumeAnalytics = (resumeId: string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.analytics(resumeId || ''),
        queryFn: () => sharingService.getAnalytics(resumeId!),
        enabled: !!resumeId,
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    });
};

/**
 * Hook to share a resume (make public)
 */
export const useShareResume = (resumeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => sharingService.share(resumeId),
        onSuccess: () => {
            // Invalidate resume detail
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(resumeId) });
            // Invalidate analytics
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics(resumeId) });
        },
    });
};

/**
 * Hook to unshare a resume (make private)
 */
export const useUnshareResume = (resumeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => sharingService.unshare(resumeId),
        onSuccess: () => {
            // Invalidate resume detail
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(resumeId) });
            // Invalidate analytics
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics(resumeId) });
        },
    });
};

/**
 * Hook to update sharing settings
 */
export const useUpdateShareSettings = (resumeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (settings: UpdateShareSettingsRequest) =>
            sharingService.updateShareSettings(resumeId, settings),
        onSuccess: () => {
            // Invalidate resume detail
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(resumeId) });
            // Invalidate analytics
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics(resumeId) });
        },
    });
};
