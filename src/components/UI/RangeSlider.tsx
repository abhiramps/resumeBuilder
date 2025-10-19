import React, { forwardRef } from "react";

/**
 * RangeSlider component props interface
 */
export interface RangeSliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label text for the slider */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the slider */
  helperText?: string;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number;
  /** Unit to display with the value */
  unit?: string;
  /** Whether to show the current value */
  showValue?: boolean;
  /** Custom value formatter */
  formatValue?: (value: number) => string;
  /** Whether the slider is required */
  required?: boolean;
  /** Custom class name for the slider */
  className?: string;
  /** Custom class name for the container */
  containerClassName?: string;
}

/**
 * Reusable RangeSlider component with value display and unit support
 *
 * @example
 * ```tsx
 * <RangeSlider
 *   label="Font Size"
 *   min={8}
 *   max={24}
 *   step={1}
 *   value={fontSize}
 *   onChange={(e) => setFontSize(Number(e.target.value))}
 *   unit="px"
 *   showValue
 * />
 * ```
 */
export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  (
    {
      label,
      error,
      helperText,
      min = 0,
      max = 100,
      step = 1,
      unit = "",
      showValue = true,
      formatValue,
      required,
      className = "",
      containerClassName = "",
      value,
      id,
      ...props
    },
    ref
  ) => {
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const currentValue = Number(value) || min;

    // Format the display value
    const formatDisplayValue = (val: number) => {
      if (formatValue) {
        return formatValue(val);
      }
      return `${val}${unit}`;
    };

    // Calculate percentage for the track fill
    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={sliderId}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {showValue && (
            <span className="text-sm font-medium text-gray-900 min-w-[60px] text-right">
              {formatDisplayValue(currentValue)}
            </span>
          )}
        </div>

        <div className="relative">
          <input
            ref={ref}
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            className={`
              w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              transition-all duration-200
              ${hasError ? "focus:ring-red-500" : "focus:ring-primary"}
              ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${className}
            `}
            style={{
              background: `linear-gradient(to right, ${hasError ? "#ef4444" : "#3b82f6"
                } 0%, ${hasError ? "#ef4444" : "#3b82f6"
                } ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            }}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${sliderId}-error`
                : helperText
                  ? `${sliderId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Custom slider thumb styling */}
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: ${hasError ? "#ef4444" : "#3b82f6"};
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              transition: all 0.2s ease;
            }

            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            input[type="range"]::-webkit-slider-thumb:active {
              transform: scale(1.05);
            }

            input[type="range"]::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: ${hasError ? "#ef4444" : "#3b82f6"};
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              transition: all 0.2s ease;
            }

            input[type="range"]::-moz-range-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            input[type="range"]::-moz-range-track {
              height: 8px;
              border-radius: 4px;
              background: transparent;
            }
          `}</style>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatDisplayValue(min)}</span>
          <span>{formatDisplayValue(max)}</span>
        </div>

        {error && (
          <p
            id={`${sliderId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${sliderId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

RangeSlider.displayName = "RangeSlider";
