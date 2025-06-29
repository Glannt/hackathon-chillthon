import { Card, CardBody, Avatar } from "@heroui/react";

import { TeamMember } from "@/types/project-detail";
import { UsersIcon } from "@/components/icons";

interface TeamMembersProps {
  members: TeamMember[];
}

export const TeamMembers = ({ members }: TeamMembersProps) => {
  if (members.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardBody className="p-6">
        <div className="flex items-center mb-4">
          <UsersIcon className="w-5 h-5 mr-2 text-gray-600" />
          <h6 className="text-gray-800 font-semibold">
            Team Members ({members.length})
          </h6>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center p-3 border rounded-lg"
            >
              <Avatar
                className="flex-shrink-0 mr-3"
                name={`${member.name}`}
                size="md"
              />
              <div className="flex-1">
                <h6 className="font-semibold text-gray-800 mb-1">
                  {member.name}
                </h6>
                {/* <small className="text-muted">
                  {member.taskCount} tasks assigned
                  {member.completedCount > 0 && (
                    <span className="text-success ml-1">
                      ({member.completedCount} completed)
                    </span>
                  )}
                </small> */}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
