import { Button } from "@heroui/button";

import { IconSvgProps } from "@/types";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    icon?: React.FC<IconSvgProps>;
    onClick: () => void;
    variant?: "solid" | "bordered" | "light";
  }[];
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

export const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
}: PageHeaderProps) => {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex mb-4">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {crumb.href ? (
                  <a
                    className="text-sm font-medium text-gray-700 hover:text-primary"
                    href={crumb.href}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-gray-500">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex space-x-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "solid"}
                onClick={action.onClick}
              >
                {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
