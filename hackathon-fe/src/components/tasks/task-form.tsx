import { useState } from "react";
import { Button, Card } from "@heroui/react";

import { NumberField } from "../forms/number-field";

import { FormField } from "@/components/form-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { EditIcon, SaveIcon, TimesIcon } from "@/components/icons";
import {
  CreateTaskForm,
  PriorityOption,
  DifficultyOption,
  StatusOption,
  TaskFormValidation,
  TaskPriority,
  TaskDifficulty,
} from "@/types/task-form";

interface TaskFormProps {
  onSubmit: (formData: CreateTaskForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateTaskForm>;
  priorityOptions: PriorityOption[];
  difficultyOptions: DifficultyOption[];
  statusOptions: StatusOption[];
  projects: Array<{ id: string; name: string }>;
  users: Array<{ id: string; name: string; role: string; department: string }>;
}

export const TaskForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  priorityOptions,
  difficultyOptions,
  statusOptions,
  projects,
  users,
}: TaskFormProps) => {
  const [formData, setFormData] = useState<CreateTaskForm>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    priority: initialData?.priority || TaskPriority.MEDIUM,
    difficulty: initialData?.difficulty || TaskDifficulty.MEDIUM,
    projectId: initialData?.projectId || "",
    assignedUserId: initialData?.assignedUserId || "unassigned",
    estimatedHours: initialData?.estimatedHours || 0,
  });

  const [errors, setErrors] = useState<TaskFormValidation>({
    name: "",
    description: "",
    priority: "",
    difficulty: "",
    projectId: "",
  });

  const validateForm = (): boolean => {
    const newErrors: TaskFormValidation = {
      name: "",
      description: "",
      priority: "",
      difficulty: "",
      projectId: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Please enter a task name.";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Please enter a task description.";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        assignedUserId:
          formData.assignedUserId === "unassigned"
            ? undefined
            : formData.assignedUserId,
        estimatedHours:
          formData.estimatedHours === 0 ? undefined : formData.estimatedHours,
      };

      onSubmit(submitData);
    }
  };

  const handleInputChange = (
    field: keyof CreateTaskForm,
    value: string | number | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof TaskFormValidation]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNumberChange = (
    field: keyof CreateTaskForm,
    value: number | undefined,
  ) => {
    const safeValue = value || 0;

    setFormData((prev) => ({ ...prev, [field]: safeValue }));
    if (errors[field as keyof TaskFormValidation]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <div className="bg-primary text-white p-4 rounded-t-lg">
        <h5 className="mb-0">
          <EditIcon className="w-5 h-5 inline mr-2" />
          Task Details
        </h5>
      </div>
      <div className="p-6">
        <div>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <FormField
                required
                className="mb-0"
                error={errors.name}
                label="Task Name"
                name="name"
                placeholder="Enter task name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                required
                className="mb-0"
                error={errors.description}
                label="Description"
                name="description"
                placeholder="Describe the task requirements and objectives"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>

            <SelectField
              className="mb-0"
              error={errors.priority}
              label="Priority"
              name="priority"
              options={priorityOptions}
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
            />

            <SelectField
              className="mb-0"
              error={errors.difficulty}
              label="Difficulty"
              name="difficulty"
              options={difficultyOptions}
              value={formData.difficulty}
              onChange={(e) => handleInputChange("difficulty", e.target.value)}
            />

            <SelectField
              required
              className="mb-0"
              error={errors.projectId}
              label="Project"
              name="projectId"
              options={projects.map((project) => ({
                value: project.id,
                label: project.name,
              }))}
              value={formData.projectId}
              onChange={(e) => handleInputChange("projectId", e.target.value)}
            />

            <SelectField
              className="mb-0"
              error=""
              label="Assigned To"
              name="assignedUserId"
              options={users.map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              value={formData.assignedUserId}
              onChange={(e) =>
                handleInputChange("assignedUserId", e.target.value)
              }
            />

            <NumberField
              className="mb-0"
              error=""
              label="Estimated Hours"
              name="estimatedHours"
              placeholder="Enter estimated hours"
              value={formData.estimatedHours}
              onChange={(e) =>
                handleNumberChange(
                  "estimatedHours",
                  e.target.valueAsNumber || 0,
                )
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              color="default"
              startContent={<TimesIcon />}
              variant="bordered"
              onPress={onCancel}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              startContent={<SaveIcon />}
              onPress={handleSubmit}
            >
              Create Task
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
