import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import { TemplateType } from "../../types/resume.types";
import { Download, Save, FileText } from "lucide-react";
import { Select } from "../UI";

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

  // Template options for the Select component
  const templateOptions = [
    { value: "classic", label: "Classic" },
    { value: "modern", label: "Modern" },
    { value: "minimal", label: "Minimal" },
    { value: "abhiram", label: "Abhiram" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                ATS Resume Builder
              </h1>
              <h1 className="text-lg font-bold text-gray-900 sm:hidden">ARB</h1>
            </div>
          </div>

          {/* Template Selector */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <label className="text-sm font-medium text-gray-700">
                Template:
              </label>
            </div>
            <div className="w-32 sm:w-40">
              <Select
                options={templateOptions}
                value={resume.template}
                onChange={(value) =>
                  handleTemplateChange(value as TemplateType)
                }
                placeholder="Template"
                className="text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              title="Save Resume"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
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
