import { Resume } from '../types/resume.types';

export interface ExportMetadata {
    version: string;
    exportedAt: string;
    appVersion: string;
}

export interface ResumeExport {
    metadata: ExportMetadata;
    resume: Resume;
}

const CURRENT_VERSION = '1.0.0';
const APP_VERSION = '1.0.0';

/**
 * Export resume data as JSON with metadata
 */
export const exportResumeJSON = (resume: Resume): string => {
    const exportData: ResumeExport = {
        metadata: {
            version: CURRENT_VERSION,
            exportedAt: new Date().toISOString(),
            appVersion: APP_VERSION,
        },
        resume,
    };

    return JSON.stringify(exportData, null, 2);
};

/**
 * Download resume as JSON file
 */
export const downloadResumeJSON = (resume: Resume, filename?: string): void => {
    const json = exportResumeJSON(resume);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename || `resume-${resume.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Validate JSON structure
 */
export const validateResumeJSON = (data: any): { valid: boolean; error?: string } => {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid JSON format' };
    }

    if (!data.metadata || !data.resume) {
        return { valid: false, error: 'Missing required fields (metadata or resume)' };
    }

    const { resume } = data;

    // Validate required resume fields
    if (!resume.id || !resume.personalInfo || !resume.sections || !resume.layout || !resume.template) {
        return { valid: false, error: 'Missing required resume fields' };
    }

    // Validate personalInfo
    if (!resume.personalInfo.fullName || !resume.personalInfo.email) {
        return { valid: false, error: 'Missing required personal information' };
    }

    // Validate sections array
    if (!Array.isArray(resume.sections)) {
        return { valid: false, error: 'Sections must be an array' };
    }

    // Validate layout
    if (!resume.layout.pageMargins || !resume.layout.fontSize || !resume.layout.colors) {
        return { valid: false, error: 'Invalid layout configuration' };
    }

    return { valid: true };
};

/**
 * Check version compatibility
 */
export const checkVersionCompatibility = (version: string): { compatible: boolean; needsMigration: boolean } => {
    const [major] = version.split('.').map(Number);
    const [currentMajor] = CURRENT_VERSION.split('.').map(Number);

    if (major < currentMajor) {
        return { compatible: true, needsMigration: true };
    }

    if (major > currentMajor) {
        return { compatible: false, needsMigration: false };
    }

    return { compatible: true, needsMigration: false };
};

/**
 * Migrate old version to current version
 */
export const migrateResume = (data: ResumeExport): Resume => {
    const { version } = data.metadata;
    let resume = data.resume;

    // Add migration logic for future versions
    if (version === '1.0.0') {
        // No migration needed for current version
        return resume;
    }

    // Future migrations would go here
    // Example:
    // if (version === '0.9.0') {
    //   resume = migrateFrom_0_9_0(resume);
    // }

    return resume;
};

/**
 * Import resume from JSON string
 */
export const importResumeJSON = (jsonString: string): { success: boolean; resume?: Resume; error?: string } => {
    try {
        const data = JSON.parse(jsonString);

        // Validate structure
        const validation = validateResumeJSON(data);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // Check version compatibility
        const compatibility = checkVersionCompatibility(data.metadata.version);
        if (!compatibility.compatible) {
            return { success: false, error: `Incompatible version: ${data.metadata.version}. Please update the app.` };
        }

        // Migrate if needed
        let resume = data.resume;
        if (compatibility.needsMigration) {
            resume = migrateResume(data);
        }

        // Update timestamps
        resume.updatedAt = new Date().toISOString();

        return { success: true, resume };
    } catch (error) {
        return { success: false, error: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
};

/**
 * Import resume from file
 */
export const importResumeFromFile = (file: File): Promise<{ success: boolean; resume?: Resume; error?: string }> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result as string;
            const result = importResumeJSON(content);
            resolve(result);
        };

        reader.onerror = () => {
            resolve({ success: false, error: 'Failed to read file' });
        };

        reader.readAsText(file);
    });
};
