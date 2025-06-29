import { Input } from "@heroui/input";
import { forwardRef } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      required,
      error,
      helperText,
      className,
      maxLength,
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
        <Input
          ref={ref}
          className={error ? "border-red-500" : ""}
          id={name}
          maxLength={maxLength}
          name={name}
          placeholder={placeholder}
          type={type}
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

FormField.displayName = "FormField";
