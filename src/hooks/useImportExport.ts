/**
 * useImportExport Hook
 * Manages import/export operations for resumes
 */

import { useState } from 'react';
import { resumeService } from '../services/resume.service';
import { importResumeFromFile, downloadResumeJSON } from '../utils/jsonExporter';
import type { Resume, ResumeContent } from '../types/resume.types';
import type { ResumeResponse } from '../types/api.types';

interface UseImportExportReturn {
    isExporting: boolean;
    isImporting: boolean;
    error: string | null;
    exportAsJSON: (resume: ResumeResponse) => Promise<void>;
    exportAsPDF: (resumeId: string) => Promise<void>;
    exportAsDOCX: (resumeId: string) => Promise<void>;
    bulkExportAsJSON: (resumes: ResumeResponse[]) => Promise<void>;
    importFromJSON: (file: File) => Promise<ResumeResponse | null>;
    importFromFile: (file: File) => Promise<ResumeResponse | null>;
    clearError: () => void;
}

export const useImportExport = (): UseImportExportReturn => {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    /**
     * Convert backend resume to frontend format for JSON export
     */
    const convertToFrontendFormat = (backendResume: ResumeResponse): Resume => {
        const content = backendResume.content as ResumeContent;

        return {
            id: backendResume.id,
            personalInfo: content.personalInfo || {
                fullName: '',
                title: '',
                email: '',
                phone: '',
                location: '',
            },
            sections: [],
            layout: {
                pageMargins: { top: 20, right: 20, bottom: 20, left: 20 },
                sectionSpacing: 16,
                lineHeight: 1.5,
                fontSize: {
                    name: 24,
                    title: 14,
                    sectionHeader: 16,
                    body: 11,
                },
                fontFamily: 'Inter',
                colors: {
                    primary: '#2563eb',
                    secondary: '#64748b',
                    text: '#1e293b',
                },
            },
            template: backendResume.templateId as any || 'modern',
            createdAt: backendResume.createdAt,
            updatedAt: backendResume.updatedAt,
        };
    };

    /**
     * Export resume as JSON file
     */
    const exportAsJSON = async (resume: ResumeResponse): Promise<void> => {
        try {
            setIsExporting(true);
            setError(null);

            const frontendResume = convertToFrontendFormat(resume);
            downloadResumeJSON(frontendResume, `${resume.title.replace(/\s+/g, '-').toLowerCase()}.json`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to export resume';
            setError(message);
            throw err;
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Export resume as PDF
     */
    const exportAsPDF = async (resumeId: string): Promise<void> => {
        try {
            setIsExporting(true);
            setError(null);

            const blob = await resumeService.exportResume(resumeId, 'pdf');
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resume-${resumeId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to export PDF';
            setError(message);
            throw err;
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Export resume as DOCX
     */
    const exportAsDOCX = async (resumeId: string): Promise<void> => {
        try {
            setIsExporting(true);
            setError(null);

            const blob = await resumeService.exportResume(resumeId, 'docx');
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resume-${resumeId}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to export DOCX';
            setError(message);
            throw err;
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Bulk export multiple resumes as JSON
     */
    const bulkExportAsJSON = async (resumes: ResumeResponse[]): Promise<void> => {
        try {
            setIsExporting(true);
            setError(null);

            const exportData = resumes.map(resume => ({
                id: resume.id,
                title: resume.title,
                content: resume.content,
                templateId: resume.templateId,
                createdAt: resume.createdAt,
                updatedAt: resume.updatedAt,
            }));

            const json = JSON.stringify({
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                count: resumes.length,
                resumes: exportData,
            }, null, 2);

            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resumes-bulk-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to bulk export';
            setError(message);
            throw err;
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Import resume from JSON file (client-side parsing)
     */
    const importFromJSON = async (file: File): Promise<ResumeResponse | null> => {
        try {
            setIsImporting(true);
            setError(null);

            const result = await importResumeFromFile(file);

            if (!result.success || !result.resume) {
                throw new Error(result.error || 'Failed to parse JSON file');
            }

            // Create new resume with imported data
            const newResume = await resumeService.createResume({
                title: `${result.resume.personalInfo.fullName}'s Resume (Imported)`,
                content: {
                    personalInfo: result.resume.personalInfo,
                },
                templateId: result.resume.template,
            });

            return newResume;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to import resume';
            setError(message);
            return null;
        } finally {
            setIsImporting(false);
        }
    };

    /**
     * Import resume from file (backend processing)
     */
    const importFromFile = async (file: File): Promise<ResumeResponse | null> => {
        try {
            setIsImporting(true);
            setError(null);

            const newResume = await resumeService.importResume(file);
            return newResume;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to import resume';
            setError(message);
            return null;
        } finally {
            setIsImporting(false);
        }
    };

    return {
        isExporting,
        isImporting,
        error,
        exportAsJSON,
        exportAsPDF,
        exportAsDOCX,
        bulkExportAsJSON,
        importFromJSON,
        importFromFile,
        clearError,
    };
};
