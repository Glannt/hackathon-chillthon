import { Card, CardBody, Badge, Progress } from "@heroui/react";

interface AIAssignmentResultProps {
  result: {
    analysis?: any;
    assignments?: Array<{
      taskId: string;
      userId: string;
      userName: string;
      assigned: boolean;
      error?: string;
    }>;
    error?: string;
  };
}

export const AIAssignmentResult = ({ result }: AIAssignmentResultProps) => {
  if (!result) return null;

  if (result.error) {
    return (
      <Card className="mb-4 border-red-200 bg-red-50">
        <CardBody className="p-4">
          <div className="flex items-start">
            <span className="text-red-500 text-xl mr-3">❌</span>
            <div>
              <h6 className="font-semibold text-red-800 mb-1">
                AI Assignment Failed
              </h6>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const assignments = result.assignments || [];
  const successfulAssignments = assignments.filter((a) => a.assigned);
  const failedAssignments = assignments.filter((a) => !a.assigned);
  const successRate =
    assignments.length > 0
      ? (successfulAssignments.length / assignments.length) * 100
      : 0;

  return (
    <Card className="mb-4 border-green-200 bg-green-50">
      <CardBody className="p-4">
        <div className="flex items-start mb-4">
          <span className="text-green-500 text-xl mr-3">✅</span>
          <div>
            <h6 className="font-semibold text-green-800 mb-1">
              AI Assignment Successful
            </h6>
            <p className="text-sm text-green-700">
              {successfulAssignments.length} of {assignments.length} tasks
              assigned successfully
            </p>
          </div>
        </div>

        {/* Success Rate Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-800">
              Success Rate
            </span>
            <span className="text-sm text-green-700">
              {Math.round(successRate)}%
            </span>
          </div>
          <Progress
            className="w-full"
            color="success"
            size="sm"
            value={successRate}
          />
        </div>

        {/* Assignment Details */}
        <div className="space-y-2">
          {successfulAssignments.length > 0 && (
            <div>
              <h6 className="text-sm font-medium text-green-800 mb-2">
                ✅ Successful Assignments
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {successfulAssignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-green-100 rounded"
                  >
                    <span className="text-sm text-green-800 font-medium">
                      {assignment.taskId}
                    </span>
                    <Badge color="success" size="sm" variant="flat">
                      {assignment.userName}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {failedAssignments.length > 0 && (
            <div>
              <h6 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                <span className="text-yellow-500 mr-1">⚠️</span>
                Failed Assignments
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {failedAssignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-yellow-100 rounded"
                  >
                    <span className="text-sm text-yellow-800 font-medium">
                      {assignment.taskId}
                    </span>
                    <div className="text-right">
                      <Badge color="warning" size="sm" variant="flat">
                        {assignment.userName}
                      </Badge>
                      {assignment.error && (
                        <p className="text-xs text-yellow-700 mt-1">
                          {assignment.error}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Summary */}
        {result.analysis && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <h6 className="text-sm font-medium text-green-800 mb-2">
              AI Analysis Summary
            </h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-700">
                  {result.analysis.taskAnalysis?.length || 0}
                </div>
                <div className="text-green-600">Tasks Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-700">
                  {result.analysis.userTaskMapping?.length || 0}
                </div>
                <div className="text-green-600">Assignments Made</div>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
