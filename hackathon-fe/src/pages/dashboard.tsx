import { useState, useEffect } from "react";

import {
  UsersIcon,
  TaskIcon,
  ProjectIcon,
  ClockIcon,
  ChartIcon,
  SettingsIcon,
  BellIcon,
  UserIcon,
} from "@/components/icons";
import { StatCard } from "@/components/stat-card";
import { Sidebar } from "@/components/sidebar";
import { PageHeader } from "@/components/page-header";
import { ChartCard } from "@/components/chart-cart";
import { QuickActions } from "@/components/quick-actions";
import { ActivityFeed } from "@/components/activity-feed";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalProjects: number;
  activeProjects: number;
  attendanceRate: number;
  productivityScore: number;
}

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "task" | "project" | "attendance" | "system";
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
    attendanceRate: 0,
    productivityScore: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Simulate API call
    setStats({
      totalUsers: 156,
      activeUsers: 89,
      totalTasks: 342,
      completedTasks: 289,
      totalProjects: 12,
      activeProjects: 8,
      attendanceRate: 94.2,
      productivityScore: 87.5,
    });

    setActivities([
      {
        id: "1",
        user: { name: "John Doe", avatar: "/avatars/john.jpg" },
        action: "completed task",
        target: "Design System Update",
        timestamp: "2 minutes ago",
        type: "task",
      },
      {
        id: "2",
        user: { name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        action: "started project",
        target: "Mobile App Redesign",
        timestamp: "15 minutes ago",
        type: "project",
      },
      {
        id: "3",
        user: { name: "Mike Johnson" },
        action: "checked in",
        target: "Office",
        timestamp: "1 hour ago",
        type: "attendance",
      },
    ]);
  }, []);

  const sidebarItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: ChartIcon,
      href: "/dashboard",
      isActive: true,
    },
    { id: "users", title: "Users", icon: UsersIcon, href: "/users" },
    { id: "tasks", title: "Tasks", icon: TaskIcon, href: "/tasks", badge: 5 },
    { id: "projects", title: "Projects", icon: ProjectIcon, href: "/projects" },
    {
      id: "attendance",
      title: "Attendance",
      icon: ClockIcon,
      href: "/attendance",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: BellIcon,
      href: "/notifications",
      badge: 3,
    },
    {
      id: "settings",
      title: "Settings",
      icon: SettingsIcon,
      href: "/settings",
    },
  ];

  const quickActions = [
    {
      id: "create-task",
      title: "Create Task",
      description: "Add new task",
      icon: TaskIcon,
      href: "/tasks/create",
      color: "primary" as const,
    },
    {
      id: "create-project",
      title: "Create Project",
      description: "Start new project",
      icon: ProjectIcon,
      href: "/projects/create",
      color: "success" as const,
    },
    {
      id: "add-user",
      title: "Add User",
      description: "Invite team member",
      icon: UserIcon,
      href: "/users/create",
      color: "info" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 p-6">
          <Sidebar items={sidebarItems} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <PageHeader
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
            subtitle="Welcome back! Here's what's happening with your projects today."
            title="Dashboard"
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              color="primary"
              icon={UsersIcon}
              title="Total Users"
              trend={{ value: 12, isPositive: true }}
              value={stats.totalUsers}
            />
            <StatCard
              color="success"
              icon={UsersIcon}
              title="Active Users"
              trend={{ value: 8, isPositive: true }}
              value={stats.activeUsers}
            />
            <StatCard
              color="info"
              icon={TaskIcon}
              title="Total Tasks"
              trend={{ value: 5, isPositive: false }}
              value={stats.totalTasks}
            />
            <StatCard
              color="success"
              icon={TaskIcon}
              title="Completed Tasks"
              trend={{ value: 15, isPositive: true }}
              value={stats.completedTasks}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts and Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <ChartCard title="Project Progress">
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart component will be implemented here
                </div>
              </ChartCard>

              <ChartCard title="Task Completion Trends">
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart component will be implemented here
                </div>
              </ChartCard>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <QuickActions actions={quickActions} />
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
