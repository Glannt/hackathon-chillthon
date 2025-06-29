interface SwitchFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
  className?: string;
}

export const SwitchField = ({
  label,
  name,
  checked,
  onChange,
  helperText,
  className,
}: SwitchFieldProps) => {
  return (
    <div className={`flex items-center space-x-3 ${className || ""}`}>
      <input
        checked={checked}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
        id={name}
        name={name}
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700" htmlFor={name}>
          {label}
        </label>
        {helperText && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    </div>
  );
};
