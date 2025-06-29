import { Card } from "@heroui/react";

import { IconSvgProps } from "@/types";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.FC<IconSvgProps>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "success" | "warning" | "danger" | "info";
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
}: StatCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "danger":
        return "text-red-600 bg-red-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-primary bg-primary-50";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">
                from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${getColorClasses()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
