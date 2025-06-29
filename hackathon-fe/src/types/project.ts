export interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
    username: string;
  };
  taskCount: number;
  completedTasks: number;
  progressPercentage: number;
  status: "active" | "inactive";
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  recentProjects: number;
}

export interface ProjectFilters {
  search: string;
  status: string;
  sortBy: "created_at" | "name" | "task_count" | "progress";
}
