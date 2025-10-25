import React, { useState } from "react";
import { useResume } from "../../contexts/ResumeContext";
import { TemplateType } from "../../types/resume.types";
import { Download, Save, FileText, Loader2 } from "lucide-react";
import { TemplateSelector } from "../UI";
import { TemplateImportExport } from "./TemplateImportExport";
import { usePDFExportContext } from "../../contexts/PDFExportContext";
import { useReactToPrint } from "react-to-print";

const Header: React.FC = () => {
  const { resume, dispatch } = useResume();
  const { previewRef } = usePDFExportContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleTemplateChange = (template: TemplateType) => {
    dispatch({ type: "SET_TEMPLATE", payload: template });
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('resumeDraft', JSON.stringify(resume));
    console.log("Resume saved successfully");
  };

  // Generate filename based on resume data
  const generateFileName = (): string => {
    const name = resume.personalInfo.fullName || 'Resume';
    const date = new Date().toISOString().split('T')[0];
    return `${name.replace(/\s+/g, '_')}_Resume_${date}`;
  };

  // PDF export handler using react-to-print (v3.x API)
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
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
      alert('Failed to export PDF. Please try again.');
    },
    pageStyle: `
      @page {
        size: letter;
        margin: 0;
      }
      
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Ensure all content is visible */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          visibility: visible !important;
        }
      }
    `,
  });

  const handleExportPDF = () => {
    if (!previewRef.current) {
      console.error('Preview ref is null');
      alert('Preview not ready. Please wait a moment and try again.');
      return;
    }

    // Verify content exists
    if (previewRef.current.innerHTML.length === 0) {
      console.error('Preview content is empty');
      alert('Resume preview is empty. Please add content to your resume.');
      return;
    }

    console.log('Exporting PDF - Preview ref available with', previewRef.current.children.length, 'children');
    handlePrint();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                  ATS Resume Builder
                </h1>
                <h1 className="text-lg font-bold text-gray-900 sm:hidden">ARB</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Professional Resume Creator</p>
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <TemplateSelector
            currentTemplate={resume.template}
            onTemplateChange={handleTemplateChange}
          />

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <TemplateImportExport />

            <button
              onClick={handleSave}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium shadow-sm"
              title="Save Resume"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export PDF"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
