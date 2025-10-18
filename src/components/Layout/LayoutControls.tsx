import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import { LayoutSettings } from "../../types/resume.types";

const LayoutControls: React.FC = () => {
  const { resume, dispatch } = useResume();

  const handleMarginChange = (
    side: keyof LayoutSettings["pageMargins"],
    value: number
  ) => {
    dispatch({
      type: "UPDATE_LAYOUT",
      payload: {
        pageMargins: {
          ...resume.layout.pageMargins,
          [side]: value,
        },
      },
    });
  };

  const handleSpacingChange = (value: number) => {
    dispatch({
      type: "UPDATE_LAYOUT",
      payload: {
        sectionSpacing: value,
      },
    });
  };

  const handleLineHeightChange = (value: number) => {
    dispatch({
      type: "UPDATE_LAYOUT",
      payload: {
        lineHeight: value,
      },
    });
  };

  const handleFontSizeChange = (
    type: keyof LayoutSettings["fontSize"],
    value: number
  ) => {
    dispatch({
      type: "UPDATE_LAYOUT",
      payload: {
        fontSize: {
          ...resume.layout.fontSize,
          [type]: value,
        },
      },
    });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    dispatch({
      type: "UPDATE_LAYOUT",
      payload: {
        fontFamily,
      },
    });
  };

  const handleColorChange = (
    type: keyof LayoutSettings["colors"],
    value: string
  ) => {
    dispatch({
      type: "UPDATE_LAYOUT",
      payload: {
        colors: {
          ...resume.layout.colors,
          [type]: value,
        },
      },
    });
  };

  const atsSafeFonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Calibri",
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Layout Controls
        </h3>

        {/* Page Margins */}
        <div className="mb-6">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
            Page Margins (inches)
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Top: {resume.layout.pageMargins.top}"
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout.pageMargins.top}
                onChange={(e) =>
                  handleMarginChange("top", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Right: {resume.layout.pageMargins.right}"
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout.pageMargins.right}
                onChange={(e) =>
                  handleMarginChange("right", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bottom: {resume.layout.pageMargins.bottom}"
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout.pageMargins.bottom}
                onChange={(e) =>
                  handleMarginChange("bottom", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Left: {resume.layout.pageMargins.left}"
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout.pageMargins.left}
                onChange={(e) =>
                  handleMarginChange("left", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div className="mb-6">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
            Spacing
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Section Spacing: {resume.layout.sectionSpacing}px
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={resume.layout.sectionSpacing}
                onChange={(e) => handleSpacingChange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Line Height: {resume.layout.lineHeight}
              </label>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={resume.layout.lineHeight}
                onChange={(e) =>
                  handleLineHeightChange(parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mb-6">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
            Typography
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={resume.layout.fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {atsSafeFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Name Size: {resume.layout.fontSize.name}pt
              </label>
              <input
                type="range"
                min="16"
                max="32"
                step="1"
                value={resume.layout.fontSize.name}
                onChange={(e) =>
                  handleFontSizeChange("name", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Title Size: {resume.layout.fontSize.title}pt
              </label>
              <input
                type="range"
                min="8"
                max="16"
                step="1"
                value={resume.layout.fontSize.title}
                onChange={(e) =>
                  handleFontSizeChange("title", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Section Header: {resume.layout.fontSize.sectionHeader}pt
              </label>
              <input
                type="range"
                min="8"
                max="16"
                step="1"
                value={resume.layout.fontSize.sectionHeader}
                onChange={(e) =>
                  handleFontSizeChange(
                    "sectionHeader",
                    parseInt(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Body Text: {resume.layout.fontSize.body}pt
              </label>
              <input
                type="range"
                min="8"
                max="14"
                step="1"
                value={resume.layout.fontSize.body}
                onChange={(e) =>
                  handleFontSizeChange("body", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="mb-6">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
            Colors
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={resume.layout.colors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={resume.layout.colors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={resume.layout.colors.secondary}
                  onChange={(e) =>
                    handleColorChange("secondary", e.target.value)
                  }
                  className="w-8 h-8 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={resume.layout.colors.secondary}
                  onChange={(e) =>
                    handleColorChange("secondary", e.target.value)
                  }
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={resume.layout.colors.text}
                  onChange={(e) => handleColorChange("text", e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={resume.layout.colors.text}
                  onChange={(e) => handleColorChange("text", e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutControls;
