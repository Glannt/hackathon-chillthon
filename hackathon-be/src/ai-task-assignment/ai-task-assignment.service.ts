import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import { promises as fs, existsSync } from 'fs';
import { join } from 'path';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

export interface TaskAssignmentResult {
  taskId: string;
  userId: string;
  userName: string;
  assigned: boolean;
  error?: string;
}

export interface AIAnalysisResult {
  taskAnalysis: any[];
  taskAssignment: any[];
  userTaskMapping: any[];
}

export interface TaskStep {
  step: string;
  tasks: { taskId: string; name: string }[];
}

export interface UserTaskMapping {
  taskId: string;
  MemberName: string;
  [key: string]: any;
}

export interface TaskData {
  id: string;
  name: string;
  status?: string;
  assignedUserId?: string;
  [key: string]: any;
}

export interface UserData {
  id: string;
  name: string;
  department?: string;
  position?: string;
  experience?: string;
  projectsDone?: number;
  avgTaskCompletion?: string;
  deadlineMisses?: number;
  [key: string]: any;
}

export interface TaskGroup {
  status: string;
  tasks: TaskData[];
}

@Injectable()
export class AiTaskAssignmentService {
  private readonly logger = new Logger(AiTaskAssignmentService.name);

  constructor(
    private readonly taskService: TasksService,
    private readonly userService: UsersService,
    private readonly projectService: ProjectsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Run AI model to analyze tasks and assign them to users
   */
  async runAITaskAssignment(
    projectId: string,
    taskFileContent: string,
    userFileContent: string,
  ): Promise<AIAnalysisResult> {
    try {
      this.logger.log(`Starting AI task assignment for project ${projectId}`);

      // Create temporary files for the Python model
      const tempDir = join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });

      const taskFilePath = join(tempDir, 'tasks.json');
      const userFilePath = join(tempDir, 'users.json');
      const outputPath = join(tempDir, 'ai_output.json');

      // Write input files
      await fs.writeFile(taskFilePath, taskFileContent, 'utf8');
      await fs.writeFile(userFilePath, userFileContent, 'utf8');

      // Run the Python model
      const result = await this.runPythonModel(
        taskFilePath,
        userFilePath,
        outputPath,
      );

      // Clean up temporary files
      await this.cleanupTempFiles([taskFilePath, userFilePath, outputPath]);

      return result;
    } catch (error) {
      this.logger.error(
        `Error in AI task assignment: ${(error as Error).message}`,
      );
      throw new Error(`AI task assignment failed: ${(error as Error).message}`);
    }
  }

  /**
   * Execute the Python model and get results
   */
  private async runPythonModel(
    taskFilePath: string,
    userFilePath: string,
    outputPath: string,
  ): Promise<AIAnalysisResult> {
    return new Promise((resolve, reject) => {
      // Use the new AI integration script
      const pythonScript = join(process.cwd(), 'ai_integration.py');

      // Check if the script exists
      if (!existsSync(pythonScript)) {
        reject(
          new Error(
            'AI integration script not found. Please ensure ai_integration.py exists in the project root.',
          ),
        );
        return;
      }

      // Get API key from config service
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');
      const args = apiKey
        ? [pythonScript, taskFilePath, userFilePath, outputPath, apiKey]
        : [pythonScript, taskFilePath, userFilePath, outputPath];

      const pythonProcess = spawn('python', args);

      let stderr = '';

      pythonProcess.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(
            new Error(`Python process failed with code ${code}: ${stderr}`),
          );
          return;
        }

        // Handle the async operation separately
        fs.readFile(outputPath, 'utf8')
          .then((outputContent) => {
            try {
              const result = JSON.parse(outputContent) as AIAnalysisResult;
              resolve(result);
            } catch (error) {
              reject(
                new Error(
                  `Failed to parse AI output: ${(error as Error).message}`,
                ),
              );
            }
          })
          .catch((error) => {
            reject(
              new Error(
                `Failed to read AI output: ${(error as Error).message}`,
              ),
            );
          });
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  /**
   * Apply AI task assignments to the database
   */
  async applyAITaskAssignments(
    projectId: string,
    userTaskMapping: UserTaskMapping[],
  ): Promise<TaskAssignmentResult[]> {
    const results: TaskAssignmentResult[] = [];
    try {
      // Get all users for name mapping
      const users = await this.userService.findAll();
      const userMap = new Map<string, string>();
      users.forEach((user: UserData) => {
        userMap.set(user.name, user.id);
      });
      // Get all tasks for the project
      const tasks = await this.taskService.findByProject(projectId);
      // Build mapping: taskId (AI) <-> task DB
      let taskCounter = 1;
      const aiTaskIdToDbId = new Map<string, string>();
      const nameToDbId = new Map<string, string>();
      tasks.forEach((task) => {
        const aiTaskId = `TASK${(taskCounter++).toString().padStart(2, '0')}`;
        aiTaskIdToDbId.set(aiTaskId, task.id);
        nameToDbId.set(task.name, task.id);
      });
      // Apply assignments
      for (const mapping of userTaskMapping) {
        // Handle both old and new field names with type guards
        let taskId: string = '';
        let memberName: string = '';

        if (typeof mapping.taskId === 'string') taskId = mapping.taskId;
        else if (typeof mapping['Task ID'] === 'string')
          taskId = mapping['Task ID'];

        if (typeof mapping.MemberName === 'string')
          memberName = mapping.MemberName;
        else if (typeof mapping['Thành viên (tên)'] === 'string')
          memberName = mapping['Thành viên (tên)'];

        const userId = userMap.get(memberName);

        // Map AI taskId to DB taskId
        let dbTaskId = aiTaskIdToDbId.get(taskId);
        if (!dbTaskId && nameToDbId.has(taskId))
          dbTaskId = nameToDbId.get(taskId);

        if (!dbTaskId) {
          results.push({
            taskId,
            userId: '',
            userName: memberName,
            assigned: false,
            error: `Task ${taskId} not found in project`,
          });
          continue;
        }

        if (!userId) {
          results.push({
            taskId,
            userId: '',
            userName: memberName,
            assigned: false,
            error: `User ${memberName} not found in database`,
          });
          continue;
        }
        try {
          await this.taskService.assignToUser(dbTaskId, userId);
          results.push({
            taskId,
            userId,
            userName: memberName,
            assigned: true,
          });
        } catch (error) {
          results.push({
            taskId,
            userId,
            userName: memberName,
            assigned: false,
            error: (error as Error).message,
          });
        }
      }
      return results;
    } catch (error) {
      this.logger.error(
        `Error applying AI task assignments: ${(error as Error).message}`,
      );
      throw new Error(
        `Failed to apply AI task assignments: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Clean up temporary files
   */
  private async cleanupTempFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        this.logger.warn(
          `Failed to delete temporary file ${filePath}: ${(error as Error).message}`,
        );
      }
    }
  }

  /**
   * Get task file content from project - convert tasks to JSON format like lam_phim.json, kèm mapping taskId
   */
  async getTaskFileContent(projectId: string): Promise<string> {
    try {
      const project = await this.projectService.findOne(projectId);
      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }
      // Get all tasks for this project
      const tasks = await this.taskService.findByProject(projectId);
      if (tasks.length === 0) {
        // Return default task structure if no tasks exist
        return JSON.stringify(
          [
            {
              step: 'Project Setup',
              tasks: [
                { taskId: 'TASK01', name: 'Create project structure' },
                { taskId: 'TASK02', name: 'Set up development environment' },
                { taskId: 'TASK03', name: 'Initialize version control' },
                { taskId: 'TASK04', name: 'Configure build tools' },
              ],
            },
          ],
          null,
          2,
        );
      }
      // Group tasks by status or create logical groups
      const taskGroups = this.groupTasksByStatus(tasks);
      // Tạo mapping taskId cho từng task
      let taskCounter = 1;
      const taskSteps: TaskStep[] = taskGroups.map((group) => ({
        step: group.status,
        tasks: group.tasks.map((task) => ({
          taskId: `TASK${(taskCounter++).toString().padStart(2, '0')}`,
          name: task.name,
        })),
      }));
      return JSON.stringify(taskSteps, null, 2);
    } catch (error) {
      this.logger.error(
        `Error getting task file content: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  /**
   * Group tasks by status for better organization
   */
  private groupTasksByStatus(tasks: TaskData[]): TaskGroup[] {
    const groups = new Map<string, TaskData[]>();

    tasks.forEach((task) => {
      const status = task.status || 'todo';
      if (!groups.has(status)) {
        groups.set(status, []);
      }
      groups.get(status)!.push(task);
    });

    return Array.from(groups.entries()).map(([status, tasks]) => ({
      status: this.formatStatusName(status),
      tasks,
    }));
  }

  /**
   * Format status name for better readability
   */
  private formatStatusName(status: string): string {
    const statusMap: { [key: string]: string } = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      done: 'Completed',
      cancelled: 'Cancelled',
    };

    return (
      statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    );
  }

  /**
   * Get user file content - get users from project and convert to JSON format like output_user.json
   */
  async getUserFileContent(projectId?: string): Promise<string> {
    try {
      let users: UserData[];

      if (projectId) {
        // Get project with users
        const project = await this.projectService.findOne(projectId);

        if (project.users && project.users.length > 0) {
          // Use users from project
          users = project.users.map((user) => ({
            id: user.id,
            name: user.name,
            department: user.department,
            position: user.position,
            experience: user.experience,
            projectsDone: user.projectsDone,
            avgTaskCompletion: user.avgTaskCompletion,
            deadlineMisses: user.deadlineMisses,
          }));
        } else {
          // If no users in project, get all users
          users = await this.userService.findAll();
        }
      } else {
        // Get all users if no project specified
        users = await this.userService.findAll();
      }

      // Convert to the format like output_user.json
      const userData = users.map((user, index) => ({
        Id: (index + 1).toString(),
        Name: user.name,
        Department: user.department || 'Development',
        Position: user.position || 'Developer',
        Experience: user.experience || '1 years',
        ProjectsDone: user.projectsDone?.toString() || '0',
        AvgTaskCompletion: user.avgTaskCompletion || '2 days (Medium)',
        DeadlineMisses: user.deadlineMisses?.toString() || '0',
      }));

      return JSON.stringify(userData, null, 2);
    } catch (error) {
      this.logger.error(
        `Error getting user file content: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
