/**
 * Version Service
 * Handles resume version control API calls
 */

import { apiClient } from '../utils/axios';
import { API_CONFIG } from '../config/api.config';
import type {
    ApiResponse,
    ResumeVersionResponse,
    CreateVersionRequest,
    ResumeResponse,
} from '../types/api.types';

export const versionService = {
    /**
     * Get all versions of a resume
     */
    async getVersions(resumeId: string): Promise<ResumeVersionResponse[]> {
        const response = await apiClient.get<ApiResponse<ResumeVersionResponse[]>>(
            API_CONFIG.ENDPOINTS.RESUMES.VERSIONS(resumeId)
        );

        return response.data.data;
    },

    /**
     * Create a new version of a resume
     */
    async createVersion(
        resumeId: string,
        data?: CreateVersionRequest
    ): Promise<ResumeVersionResponse> {
        const response = await apiClient.post<ApiResponse<ResumeVersionResponse>>(
            API_CONFIG.ENDPOINTS.RESUMES.CREATE_VERSION(resumeId),
            data || {}
        );

        return response.data.data;
    },

    /**
     * Get a specific version
     */
    async getVersion(resumeId: string, versionId: string): Promise<ResumeVersionResponse> {
        const response = await apiClient.get<ApiResponse<ResumeVersionResponse>>(
            API_CONFIG.ENDPOINTS.RESUMES.GET_VERSION(resumeId, versionId)
        );

        return response.data.data;
    },

    /**
     * Restore a specific version (make it the current version)
     */
    async restoreVersion(resumeId: string, versionId: string): Promise<ResumeResponse> {
        const response = await apiClient.post<ApiResponse<ResumeResponse>>(
            API_CONFIG.ENDPOINTS.RESUMES.RESTORE_VERSION(resumeId, versionId)
        );

        return response.data.data;
    },
};
