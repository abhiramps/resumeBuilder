/**
 * Resumes List Hook
 * Provides resume list management with pagination and filtering
 */

import { useQuery } from '@tanstack/react-query';
import { resumeService } from '../services/resume.service';
import type { ResumeListQuery } from '../types/api.types';
import { RESUME_KEYS } from './useResume';

/**
 * Hook to fetch list of resumes with pagination and filters
 */
export const useResumes = (query?: ResumeListQuery) => {
    const queryKey = RESUME_KEYS.list(JSON.stringify(query || {}));

    return useQuery({
        queryKey,
        queryFn: () => resumeService.getResumes(query),
        staleTime: 2 * 60 * 1000, // 2 minutes
        placeholderData: (previousData) => previousData, // Keep previous data while fetching
    });
};

/**
 * Hook to fetch resumes with search
 */
export const useSearchResumes = (search: string, options?: Omit<ResumeListQuery, 'search'>) => {
    return useResumes({
        ...options,
        search,
    });
};

/**
 * Hook to fetch resumes by status
 */
export const useResumesByStatus = (
    status: 'draft' | 'published' | 'all',
    options?: Omit<ResumeListQuery, 'status'>
) => {
    return useResumes({
        ...options,
        status,
    });
};
