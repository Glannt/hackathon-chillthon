import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProjectForm } from "@/components/projects/project-form";
import { projectStatusOptions } from "@/data/task-form";
import { ArrowLeftIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { CreateProjectForm } from "@/types/task-form";
import { ProjectsService } from "@/services/projects.service";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: CreateProjectForm) => {
    setIsLoading(true);
    try {
      console.log("Creating project:", formData);

      // Call backend API
      const newProject = await ProjectsService.createProject(formData);

      console.log("Project created successfully:", newProject);

      // Navigate to project list or new project detail
      navigate("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      // You can add toast notification here for error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageHeader
        actions={[
          {
            label: "Back to Projects",
            icon: ArrowLeftIcon,
            onClick: handleCancel,
            variant: "bordered" as const,
          },
        ]}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "Create Project" },
        ]}
        subtitle="Create a new project and start managing tasks"
        title="Create New Project"
      />

      <div className="max-w-2xl mx-auto">
        <ProjectForm
          initialData={undefined}
          isLoading={isLoading}
          statusOptions={projectStatusOptions}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
