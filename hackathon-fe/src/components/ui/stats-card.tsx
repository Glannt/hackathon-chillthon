import { Card } from "@heroui/react";

import { IconSvgProps } from "@/types";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.FC<IconSvgProps>;
  color: "primary" | "success" | "info" | "warning" | "danger";
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  className,
}: StatsCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "border-l-primary text-primary";
      case "success":
        return "border-l-success text-success";
      case "info":
        return "border-l-info text-info";
      case "warning":
        return "border-l-warning text-warning";
      case "danger":
        return "border-l-danger text-danger";
      default:
        return "border-l-primary text-primary";
    }
  };

  return (
    <Card
      className={`border-l-4 shadow-sm ${getColorClasses()} ${className || ""}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wide mb-1">
              {title}
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          <div className="text-gray-300">
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </div>
    </Card>
  );
};
