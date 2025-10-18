import React, { forwardRef, useState, useRef, useEffect } from "react";

/**
 * ColorPicker component props interface
 */
export interface ColorPickerProps {
  /** Label text for the color picker */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the color picker */
  helperText?: string;
  /** Selected color value */
  value?: string;
  /** Change handler */
  onChange?: (color: string) => void;
  /** Whether the color picker is required */
  required?: boolean;
  /** Whether the color picker is disabled */
  disabled?: boolean;
  /** Custom class name for the color picker */
  className?: string;
  /** Custom class name for the container */
  containerClassName?: string;
  /** Whether to show the hex value input */
  showHexInput?: boolean;
  /** Preset colors to display */
  presetColors?: string[];
}

/**
 * Default preset colors
 */
const DEFAULT_PRESET_COLORS = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#cccccc",
  "#ffffff",
  "#ff0000",
  "#ff6600",
  "#ffcc00",
  "#00ff00",
  "#0066ff",
  "#6600ff",
  "#ff0066",
  "#00ffff",
  "#ffff00",
  "#ff9900",
  "#9900ff",
  "#00ff99",
  "#2c3e50",
  "#34495e",
  "#7f8c8d",
  "#95a5a6",
  "#bdc3c7",
  "#ecf0f1",
  "#e74c3c",
  "#f39c12",
  "#f1c40f",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
];

/**
 * Reusable ColorPicker component with color preview and hex input
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   label="Primary Color"
 *   value={primaryColor}
 *   onChange={setPrimaryColor}
 *   showHexInput
 *   presetColors={customColors}
 * />
 * ```
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      label,
      error,
      helperText,
      value = "#000000",
      onChange,
      required,
      disabled = false,
      className = "",
      containerClassName = "",
      showHexInput = true,
      presetColors = DEFAULT_PRESET_COLORS,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hexInput, setHexInput] = useState(value);
    const colorPickerId = `color-picker-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const hasError = !!error;
    const inputRef = useRef<HTMLInputElement>(null);

    // Update hex input when value changes
    useEffect(() => {
      setHexInput(value);
    }, [value]);

    // Handle color selection
    const handleColorSelect = (color: string) => {
      if (onChange) {
        onChange(color);
      }
      setIsOpen(false);
    };

    // Handle hex input change
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setHexInput(newValue);

      // Validate hex color format
      if (/^#[0-9A-Fa-f]{6}$/.test(newValue) && onChange) {
        onChange(newValue);
      }
    };

    // Handle hex input blur
    const handleHexBlur = () => {
      // Reset to current value if invalid
      if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
        setHexInput(value);
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && "current" in ref && ref.current) {
          if (!ref.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
      <div ref={ref} className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={colorPickerId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="flex items-center space-x-2">
          {/* Color preview button */}
          <button
            type="button"
            className={`
              w-10 h-10 border-2 rounded-md shadow-sm cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              transition-all duration-200
              ${
                hasError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
            `}
            style={{ backgroundColor: value }}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-label={`Selected color: ${value}`}
          />

          {/* Hex input */}
          {showHexInput && (
            <input
              ref={inputRef}
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              onBlur={handleHexBlur}
              className={`
                flex-1 px-3 py-2 text-sm border rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-colors duration-200 font-mono
                ${
                  hasError
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-primary focus:border-primary"
                }
                ${
                  disabled
                    ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-900"
                }
                ${className}
              `}
              placeholder="#000000"
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={
                error
                  ? `${colorPickerId}-error`
                  : helperText
                  ? `${colorPickerId}-helper`
                  : undefined
              }
            />
          )}
        </div>

        {/* Color picker dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg">
            {/* Native color input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Color
              </label>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            {/* Preset colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preset Colors
              </label>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`
                      w-8 h-8 border-2 rounded cursor-pointer
                      transition-all duration-200 hover:scale-110
                      ${
                        value === color
                          ? "border-gray-800 ring-2 ring-gray-400"
                          : "border-gray-300 hover:border-gray-500"
                      }
                    `}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p
            id={`${colorPickerId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${colorPickerId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";
