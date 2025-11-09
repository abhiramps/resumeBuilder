/**
 * Hooks Export Index
 * 
 * Centralized exports for all custom hooks
 */

export { useAutoSave } from './useAutoSave';
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

// Auth and user hooks
export { useAuth } from './useAuth';
export { useUserProfile, useUpdateProfile, useDeleteAccount } from './useUser';
