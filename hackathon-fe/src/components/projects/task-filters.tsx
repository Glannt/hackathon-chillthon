import { Select, SelectItem, Button } from "@heroui/react";

import {
  StatusChoice,
  PriorityChoice,
  SortOption,
  TaskFilters,
} from "@/types/project-detail";
import { FilterIcon } from "@/components/icons";

interface TaskFiltersProps {
  filters: TaskFilters;
  statusChoices: StatusChoice[];
  priorityChoices: PriorityChoice[];
  sortOptions: SortOption[];
  onFilterChange: (filters: TaskFilters) => void;
}

export const TaskFilter = ({
  filters,
  statusChoices,
  priorityChoices,
  sortOptions,
  onFilterChange,
}: TaskFiltersProps) => {
  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({ ...filters, priority: value });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <Select
          selectedKeys={[filters.status]}
          size="sm"
          onSelectionChange={(keys) =>
            handleStatusChange(Array.from(keys)[0] as string)
          }
        >
          <SelectItem key="all" value="all">
            All Status
          </SelectItem>
          {statusChoices.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <Select
          selectedKeys={[filters.priority]}
          size="sm"
          onSelectionChange={(keys) =>
            handlePriorityChange(Array.from(keys)[0] as string)
          }
        >
          <SelectItem key="all" value="all">
            All Priority
          </SelectItem>
          {priorityChoices.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <Select
          selectedKeys={[filters.sortBy]}
          size="sm"
          onSelectionChange={(keys) =>
            handleSortChange(Array.from(keys)[0] as string)
          }
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          className="w-full"
          size="sm"
          startContent={<FilterIcon />}
          variant="bordered"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
