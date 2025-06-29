import { apiClient } from "@/lib/axios";

export interface AIAnalysisResult {
  taskAnalysis: any[];
  taskAssignment: any[];
  userTaskMapping: any[];
}

export interface TaskAssignmentResult {
  taskId: string;
  userId: string;
  userName: string;
  assigned: boolean;
  error?: string;
}

export class AITaskAssignmentService {
  /**
   * Run AI analysis for task assignment
   */
  static async runAIAnalysis(projectId: string): Promise<AIAnalysisResult> {
    const response = await apiClient.post(
      `/ai-task-assignment/${projectId}/run`,
    );

    return response.data;
  }

  /**
   * Apply AI task assignments
   */
  static async applyAssignments(
    projectId: string,
    userTaskMapping: any[],
  ): Promise<TaskAssignmentResult[]> {
    const response = await apiClient.post(
      `/ai-task-assignment/${projectId}/apply`,
      {
        userTaskMapping,
      },
    );

    return response.data;
  }

  /**
   * Get task content for a project
   */
  static async getTaskContent(projectId: string): Promise<{ content: string }> {
    const response = await apiClient.get(
      `/ai-task-assignment/${projectId}/task-content`,
    );

    return response.data;
  }

  /**
   * Get user content
   */
  static async getUserContent(): Promise<{ content: string }> {
    const response = await apiClient.get(`/ai-task-assignment/user-content`);

    return response.data;
  }

  /**
   * Complete AI task assignment workflow
   */
  static async assignTasksWithAI(projectId: string): Promise<{
    analysis: AIAnalysisResult;
    assignments: TaskAssignmentResult[];
  }> {
    // Step 1: Run AI analysis
    const analysis = await this.runAIAnalysis(projectId);

    // Step 2: Apply assignments if mapping exists
    let assignments: TaskAssignmentResult[] = [];

    if (analysis.userTaskMapping && analysis.userTaskMapping.length > 0) {
      assignments = await this.applyAssignments(
        projectId,
        analysis.userTaskMapping,
      );
    }

    return { analysis, assignments };
  }
}
