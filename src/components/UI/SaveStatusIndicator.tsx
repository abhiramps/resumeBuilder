import React from "react";
import { AutoSaveResult } from "../../hooks/useAutoSave";

/**
 * React component for save status indicator
 *
 * @param autoSaveResult - Result from useAutoSave hook
 * @returns Save status indicator JSX
 */
export const SaveStatusIndicator: React.FC<{
  autoSaveResult: AutoSaveResult;
}> = ({ autoSaveResult }) => {
  const { saveStatus, lastSaved } = autoSaveResult;

  if (saveStatus === "saving") {
    return (
      <div className="flex items-center space-x-1 text-blue-600">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
        <span className="text-xs">Saving...</span>
      </div>
    );
  }

  if (saveStatus === "saved") {
    return (
      <div className="flex items-center space-x-1 text-green-600">
        <div className="w-2 h-2 bg-green-600 rounded-full" />
        <span className="text-xs">Saved</span>
      </div>
    );
  }

  if (saveStatus === "error") {
    return (
      <div className="flex items-center space-x-1 text-red-600">
        <div className="w-2 h-2 bg-red-600 rounded-full" />
        <span className="text-xs">Error</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center space-x-1 text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
        <span className="text-xs">
          Last saved: {new Date(lastSaved).toLocaleTimeString()}
        </span>
      </div>
    );
  }

  return null;
};
