import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import { TemplateType } from "../../types/resume.types";
import { Download, Save, FileText } from "lucide-react";
import { TemplateSelector } from "../UI";
import { TemplateImportExport } from "./TemplateImportExport";

const Header: React.FC = () => {
  const { resume, dispatch } = useResume();

  const handleTemplateChange = (template: TemplateType) => {
    dispatch({ type: "SET_TEMPLATE", payload: template });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving resume...", resume);
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log("Exporting PDF...", resume);
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
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              title="Export PDF"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
