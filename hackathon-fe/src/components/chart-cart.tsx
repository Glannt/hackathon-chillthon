import { Card } from "@heroui/react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = ({ title, children, className }: ChartCardProps) => {
  return (
    <Card className={`p-6 ${className || ""}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </Card>
  );
};
