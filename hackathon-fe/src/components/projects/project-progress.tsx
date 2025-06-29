import { Card, CardBody, Progress } from "@heroui/react";

import { ProjectStats, StatusStats } from "@/types/project-detail";
import { ChartLineIcon } from "@/components/icons";

interface ProjectProgressProps {
  stats: ProjectStats;
  statusStats: StatusStats;
}

export const ProjectProgress = ({
  stats,
  statusStats,
}: ProjectProgressProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "review":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardBody className="p-6">
        <div className="flex items-center mb-4">
          <ChartLineIcon className="w-5 h-5 mr-2 text-gray-600" />
          <h6 className="text-gray-800 font-semibold">Project Progress</h6>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h6 className="text-gray-800 mb-3 font-semibold">
              Overall Progress
            </h6>
            <Progress
              showValueLabel
              className="mb-3"
              color="success"
              size="lg"
              value={stats.progressPercentage}
            />
            <small className="text-muted">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </small>
          </div>

          <div>
            <h6 className="text-gray-800 mb-3 font-semibold">
              Status Distribution
            </h6>
            <div className="space-y-3">
              {Object.entries(statusStats).map(([status, stat]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.name}</span>
                  <div className="flex items-center">
                    <Progress
                      className="mr-2"
                      color={getStatusColor(status) as any}
                      size="sm"
                      style={{ width: "100px" }}
                      value={stat.percentage}
                    />
                    <small className="text-muted w-8 text-right">
                      {stat.count}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
