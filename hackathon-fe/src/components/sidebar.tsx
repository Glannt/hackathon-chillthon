import { Button, Card } from "@heroui/react";

import { IconSvgProps } from "@/types";
interface SidebarItem {
  id: string;
  title: string;
  icon: React.FC<IconSvgProps>;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  className?: string;
}

export const Sidebar = ({
  items,
  title = "Navigation",
  className,
}: SidebarProps) => {
  return (
    <Card className={`p-4 ${className || ""}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <nav className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.id}
            as="a"
            className="w-full justify-start"
            href={item.href}
            variant={item.isActive ? "solid" : "ghost"}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </nav>
    </Card>
  );
};
