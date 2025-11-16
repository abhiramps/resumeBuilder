import React from "react";

/**
 * React component for save status indicator
 *
 * @param isSaving - Whether the resume is currently being saved
 * @returns Save status indicator JSX
 */
export const SaveStatusIndicator: React.FC<{
  isSaving?: boolean;
}> = ({ isSaving = false }) => {
  if (isSaving) {
    return (
      <div className="flex items-center space-x-1 text-blue-600">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
        <span className="text-xs">Saving...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-green-600">
      <div className="w-2 h-2 bg-green-600 rounded-full" />
      <span className="text-xs">Saved</span>
    </div>
  );
};
