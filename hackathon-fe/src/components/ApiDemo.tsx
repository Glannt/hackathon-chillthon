import React, { useEffect } from "react";

import { useProjects, useUsers, useTasks } from "../hooks/useApi";

import { Project, Task, User } from "@/services";

export const ApiDemo: React.FC = () => {
  const projects = useProjects();
  const users = useUsers();
  const tasks = useTasks();

  useEffect(() => {
    // Load initial data
    projects.getAllProjects.execute();
    users.getAllUsers.execute();
    tasks.getAllTasks.execute();
  }, []);

  const handleCreateProject = async () => {
    const newProject = await projects.createProject.execute({
      name: "Demo Project",
      description: "This is a demo project created via API",
      status: "active",
    });

    if (newProject) {
      console.log("Project created:", newProject);
      projects.getAllProjects.execute(); // Refresh list
    }
  };

  const handleSeedUsers = async () => {
    const result = await users.seedUsers.execute();

    if (result) {
      console.log("Users seeded:", result);
      users.getAllUsers.execute(); // Refresh list
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">API Demo</h2>

      {/* Projects Section */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Projects</h3>
        <div className="space-y-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={projects.createProject.loading}
            onClick={handleCreateProject}
          >
            {projects.createProject.loading
              ? "Creating..."
              : "Create Demo Project"}
          </button>

          {projects.getAllProjects.loading && <p>Loading projects...</p>}
          {projects.getAllProjects.error && (
            <p className="text-red-500">
              Error: {projects.getAllProjects.error}
            </p>
          )}
          {projects.getAllProjects.data && (
            <div>
              <p>Total projects: {projects.getAllProjects.data.length}</p>
              <ul className="list-disc list-inside">
                {projects.getAllProjects.data
                  .slice(0, 3)
                  .map((project: Project) => (
                    <li key={project.id}>{project.name}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <div className="space-y-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            disabled={users.seedUsers.loading}
            onClick={handleSeedUsers}
          >
            {users.seedUsers.loading ? "Seeding..." : "Seed Users"}
          </button>

          {users.getAllUsers.loading && <p>Loading users...</p>}
          {users.getAllUsers.error && (
            <p className="text-red-500">Error: {users.getAllUsers.error}</p>
          )}
          {users.getAllUsers.data && (
            <div>
              <p>Total users: {users.getAllUsers.data.length}</p>
              <ul className="list-disc list-inside">
                {users.getAllUsers.data.slice(0, 3).map((user: User) => (
                  <li key={user.id}>
                    {user.name} ({user.role})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Tasks</h3>
        <div className="space-y-2">
          {tasks.getAllTasks.loading && <p>Loading tasks...</p>}
          {tasks.getAllTasks.error && (
            <p className="text-red-500">Error: {tasks.getAllTasks.error}</p>
          )}
          {tasks.getAllTasks.data && (
            <div>
              <p>Total tasks: {tasks.getAllTasks.data.length}</p>
              <ul className="list-disc list-inside">
                {tasks.getAllTasks.data.slice(0, 3).map((task: Task) => (
                  <li key={task.id}>
                    {task.name} - {task.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* API Status */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">API Status</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium">Projects API:</p>
            <p
              className={
                projects.getAllProjects.loading
                  ? "text-yellow-600"
                  : projects.getAllProjects.error
                    ? "text-red-600"
                    : "text-green-600"
              }
            >
              {projects.getAllProjects.loading
                ? "Loading"
                : projects.getAllProjects.error
                  ? "Error"
                  : "Ready"}
            </p>
          </div>
          <div>
            <p className="font-medium">Users API:</p>
            <p
              className={
                users.getAllUsers.loading
                  ? "text-yellow-600"
                  : users.getAllUsers.error
                    ? "text-red-600"
                    : "text-green-600"
              }
            >
              {users.getAllUsers.loading
                ? "Loading"
                : users.getAllUsers.error
                  ? "Error"
                  : "Ready"}
            </p>
          </div>
          <div>
            <p className="font-medium">Tasks API:</p>
            <p
              className={
                tasks.getAllTasks.loading
                  ? "text-yellow-600"
                  : tasks.getAllTasks.error
                    ? "text-red-600"
                    : "text-green-600"
              }
            >
              {tasks.getAllTasks.loading
                ? "Loading"
                : tasks.getAllTasks.error
                  ? "Error"
                  : "Ready"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
