import React, { forwardRef } from "react";
import { Resume } from "../../types/resume.types";
import { templateHelpers } from "../../utils/templateHelpers";
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
export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resume, className = "", printMode = false }, ref) => {
    // Render the appropriate template based on resume.template
    const templateProps = {
      resume,
      layout: resume.layout,
      printMode,
      ref,
      className
    };

    switch (resume.template) {
      case "classic":
        return <ClassicTemplate {...templateProps} />;
      case "modern":
        return <ModernTemplate {...templateProps} />;
      case "minimal":
        return <MinimalTemplate {...templateProps} />;
      case "abhiram":
        return <AbhiramTemplate {...templateProps} />;
      default:
        return <AbhiramTemplate {...templateProps} />;
    }
  }
);


ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
