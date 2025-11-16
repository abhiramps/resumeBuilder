/**
 * Sharing Service
 * Handles resume sharing, public viewing, and analytics
 */

import { apiClient } from '../utils/axios';
import { API_CONFIG } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import type {
    ShareResumeResponse,
    PublicResumeView,
    ResumeAnalytics,
    UpdateShareSettingsRequest,
} from '../types/sharing.types';

export const sharingService = {
    /**
     * Share a resume (make it public)
     */
    async share(resumeId: string): Promise<ShareResumeResponse> {
        const response = await apiClient.post<ApiResponse<ShareResumeResponse>>(
            API_CONFIG.ENDPOINTS.RESUMES.SHARE(resumeId),
            { isPublic: true }
        );

        return response.data.data;
    },

    /**
     * Unshare a resume (make it private)
     */
    async unshare(resumeId: string): Promise<void> {
        await apiClient.post(
            API_CONFIG.ENDPOINTS.RESUMES.SHARE(resumeId),
            { isPublic: false }
        );
    },

    /**
     * Get a public resume by slug
     */
    async getPublicResume(slug: string): Promise<PublicResumeView> {
        const response = await apiClient.get<ApiResponse<PublicResumeView>>(
            API_CONFIG.ENDPOINTS.RESUMES.PUBLIC(slug)
        );

        return response.data.data;
    },

    /**
     * Update sharing settings for a resume
     */
    async updateShareSettings(
        resumeId: string,
        settings: UpdateShareSettingsRequest
    ): Promise<ShareResumeResponse> {
        const response = await apiClient.post<ApiResponse<ShareResumeResponse>>(
            API_CONFIG.ENDPOINTS.RESUMES.SHARE(resumeId),
            settings
        );

        return response.data.data;
    },

    /**
     * Get analytics for a resume
     */
    async getAnalytics(resumeId: string): Promise<ResumeAnalytics> {
        const response = await apiClient.get<ApiResponse<ResumeAnalytics>>(
            `${API_CONFIG.ENDPOINTS.RESUMES.GET(resumeId)}/analytics`
        );

        return response.data.data;
    },
};
