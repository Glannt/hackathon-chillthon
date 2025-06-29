import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      name,
      options,
      placeholder,
      required,
      error,
      helperText,
      className,
      value,
      onChange,
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
        <select
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? "border-red-500" : ""
          }`}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        >
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
