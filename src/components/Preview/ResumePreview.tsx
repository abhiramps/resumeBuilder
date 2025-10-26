import { forwardRef, memo } from "react";
import { Resume } from "../../types/resume.types";
import { ClassicTemplate, ModernTemplate, MinimalTemplate, AbhiramTemplate } from "../Templates";

/**
 * Resume Preview Component Props
 */
export interface ResumePreviewProps {
  /** Resume data to display */
  resume: Resume;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show print-specific styling */
  printMode?: boolean;
}

/**
 * Resume Preview Component
 * 
 * Displays the formatted resume with:
 * - Letter size (8.5" x 11") dimensions
 * - User's layout settings applied
 * - Only enabled sections shown
 * - Sections in correct order
 * - Print-optimized styling
 * - ATS-safe formatting
 * 
 * Uses forwardRef for PDF generation compatibility
 */
const ResumePreviewComponent = forwardRef<HTMLDivElement, ResumePreviewProps>(
  (props, ref) => {
    const { resume, className = "", printMode = false } = props;

    // Render the appropriate template based on resume.template
    const templateProps = {
      resume,
      layout: resume.layout,
      printMode,
      className
    };

    switch (resume.template) {
      case "classic":
        return <ClassicTemplate ref={ref} {...templateProps} />;
      case "modern":
        return <ModernTemplate ref={ref} {...templateProps} />;
      case "minimal":
        return <MinimalTemplate ref={ref} {...templateProps} />;
      case "abhiram":
        return <AbhiramTemplate ref={ref} {...templateProps} />;
      default:
        return <AbhiramTemplate ref={ref} {...templateProps} />;
    }
  }
);


ResumePreviewComponent.displayName = "ResumePreview";

// Memoize the preview to prevent unnecessary re-renders
export const ResumePreview = memo(ResumePreviewComponent);

export default ResumePreview;
