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

export enum SubtaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export class CreateSubtaskDto {
  @ApiProperty({
    description: 'Subtask name',
    example: 'Setup JWT middleware',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Subtask description',
    example: 'Configure JWT middleware for token validation',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Parent task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  taskId: string;

  @ApiPropertyOptional({
    description: 'Subtask order within the task',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({
    description: 'Subtask status',
    enum: SubtaskStatus,
    default: SubtaskStatus.TODO,
  })
  @IsOptional()
  @IsEnum(SubtaskStatus)
  status?: SubtaskStatus;
}

export class UpdateSubtaskDto {
  @ApiPropertyOptional({
    description: 'Subtask name',
    example: 'Setup JWT middleware v2',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Subtask description',
    example: 'Updated JWT middleware configuration',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Subtask order within the task',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({
    description: 'Subtask status',
    enum: SubtaskStatus,
  })
  @IsOptional()
  @IsEnum(SubtaskStatus)
  status?: SubtaskStatus;
}

export class SubtaskResponseDto {
  @ApiProperty({
    description: 'Subtask ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Subtask name',
    example: 'Setup JWT middleware',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Subtask description',
    example: 'Configure JWT middleware for token validation',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Parent task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  taskId: string;

  @ApiProperty({
    description: 'Subtask order within the task',
    example: 1,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'Subtask status',
    enum: SubtaskStatus,
  })
  @IsEnum(SubtaskStatus)
  status: SubtaskStatus;

  @ApiProperty({
    description: 'Subtask creation date',
    example: '2024-12-19T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Subtask last update date',
    example: '2024-12-19T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class UpdateSubtaskStatusDto {
  @ApiProperty({
    description: 'New subtask status',
    enum: SubtaskStatus,
  })
  @IsEnum(SubtaskStatus)
  status: SubtaskStatus;
}

export class ReorderSubtasksDto {
  @ApiProperty({
    description: 'Array of subtask IDs in the desired order',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '987fcdeb-51a2-43d1-b789-123456789abc',
    ],
    type: [String],
  })
  @IsUUID('4', { each: true })
  subtaskIds: string[];
}
