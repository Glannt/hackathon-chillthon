import {
  ProjectDetail,
  ProjectStats,
  StatusStats,
  TeamMember,
  Task,
  StatusChoice,
  PriorityChoice,
  SortOption,
} from "@/types/project-detail";

export const mockProjectDetail: ProjectDetail = {
  id: "1",
  name: "E-commerce Platform Development",
  description:
    "A comprehensive e-commerce platform with modern features including user authentication, product management, shopping cart, payment integration, and admin dashboard. The platform will support multiple payment gateways and provide a seamless shopping experience for customers.",
  isActive: true,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:45:00Z",
  createdBy: {
    id: "1",
    fullName: "John Smith",
    username: "johnsmith",
  },
};

export const mockProjectStats: ProjectStats = {
  totalTasks: 24,
  completedTasks: 12,
  inProgressTasks: 8,
  overdueTasks: 2,
  progressPercentage: 50.0,
};

export const mockStatusStats: StatusStats = {
  pending: {
    name: "Pending",
    count: 4,
    percentage: 16.7,
  },
  in_progress: {
    name: "In Progress",
    count: 8,
    percentage: 33.3,
  },
  review: {
    name: "Review",
    count: 2,
    percentage: 8.3,
  },
  completed: {
    name: "Completed",
    count: 12,
    percentage: 50.0,
  },
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    fullName: "John Smith",
    taskCount: 8,
    completedCount: 5,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    taskCount: 6,
    completedCount: 3,
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    fullName: "Mike Davis",
    taskCount: 5,
    completedCount: 2,
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Wilson",
    fullName: "Emily Wilson",
    taskCount: 3,
    completedCount: 1,
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    fullName: "David Brown",
    taskCount: 2,
    completedCount: 1,
  },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design User Authentication System",
    description:
      "Create a secure user authentication system with login, registration, and password reset functionality",
    status: "completed",
    priority: "high",
    deadline: "2024-01-25T23:59:59Z",
    isOverdue: false,
    assignedTo: {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      fullName: "John Smith",
    },
    progressPercentage: 100,
  },
  {
    id: "2",
    title: "Implement Product Catalog",
    description:
      "Develop the product catalog with search, filtering, and pagination features",
    status: "in_progress",
    priority: "high",
    deadline: "2024-01-30T23:59:59Z",
    isOverdue: false,
    assignedTo: {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      fullName: "Sarah Johnson",
    },
    progressPercentage: 60,
  },
  {
    id: "3",
    title: "Shopping Cart Implementation",
    description:
      "Build shopping cart functionality with add/remove items and quantity management",
    status: "in_progress",
    priority: "medium",
    deadline: "2024-01-28T23:59:59Z",
    isOverdue: true,
    assignedTo: {
      id: "3",
      firstName: "Mike",
      lastName: "Davis",
      fullName: "Mike Davis",
    },
    progressPercentage: 40,
  },
  {
    id: "4",
    title: "Payment Gateway Integration",
    description:
      "Integrate multiple payment gateways (Stripe, PayPal) for secure transactions",
    status: "pending",
    priority: "urgent",
    deadline: "2024-02-05T23:59:59Z",
    isOverdue: false,
    assignedTo: {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      fullName: "John Smith",
    },
    progressPercentage: 0,
  },
  {
    id: "5",
    title: "Admin Dashboard Development",
    description:
      "Create comprehensive admin dashboard for managing products, orders, and users",
    status: "review",
    priority: "medium",
    deadline: "2024-02-01T23:59:59Z",
    isOverdue: false,
    assignedTo: {
      id: "4",
      firstName: "Emily",
      lastName: "Wilson",
      fullName: "Emily Wilson",
    },
    progressPercentage: 90,
  },
];

export const statusChoices: StatusChoice[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

export const priorityChoices: PriorityChoice[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const sortOptions: SortOption[] = [
  { value: "-created_at", label: "Date Created" },
  { value: "title", label: "Title" },
  { value: "deadline", label: "Deadline" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
];
