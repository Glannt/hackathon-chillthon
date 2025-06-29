import { Card } from "@heroui/react";

import { ProjectIcon, PlusIcon } from "@/components/icons";
import { Project } from "@/types/task-form";

interface ProjectOverviewProps {
  projects: Project[];
  onCreateProject: () => void;
}

export const ProjectOverview = ({
  projects,
  onCreateProject,
}: ProjectOverviewProps) => {
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error);

      return "Invalid date";
    }
  };

  return (
    <Card className="mb-4">
      <div className="p-4">
        <h5 className="mb-3 font-semibold">
          <ProjectIcon className="w-4 h-4 inline mr-2" />
          Project Overview
        </h5>
        {projects && projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-3 border rounded hover:bg-gray-50 transition-colors"
              >
                <h6 className="mb-1 font-medium">
                  {project.name || "Unnamed Project"}
                </h6>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {project.description.length > 50
                      ? `${project.description.substring(0, 50)}...`
                      : project.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded">
                    {project.taskCount || 0} tasks
                  </span>
                  <span
                    className={`px-2 py-1 text-white text-xs rounded ${
                      project.status === "active"
                        ? "bg-success"
                        : project.status === "completed"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                    }`}
                  >
                    {project.status || "unknown"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                  <div
                    className="bg-success h-1 rounded-full transition-all duration-300"
                    style={{ width: `${project.progressPercentage || 0}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Created: {formatDate(project.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-3">No projects available</p>
            <button
              className="inline-flex items-center px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
              onClick={onCreateProject}
            >
              <PlusIcon className="w-3 h-3 mr-1" />
              Create Project
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};
