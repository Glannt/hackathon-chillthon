import { Card } from "@heroui/react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({
  title,
  description,
  children,
  className,
}: FormSectionProps) => {
  return (
    <Card className={`p-6 ${className || ""}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
};
