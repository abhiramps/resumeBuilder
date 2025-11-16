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
import type {
    ResumeVersion,
    CreateVersionData,
    CompareVersionsResult,
    RestoreVersionOptions,
    DeleteVersionOptions,
} from '../types/version.types';

export const versionService = {
    /**
     * Create a new version of a resume
     * Alias: create
     */
    async create(resumeId: string, data?: CreateVersionData): Promise<ResumeVersion> {
        const response = await apiClient.post<ApiResponse<ResumeVersion>>(
            API_CONFIG.ENDPOINTS.RESUMES.CREATE_VERSION(resumeId),
            data || {}
        );

        return response.data.data;
    },

    /**
     * Get all versions of a resume
     * Alias: list
     */
    async list(resumeId: string): Promise<ResumeVersion[]> {
        const response = await apiClient.get<ApiResponse<ResumeVersion[]>>(
            API_CONFIG.ENDPOINTS.RESUMES.VERSIONS(resumeId)
        );

        return response.data.data;
    },

    /**
     * Get a specific version by ID
     * Alias: getById
     */
    async getById(resumeId: string, versionId: string): Promise<ResumeVersion> {
        const response = await apiClient.get<ApiResponse<ResumeVersion>>(
            API_CONFIG.ENDPOINTS.RESUMES.GET_VERSION(resumeId, versionId)
        );

        return response.data.data;
    },

    /**
     * Restore a specific version (make it the current version)
     * Alias: restore
     */
    async restore(
        resumeId: string,
        versionId: string,
        options?: RestoreVersionOptions
    ): Promise<ResumeResponse> {
        const response = await apiClient.post<ApiResponse<ResumeResponse>>(
            API_CONFIG.ENDPOINTS.RESUMES.RESTORE_VERSION(resumeId, versionId),
            options || {}
        );

        return response.data.data;
    },

    /**
     * Compare two versions of a resume
     */
    async compare(
        resumeId: string,
        version1: string,
        version2: string
    ): Promise<CompareVersionsResult> {
        const response = await apiClient.get<ApiResponse<CompareVersionsResult>>(
            `${API_CONFIG.ENDPOINTS.RESUMES.VERSIONS(resumeId)}/compare`,
            {
                params: { version1, version2 },
            }
        );

        return response.data.data;
    },

    /**
     * Delete a specific version
     */
    async delete(
        resumeId: string,
        versionId: string,
        options?: DeleteVersionOptions
    ): Promise<void> {
        await apiClient.delete(
            API_CONFIG.ENDPOINTS.RESUMES.GET_VERSION(resumeId, versionId),
            {
                data: options || {},
            }
        );
    },

    // Legacy method names for backward compatibility
    /**
     * @deprecated Use list() instead
     */
    async getVersions(resumeId: string): Promise<ResumeVersionResponse[]> {
        return this.list(resumeId);
    },

    /**
     * @deprecated Use create() instead
     */
    async createVersion(
        resumeId: string,
        data?: CreateVersionRequest
    ): Promise<ResumeVersionResponse> {
        return this.create(resumeId, data);
    },

    /**
     * @deprecated Use getById() instead
     */
    async getVersion(resumeId: string, versionId: string): Promise<ResumeVersionResponse> {
        return this.getById(resumeId, versionId);
    },

    /**
     * @deprecated Use restore() instead
     */
    async restoreVersion(resumeId: string, versionId: string): Promise<ResumeResponse> {
        return this.restore(resumeId, versionId);
    },
};
