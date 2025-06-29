import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsEmail, IsUUID } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  QA = 'qa',
  DEVOPS = 'devops',
}

export enum Department {
  BACKEND = 'Backend',
  FRONTEND = 'Frontend',
  MOBILE = 'Mobile',
  AI = 'AI',
  DEVOPS = 'DevOps',
  TESTER = 'Tester',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.DEVELOPER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'User department',
    enum: Department,
    example: Department.BACKEND,
  })
  @IsEnum(Department)
  department: Department;

  @ApiPropertyOptional({
    description: 'User position',
    example: 'Senior Developer',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'User experience level',
    example: '5 years',
  })
  @IsOptional()
  @IsString()
  experience?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User name',
    example: 'John Doe Updated',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'john.doe.updated@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User department',
    enum: Department,
  })
  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @ApiPropertyOptional({
    description: 'User position',
    example: 'Lead Developer',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'User experience level',
    example: '7 years',
  })
  @IsOptional()
  @IsString()
  experience?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'User department',
    enum: Department,
  })
  @IsEnum(Department)
  department: Department;

  @ApiPropertyOptional({
    description: 'User position',
    example: 'Senior Developer',
  })
  position?: string;

  @ApiPropertyOptional({
    description: 'User experience level',
    example: '5 years',
  })
  experience?: string;

  @ApiProperty({
    description: 'Number of projects completed',
    example: '15',
  })
  projectsDone: string;

  @ApiProperty({
    description: 'Average task completion rate',
    example: '85%',
  })
  avgTaskCompletion: string;

  @ApiProperty({
    description: 'Number of deadline misses',
    example: '2',
  })
  deadlineMisses: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2024-12-19T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2024-12-19T10:30:00.000Z',
  })
  updatedAt: Date;
}
