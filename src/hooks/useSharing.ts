/**
 * Sharing and Analytics Hooks
 * React Query hooks for resume sharing and analytics
 */

import { useState, useCallback } from 'react';
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


/**
 * Main sharing hook for SharePage
 * Provides all sharing functionality in one hook
 */
export const useSharing = (resumeId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch current share status and link
    const { data: shareData, refetch: refetchShare } = useQuery({
        queryKey: RESUME_KEYS.detail(resumeId),
        queryFn: async () => {
            // This would fetch the resume to check if it's shared
            // For now, return mock data structure
            return {
                isShared: false,
                shareLink: null,
            };
        },
        enabled: !!resumeId,
    });

    // Fetch analytics
    const { data: analytics, refetch: refetchAnalytics } = useQuery({
        queryKey: QUERY_KEYS.analytics(resumeId),
        queryFn: () => sharingService.getAnalytics(resumeId),
        enabled: !!resumeId && shareData?.isShared,
    });

    const createShareLink = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await sharingService.share(resumeId);
            await refetchShare();
        } catch (err: any) {
            setError(err.message || 'Failed to create share link');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [resumeId, refetchShare]);

    const revokeShareLink = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await sharingService.unshare(resumeId);
            await refetchShare();
        } catch (err: any) {
            setError(err.message || 'Failed to revoke share link');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [resumeId, refetchShare]);

    const getAnalytics = useCallback(async () => {
        await refetchAnalytics();
    }, [refetchAnalytics]);

    return {
        shareLink: shareData?.shareLink || null,
        isShared: shareData?.isShared || false,
        analytics: analytics || null,
        isLoading,
        error,
        createShareLink,
        revokeShareLink,
        getAnalytics,
    };
};
