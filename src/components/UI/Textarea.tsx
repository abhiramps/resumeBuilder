import React, { forwardRef, useEffect, useRef } from "react";

/**
 * Textarea component props interface
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text for the textarea */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the textarea */
  helperText?: string;
  /** Whether the textarea should auto-resize */
  autoResize?: boolean;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Whether the textarea is required */
  required?: boolean;
  /** Custom class name for the textarea */
  className?: string;
  /** Custom class name for the container */
  containerClassName?: string;
}

/**
 * Reusable Textarea component with auto-resize, character count, and validation
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   autoResize
 *   maxLength={500}
 *   showCharCount
 *   placeholder="Enter your description..."
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      autoResize = false,
      maxLength,
      showCharCount = false,
      required,
      className = "",
      containerClassName = "",
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasError = !!error;

    // Combine refs
    const combinedRef = (node: HTMLTextAreaElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && node) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
      if (node) {
        (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    };

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const currentLength = typeof value === "string" ? value.length : 0;
    const isOverLimit = maxLength ? currentLength > maxLength : false;

    return (
      <div className={`space-y-1 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={combinedRef}
            id={textareaId}
            className={`
              block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-colors duration-200 resize-none
              ${hasError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-primary focus:border-primary"
              }
              ${props.disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-900"
              }
              ${autoResize ? "overflow-hidden" : ""}
              ${className}
            `}
            aria-invalid={hasError || isOverLimit}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : helperText
                  ? `${textareaId}-helper`
                  : showCharCount
                    ? `${textareaId}-count`
                    : undefined
            }
            value={value}
            {...props}
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p
                id={`${textareaId}-error`}
                className="text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}

            {helperText && !error && (
              <p id={`${textareaId}-helper`} className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>

          {showCharCount && maxLength && (
            <p
              id={`${textareaId}-count`}
              className={`text-xs ${isOverLimit ? "text-red-600" : "text-gray-500"
                }`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
