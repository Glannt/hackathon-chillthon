import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/react";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "task" | "project" | "attendance" | "system";
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
}

export const ActivityFeed = ({
  activities,
  title = "Recent Activity",
}: ActivityFeedProps) => {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "task":
        return "📋";
      case "project":
        return "📁";
      case "attendance":
        return "⏰";
      case "system":
        return "⚙️";
      default:
        return "📝";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Avatar
                className="w-8 h-8"
                name={activity.user.name}
                size="sm"
                src={activity.user.avatar}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user.name}</span>{" "}
                <span className="text-gray-600">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
            <div className="flex-shrink-0 text-lg">
              {getActivityIcon(activity.type)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
