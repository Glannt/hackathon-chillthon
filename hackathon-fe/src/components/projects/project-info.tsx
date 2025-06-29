import { Card, CardBody, Badge } from "@heroui/react";

import { ProjectDetail } from "@/types/project-detail";

interface ProjectInfoProps {
  project: ProjectDetail;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  return (
    <Card className="shadow-sm">
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h5 className="text-gray-800 mb-3 font-semibold">Description</h5>
            <p className="text-muted">
              {project.description || <em>No description provided.</em>}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">
                Status:
              </span>
              <Badge
                color={project.isActive ? "success" : "default"}
                variant="flat"
              >
                {project.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">
                Last Updated:
              </span>
              <span className="text-sm text-muted">
                {new Date(project.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
