import { useState } from "react";
import { Button, Card } from "@heroui/react";

import { FormField } from "@/components/form-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { EditIcon, SaveIcon, TimesIcon } from "@/components/icons";
import {
  CreateProjectForm,
  ProjectStatusOption,
  ProjectFormValidation,
  ProjectStatus,
} from "@/types/task-form";

interface ProjectFormProps {
  onSubmit: (formData: CreateProjectForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateProjectForm>;
  statusOptions: ProjectStatusOption[];
  isEdit?: boolean;
}

export const ProjectForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  statusOptions,
  isEdit = false,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState<CreateProjectForm>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || ProjectStatus.ACTIVE,
  });

  const [errors, setErrors] = useState<ProjectFormValidation>({
    name: "",
    description: "",
    status: "",
  });

  const validateForm = (): boolean => {
    const newErrors: ProjectFormValidation = {
      name: "",
      description: "",
      status: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Please enter a project name.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please enter a project description.";
    }

    if (!formData.status) {
      newErrors.status = "Please select a project status.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof CreateProjectForm,
    value: string | ProjectStatus,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ProjectFormValidation]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <div className="bg-primary text-white p-4 rounded-t-lg">
        <h5 className="mb-0">
          <EditIcon className="w-5 h-5 inline mr-2" />
          {isEdit ? "Edit Project" : "Create New Project"}
        </h5>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <FormField
              required
              className="mb-0"
              error={errors.name}
              label="Project Name"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <TextareaField
              required
              className="mb-0"
              error={errors.description}
              label="Description"
              name="description"
              placeholder="Describe the project objectives, scope, and requirements"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />

            <SelectField
              required
              className="mb-0"
              error={errors.status}
              label="Project Status"
              name="status"
              options={statusOptions}
              value={formData.status}
              onChange={(e) =>
                handleInputChange("status", e.target.value as ProjectStatus)
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              disabled={isLoading}
              startContent={<TimesIcon className="w-4 h-4" />}
              type="button"
              variant="bordered"
              onPress={onCancel}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              startContent={<SaveIcon className="w-4 h-4" />}
              type="submit"
              onPress={() => {}}
            >
              {isEdit ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
