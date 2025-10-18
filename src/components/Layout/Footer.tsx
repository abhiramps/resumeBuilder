import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Button, SaveStatusIndicator } from "../UI";

const Footer: React.FC = () => {
  const { atsValidation } = useResume();

  // Mock auto-save result for status indicator
  const mockAutoSaveResult = {
    saveStatus: "saved" as const,
    lastSaved: new Date().toISOString(),
    error: undefined,
    saveNow: async () => {},
    clearSaved: async () => {},
    restoreData: async () => null,
    isRestored: false,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 70)
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const errorCount = atsValidation.issues.filter(
    (issue) => issue.type === "error"
  ).length;
  const warningCount = atsValidation.issues.filter(
    (issue) => issue.type === "warning"
  ).length;

  const handleViewDetails = () => {
    // TODO: Implement view details functionality
    console.log("Viewing ATS details...", atsValidation.issues);
  };

  const handleShowHelp = () => {
    // TODO: Implement help/tips functionality
    console.log("Showing help/tips...");
  };

  return (
    <footer className="sticky bottom-0 z-20 bg-white border-t border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ATS Score and Issues */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              {getScoreIcon(atsValidation.score)}
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                ATS Score:
              </span>
              <span className="text-sm font-medium text-gray-700 sm:hidden">
                ATS:
              </span>
              <span
                className={`text-sm font-bold ${getScoreColor(
                  atsValidation.score
                )}`}
              >
                {atsValidation.score}/100
              </span>
            </div>

            {/* Issue Counts */}
            {(errorCount > 0 || warningCount > 0) && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {errorCount > 0 && (
                  <span className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="hidden sm:inline">
                      {errorCount} Error{errorCount !== 1 ? "s" : ""}
                    </span>
                    <span className="sm:hidden">{errorCount}</span>
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    <span className="hidden sm:inline">
                      {warningCount} Warning{warningCount !== 1 ? "s" : ""}
                    </span>
                    <span className="sm:hidden">{warningCount}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* View Details Button */}
            {atsValidation.issues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
                className="text-sm"
              >
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </Button>
            )}

            {/* Help/Tips Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowHelp}
              leftIcon={<HelpCircle className="h-4 w-4" />}
              className="text-sm"
            >
              <span className="hidden sm:inline">Help</span>
            </Button>
          </div>

          {/* Save Status and Last Updated */}
          <div className="flex items-center space-x-4">
            {/* Save Status Indicator */}
            <div className="hidden sm:block">
              <SaveStatusIndicator autoSaveResult={mockAutoSaveResult} />
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-400 hidden lg:block">
              Last validated:{" "}
              {new Date(atsValidation.lastValidated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
