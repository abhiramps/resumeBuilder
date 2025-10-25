import React, { useState } from "react";
import { ResumePreview } from "./ResumePreview";
import { useResumeContext } from "../../contexts/ResumeContext";
import { usePDFExportContext } from "../../contexts/PDFExportContext";

/**
 * Preview Container Component Props
 */
export interface PreviewContainerProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to show zoom controls */
  showZoomControls?: boolean;
  /** Whether to show print mode toggle */
  showPrintMode?: boolean;
}

/**
 * Preview Container Component
 * 
 * Wrapper component that provides:
 * - Centered preview with paper shadow effect
 * - Zoom controls for better viewing
 * - Print mode toggle
 * - Responsive scaling
 * - Scrollable container
 */
export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  className = "",
  showZoomControls = true,
  showPrintMode = true,
}) => {
  const { resume } = useResumeContext();
  const { previewRef } = usePDFExportContext();
  const [zoom, setZoom] = useState(100);
  const [printMode, setPrintMode] = useState(false);

  // Zoom levels
  const zoomLevels = [50, 75, 100, 125, 150, 200];

  /**
   * Handle zoom change
   */
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  /**
   * Zoom in
   */
  const zoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex < zoomLevels.length - 1) {
      setZoom(zoomLevels[currentIndex + 1]);
    }
  };

  /**
   * Zoom out
   */
  const zoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex > 0) {
      setZoom(zoomLevels[currentIndex - 1]);
    }
  };

  /**
   * Reset zoom to 100%
   */
  const resetZoom = () => {
    setZoom(100);
  };

  /**
   * Toggle print mode
   */
  const togglePrintMode = () => {
    setPrintMode(!printMode);
  };

  const containerStyles: React.CSSProperties = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: "top center",
    transition: "transform 0.2s ease-in-out",
    // Don't apply transform during printing
  };

  return (
    <div className={`preview-container ${className}`}>
      {/* Controls Bar */}
      {(showZoomControls || showPrintMode) && (
        <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm print:hidden">
          {/* Zoom Controls */}
          {showZoomControls && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Zoom:</span>

              {/* Zoom Out Button */}
              <button
                onClick={zoomOut}
                disabled={zoom <= zoomLevels[0]}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              {/* Zoom Level Selector */}
              <select
                value={zoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {zoomLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}%
                  </option>
                ))}
              </select>

              {/* Zoom In Button */}
              <button
                onClick={zoomIn}
                disabled={zoom >= zoomLevels[zoomLevels.length - 1]}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Reset Zoom Button */}
              <button
                onClick={resetZoom}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          )}

          {/* Print Mode Toggle */}
          {showPrintMode && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Print Mode:</span>
              <button
                onClick={togglePrintMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${printMode ? "bg-blue-600" : "bg-gray-200"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${printMode ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preview Area */}
      <div className="preview-area bg-gray-100 rounded-lg p-6 overflow-auto">
        <div
          className="preview-wrapper flex justify-center"
          style={{ minHeight: "600px" }}
        >
          {/* Wrapper with zoom - NOT applied during print */}
          <div style={printMode ? {} : containerStyles}>
            <ResumePreview
              ref={previewRef}
              resume={resume}
              printMode={true}
              className="shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-4 text-center text-sm text-gray-500 no-print print:hidden">
        <p>
          Preview shows how your resume will appear when printed or exported as PDF.
          {printMode && " Print mode shows exact dimensions and styling."}
        </p>
      </div>
    </div>
  );
};

export default PreviewContainer;