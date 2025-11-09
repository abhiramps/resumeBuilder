/**
 * Services Index
 * Central export for all API services
 */

export { authService } from './auth.service';
export { userService } from './user.service';
export { resumeService } from './resume.service';
export { versionService } from './version.service';

// Re-export types for convenience
export type {
    ApiResponse,
    PaginatedResponse,
    ApiError,
    ResumeResponse,
    CreateResumeRequest,
    UpdateResumeRequest,
    ResumeListQuery,
    ShareResumeRequest,
    ShareResumeResponse,
} from '../types/api.types';
