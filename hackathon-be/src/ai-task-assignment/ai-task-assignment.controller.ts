import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { IsOptional, IsString, IsArray } from 'class-validator';
import {
  ApiProperty,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  AiTaskAssignmentService,
  TaskAssignmentResult,
  AIAnalysisResult,
  UserTaskMapping,
} from './ai-task-assignment.service';

export class RunAIAssignmentDto {
  @ApiProperty({
    description:
      'Optional task file content. If not provided, will fetch from project tasks.',
    required: false,
    example: '[{"step": "Planning", "tasks": ["Task 1", "Task 2"]}]',
  })
  @IsOptional()
  @IsString()
  taskFileContent?: string;

  @ApiProperty({
    description:
      'Optional user file content. If not provided, will fetch from project users.',
    required: false,
    example: '[{"Id": "1", "Name": "John Doe", "Department": "Development"}]',
  })
  @IsOptional()
  @IsString()
  userFileContent?: string;
}

export class ApplyAssignmentsDto {
  @ApiProperty({
    description: 'User-task mapping array from AI analysis',
    type: 'array',
    example: [
      {
        taskId: 'TASK01',
        MemberName: 'John Doe',
      },
    ],
  })
  @IsArray()
  userTaskMapping: UserTaskMapping[];
}

@ApiTags('AI Task Assignment')
@Controller('ai-task-assignment')
export class AiTaskAssignmentController {
  constructor(
    private readonly aiTaskAssignmentService: AiTaskAssignmentService,
  ) {}

  @Post(':projectId/run')
  @ApiOperation({
    summary: 'Run AI task assignment analysis',
    description:
      'Analyze project tasks and users to generate AI-powered task assignments',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project ID to analyze',
    type: 'string',
  })
  @ApiBody({
    type: RunAIAssignmentDto,
    description:
      'Optional task and user content. If not provided, will fetch from database.',
  })
  @ApiResponse({
    status: 200,
    description: 'AI analysis completed successfully',
    type: 'object',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid project ID or request data',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async runAIAssignment(
    @Param('projectId') projectId: string,
    @Body() dto: RunAIAssignmentDto = {},
  ): Promise<AIAnalysisResult> {
    const taskContent =
      dto?.taskFileContent ||
      (await this.aiTaskAssignmentService.getTaskFileContent(projectId));
    const userContent =
      dto?.userFileContent ||
      (await this.aiTaskAssignmentService.getUserFileContent(projectId));

    return this.aiTaskAssignmentService.runAITaskAssignment(
      projectId,
      taskContent,
      userContent,
    );
  }

  @Post(':projectId/apply')
  @ApiOperation({
    summary: 'Apply AI task assignments',
    description: 'Apply the AI-generated task assignments to the database',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project ID to apply assignments to',
    type: 'string',
  })
  @ApiBody({
    type: ApplyAssignmentsDto,
    description: 'User-task mapping from AI analysis',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignments applied successfully',
    type: 'array',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid assignment data',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async applyAssignments(
    @Param('projectId') projectId: string,
    @Body() dto: ApplyAssignmentsDto,
  ): Promise<TaskAssignmentResult[]> {
    return this.aiTaskAssignmentService.applyAITaskAssignments(
      projectId,
      dto.userTaskMapping,
    );
  }

  @Get(':projectId/task-content')
  @ApiOperation({
    summary: 'Get task content for project',
    description: 'Get formatted task content for AI analysis',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project ID to get tasks for',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Task content retrieved successfully',
    type: 'object',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async getTaskContent(
    @Param('projectId') projectId: string,
  ): Promise<{ content: string }> {
    const content =
      await this.aiTaskAssignmentService.getTaskFileContent(projectId);
    return { content };
  }

  @Get('user-content')
  @ApiOperation({
    summary: 'Get user content',
    description: 'Get formatted user content for AI analysis',
  })
  @ApiResponse({
    status: 200,
    description: 'User content retrieved successfully',
    type: 'object',
  })
  async getUserContent(): Promise<{ content: string }> {
    const content = await this.aiTaskAssignmentService.getUserFileContent();
    return { content };
  }
}
