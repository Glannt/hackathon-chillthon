import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  AssignTaskDto,
  UpdateTaskStatusDto,
  UpdateTaskProgressDto,
} from '../dto/task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'Retrieve a list of all tasks. Can be filtered by status, priority, project, or user.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus,
    description: 'Filter tasks by status',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: TaskPriority,
    description: 'Filter tasks by priority',
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    description: 'Filter tasks by project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter tasks by assigned user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tasks retrieved successfully',
    type: [TaskResponseDto],
  })
  async findAll(
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('projectId') projectId?: string,
    @Query('userId') userId?: string,
  ): Promise<Task[]> {
    if (status) {
      return this.tasksService.findByStatus(status);
    }
    if (priority) {
      return this.tasksService.findByPriority(priority);
    }
    if (projectId) {
      return this.tasksService.findByProject(projectId);
    }
    if (userId) {
      return this.tasksService.findByUser(userId);
    }
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Retrieve a specific task by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Create a new task with the provided data',
  })
  @ApiBody({
    type: CreateTaskDto,
    description: 'Task data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid task data',
  })
  async create(@Body() taskData: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(taskData);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a task',
    description: 'Update an existing task with new data',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTaskDto,
    description: 'Updated task data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid task data',
  })
  async update(
    @Param('id') id: string,
    @Body() taskData: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, taskData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Delete a task by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Put(':id/assign')
  @ApiOperation({
    summary: 'Assign task to user',
    description: 'Assign a task to a specific user',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: AssignTaskDto,
    description: 'User assignment data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task assigned successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task or user not found',
  })
  async assignToUser(
    @Param('id') taskId: string,
    @Body() body: AssignTaskDto,
  ): Promise<Task> {
    return this.tasksService.assignToUser(taskId, body.userId);
  }

  @Put(':id/status')
  @ApiOperation({
    summary: 'Update task status',
    description: 'Update the status of a specific task',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTaskStatusDto,
    description: 'New task status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task status updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async updateStatus(
    @Param('id') taskId: string,
    @Body() body: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateStatus(taskId, body.status);
  }

  @Put(':id/progress')
  @ApiOperation({
    summary: 'Update task progress',
    description: 'Update the progress percentage of a specific task',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTaskProgressDto,
    description: 'New task progress',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task progress updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid progress value (must be 0-100)',
  })
  async updateProgress(
    @Param('id') taskId: string,
    @Body() body: UpdateTaskProgressDto,
  ): Promise<Task> {
    return this.tasksService.updateProgress(taskId, body.progress);
  }

  @Get('statuses/available')
  @ApiOperation({
    summary: 'Get available statuses and priorities',
    description: 'Retrieve all available task statuses and priorities',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Available statuses and priorities retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        statuses: {
          type: 'array',
          items: { type: 'string' },
          example: ['todo', 'in_progress', 'review', 'done', 'cancelled'],
        },
        priorities: {
          type: 'array',
          items: { type: 'string' },
          example: ['low', 'medium', 'high', 'urgent'],
        },
      },
    },
  })
  getAvailableStatuses(): { statuses: string[]; priorities: string[] } {
    return {
      statuses: Object.values(TaskStatus),
      priorities: Object.values(TaskPriority),
    };
  }
}
