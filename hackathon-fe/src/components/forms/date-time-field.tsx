import { forwardRef } from "react";

interface DateTimeFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
}

export const DateTimeField = forwardRef<HTMLInputElement, DateTimeFieldProps>(
  (
    {
      label,
      name,
      placeholder,
      required,
      error,
      helperText,
      className,
      value,
      onChange,
      min,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`space-y-2 ${className || ""}`}>
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? "border-red-500" : ""
          }`}
          id={name}
          min={min}
          name={name}
          type="datetime-local"
          value={value}
          onChange={onChange}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

DateTimeField.displayName = "DateTimeField";
