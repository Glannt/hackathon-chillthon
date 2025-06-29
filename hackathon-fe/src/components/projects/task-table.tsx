import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Avatar,
  Progress,
  Button,
} from "@heroui/react";

import { Task } from "@/types/project-detail";
import { EyeIcon, EditIcon } from "@/components/icons";

interface TaskTableProps {
  tasks: Task[];
  canEdit: boolean;
  onViewTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
}

export const TaskTable = ({
  tasks,
  canEdit,
  onViewTask,
  onEditTask,
}: TaskTableProps) => {
  const getStatusBadge = (status: Task["status"]) => {
    const statusConfig = {
      // Backend status values
      todo: { color: "default" as const, label: "Todo" },
      in_progress: { color: "primary" as const, label: "In Progress" },
      review: { color: "warning" as const, label: "Review" },
      done: { color: "success" as const, label: "Done" },
      cancelled: { color: "danger" as const, label: "Cancelled" },
      // Frontend expected values (fallback)
      pending: { color: "default" as const, label: "Pending" },
      completed: { color: "success" as const, label: "Completed" },
    };

    const config = statusConfig[status];

    // Fallback for unknown status values
    if (!config) {
      return (
        <Badge color="default" variant="flat">
          {status || "Unknown"}
        </Badge>
      );
    }

    return (
      <Badge color={config.color} variant="flat">
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    const priorityConfig = {
      low: { color: "default" as const, label: "Low" },
      medium: { color: "warning" as const, label: "Medium" },
      high: { color: "danger" as const, label: "High" },
      urgent: { color: "danger" as const, label: "Urgent" },
    };

    const config = priorityConfig[priority];

    return (
      <Badge color={config.color} variant="flat">
        {config.label}
      </Badge>
    );
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Table aria-label="Project tasks table">
      <TableHeader>
        <TableColumn>Task</TableColumn>
        <TableColumn>Assigned To</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Priority</TableColumn>
        <TableColumn>Deadline</TableColumn>
        <TableColumn>Progress</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <div>
                <div className="font-semibold text-gray-800">
                  {task.title}
                  {task.isOverdue && (
                    <Badge className="ml-2" color="danger" variant="flat">
                      Overdue
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted mt-1">
                  {task.description.length > 50
                    ? `${task.description.substring(0, 50)}...`
                    : task.description}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Avatar
                  className="mr-2"
                  name={`${task.assignedTo.name} `}
                  size="sm"
                />
                <span className="text-sm">{task.assignedTo.name}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(task.status)}</TableCell>
            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
            <TableCell>
              <span className="text-sm text-muted">
                {formatDeadline(task.deadline)}
              </span>
            </TableCell>
            <TableCell>
              <Progress
                className="w-20"
                color="success"
                size="sm"
                value={task.progressPercentage}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="bordered"
                  onPress={() => onViewTask(task.id)}
                >
                  <EyeIcon className="w-4 h-4" />
                </Button>
                {canEdit && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="bordered"
                    onPress={() => onEditTask(task.id)}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
