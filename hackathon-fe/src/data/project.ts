import { Project, ProjectStats } from "@/types/project";

export const projectStats: ProjectStats = {
  totalProjects: 12,
  activeProjects: 8,
  totalTasks: 156,
  recentProjects: 5,
};

export const projectsData: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform Redesign",
    description:
      "Complete redesign of the main e-commerce platform with modern UI/UX and improved performance.",
    isActive: true,
    createdAt: "2024-01-15",
    createdBy: {
      id: "1",
      fullName: "John Doe",
      username: "johndoe",
    },
    taskCount: 24,
    completedTasks: 18,
    progressPercentage: 75.0,
    status: "active",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description:
      "Development of a cross-platform mobile application for iOS and Android.",
    isActive: true,
    createdAt: "2024-01-20",
    createdBy: {
      id: "2",
      fullName: "Jane Smith",
      username: "janesmith",
    },
    taskCount: 32,
    completedTasks: 25,
    progressPercentage: 78.1,
    status: "active",
  },
  {
    id: "3",
    name: "Database Migration Project",
    description:
      "Migration from legacy database system to modern cloud-based solution.",
    isActive: false,
    createdAt: "2024-01-10",
    createdBy: {
      id: "3",
      fullName: "Mike Johnson",
      username: "mikejohnson",
    },
    taskCount: 15,
    completedTasks: 15,
    progressPercentage: 100.0,
    status: "inactive",
  },
  {
    id: "4",
    name: "API Integration System",
    description:
      "Integration of third-party APIs for payment processing and shipping.",
    isActive: true,
    createdAt: "2024-01-25",
    createdBy: {
      id: "1",
      fullName: "John Doe",
      username: "johndoe",
    },
    taskCount: 18,
    completedTasks: 12,
    progressPercentage: 66.7,
    status: "active",
  },
  {
    id: "5",
    name: "Security Audit Implementation",
    description:
      "Comprehensive security audit and implementation of security best practices.",
    isActive: true,
    createdAt: "2024-01-30",
    createdBy: {
      id: "4",
      fullName: "Sarah Wilson",
      username: "sarahwilson",
    },
    taskCount: 28,
    completedTasks: 20,
    progressPercentage: 71.4,
    status: "active",
  },
  {
    id: "6",
    name: "Content Management System",
    description:
      "Development of a custom CMS for managing website content and media.",
    isActive: true,
    createdAt: "2024-02-01",
    createdBy: {
      id: "2",
      fullName: "Jane Smith",
      username: "janesmith",
    },
    taskCount: 22,
    completedTasks: 16,
    progressPercentage: 72.7,
    status: "active",
  },
];
