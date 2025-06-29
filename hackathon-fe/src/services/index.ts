// Export all services
export {
  default as projectsService,
  type Project,
  type CreateProjectData,
  type UpdateProjectData,
} from "./projects.service";
export {
  default as usersService,
  type User,
  type CreateUserData,
  type UpdateUserData,
  type AvailableRoles,
} from "./users.service";
export {
  default as tasksService,
  type Task,
  type CreateTaskData,
  type UpdateTaskData,
  type AssignTaskData,
  type UpdateTaskStatusData,
  type UpdateTaskProgressData,
  type AvailableStatuses,
} from "./tasks.service";
export {
  default as subtasksService,
  type Subtask,
  type CreateSubtaskData,
  type UpdateSubtaskData,
  type AssignSubtaskData,
  type UpdateSubtaskStatusData,
  type UpdateSubtaskProgressData,
} from "./subtasks.service";

// Export axios instance and service class
export { default as apiService, apiClient } from "../lib/axios";
