import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Button, Pagination } from "@heroui/react";

import {
  ProjectDetail,
  ProjectStats,
  StatusStats,
  TeamMember,
  Task,
  TaskFilters,
} from "@/types/project-detail";
import {
  statusChoices,
  priorityChoices,
  sortOptions,
} from "@/data/project-detail";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectInfo } from "@/components/projects/project-info";
import { ProjectStats as ProjectStatsComponent } from "@/components/projects/project-stats";
import { ProjectProgress } from "@/components/projects/project-progress";
import { TeamMembers } from "@/components/projects/team-members";
import { TaskFilter as TaskFiltersComponent } from "@/components/projects/task-filters";
import { TaskTable } from "@/components/projects/task-table";
import { PlusIcon, TaskIcon } from "@/components/icons";
import { useProjects, useTasks } from "@/hooks/useApi";
import { apiClient } from "@/lib/axios";
import { ProjectsService } from "@/services/projects.service";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // API hooks
  const { getProjectById } = useProjects();
  const { getTasksByProject } = useTasks();

  // State for project data
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    progressPercentage: 0,
  });
  const [statusStats, setStatusStats] = useState<StatusStats>({});

  // State for filters
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    sortBy: "-created_at",
  });

  // State for AI assignment
  const [isAssigningAI, setIsAssigningAI] = useState(false);
  const [aiAssignmentResult, setAiAssignmentResult] = useState<any>(null);

  // Mock pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // Mock permissions - in real app, this would come from auth context
  const canEdit = true;

  // Load project data
  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    if (!id) return;

    try {
      // Load project details
      const projectData = await getProjectById.execute(id);

      if (projectData) {
        // Convert backend Project to frontend ProjectDetail
        const projectDetail: ProjectDetail = {
          id: projectData.id,
          name: projectData.name,
          description: projectData.description || "",
          isActive: projectData.status === "active",
          createdAt:
            typeof projectData.createdAt === "string"
              ? projectData.createdAt
              : new Date(projectData.createdAt).toISOString(),
          updatedAt:
            typeof projectData.updatedAt === "string"
              ? projectData.updatedAt
              : new Date(projectData.updatedAt).toISOString(),
          createdBy: {
            id: "1", // This would come from the backend
            fullName: "Project Creator",
            username: "creator",
          },
        };

        setProject(projectDetail);
      }

      // Load tasks for this project
      const tasksData = await getTasksByProject.execute(id);

      if (tasksData) {
        // Convert backend tasks to frontend Task format
        const convertedTasks: Task[] = tasksData.map((task: any) => ({
          id: task.id,
          title: task.name,
          description: task.description,
          status:
            (task.status as
              | "todo"
              | "in_progress"
              | "review"
              | "done"
              | "cancelled") || "todo",
          priority:
            (task.priority as "low" | "medium" | "high" | "urgent") || "medium",
          deadline: task.dueDate ? new Date(task.dueDate).toISOString() : "",
          isOverdue: task.dueDate ? new Date(task.dueDate) < new Date() : false,
          assignedTo: {
            id: task.assignedUserId || "",
            name: task.assignedUser?.name || "Unassigned",
          },
          progressPercentage: task.progress || 0,
        }));

        setTasks(convertedTasks);

        // Calculate stats
        calculateStats(convertedTasks);
      }

      // Load project users for team members
      try {
        const projectUsersData = await ProjectsService.getProjectUsers(id);

        if (projectUsersData) {
          // Convert project users to team members format
          const convertedTeamMembers: TeamMember[] = projectUsersData.map(
            (user: any) => ({
              id: user.id,
              name: user.name,
              taskCount: 0, // This would be calculated from tasks
              completedCount: 0, // This would be calculated from tasks
            }),
          );

          setTeamMembers(convertedTeamMembers);
        }
      } catch (error) {
        console.error("Error loading project users:", error);
        // Fallback to empty team members if API fails
        setTeamMembers([]);
      }
    } catch (error) {
      console.error("Error loading project data:", error);
    }
  };

  const calculateStats = (taskList: Task[]) => {
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter(
      (task) => task.status === "done",
    ).length;
    const inProgressTasks = taskList.filter(
      (task) => task.status === "in_progress",
    ).length;
    const overdueTasks = taskList.filter((task) => task.isOverdue).length;
    const progressPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setStats({
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      progressPercentage,
    });

    // Calculate status stats
    const statusCounts: { [key: string]: number } = {};

    taskList.forEach((task) => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });

    const statusStatsData: StatusStats = {};

    Object.entries(statusCounts).forEach(([status, count]) => {
      statusStatsData[status] = {
        name: status,
        count,
        percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
      };
    });

    setStatusStats(statusStatsData);
  };

  // AI Task Assignment
  const handleAssignTaskWithAI = async () => {
    if (!id) return;
    console.log(id);

    setIsAssigningAI(true);
    setAiAssignmentResult(null);

    try {
      // Step 1: Run AI analysis
      const analysisResponse = await apiClient.post(
        `/ai-task-assignment/${id}/run`,
      );

      if (analysisResponse.data && analysisResponse.data.userTaskMapping) {
        // Step 2: Apply the assignments
        const applyResponse = await apiClient.post(
          `/ai-task-assignment/${id}/apply`,
          {
            userTaskMapping: analysisResponse.data.userTaskMapping,
          },
        );

        setAiAssignmentResult({
          analysis: analysisResponse.data,
          assignments: applyResponse.data,
        });

        // Reload project data to see updated assignments
        await loadProjectData();

        console.log("AI task assignment completed successfully");
      }
    } catch (error) {
      console.error("Error in AI task assignment:", error);
      setAiAssignmentResult({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsAssigningAI(false);
    }
  };

  // Event handlers
  const handleBack = () => {
    navigate("/projects");
  };

  const handleEdit = () => {
    console.log("Edit project");
  };

  const handleAddTask = () => {
    if (id) {
      navigate(`/projects/${id}/task`);
    }
  };

  const handleDelete = () => {
    console.log("Delete project");
  };

  const handleViewTask = (taskId: string) => {
    console.log("View task:", taskId);
  };

  const handleEditTask = (taskId: string) => {
    console.log("Edit task:", taskId);
  };

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed:", page);
  };

  // Loading state
  if (getProjectById.loading || getTasksByProject.loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (getProjectById.error || getTasksByProject.error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h5 className="text-danger mb-2">Error loading project</h5>
          <p className="text-muted mb-4">
            {getProjectById.error || getTasksByProject.error}
          </p>
          <Button color="primary" onPress={loadProjectData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No project data
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h5 className="text-muted mb-2">Project not found</h5>
          <Button color="primary" onPress={handleBack}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Project Header */}
      <ProjectHeader
        canEdit={canEdit}
        project={project}
        onAddTask={handleAddTask}
        onBack={handleBack}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Project Info */}
      <ProjectInfo project={project} />

      {/* Project Statistics */}
      <ProjectStatsComponent stats={stats} />

      {/* Project Progress */}
      <ProjectProgress stats={stats} statusStats={statusStats} />

      {/* Team Members */}
      <TeamMembers members={teamMembers} />

      {/* Tasks Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center">
            <TaskIcon className="w-5 h-5 mr-2 text-gray-600" />
            <h6 className="text-gray-800 font-semibold">Project Tasks</h6>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Button
                color="secondary"
                disabled={isAssigningAI}
                isLoading={isAssigningAI}
                size="sm"
                startContent={
                  isAssigningAI ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <span className="text-lg">🤖</span>
                  )
                }
                onPress={handleAssignTaskWithAI}
              >
                {isAssigningAI ? "Assigning..." : "Assign with AI"}
              </Button>
              <Button
                color="primary"
                size="sm"
                startContent={<PlusIcon />}
                onPress={handleAddTask}
              >
                Add Task
              </Button>
            </div>
          )}
        </CardHeader>
        <CardBody>
          {/* AI Assignment Result */}
          {aiAssignmentResult && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                aiAssignmentResult.error
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              {aiAssignmentResult.error ? (
                <div className="text-red-800">
                  <h6 className="font-semibold mb-2">AI Assignment Failed</h6>
                  <p className="text-sm">{aiAssignmentResult.error}</p>
                </div>
              ) : (
                <div className="text-green-800">
                  <h6 className="font-semibold mb-2">
                    AI Assignment Successful
                  </h6>
                  <p className="text-sm">
                    {aiAssignmentResult.assignments?.filter(
                      (a: any) => a.assigned,
                    ).length || 0}{" "}
                    tasks assigned successfully
                  </p>
                  {aiAssignmentResult.assignments?.some(
                    (a: any) => !a.assigned,
                  ) && (
                    <p className="text-sm text-yellow-700 mt-1">
                      Some assignments failed. Check the console for details.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Task Filters */}
          <TaskFiltersComponent
            filters={filters}
            priorityChoices={priorityChoices}
            sortOptions={sortOptions}
            statusChoices={statusChoices}
            onFilterChange={handleFilterChange}
          />

          {/* Task Table */}
          {tasks.length > 0 ? (
            <>
              <TaskTable
                canEdit={canEdit}
                tasks={tasks}
                onEditTask={handleEditTask}
                onViewTask={handleViewTask}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    showControls
                    showShadow
                    page={currentPage}
                    total={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <TaskIcon className="w-16 h-16 text-muted mx-auto mb-4" />
              <h5 className="text-muted mb-2">No tasks found</h5>
              <p className="text-muted mb-4">
                No tasks match the current filters.
              </p>
              {canEdit && (
                <Button
                  color="primary"
                  startContent={<PlusIcon />}
                  onPress={handleAddTask}
                >
                  Create First Task
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
