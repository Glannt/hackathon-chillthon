import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/react";

import { PlusIcon, ProjectIcon } from "../icons";

import { ProjectCard } from "./project-card";

import { Project, ProjectStatus } from "@/types/task-form";
import { ProjectsService } from "@/services/projects.service";

interface ProjectGridProps {
  onViewDetails: (projectId: string) => void;
  onAddTask: (projectId: string) => void;
  onEditProject: (projectId: string) => void;
  onCreateProject: () => void;
  isManager: boolean;
}

export const ProjectGrid = ({
  onViewDetails,
  onAddTask,
  onEditProject,
  onCreateProject,
  isManager,
}: ProjectGridProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const projectsData = await ProjectsService.getAllProjects();
      // Convert API response to match our Project type
      const convertedProjects: Project[] = projectsData.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description || "",
        status: project.status as ProjectStatus,
        taskCount: project.taskCount,
        progressPercentage: project.progressPercentage,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));

      setProjects(convertedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProjects();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Spinner className="mx-auto mb-4" size="lg" />
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ProjectIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-gray-500 mb-2">Error Loading Projects</h4>
        <p className="text-gray-400 mb-4">{error}</p>
        <Button variant="solid" onPress={handleRefresh}>
          Try Again
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <ProjectIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-gray-500 mb-2">No Projects Found</h4>
        <p className="text-gray-400 mb-4">
          Get started by creating your first project.
        </p>
        {isManager && (
          <Button variant="solid" onPress={onCreateProject}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Projects ({projects.length})
        </h3>
        <Button
          isDisabled={isLoading}
          size="sm"
          variant="bordered"
          onPress={handleRefresh}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            isManager={isManager}
            project={project}
            onAddTask={onAddTask}
            onEditProject={onEditProject}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};
