import React from "react";

import {
  EditIcon,
  CheckIcon,
  PlusIcon,
  TimesIcon,
  EyeIcon,
  SaveIcon,
  UserIcon,
  ProjectIcon,
  TaskIcon,
  SettingsIcon,
} from "./icons";

export const IconDemo: React.FC = () => {
  const iconGroups = [
    {
      title: "Action Icons",
      icons: [
        { name: "Edit", component: EditIcon, color: "text-blue-500" },
        { name: "Check", component: CheckIcon, color: "text-green-500" },
        { name: "Plus", component: PlusIcon, color: "text-purple-500" },
        { name: "Times", component: TimesIcon, color: "text-red-500" },
        { name: "Eye", component: EyeIcon, color: "text-gray-500" },
        { name: "Save", component: SaveIcon, color: "text-indigo-500" },
      ],
    },
    {
      title: "Entity Icons",
      icons: [
        { name: "User", component: UserIcon, color: "text-blue-600" },
        { name: "Project", component: ProjectIcon, color: "text-green-600" },
        { name: "Task", component: TaskIcon, color: "text-orange-600" },
        { name: "Settings", component: SettingsIcon, color: "text-gray-600" },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Icon Library Demo</h2>

      {iconGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {group.icons.map((icon, iconIndex) => {
              const IconComponent = icon.component;

              return (
                <div
                  key={iconIndex}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`${icon.color} mb-2`}>
                    <IconComponent size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {icon.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Size Variations */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Size Variations</h3>
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <EditIcon className="text-blue-500" size={16} />
            <span className="text-xs mt-1">16px</span>
          </div>
          <div className="flex flex-col items-center">
            <EditIcon className="text-blue-500" size={24} />
            <span className="text-xs mt-1">24px</span>
          </div>
          <div className="flex flex-col items-center">
            <EditIcon className="text-blue-500" size={32} />
            <span className="text-xs mt-1">32px</span>
          </div>
          <div className="flex flex-col items-center">
            <EditIcon className="text-blue-500" size={48} />
            <span className="text-xs mt-1">48px</span>
          </div>
        </div>
      </div>

      {/* Color Variations */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Color Variations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <CheckIcon className="text-green-500" size={24} />
            <span className="text-xs mt-1 text-green-600">Success</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckIcon className="text-blue-500" size={24} />
            <span className="text-xs mt-1 text-blue-600">Info</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckIcon className="text-yellow-500" size={24} />
            <span className="text-xs mt-1 text-yellow-600">Warning</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckIcon className="text-red-500" size={24} />
            <span className="text-xs mt-1 text-red-600">Error</span>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <EditIcon size={16} />
              <span>Edit Project</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <CheckIcon size={16} />
              <span>Complete Task</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              <EyeIcon size={16} />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
