/**
 * Resume Hooks Tests
 * Tests for resume management hooks
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResume, useCreateResume, RESUME_KEYS } from '../useResume';
import { resumeService } from '../../services/resume.service';
import type { ResumeResponse } from '../../types/api.types';

// Mock the resume service
jest.mock('../../services/resume.service');

const mockResumeService = resumeService as jest.Mocked<typeof resumeService>;

// Create wrapper with QueryClient
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useResume', () => {
    const mockResume: ResumeResponse = {
        id: 'resume-1',
        userId: 'user-1',
        title: 'My Resume',
        templateId: 'classic',
        content: {
            personalInfo: {
                fullName: 'John Doe',
                title: 'Software Engineer',
                email: 'john@example.com',
                phone: '+1234567890',
                location: 'San Francisco, CA',
            },
        },
        status: 'draft',
        isPublic: false,
        viewCount: 0,
        exportCount: 0,
        version: 1,
        isCurrentVersion: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch resume data', async () => {
        mockResumeService.getResume.mockResolvedValue(mockResume);

        const { result } = renderHook(() => useResume('resume-1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResume);
        expect(mockResumeService.getResume).toHaveBeenCalledWith('resume-1');
    });

    it('should not fetch when id is undefined', () => {
        const { result } = renderHook(() => useResume(undefined), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(mockResumeService.getResume).not.toHaveBeenCalled();
    });
});

describe('useCreateResume', () => {
    it('should create a new resume', async () => {
        const newResume: ResumeResponse = {
            id: 'resume-2',
            userId: 'user-1',
            title: 'New Resume',
            templateId: 'modern',
            content: {},
            status: 'draft',
            isPublic: false,
            viewCount: 0,
            exportCount: 0,
            version: 1,
            isCurrentVersion: true,
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
        };

        mockResumeService.createResume.mockResolvedValue(newResume);

        const { result } = renderHook(() => useCreateResume(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            title: 'New Resume',
            templateId: 'modern',
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(newResume);
        expect(mockResumeService.createResume).toHaveBeenCalledWith({
            title: 'New Resume',
            templateId: 'modern',
        });
    });
});

describe('RESUME_KEYS', () => {
    it('should generate correct query keys', () => {
        expect(RESUME_KEYS.all).toEqual(['resumes']);
        expect(RESUME_KEYS.lists()).toEqual(['resumes', 'list']);
        expect(RESUME_KEYS.list('filter')).toEqual(['resumes', 'list', 'filter']);
        expect(RESUME_KEYS.details()).toEqual(['resumes', 'detail']);
        expect(RESUME_KEYS.detail('resume-1')).toEqual(['resumes', 'detail', 'resume-1']);
        expect(RESUME_KEYS.public('my-slug')).toEqual(['resumes', 'public', 'my-slug']);
    });
});
