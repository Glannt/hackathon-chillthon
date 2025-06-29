import { apiClient } from "@/lib/axios";
import { CreateProjectForm, UpdateProjectForm } from "@/types/task-form";

// Types for projects
export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  taskCount: number;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  difficulty: "easy" | "medium" | "hard" | "very_hard";
  status: "todo" | "in_progress" | "review" | "done" | "cancelled";
  dueDate?: Date;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  isCompleted: boolean;
  projectId: string;
  assignedUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectsService {
  static async getAllProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>("/projects");

    return response.data;
  }

  static async getProjectById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);

    return response.data;
  }

  static async getProjectUsers(id: string): Promise<ProjectUser[]> {
    const response = await apiClient.get<ProjectUser[]>(
      `/projects/${id}/users`,
    );

    return response.data;
  }

  static async createProject(data: CreateProjectForm): Promise<Project> {
    const response = await apiClient.post<Project>("/projects", data);

    return response.data;
  }

  static async updateProject(
    id: string,
    data: UpdateProjectForm,
  ): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${id}`, data);

    return response.data;
  }

  static async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }
}

export const projectsService = new ProjectsService();
export default projectsService;
