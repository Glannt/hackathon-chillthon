import { useState, useCallback } from "react";

import { ProjectsService } from "../services/projects.service";
import { UsersService } from "../services/users.service";
import { TasksService } from "../services/tasks.service";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);

        setState({ data: result, loading: false, error: null });

        return result;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";

        setState({ data: null, loading: false, error: errorMessage });

        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for each service
export function useProjects() {
  return {
    getAllProjects: useApi(ProjectsService.getAllProjects),
    getProjectById: useApi(ProjectsService.getProjectById),
    createProject: useApi(ProjectsService.createProject),
    updateProject: useApi(ProjectsService.updateProject),
    deleteProject: useApi(ProjectsService.deleteProject),
  };
}

export function useUsers() {
  return {
    getAllUsers: useApi(UsersService.getAllUsers),
    getUsersByRole: useApi(UsersService.getUsersByRole),
    getUsersByDepartment: useApi(UsersService.getUsersByDepartment),
    getUserById: useApi(UsersService.getUserById),
    createUser: useApi(UsersService.createUser),
    updateUser: useApi(UsersService.updateUser),
    deleteUser: useApi(UsersService.deleteUser),
    seedUsers: useApi(UsersService.seedUsers),
    getAvailableRoles: useApi(UsersService.getAvailableRoles),
  };
}

export function useTasks() {
  return {
    getAllTasks: useApi(TasksService.getAllTasks),
    getTasksByStatus: useApi(TasksService.getTasksByStatus),
    getTasksByPriority: useApi(TasksService.getTasksByPriority),
    getTasksByProject: useApi(TasksService.getTasksByProject),
    getTasksByUser: useApi(TasksService.getTasksByUser),
    getTaskById: useApi(TasksService.getTaskById),
    createTask: useApi(TasksService.createTask),
    updateTask: useApi(TasksService.updateTask),
    deleteTask: useApi(TasksService.deleteTask),
    assignTaskToUser: useApi(TasksService.assignTaskToUser),
    updateTaskStatus: useApi(TasksService.updateTaskStatus),
    updateTaskProgress: useApi(TasksService.updateTaskProgress),
    getAvailableStatuses: useApi(TasksService.getAvailableStatuses),
  };
}
