import { Card } from "@heroui/react";

import { CheckCircleIcon, LightbulbIcon } from "@/components/icons";

const guidelines = [
  "Use clear, descriptive project names",
  "Include project objectives and scope",
  "Define key deliverables and milestones",
  "Specify team roles and responsibilities",
  "Set realistic timelines and deadlines",
  "Consider resource requirements",
];

export const ProjectGuidelines = () => {
  return (
    <Card className="bg-gray-50 border-0">
      <div className="p-4">
        <h6 className="font-semibold text-primary mb-3">
          <LightbulbIcon className="w-4 h-4 inline mr-1" />
          Project Creation Guidelines
        </h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 text-success mr-2 flex-shrink-0" />
              <span className="text-sm">{guideline}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
