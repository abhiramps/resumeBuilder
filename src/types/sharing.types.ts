/**
 * Sharing and Analytics Types
 * Types for resume sharing, public viewing, and analytics
 */

export interface ShareResumeResponse {
    publicUrl: string;
    publicSlug: string;
    isPublic: boolean;
}

export interface PublicResumeView {
    id: string;
    title: string;
    content: ResumeContent;
    templateId: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ResumeAnalytics {
    resumeId: string;
    viewCount: number;
    exportCount: number;
    lastViewedAt?: string;
    lastExportedAt?: string;
    viewsByDate: ViewsByDate[];
    exportsByFormat: ExportsByFormat[];
}

export interface ViewsByDate {
    date: string;
    count: number;
}

export interface ExportsByFormat {
    format: 'pdf' | 'docx' | 'json';
    count: number;
}

export interface UpdateShareSettingsRequest {
    isPublic: boolean;
    publicSlug?: string;
}

// Re-export ResumeContent from api.types for convenience
import { ResumeContent } from './api.types';
export type { ResumeContent };
