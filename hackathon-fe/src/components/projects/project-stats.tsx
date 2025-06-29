import { Card, CardBody } from "@heroui/react";

import { ProjectStats as ProjectStatsType } from "@/types/project-detail";
import {
  TaskIcon,
  CheckCircleIcon,
  SpinnerIcon,
  ExclamationTriangleIcon,
} from "@/components/icons";

interface ProjectStatsProps {
  stats: ProjectStatsType;
}

export const ProjectStats = ({ stats }: ProjectStatsProps) => {
  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: TaskIcon,
      color: "primary",
      bgColor: "bg-primary-50",
      textColor: "text-primary",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: CheckCircleIcon,
      color: "success",
      bgColor: "bg-success-50",
      textColor: "text-success",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: SpinnerIcon,
      color: "info",
      bgColor: "bg-info-50",
      textColor: "text-info",
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: ExclamationTriangleIcon,
      color: "warning",
      bgColor: "bg-warning-50",
      textColor: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index} className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  {card.title}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {card.value}
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
