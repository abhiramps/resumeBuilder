/**
 * Version Control Types
 * Types for resume version management and comparison
 */

import type { ResumeContent } from './api.types';

// Re-export from api.types for convenience
export type { ResumeVersionResponse as ResumeVersion } from './api.types';
export type { CreateVersionRequest as CreateVersionData } from './api.types';

/**
 * Version comparison result showing differences between two versions
 */
export interface CompareVersionsResult {
    version1: VersionInfo;
    version2: VersionInfo;
    differences: VersionDifference[];
    summary: ComparisonSummary;
}

export interface VersionInfo {
    id: string;
    versionNumber: number;
    versionName?: string;
    createdAt: string;
    changesSummary?: string;
}

export interface VersionDifference {
    field: string;
    section?: string;
    type: 'added' | 'removed' | 'modified';
    oldValue?: any;
    newValue?: any;
    description: string;
}

export interface ComparisonSummary {
    totalChanges: number;
    addedFields: number;
    removedFields: number;
    modifiedFields: number;
    sectionsChanged: string[];
}

/**
 * Version list item for displaying in UI
 */
export interface VersionListItem {
    id: string;
    versionNumber: number;
    versionName?: string;
    changesSummary?: string;
    createdAt: string;
    isCurrent: boolean;
}

/**
 * Version restore options
 */
export interface RestoreVersionOptions {
    createBackup?: boolean;
    backupName?: string;
}

/**
 * Version delete options
 */
export interface DeleteVersionOptions {
    force?: boolean;
}
