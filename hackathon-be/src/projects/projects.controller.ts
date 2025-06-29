import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
} from '../dto/project.dto';

export class AddUsersToProjectDto {
  userIds: string[];
}

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Retrieve a list of all projects in the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of projects retrieved successfully',
    type: [ProjectResponseDto],
  })
  async findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Retrieve a specific project by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project retrieved successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new project',
    description: 'Create a new project with the provided data',
  })
  @ApiBody({
    type: CreateProjectDto,
    description: 'Project data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project created successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid project data',
  })
  async create(@Body() projectData: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(projectData);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a project',
    description: 'Update an existing project with new data',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateProjectDto,
    description: 'Updated project data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project updated successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid project data',
  })
  async update(
    @Param('id') id: string,
    @Body() projectData: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(id, projectData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Delete a project by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Project deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }

  // User management endpoints

  @Post(':id/users')
  @ApiOperation({
    summary: 'Add users to project',
    description: 'Add multiple users to a project',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: AddUsersToProjectDto,
    description: 'User IDs to add to project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users added to project successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or users not found',
  })
  async addUsersToProject(
    @Param('id') id: string,
    @Body() dto: AddUsersToProjectDto,
  ): Promise<Project> {
    return this.projectsService.addUsersToProject(id, dto.userIds);
  }

  @Post(':id/users/add-five')
  @ApiOperation({
    summary: 'Add 5 users to project',
    description: 'Automatically add the first 5 active users to a project',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '5 users added to project successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found or no active users available',
  })
  async addFiveUsersToProject(@Param('id') id: string): Promise<Project> {
    return this.projectsService.addFiveUsersToProject(id);
  }

  @Delete(':id/users')
  @ApiOperation({
    summary: 'Remove users from project',
    description: 'Remove multiple users from a project',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: AddUsersToProjectDto,
    description: 'User IDs to remove from project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users removed from project successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async removeUsersFromProject(
    @Param('id') id: string,
    @Body() dto: AddUsersToProjectDto,
  ): Promise<Project> {
    return this.projectsService.removeUsersFromProject(id, dto.userIds);
  }

  @Get(':id/users')
  @ApiOperation({
    summary: 'Get project users',
    description: 'Get all users assigned to a project',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project users retrieved successfully',
    type: [User],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  async getProjectUsers(@Param('id') id: string): Promise<User[]> {
    return this.projectsService.getProjectUsers(id);
  }
}
