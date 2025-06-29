import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { ProjectDetail } from "@/types/project-detail";
import {
  ArrowLeftIcon,
  CogIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";

interface ProjectHeaderProps {
  project: ProjectDetail;
  canEdit: boolean;
  onBack: () => void;
  onEdit: () => void;
  onAddTask: () => void;
  onDelete: () => void;
}

export const ProjectHeader = ({
  project,
  canEdit,
  onBack,
  onEdit,
  onAddTask,
  onDelete,
}: ProjectHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              <i className="fas fa-project-diagram mr-2" />
              {project.name}
            </h1>
            <p className="text-white/75 mb-0">
              <i className="fas fa-user mr-1" />
              Created by {project.createdBy.fullName}
              <span className="ml-3">
                <i className="fas fa-calendar mr-1" />
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              color="default"
              size="sm"
              startContent={<ArrowLeftIcon />}
              variant="bordered"
              onPress={onBack}
            >
              Back to Projects
            </Button>
            {canEdit && (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    color="default"
                    size="sm"
                    startContent={<CogIcon />}
                    variant="bordered"
                  >
                    Actions
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Project actions">
                  <DropdownItem
                    key="edit"
                    startContent={<EditIcon />}
                    onPress={onEdit}
                  >
                    Edit Project
                  </DropdownItem>
                  <DropdownItem
                    key="add-task"
                    startContent={<PlusIcon />}
                    onPress={onAddTask}
                  >
                    Add Task
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<TrashIcon />}
                    onPress={onDelete}
                  >
                    Delete Project
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
