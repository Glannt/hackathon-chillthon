import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
} from 'class-validator';

export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Movie Streaming Platform',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Project description',
    example:
      'A comprehensive movie streaming platform with user management, video streaming, and content management features',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: 'Project name',
    example: 'Movie Streaming Platform v2',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Updated description for the movie streaming platform',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ProjectStatus,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}

export class ProjectResponseDto {
  @ApiProperty({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Movie Streaming Platform',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'A comprehensive movie streaming platform...',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Project status',
    enum: ProjectStatus,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({
    description: 'Number of tasks in the project',
    example: 38,
  })
  @IsNumber()
  taskCount: number;

  @ApiProperty({
    description: 'Project progress percentage',
    example: 25,
  })
  @IsNumber()
  progressPercentage: number;

  @ApiProperty({
    description: 'Project creation date',
    example: '2024-12-19T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Project last update date',
    example: '2024-12-19T10:30:00.000Z',
  })
  updatedAt: Date;
}
