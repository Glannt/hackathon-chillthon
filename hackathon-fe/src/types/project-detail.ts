export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    fullName: string;
    username: string;
  };
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  progressPercentage: number;
}

export interface StatusStats {
  [key: string]: {
    name: string;
    count: number;
    percentage: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  taskCount: number;
  completedCount: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  deadline: string;
  isOverdue: boolean;
  assignedTo: {
    id: string;
    name: string;
  };
  progressPercentage: number;
}

export interface TaskFilters {
  status: string;
  priority: string;
  sortBy: string;
}

export interface StatusChoice {
  value: string;
  label: string;
}

export interface PriorityChoice {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
}
