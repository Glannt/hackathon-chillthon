import { Button, Card, Input } from "@heroui/react";

import { ProjectFilters } from "@/types/project";

interface FilterSectionProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  onClearFilters: () => void;
}

export const FilterSection = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: FilterSectionProps) => {
  const handleInputChange = (field: keyof ProjectFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Card className="mb-6">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold">
            <i className="fas fa-filter mr-2" />
            Filters & Search
          </h6>
          <Button size="sm" variant="ghost" onClick={onClearFilters}>
            <i className="fas fa-times mr-1" />
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="searchInput"
            >
              Search Projects
            </label>
            <Input
              id="searchInput"
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="statusFilter"
            >
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              id="statusFilter"
              value={filters.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="sortBy">
              Sort By
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) =>
                handleInputChange("sortBy", e.target.value as any)
              }
            >
              <option value="created_at">Date Created</option>
              <option value="name">Name</option>
              <option value="task_count">Task Count</option>
              <option value="progress">Progress</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={() => {}}>
              <i className="fas fa-search mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
