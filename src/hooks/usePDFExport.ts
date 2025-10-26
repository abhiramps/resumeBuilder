import { useRef, useCallback, useState, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Resume } from '../types/resume.types';

export interface PDFExportOptions {
  fileName?: string;
  paperSize?: 'letter' | 'a4';
  quality?: 'standard' | 'high';
}

export interface UsePDFExportReturn {
  componentRef: React.RefObject<HTMLDivElement>;
  handleExport: (options?: PDFExportOptions) => void;
  isExporting: boolean;
}

/**
 * Custom hook for PDF export functionality
 * 
 * Uses react-to-print library for high-quality PDF generation with:
 * - Exact WYSIWYG rendering
 * - Letter size (8.5" x 11") format
 * - User-defined page margins applied
 * - Automatic filename generation
 * - Loading state management
 * - Error handling
 * - Print-specific CSS optimization
 * 
 * @param resume - Resume data for filename generation and margin settings
 * @returns Object containing componentRef, handleExport function, and isExporting state
 * 
 * @example
 * ```tsx
 * const { componentRef, handleExport, isExporting } = usePDFExport(resume);
 * 
 * return (
 *   <>
 *     <ResumePreview ref={componentRef} resume={resume} />
 *     <button onClick={() => handleExport()} disabled={isExporting}>
 *       {isExporting ? 'Exporting...' : 'Export PDF'}
 *     </button>
 *   </>
 * );
 * ```
 */
export const usePDFExport = (resume: Resume): UsePDFExportReturn => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Generate filename based on resume data and current date
  const generateFileName = useCallback((customName?: string): string => {
    if (customName) return customName;
    
    const name = resume.personalInfo.fullName || 'Resume';
    const date = new Date().toISOString().split('T')[0];
    return `${name.replace(/\s+/g, '_')}_Resume_${date}`;
  }, [resume.personalInfo.fullName]);

  // Generate dynamic page style with user's margin settings
  const pageStyle = useMemo(() => {
    const margins = resume.layout.pageMargins;
    return `
      @page {
        size: letter;
        margin: ${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in;
      }
      @media print {
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `;
  }, [resume.layout.pageMargins]);

  // Handle print with react-to-print (v3.x API)
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: generateFileName(),
    onBeforePrint: async () => {
      setIsExporting(true);
    },
    onAfterPrint: () => {
      setIsExporting(false);
    },
    onPrintError: (errorLocation, error) => {
      console.error('PDF Export Error:', errorLocation, error);
      setIsExporting(false);
    },
    pageStyle,
    suppressErrors: true,
  });

  // Export handler with options
  const handleExport = useCallback((options?: PDFExportOptions) => {
    if (!componentRef.current) {
      console.error('Component ref not available');
      setIsExporting(false);
      return;
    }

    // Verify the ref has content
    if (componentRef.current.innerHTML.length === 0) {
      console.error('Component ref is empty');
      setIsExporting(false);
      return;
    }

    // Trigger print
    handlePrint();
  }, [handlePrint]);

  return {
    componentRef,
    handleExport,
    isExporting,
  };
};
