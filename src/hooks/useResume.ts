/**
 * Resume Hook
 * Provides comprehensive resume management functionality
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '../services/resume.service';
import type {
    ResumeResponse,
    CreateResumeRequest,
    UpdateResumeRequest,
    ShareResumeRequest,
} from '../types/api.types';

// Query keys
export const RESUME_KEYS = {
    all: ['resumes'] as const,
    lists: () => [...RESUME_KEYS.all, 'list'] as const,
    list: (filters: string) => [...RESUME_KEYS.lists(), filters] as const,
    details: () => [...RESUME_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...RESUME_KEYS.details(), id] as const,
    public: (slug: string) => [...RESUME_KEYS.all, 'public', slug] as const,
};

/**
 * Hook to fetch a single resume by ID
 */
export const useResume = (id: string | undefined) => {
    return useQuery({
        queryKey: RESUME_KEYS.detail(id || ''),
        queryFn: () => resumeService.getResume(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch a public resume by slug
 */
export const usePublicResume = (slug: string | undefined) => {
    return useQuery({
        queryKey: RESUME_KEYS.public(slug || ''),
        queryFn: () => resumeService.getPublicResume(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Hook to create a new resume
 */
export const useCreateResume = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateResumeRequest) => resumeService.createResume(data),
        onSuccess: () => {
            // Invalidate resume lists
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
        },
    });
};

/**
 * Hook to update a resume
 */
export const useUpdateResume = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateResumeRequest) => resumeService.updateResume(id, data),
        onMutate: async (newData) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: RESUME_KEYS.detail(id) });

            // Snapshot previous value
            const previousResume = queryClient.getQueryData<ResumeResponse>(
                RESUME_KEYS.detail(id)
            );

            // Optimistically update
            if (previousResume) {
                queryClient.setQueryData<ResumeResponse>(RESUME_KEYS.detail(id), {
                    ...previousResume,
                    ...newData,
                    updatedAt: new Date().toISOString(),
                });
            }

            return { previousResume };
        },
        onError: (_err, _newData, context) => {
            // Rollback on error
            if (context?.previousResume) {
                queryClient.setQueryData(RESUME_KEYS.detail(id), context.previousResume);
            }
        },
        onSettled: () => {
            // Refetch after mutation
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
        },
    });
};

/**
 * Hook to delete a resume
 */
export const useDeleteResume = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resumeService.deleteResume(id),
        onSuccess: (_, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: RESUME_KEYS.detail(id) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
        },
    });
};

/**
 * Hook to duplicate a resume
 */
export const useDuplicateResume = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resumeService.duplicateResume(id),
        onSuccess: () => {
            // Invalidate resume lists
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
        },
    });
};

/**
 * Hook to share/unshare a resume
 */
export const useShareResume = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ShareResumeRequest) => resumeService.shareResume(id, data),
        onSuccess: () => {
            // Invalidate resume detail
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(id) });
        },
    });
};

/**
 * Hook to export a resume
 */
export const useExportResume = () => {
    return useMutation({
        mutationFn: ({ id, format }: { id: string; format: 'pdf' | 'docx' | 'json' }) =>
            resumeService.exportResume(id, format),
        onSuccess: (blob, { format }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resume.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

/**
 * Hook to import a resume
 */
export const useImportResume = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => resumeService.importResume(file),
        onSuccess: () => {
            // Invalidate resume lists
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
        },
    });
};
