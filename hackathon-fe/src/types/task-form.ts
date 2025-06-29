// Enums matching backend entities
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  DEVELOPER = "developer",
  QA = "qa",
  DEVOPS = "devops",
}

export enum Department {
  BACKEND = "Backend",
  FRONTEND = "Frontend",
  MOBILE = "Mobile",
  AI = "AI",
  DEVOPS = "DevOps",
  TESTER = "Tester",
}

export enum ProjectStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TaskDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  VERY_HARD = "very_hard",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  DONE = "done",
  CANCELLED = "cancelled",
}

export enum SubtaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

// Entity interfaces matching backend exactly
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  taskCount: number;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface User {
  id: string;
  name: string;
  department: Department;
  position: string;
  experience: string;
  projectsDone: number;
  avgTaskCompletion: string;
  deadlineMisses: number;
  role: UserRole;
  email: string | null;
  password: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface Task {
  id: string;
  name: string;
  description: string | null;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  dueDate: Date | null;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  project?: Project;
  assignedUserId: string | null;
  assignedUser?: User;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  name: string;
  description: string | null;
  status: SubtaskStatus;
  isCompleted: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
  task?: Task;
}

// Form interfaces
export interface CreateTaskForm {
  name: string;
  description: string;
  projectId: string;
  assignedUserId?: string;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
  estimatedHours?: number;
}

export interface UpdateTaskForm {
  name?: string;
  description?: string;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
  status?: TaskStatus;
  projectId?: string;
  assignedUserId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  isCompleted?: boolean;
}

export interface CreateProjectForm {
  name: string;
  description: string;
  status?: ProjectStatus;
}

export interface UpdateProjectForm {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface CreateUserForm {
  name: string;
  department: Department;
  position: string;
  experience: string;
  role: UserRole;
  email?: string;
  password?: string;
}

export interface UpdateUserForm {
  name?: string;
  department?: Department;
  position?: string;
  experience?: string;
  role?: UserRole;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export interface CreateSubtaskForm {
  name: string;
  description?: string;
  taskId: string;
  order?: number;
}

export interface UpdateSubtaskForm {
  name?: string;
  description?: string;
  status?: SubtaskStatus;
  isCompleted?: boolean;
  order?: number;
}

// Validation interfaces
export interface TaskFormValidation {
  name: string;
  description: string;
  priority: string;
  difficulty: string;
  projectId: string;
}

export interface ProjectFormValidation {
  name: string;
  description: string;
  status: string;
}

export interface UserFormValidation {
  name: string;
  department: string;
  position: string;
  experience: string;
  role: string;
  email: string;
}

export interface SubtaskFormValidation {
  name: string;
  description: string;
  taskId: string;
}

// Option interfaces for form selects
export interface PriorityOption {
  value: TaskPriority;
  label: string;
  description?: string;
}

export interface DifficultyOption {
  value: TaskDifficulty;
  label: string;
  description?: string;
}

export interface StatusOption {
  value: TaskStatus;
  label: string;
  description?: string;
}

export interface SubtaskStatusOption {
  value: SubtaskStatus;
  label: string;
  description?: string;
}

export interface ProjectStatusOption {
  value: ProjectStatus;
  label: string;
  description?: string;
}

export interface WorkloadOption {
  value: "Small" | "Medium" | "Large";
  label: string;
  description?: string;
}

export interface TaskTypeOption {
  value: string;
  label: string;
  description?: string;
}

export interface SkillOption {
  value: string;
  label: string;
  category?: string;
}

export interface RoleOption {
  value: UserRole;
  label: string;
  description?: string;
}

export interface DepartmentOption {
  value: Department;
  label: string;
  description?: string;
}
