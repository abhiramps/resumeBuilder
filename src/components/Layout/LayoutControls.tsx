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
          ...(resume.layout?.pageMargins || { top: 1, right: 1, bottom: 1, left: 1 }),
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
          ...(resume.layout?.fontSize || { name: 22, title: 12, sectionHeader: 12, body: 10 }),
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
          ...(resume.layout?.colors || { primary: "#2c3e50", secondary: "#555555", text: "#333333" }),
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
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
          Layout Controls
        </h3>

        {/* Page Margins */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
            Page Margins (inches)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Top</span>
                <span className="text-primary font-semibold">{resume.layout?.pageMargins?.top || 1}"</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout?.pageMargins?.top || 1}
                onChange={(e) =>
                  handleMarginChange("top", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Right</span>
                <span className="text-primary font-semibold">{resume.layout?.pageMargins?.right || 1}"</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout?.pageMargins?.right || 1}
                onChange={(e) =>
                  handleMarginChange("right", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Bottom</span>
                <span className="text-primary font-semibold">{resume.layout?.pageMargins?.bottom || 1}"</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout?.pageMargins?.bottom || 1}
                onChange={(e) =>
                  handleMarginChange("bottom", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Left</span>
                <span className="text-primary font-semibold">{resume.layout?.pageMargins?.left || 1}"</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={resume.layout?.pageMargins?.left || 1}
                onChange={(e) =>
                  handleMarginChange("left", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
            Spacing
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Section Spacing</span>
                <span className="text-primary font-semibold">{resume.layout?.sectionSpacing || 16}px</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={resume.layout?.sectionSpacing || 16}
                onChange={(e) => handleSpacingChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Line Height</span>
                <span className="text-primary font-semibold">{resume.layout?.lineHeight || 1.4}</span>
              </label>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={resume.layout?.lineHeight || 1.4}
                onChange={(e) =>
                  handleLineHeightChange(parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
            Typography
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={resume.layout?.fontFamily || "Arial"}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
              >
                {atsSafeFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Name Size</span>
                <span className="text-primary font-semibold">{resume.layout?.fontSize?.name || 22}pt</span>
              </label>
              <input
                type="range"
                min="16"
                max="32"
                step="1"
                value={resume.layout?.fontSize?.name || 22}
                onChange={(e) =>
                  handleFontSizeChange("name", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Title Size</span>
                <span className="text-primary font-semibold">{resume.layout?.fontSize?.title || 12}pt</span>
              </label>
              <input
                type="range"
                min="8"
                max="16"
                step="1"
                value={resume.layout?.fontSize?.title || 12}
                onChange={(e) =>
                  handleFontSizeChange("title", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Section Header</span>
                <span className="text-primary font-semibold">{resume.layout?.fontSize?.sectionHeader || 12}pt</span>
              </label>
              <input
                type="range"
                min="8"
                max="16"
                step="1"
                value={resume.layout?.fontSize?.sectionHeader || 12}
                onChange={(e) =>
                  handleFontSizeChange(
                    "sectionHeader",
                    parseInt(e.target.value)
                  )
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex justify-between">
                <span>Body Text</span>
                <span className="text-primary font-semibold">{resume.layout?.fontSize?.body || 10}pt</span>
              </label>
              <input
                type="range"
                min="8"
                max="14"
                step="1"
                value={resume.layout?.fontSize?.body || 10}
                onChange={(e) =>
                  handleFontSizeChange("body", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
            Colors
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={resume.layout?.colors?.primary || "#2c3e50"}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={resume.layout?.colors?.primary || "#2c3e50"}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={resume.layout?.colors?.secondary || "#555555"}
                  onChange={(e) =>
                    handleColorChange("secondary", e.target.value)
                  }
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={resume.layout?.colors?.secondary || "#555555"}
                  onChange={(e) =>
                    handleColorChange("secondary", e.target.value)
                  }
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={resume.layout?.colors?.text || "#333333"}
                  onChange={(e) => handleColorChange("text", e.target.value)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={resume.layout?.colors?.text || "#333333"}
                  onChange={(e) => handleColorChange("text", e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
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
