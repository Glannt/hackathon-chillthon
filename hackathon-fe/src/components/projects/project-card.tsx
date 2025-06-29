import { Button, Card } from "@heroui/react";

import {
  ProjectIcon,
  CalendarIcon,
  EyeIcon,
  PlusIcon,
  CheckCircleIcon,
  PauseCircleIcon,
} from "../icons";

import { Project, ProjectStatus } from "@/types/task-form";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
  onAddTask: (projectId: string) => void;
  onEditProject: (projectId: string) => void;
  isManager: boolean;
}

export const ProjectCard = ({
  project,
  onViewDetails,
  onAddTask,
  onEditProject,
  isManager,
}: ProjectCardProps) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return "bg-success text-white";
      case ProjectStatus.COMPLETED:
        return "bg-blue-500 text-white";
      case ProjectStatus.INACTIVE:
        return "bg-gray-500 text-white";
      case ProjectStatus.CANCELLED:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return <CheckCircleIcon className="w-3 h-3 inline mr-1" />;
      case ProjectStatus.COMPLETED:
        return <CheckCircleIcon className="w-3 h-3 inline mr-1" />;
      case ProjectStatus.INACTIVE:
        return <PauseCircleIcon className="w-3 h-3 inline mr-1" />;
      case ProjectStatus.CANCELLED:
        return <PauseCircleIcon className="w-3 h-3 inline mr-1" />;
      default:
        return <PauseCircleIcon className="w-3 h-3 inline mr-1" />;
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return "Active";
      case ProjectStatus.COMPLETED:
        return "Completed";
      case ProjectStatus.INACTIVE:
        return "Inactive";
      case ProjectStatus.CANCELLED:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="h-full shadow-sm border-0">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h5 className="mb-1 truncate">
              <ProjectIcon className="w-4 h-4 inline mr-2" />
              {project.name}
            </h5>
            <small className="opacity-75">
              <CalendarIcon className="w-3 h-3 inline mr-1" />
              Created{" "}
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </small>
          </div>
          <div className="dropdown">
            <Button className="text-white" size="sm" variant="ghost">
              <i className="fas fa-ellipsis-v" />
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`${getStatusColor(project.status)} px-2 py-1 rounded-full text-xs`}
          >
            {getStatusIcon(project.status)}
            {getStatusLabel(project.status)}
          </span>
        </div>
      </div>

      {/* Project Body */}
      <div className="p-4 flex flex-col h-full">
        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {project.description || (
              <em className="text-gray-400">No description provided</em>
            )}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Progress</span>
            <span className="text-sm text-gray-500">
              {project.progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div className="border-r">
            <div className="text-lg font-semibold text-primary">
              {project.taskCount}
            </div>
            <small className="text-gray-500">Total Tasks</small>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {project.progressPercentage.toFixed(0)}%
            </div>
            <small className="text-gray-500">Complete</small>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-auto mb-4">
          <small className="text-gray-500">
            <CalendarIcon className="w-3 h-3 inline mr-1" />
            Updated{" "}
            {new Date(project.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </small>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(project.id)}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            View Details
          </Button>
          {isManager && (
            <Button
              size="sm"
              variant="shadow"
              onClick={() => onAddTask(project.id)}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
