import { forwardRef } from "react";

interface TextareaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      name,
      placeholder,
      required,
      error,
      helperText,
      className,
      rows = 4,
      maxLength,
      showCharCount = false,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const charCount = value?.length || 0;

    return (
      <div className={`space-y-2 ${className || ""}`}>
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? "border-red-500" : ""
          }`}
          id={name}
          maxLength={maxLength}
          name={name}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
        {showCharCount && maxLength && (
          <div className="text-right">
            <small
              className={`text-sm ${charCount > maxLength * 0.9 ? "text-warning" : "text-gray-500"}`}
            >
              {charCount}/{maxLength} characters
            </small>
          </div>
        )}
      </div>
    );
  },
);

TextareaField.displayName = "TextareaField";
