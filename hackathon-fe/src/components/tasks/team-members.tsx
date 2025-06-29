import { Card } from "@heroui/react";

import { UsersIcon } from "@/components/icons";
import { User } from "@/types/task-form";

interface TeamMembersProps {
  users: User[];
}

export const TeamMembers = ({ users }: TeamMembersProps) => {
  const getInitials = (name: string) => {
    const names = name.split(" ");

    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }

    return name.charAt(0).toUpperCase();
  };

  return (
    <Card>
      <div className="p-4">
        <h5 className="mb-3 font-semibold">
          <UsersIcon className="w-4 h-4 inline mr-2" />
          Team Members
        </h5>
        {users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role} • {user.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No team members available</p>
        )}
      </div>
    </Card>
  );
};
