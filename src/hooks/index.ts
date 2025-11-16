/**
 * Hooks Export Index
 * 
 * Centralized exports for all custom hooks
 */

export { useAutoSave } from './useAutoSave';
export { useDebounce } from './useDebounce';
export { useTemplate } from './useTemplate';
export {
  useTemplateStyles,
  useTemplateStylesFor,
  useTemplateFont,
  useTemplateColors,
  useTemplateFontSizes,
  useTemplateSpacing,
} from './useTemplateStyles';
export {
  useATSValidation,
  useATSScore,
  useATSIssues,
  useATSCompliance,
} from './useATSValidation';
export { usePDFExport } from './usePDFExport';
export type { PDFExportOptions, UsePDFExportReturn } from './usePDFExport';

// Resume management hooks
export {
  useResume,
  usePublicResume,
  useCreateResume,
  useUpdateResume,
  useDeleteResume,
  useDuplicateResume,
  useShareResume,
  useExportResume,
  useImportResume,
  RESUME_KEYS,
} from './useResume';
export { useResumes, useSearchResumes, useResumesByStatus } from './useResumes';

// Version management hooks
export {
  useVersions,
  useVersion,
  useCreateVersion,
  useRestoreVersion,
  useCompareVersions,
  useDeleteVersion,
} from './useVersions';

// Sharing and analytics hooks
export {
  usePublicResume as usePublicResumeSharing,
  useResumeAnalytics,
  useShareResume as useShareResumeSharing,
  useUnshareResume,
  useUpdateShareSettings,
} from './useSharing';

// Auth and user hooks
export { useAuth } from './useAuth';
export { useUserProfile, useUpdateProfile, useDeleteAccount } from './useUser';

// Import/Export hooks
export { useImportExport } from './useImportExport';
