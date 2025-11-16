/**
 * Services Index
 * Central export for all API services
 */

export { authService } from './auth.service';
export { userService } from './user.service';
export { resumeService } from './resume.service';
export { versionService } from './version.service';
export { sharingService } from './sharing.service';

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
    SignUpRequest,
    SignInRequest,
    AuthResponse,
    SessionResponse,
    UserProfile,
} from '../types/api.types';

export type {
    User,
    AuthState,
    LoginCredentials,
    SignupCredentials,
    OAuthProvider,
} from '../types/auth.types';

export type {
    PublicResumeView,
    ResumeAnalytics,
    UpdateShareSettingsRequest,
} from '../types/sharing.types';

export type {
    ResumeVersion,
    CreateVersionData,
    CompareVersionsResult,
    VersionDifference,
    ComparisonSummary,
    VersionListItem,
    RestoreVersionOptions,
    DeleteVersionOptions,
} from '../types/version.types';
