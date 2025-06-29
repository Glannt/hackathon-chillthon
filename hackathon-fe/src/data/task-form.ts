import {
  Project,
  User,
  PriorityOption,
  DifficultyOption,
  StatusOption,
  SubtaskStatusOption,
  ProjectStatusOption,
  WorkloadOption,
  TaskTypeOption,
  SkillOption,
  RoleOption,
  DepartmentOption,
  TaskPriority,
  TaskDifficulty,
  TaskStatus,
  SubtaskStatus,
  ProjectStatus,
  UserRole,
  Department,
} from "@/types/task-form";

export const priorityOptions: PriorityOption[] = [
  { value: TaskPriority.LOW, label: "Low", description: "Low priority tasks" },
  {
    value: TaskPriority.MEDIUM,
    label: "Medium",
    description: "Normal priority tasks",
  },
  {
    value: TaskPriority.HIGH,
    label: "High",
    description: "High priority tasks",
  },
  {
    value: TaskPriority.URGENT,
    label: "Urgent",
    description: "Critical priority tasks",
  },
];

export const difficultyOptions: DifficultyOption[] = [
  {
    value: TaskDifficulty.EASY,
    label: "Easy",
    description: "Simple tasks that can be completed quickly",
  },
  {
    value: TaskDifficulty.MEDIUM,
    label: "Medium",
    description: "Moderate complexity tasks",
  },
  {
    value: TaskDifficulty.HARD,
    label: "Hard",
    description: "Complex tasks requiring significant effort",
  },
  {
    value: TaskDifficulty.VERY_HARD,
    label: "Very Hard",
    description: "Extremely complex tasks",
  },
];

export const statusOptions: StatusOption[] = [
  {
    value: TaskStatus.TODO,
    label: "To Do",
    description: "Task not started yet",
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: "In Progress",
    description: "Task currently being worked on",
  },
  {
    value: TaskStatus.REVIEW,
    label: "Review",
    description: "Task completed, waiting for review",
  },
  {
    value: TaskStatus.DONE,
    label: "Done",
    description: "Task completed and approved",
  },
  {
    value: TaskStatus.CANCELLED,
    label: "Cancelled",
    description: "Task cancelled",
  },
];

export const subtaskStatusOptions: SubtaskStatusOption[] = [
  {
    value: SubtaskStatus.TODO,
    label: "To Do",
    description: "Subtask not started yet",
  },
  {
    value: SubtaskStatus.IN_PROGRESS,
    label: "In Progress",
    description: "Subtask currently being worked on",
  },
  {
    value: SubtaskStatus.DONE,
    label: "Done",
    description: "Subtask completed",
  },
];

export const projectStatusOptions: ProjectStatusOption[] = [
  {
    value: ProjectStatus.ACTIVE,
    label: "Active",
    description: "Project is currently active and being worked on",
  },
  {
    value: ProjectStatus.INACTIVE,
    label: "Inactive",
    description: "Project is temporarily paused",
  },
  {
    value: ProjectStatus.COMPLETED,
    label: "Completed",
    description: "Project has been completed successfully",
  },
  {
    value: ProjectStatus.CANCELLED,
    label: "Cancelled",
    description: "Project has been cancelled",
  },
];

export const workloadOptions: WorkloadOption[] = [
  { value: "Small", label: "Small", description: "1-4 hours" },
  { value: "Medium", label: "Medium", description: "4-16 hours" },
  { value: "Large", label: "Large", description: "16+ hours" },
];

export const taskTypeOptions: TaskTypeOption[] = [
  { value: "Low", label: "Low Complexity", description: "Simple tasks" },
  {
    value: "Medium",
    label: "Medium Complexity",
    description: "Moderate tasks",
  },
  { value: "High", label: "High Complexity", description: "Complex tasks" },
];

export const roleOptions: RoleOption[] = [
  {
    value: UserRole.ADMIN,
    label: "Admin",
    description: "System administrator",
  },
  { value: UserRole.MANAGER, label: "Manager", description: "Project manager" },
  {
    value: UserRole.DEVELOPER,
    label: "Developer",
    description: "Software developer",
  },
  {
    value: UserRole.QA,
    label: "QA",
    description: "Quality assurance engineer",
  },
  { value: UserRole.DEVOPS, label: "DevOps", description: "DevOps engineer" },
];

export const departmentOptions: DepartmentOption[] = [
  {
    value: Department.BACKEND,
    label: "Backend",
    description: "Backend development team",
  },
  {
    value: Department.FRONTEND,
    label: "Frontend",
    description: "Frontend development team",
  },
  {
    value: Department.MOBILE,
    label: "Mobile",
    description: "Mobile development team",
  },
  {
    value: Department.AI,
    label: "AI",
    description: "Artificial Intelligence team",
  },
  { value: Department.DEVOPS, label: "DevOps", description: "DevOps team" },
  { value: Department.TESTER, label: "Tester", description: "Testing team" },
];

export const skillOptions: SkillOption[] = [
  // Backend Skills
  {
    value: "Backend (NodeJS, Python, Java...)",
    label: "Backend Development",
    category: "Backend",
  },
  {
    value: "SQL, Database Design",
    label: "Database Design",
    category: "Backend",
  },
  {
    value: "REST/GraphQL, API Design",
    label: "API Design",
    category: "Backend",
  },
  {
    value: "Authentication (JWT, OAuth2)",
    label: "Authentication",
    category: "Backend",
  },
  {
    value: "Security (JWT, OAuth2), Encryption",
    label: "Security",
    category: "Backend",
  },
  {
    value: "AWS/Azure/Cloud Storage",
    label: "Cloud Storage",
    category: "Backend",
  },
  {
    value: "Video Streaming (CDN, Server), AWS/Azure",
    label: "Video Streaming",
    category: "Backend",
  },
  { value: "Algorithm", label: "Algorithms", category: "Backend" },
  {
    value: "Machine Learning (Optional), Algorithm",
    label: "Machine Learning",
    category: "Backend",
  },
  { value: "OAuth 2.0", label: "OAuth 2.0", category: "Backend" },
  {
    value: "Performance Testing, Backend, Video Optimization",
    label: "Performance Testing",
    category: "Backend",
  },
  {
    value: "AWS/Azure/VPS, Server Management, DevOps",
    label: "DevOps",
    category: "Backend",
  },
  {
    value: "Monitoring, Logging, DevOps",
    label: "Monitoring",
    category: "Backend",
  },

  // Frontend Skills
  {
    value: "ReactJS/VueJS/Angular, HTML/CSS/JS",
    label: "Frontend Development",
    category: "Frontend",
  },
  { value: "UX/UI Design", label: "UX/UI Design", category: "Frontend" },
  {
    value: "UX/UI Design, Figma/Sketch",
    label: "Design Tools",
    category: "Frontend",
  },
  {
    value: "Video Player Integration",
    label: "Video Player",
    category: "Frontend",
  },
  { value: "API Integration", label: "API Integration", category: "Frontend" },
  {
    value: "CSS, Responsive Design",
    label: "Responsive Design",
    category: "Frontend",
  },
  { value: "Ad Integration", label: "Ad Integration", category: "Frontend" },

  // General Skills
  {
    value: "Phân tích yêu cầu, Communication",
    label: "Requirements Analysis",
    category: "General",
  },
  {
    value: "Product Management, Phân tích yêu cầu",
    label: "Product Management",
    category: "General",
  },
  {
    value: "Testing, Manual Testing, Automation Testing",
    label: "Testing",
    category: "General",
  },
  { value: "SEO, Frontend", label: "SEO", category: "General" },
  {
    value: "Server Management, DevOps",
    label: "Server Management",
    category: "General",
  },
];

export const projectsData: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform Redesign",
    description:
      "Complete redesign of the main e-commerce platform with modern UI/UX and improved performance.",
    status: ProjectStatus.ACTIVE,
    taskCount: 24,
    progressPercentage: 75.0,
    createdAt: new Date("2024-01-15T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
  {
    id: "2",
    name: "Mobile App Development",
    description:
      "Development of a cross-platform mobile application for iOS and Android.",
    status: ProjectStatus.ACTIVE,
    taskCount: 32,
    progressPercentage: 78.1,
    createdAt: new Date("2024-02-01T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
  {
    id: "3",
    name: "Database Migration Project",
    description:
      "Migration from legacy database system to modern cloud-based solution.",
    status: ProjectStatus.COMPLETED,
    taskCount: 15,
    progressPercentage: 100.0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-12-01T00:00:00Z"),
  },
  {
    id: "4",
    name: "API Integration System",
    description:
      "Integration of third-party APIs for enhanced functionality and data synchronization.",
    status: ProjectStatus.ACTIVE,
    taskCount: 8,
    progressPercentage: 25.0,
    createdAt: new Date("2024-12-01T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
];

export const usersData: User[] = [
  {
    id: "unassigned",
    name: "Unassigned",
    email: null,
    department: Department.BACKEND,
    position: "Not Assigned",
    experience: "N/A",
    projectsDone: 0,
    avgTaskCompletion: "N/A",
    deadlineMisses: 0,
    role: UserRole.DEVELOPER,
    password: null,
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    department: Department.BACKEND,
    position: "Senior Backend Developer",
    experience: "5 years",
    projectsDone: 12,
    avgTaskCompletion: "85%",
    deadlineMisses: 2,
    role: UserRole.DEVELOPER,
    password: null,
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: Department.FRONTEND,
    position: "UI/UX Designer",
    experience: "3 years",
    projectsDone: 8,
    avgTaskCompletion: "92%",
    deadlineMisses: 1,
    role: UserRole.DEVELOPER,
    password: null,
    isActive: true,
    createdAt: new Date("2024-02-01T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    department: Department.BACKEND,
    position: "Project Manager",
    experience: "7 years",
    projectsDone: 20,
    avgTaskCompletion: "88%",
    deadlineMisses: 3,
    role: UserRole.MANAGER,
    password: null,
    isActive: true,
    createdAt: new Date("2023-06-01T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    department: Department.TESTER,
    position: "QA Engineer",
    experience: "4 years",
    projectsDone: 15,
    avgTaskCompletion: "90%",
    deadlineMisses: 2,
    role: UserRole.QA,
    password: null,
    isActive: true,
    createdAt: new Date("2023-09-01T00:00:00Z"),
    updatedAt: new Date("2024-12-19T00:00:00Z"),
  },
];
