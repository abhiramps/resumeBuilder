/**
 * Version Management Hooks
 * React Query hooks for resume version control
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { versionService } from '../services/version.service';
import { QUERY_KEYS } from '../lib/queryClient';
import { RESUME_KEYS } from './useResume';
import type {
    CreateVersionData,
    RestoreVersionOptions,
    DeleteVersionOptions,
} from '../types/version.types';

/**
 * Hook to fetch all versions of a resume
 */
export const useVersions = (resumeId: string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.versions(resumeId || ''),
        queryFn: () => versionService.list(resumeId!),
        enabled: !!resumeId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to fetch a specific version
 */
export const useVersion = (resumeId: string | undefined, versionId: string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.version(resumeId || '', versionId || ''),
        queryFn: () => versionService.getById(resumeId!, versionId!),
        enabled: !!resumeId && !!versionId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to create a new version
 */
export const useCreateVersion = (resumeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data?: CreateVersionData) => versionService.create(resumeId, data),
        onSuccess: () => {
            // Invalidate versions list
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions(resumeId) });
            // Invalidate resume detail
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(resumeId) });
        },
    });
};

/**
 * Hook to restore a version
 */
export const useRestoreVersion = (resumeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ versionId, options }: { versionId: string; options?: RestoreVersionOptions }) =>
            versionService.restore(resumeId, versionId, options),
        onSuccess: () => {
            // Invalidate resume detail
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(resumeId) });
            // Invalidate versions list
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions(resumeId) });
        },
    });
};

/**
 * Hook to compare two versions
 */
export const useCompareVersions = (resumeId: string) => {
    return useMutation({
        mutationFn: ({ version1, version2 }: { version1: string; version2: string }) =>
            versionService.compare(resumeId, version1, version2),
    });
};

/**
 * Hook to delete a version
 */
export const useDeleteVersion = (resumeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ versionId, options }: { versionId: string; options?: DeleteVersionOptions }) =>
            versionService.delete(resumeId, versionId, options),
        onSuccess: () => {
            // Invalidate versions list
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions(resumeId) });
        },
    });
};


/**
 * Main versions hook for VersionsPage
 * Provides all version management functionality in one hook
 */
export const useVersionsManagement = (resumeId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch versions list
    const { data: versionsData, refetch } = useQuery({
        queryKey: QUERY_KEYS.versions(resumeId),
        queryFn: () => versionService.list(resumeId),
        enabled: !!resumeId,
    });

    const listVersions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await refetch();
        } catch (err: any) {
            setError(err.message || 'Failed to load versions');
        } finally {
            setIsLoading(false);
        }
    }, [refetch]);

    const createVersion = useCallback(async (name: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await versionService.create(resumeId, { versionName: name });
            await refetch();
        } catch (err: any) {
            setError(err.message || 'Failed to create version');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [resumeId, refetch]);

    const restoreVersion = useCallback(async (versionId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await versionService.restore(resumeId, versionId);
            await refetch();
        } catch (err: any) {
            setError(err.message || 'Failed to restore version');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [resumeId, refetch]);

    return {
        versions: versionsData || [],
        isLoading,
        error,
        listVersions,
        createVersion,
        restoreVersion,
    };
};
