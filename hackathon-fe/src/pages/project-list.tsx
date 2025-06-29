import { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

import { StatsCard } from "@/components/ui/stats-card";
import { FilterSection } from "@/components/ui/filter-section";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Project, ProjectFilters } from "@/types/project";
import { PageHeader } from "@/components/page-header";
import { projectsData, projectStats } from "@/data/project";
import {
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  ProjectIcon,
  TaskIcon,
} from "@/components/icons";

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: "",
    sortBy: "created_at",
  });
  const [isManager] = useState(true); // This would come from auth context

  useEffect(() => {
    // Simulate API call
    setProjects(projectsData);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        !filters.search ||
        project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesStatus =
        !filters.status || project.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "task_count":
          return b.taskCount - a.taskCount;
        case "progress":
          return b.progressPercentage - a.progressPercentage;
        case "created_at":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [projects, filters]);

  const handleViewDetails = (projectId: string) => {
    // Navigate to project detail page
    navigate(`/projects/${projectId}`);
    console.log("View project details:", projectId);
  };

  const handleAddTask = (projectId: string) => {
    // Navigate to create task page with project pre-selected
    console.log("Add task to project:", projectId);
  };

  const handleEditProject = (projectId: string) => {
    // Navigate to edit project page
    console.log("Edit project:", projectId);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      sortBy: "created_at",
    });
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageHeader
        actions={
          isManager
            ? [
                {
                  label: "Create Project",
                  icon: PlusIcon,
                  onClick: () => navigate("/projects/create"),
                  variant: "solid" as const, // Changed from "primary" to "solid"
                },
              ]
            : undefined
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        subtitle="Manage and track all your projects"
        title="Projects"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          color="primary"
          icon={ProjectIcon}
          title="Total Projects"
          value={projectStats.totalProjects}
        />
        <StatsCard
          color="success"
          icon={CheckCircleIcon}
          title="Active Projects"
          value={projectStats.activeProjects}
        />
        <StatsCard
          color="info"
          icon={TaskIcon}
          title="Total Tasks"
          value={projectStats.totalTasks}
        />
        <StatsCard
          color="warning"
          icon={ClockIcon}
          title="Recent Projects"
          value={projectStats.recentProjects}
        />
      </div>

      {/* Filters */}
      <FilterSection
        filters={filters}
        onClearFilters={handleClearFilters}
        onFiltersChange={setFilters}
      />

      {/* Projects Grid */}
      <ProjectGrid
        isManager={isManager}
        onAddTask={handleAddTask}
        onCreateProject={() => navigate("/projects/create")}
        onEditProject={handleEditProject}
        onViewDetails={handleViewDetails}
      />

      {/* Load More Button */}
      {filteredAndSortedProjects.length > 6 && (
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => console.log("Load more")}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Load More Projects
          </Button>
        </div>
      )}
    </div>
  );
}
