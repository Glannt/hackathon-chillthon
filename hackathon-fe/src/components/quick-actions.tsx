import { Button, Card } from "@heroui/react";

import { IconSvgProps } from "@/types";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.FC<IconSvgProps>;
  href: string;
  color?: "primary" | "success" | "warning" | "danger" | "info";
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export const QuickActions = ({
  actions,
  title = "Quick Actions",
}: QuickActionsProps) => {
  const getColorClasses = (color: QuickAction["color"]) => {
    switch (color) {
      case "success":
        return "text-green-600 bg-green-50 hover:bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-50 hover:bg-yellow-100";
      case "danger":
        return "text-red-600 bg-red-50 hover:bg-red-100";
      case "info":
        return "text-blue-600 bg-blue-50 hover:bg-blue-100";
      default:
        return "text-primary bg-primary-50 hover:bg-primary-100";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.id}
            as="a"
            className={`h-auto p-4 flex flex-col items-center space-y-2 ${getColorClasses(action.color)}`}
            href={action.href}
            variant="ghost"
          >
            <action.icon className="w-6 h-6" />
            <div className="text-center">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs opacity-75">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};
