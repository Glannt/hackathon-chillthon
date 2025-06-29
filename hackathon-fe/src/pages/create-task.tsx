import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { TaskForm } from "@/components/tasks/task-form";
import { TeamMembers } from "@/components/tasks/team-members";
import {
  priorityOptions,
  difficultyOptions,
  statusOptions,
} from "@/data/task-form";
import { ArrowLeftIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { QuickTips } from "@/components/tasks/quick-tips";
import { ProjectOverview } from "@/components/tasks/project-overview";
import {
  CreateTaskForm,
  User,
  Project as TaskFormProject,
} from "@/types/task-form";
import { TasksService } from "@/services/tasks.service";
import {
  ProjectsService,
  Project as ApiProject,
} from "@/services/projects.service";
import { UsersService } from "@/services/users.service";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for real data from API
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Get pre-selected project from URL params
  const preSelectedProject = searchParams.get("project");

  // Load projects and users from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      // Load projects and users in parallel
      const [projectsData, usersData] = await Promise.all([
        ProjectsService.getAllProjects(),
        UsersService.getAllUsers(),
      ]);

      // Add "Unassigned" option to users
      const unassignedUser: User = {
        id: "unassigned",
        name: "Unassigned",
        email: null,
        department: "Backend" as any,
        position: "Not Assigned",
        experience: "N/A",
        projectsDone: 0,
        avgTaskCompletion: "N/A",
        deadlineMisses: 0,
        role: "developer" as any,
        password: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setProjects(projectsData);
      setUsers([unassignedUser, ...usersData]);
    } catch (error: any) {
      console.error("Error loading data:", error);
      setError("Failed to load projects and users. Please refresh the page.");
    } finally {
      setIsDataLoading(false);
    }
  };

  // Convert API Project to TaskForm Project for ProjectOverview
  const convertProjectForOverview = (
    apiProject: ApiProject,
  ): TaskFormProject => {
    return {
      id: apiProject.id,
      name: apiProject.name,
      description: apiProject.description || "",
      status: apiProject.status as any,
      taskCount: apiProject.taskCount,
      progressPercentage: apiProject.progressPercentage,
      createdAt:
        typeof apiProject.createdAt === "string"
          ? new Date(apiProject.createdAt)
          : apiProject.createdAt,
      updatedAt:
        typeof apiProject.updatedAt === "string"
          ? new Date(apiProject.updatedAt)
          : apiProject.updatedAt,
    };
  };

  const handleSubmit = async (formData: CreateTaskForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare data for API call
      const taskData = {
        ...formData,
        // If assignedUserId is "unassigned", set it to undefined for API
        assignedUserId:
          formData.assignedUserId === "unassigned"
            ? undefined
            : formData.assignedUserId,
      };

      console.log("Creating task:", taskData);

      // Call the real API
      const createdTask = await TasksService.createTask(taskData);

      console.log("Task created successfully:", createdTask);

      // Navigate to project detail page if we have a project ID
      if (createdTask.projectId) {
        navigate(`/projects/${createdTask.projectId}`);
      } else {
        navigate("/projects");
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create task. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  const handleCreateProject = () => {
    navigate("/projects/create");
  };

  // Loading state for data
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted">Loading projects and users...</p>
        </div>
      </div>
    );
  }

  // Error state for data loading
  if (error && !projects.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <h5 className="text-danger mb-2">Error loading data</h5>
          <p className="text-muted mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={loadData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageHeader
        actions={[
          {
            label: "Back to Projects",
            icon: ArrowLeftIcon,
            onClick: handleCancel,
            variant: "bordered" as const,
          },
        ]}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "Create Task" },
        ]}
        subtitle="Create and assign a new task to team members"
        title="Create New Task"
      />

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <TaskForm
            difficultyOptions={difficultyOptions}
            initialData={
              preSelectedProject ? { projectId: preSelectedProject } : undefined
            }
            isLoading={isLoading}
            priorityOptions={priorityOptions}
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
            statusOptions={statusOptions}
            users={users.map((u) => ({
              id: u.id,
              name: u.name,
              role: u.role,
              department: u.department,
            }))}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <QuickTips />
          <ProjectOverview
            projects={projects.map(convertProjectForOverview)}
            onCreateProject={handleCreateProject}
          />
          <TeamMembers users={users} />
        </div>
      </div>
    </div>
  );
}
