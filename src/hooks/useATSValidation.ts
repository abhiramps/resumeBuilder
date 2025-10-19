import { useMemo } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { validateResume, ValidationReport } from '../utils/templateValidator';

/**
 * useATSValidation Hook
 * 
 * Provides real-time ATS validation for the current resume.
 * Memoized to only recalculate when resume data changes.
 * 
 * @returns ValidationReport with score, issues, and passed checks
 * 
 * @example
 * const validation = useATSValidation();
 * console.log(validation.score); // 85
 * console.log(validation.isATSCompliant); // true
 * console.log(validation.issues); // Array of issues
 */
export const useATSValidation = (): ValidationReport => {
  const { resume } = useResume();

  const validationReport = useMemo(() => {
    return validateResume(resume);
  }, [resume]);

  return validationReport;
};

/**
 * useATSScore Hook
 * 
 * Returns just the ATS score (0-100).
 * Useful for components that only need the score.
 * 
 * @returns ATS score number
 */
export const useATSScore = (): number => {
  const validation = useATSValidation();
  return validation.score;
};

/**
 * useATSIssues Hook
 * 
 * Returns just the validation issues.
 * Useful for displaying issue lists.
 * 
 * @returns Array of validation issues
 */
export const useATSIssues = () => {
  const validation = useATSValidation();
  return validation.issues;
};

/**
 * useATSCompliance Hook
 * 
 * Returns boolean indicating if resume is ATS compliant.
 * 
 * @returns true if ATS compliant (score >= 70)
 */
export const useATSCompliance = (): boolean => {
  const validation = useATSValidation();
  return validation.isATSCompliant;
};

export default useATSValidation;
