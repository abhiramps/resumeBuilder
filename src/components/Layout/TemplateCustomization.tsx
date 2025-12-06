import React from "react";
import { useResumeContext } from "../../contexts/ResumeContext";
import { Sparkles, RotateCcw } from "lucide-react";
import { applyTemplatePreset } from "../../utils/templateStyler";

/**
 * Template-Specific Customization Component
 *
 * Provides customization options specific to each template type.
 * Different templates show different customization controls.
 */
export const TemplateCustomization: React.FC = () => {
  const { resume, dispatch } = useResumeContext();
  const currentTemplate = resume.template;

  const resetToTemplateDefaults = () => {
    const preset = applyTemplatePreset(currentTemplate, resume.layout);

    dispatch({
      type: "UPDATE_FONT_FAMILY",
      payload: preset.fontFamily || "Arial",
    });
    if (preset.fontSize) {
      dispatch({ type: "UPDATE_FONT_SIZES", payload: preset.fontSize });
    }
    if (preset.colors) {
      dispatch({ type: "UPDATE_COLORS", payload: preset.colors });
    }
    if (preset.lineHeight) {
      dispatch({
        type: "UPDATE_SPACING",
        payload: { lineHeight: preset.lineHeight },
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            Template Options
          </h3>
        </div>
        <button
          onClick={resetToTemplateDefaults}
          className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
          title="Reset to template defaults"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Template-Specific Controls */}
      {currentTemplate === "classic" && <ClassicOptions />}
      {currentTemplate === "modern" && <ModernOptions />}
      {currentTemplate === "minimal" && <MinimalOptions />}
      {currentTemplate === "professional" && <ProfessionalOptions />}
    </div>
  );
};

/**
 * Classic Template Options
 */
const ClassicOptions: React.FC = () => {
  const { resume, dispatch } = useResumeContext();
  const isSerif =
    resume.layout.fontFamily?.includes("Times") ||
    resume.layout.fontFamily?.includes("Georgia");

  const toggleFontStyle = () => {
    const newFont = isSerif
      ? "Arial, Helvetica, sans-serif"
      : "Times New Roman, serif";
    dispatch({ type: "UPDATE_FONT_FAMILY", payload: newFont });
  };

  const applySpacingVariant = (
    variant: "compact" | "standard" | "spacious"
  ) => {
    const spacingMap = {
      compact: { sectionSpacing: 12, lineHeight: 1.2 },
      standard: { sectionSpacing: 16, lineHeight: 1.3 },
      spacious: { sectionSpacing: 20, lineHeight: 1.5 },
    };
    dispatch({ type: "UPDATE_SPACING", payload: spacingMap[variant] });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600">
        Traditional, conservative styling options
      </p>

      {/* Font Style Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Font Style</label>
        <div className="flex gap-2">
          <button
            onClick={toggleFontStyle}
            className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
              isSerif
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Serif
          </button>
          <button
            onClick={toggleFontStyle}
            className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
              !isSerif
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Sans-serif
          </button>
        </div>
      </div>

      {/* Spacing Variants */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Spacing Density
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => applySpacingVariant("compact")}
            className="flex-1 px-3 py-2 text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors"
          >
            Compact
          </button>
          <button
            onClick={() => applySpacingVariant("standard")}
            className="flex-1 px-3 py-2 text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors"
          >
            Standard
          </button>
          <button
            onClick={() => applySpacingVariant("spacious")}
            className="flex-1 px-3 py-2 text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors"
          >
            Spacious
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modern Template Options
 */
const ModernOptions: React.FC = () => {
  const { resume, dispatch } = useResumeContext();

  const accentColors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Green", value: "#10b981" },
  ];

  const applyAccentColor = (color: string) => {
    dispatch({
      type: "UPDATE_COLORS",
      payload: { primary: color },
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600">
        Contemporary design with visual accents
      </p>

      {/* Accent Color */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Accent Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => applyAccentColor(color.value)}
              className="group relative"
              title={color.name}
            >
              <div
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  resume.layout.colors?.primary === color.value
                    ? "border-gray-800 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Skills Toggle */}
      <div className="p-3 bg-white rounded border border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-700">
              Grid Skills Layout
            </p>
            <p className="text-xs text-gray-500">
              Skills displayed in grid format
            </p>
          </div>
          <div className="text-xs text-green-600 font-medium">Active</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Minimal Template Options
 */
const MinimalOptions: React.FC = () => {
  const { dispatch } = useResumeContext();

  const densityLevels = [
    {
      name: "Ultra Dense",
      spacing: 8,
      lineHeight: 1.15,
      fontSize: { name: 20, title: 11, sectionHeader: 10, body: 9 },
    },
    {
      name: "Dense",
      spacing: 10,
      lineHeight: 1.2,
      fontSize: { name: 22, title: 12, sectionHeader: 10, body: 9 },
    },
    {
      name: "Balanced",
      spacing: 12,
      lineHeight: 1.3,
      fontSize: { name: 22, title: 12, sectionHeader: 11, body: 10 },
    },
  ];

  const applyDensity = (level: (typeof densityLevels)[0]) => {
    dispatch({
      type: "UPDATE_SPACING",
      payload: { sectionSpacing: level.spacing, lineHeight: level.lineHeight },
    });
    dispatch({ type: "UPDATE_FONT_SIZES", payload: level.fontSize });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600">
        Space-efficient, maximum content density
      </p>

      {/* Density Level */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Content Density
        </label>
        <div className="space-y-2">
          {densityLevels.map((level) => (
            <button
              key={level.name}
              onClick={() => applyDensity(level)}
              className="w-full px-3 py-2 text-left text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors"
            >
              <div className="font-medium text-gray-800">{level.name}</div>
              <div className="text-gray-500">
                Spacing: {level.spacing}px • Line: {level.lineHeight} • Body:{" "}
                {level.fontSize.body}pt
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Black & White Lock */}
      <div className="p-3 bg-white rounded border border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-700">
              Black & White Only
            </p>
            <p className="text-xs text-gray-500">Optimized for ATS parsing</p>
          </div>
          <div className="text-xs text-green-600 font-medium">100% ATS</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Professional Template Options
 */
const ProfessionalOptions: React.FC = () => {
  const { dispatch } = useResumeContext();

  const colorSchemes = [
    {
      name: "Navy Professional",
      primary: "#2c3e50",
      secondary: "#555",
      text: "#333",
    },
    {
      name: "Dark Blue",
      primary: "#1e3a8a",
      secondary: "#64748b",
      text: "#334155",
    },
    {
      name: "Forest Green",
      primary: "#065f46",
      secondary: "#6b7280",
      text: "#374151",
    },
    {
      name: "Deep Purple",
      primary: "#5b21b6",
      secondary: "#6b7280",
      text: "#374151",
    },
  ];

  const applyColorScheme = (scheme: (typeof colorSchemes)[0]) => {
    dispatch({
      type: "UPDATE_COLORS",
      payload: {
        primary: scheme.primary,
        secondary: scheme.secondary,
        text: scheme.text,
      },
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600">
        Professional backend engineer styling
      </p>

      {/* Color Scheme Variants */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Color Scheme
        </label>
        <div className="space-y-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => applyColorScheme(scheme)}
              className="w-full px-3 py-2.5 text-left bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-800">
                  {scheme.name}
                </span>
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: scheme.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: scheme.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: scheme.text }}
                    title="Text"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Centered Header Lock */}
      <div className="p-3 bg-white rounded border border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-700">Centered Header</p>
            <p className="text-xs text-gray-500">
              Professional centered layout
            </p>
          </div>
          <div className="text-xs text-purple-600 font-medium">Active</div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomization;
