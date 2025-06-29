import apiService from "@/lib/axios";
import { Task, CreateTaskForm, UpdateTaskForm } from "@/types/task-form";

export interface AssignTaskData {
  userId: string;
}

export interface UpdateTaskStatusData {
  status: string;
}

export interface UpdateTaskProgressData {
  progress: number;
}

export interface AvailableStatuses {
  statuses: string[];
  priorities: string[];
}

export class TasksService {
  static async getAllTasks(): Promise<Task[]> {
    const response = await apiService.get<Task[]>("/tasks");

    return response;
  }

  static async getTaskById(id: string): Promise<Task> {
    const response = await apiService.get<Task>(`/tasks/${id}`);

    return response;
  }

  static async createTask(data: CreateTaskForm): Promise<Task> {
    const response = await apiService.post<Task>("/tasks", data);

    return response;
  }

  static async updateTask(id: string, data: UpdateTaskForm): Promise<Task> {
    const response = await apiService.patch<Task>(`/tasks/${id}`, data);

    return response;
  }

  static async deleteTask(id: string): Promise<void> {
    await apiService.delete<void>(`/tasks/${id}`);
  }

  // Get tasks by project
  static async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await apiService.get<Task[]>(
      `/tasks?projectId=${projectId}`,
    );

    return response;
  }

  // Get tasks by user
  static async getTasksByUser(userId: string): Promise<Task[]> {
    const response = await apiService.get<Task[]>(
      `/tasks?assignedUserId=${userId}`,
    );

    return response;
  }

  // Get tasks by status
  static async getTasksByStatus(status: string): Promise<Task[]> {
    const response = await apiService.get<Task[]>(`/tasks?status=${status}`);

    return response;
  }

  // Seed tasks data
  static async seedTasks(): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>("/tasks/seed");

    return response;
  }

  // Get tasks by priority
  static async getTasksByPriority(priority: string): Promise<Task[]> {
    const response = await apiService.get<Task[]>(
      `/tasks?priority=${priority}`,
    );

    return response;
  }

  // Get available statuses and priorities
  static async getAvailableStatuses(): Promise<AvailableStatuses> {
    const response = await apiService.get<AvailableStatuses>(
      "/tasks/statuses/available",
    );

    return response;
  }

  // Assign task to user
  static async assignTaskToUser(
    taskId: string,
    data: AssignTaskData,
  ): Promise<Task> {
    const response = await apiService.put<Task>(
      `/tasks/${taskId}/assign`,
      data,
    );

    return response;
  }

  // Update task status
  static async updateTaskStatus(
    taskId: string,
    data: UpdateTaskStatusData,
  ): Promise<Task> {
    const response = await apiService.put<Task>(
      `/tasks/${taskId}/status`,
      data,
    );

    return response;
  }

  // Update task progress
  static async updateTaskProgress(
    taskId: string,
    data: UpdateTaskProgressData,
  ): Promise<Task> {
    const response = await apiService.put<Task>(
      `/tasks/${taskId}/progress`,
      data,
    );

    return response;
  }
}

export const tasksService = new TasksService();
export default tasksService;
