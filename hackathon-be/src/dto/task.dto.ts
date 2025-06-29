import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task name',
    example: 'Implement user authentication',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Task description',
    example:
      'Implement JWT-based authentication system with login/logout functionality',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({
    description: 'Assigned user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Task difficulty',
    enum: TaskDifficulty,
    default: TaskDifficulty.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskDifficulty)
  difficulty?: TaskDifficulty;

  @ApiPropertyOptional({
    description: 'Estimated hours to complete',
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedHours?: number;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Task name',
    example: 'Implement user authentication v2',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Updated description for authentication system',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Assigned user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: TaskPriority,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Task difficulty',
    enum: TaskDifficulty,
  })
  @IsOptional()
  @IsEnum(TaskDifficulty)
  difficulty?: TaskDifficulty;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Task progress percentage (0-100)',
    example: 50,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Estimated hours to complete',
    example: 25,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedHours?: number;
}

export class TaskResponseDto {
  @ApiProperty({
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Task name',
    example: 'Implement user authentication',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Implement JWT-based authentication system...',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({
    description: 'Assigned user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assignedUserId?: string;

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    description: 'Task difficulty',
    enum: TaskDifficulty,
  })
  @IsEnum(TaskDifficulty)
  difficulty: TaskDifficulty;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({
    description: 'Task progress percentage',
    example: 50,
  })
  @IsNumber()
  progress: number;

  @ApiProperty({
    description: 'Whether task is completed',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Estimated hours to complete',
    example: 20,
  })
  @IsNumber()
  estimatedHours: number;

  @ApiProperty({
    description: 'Task creation date',
    example: '2024-12-19T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Task last update date',
    example: '2024-12-19T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class AssignTaskDto {
  @ApiProperty({
    description: 'User ID to assign the task to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;
}

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'New task status',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class UpdateTaskProgressDto {
  @ApiProperty({
    description: 'Task progress percentage (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}
