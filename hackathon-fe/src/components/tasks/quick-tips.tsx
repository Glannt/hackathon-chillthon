import { Card } from "@heroui/react";

import { LightbulbIcon, CheckIcon } from "@/components/icons";

const tips = [
  "Use clear, descriptive titles",
  "Set realistic deadlines",
  "Choose appropriate priority levels",
  "Provide detailed descriptions",
  "Estimate time accurately",
];

export const QuickTips = () => {
  return (
    <Card className="mb-4">
      <div className="p-4">
        <h5 className="mb-3 font-semibold">
          <LightbulbIcon className="w-4 h-4 inline mr-2" />
          Quick Tips
        </h5>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="w-4 h-4 text-success mr-2 flex-shrink-0" />
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
