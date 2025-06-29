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
import { SubtasksService } from './subtasks.service';
import { Subtask, SubtaskStatus } from '../entities/subtask.entity';
import {
  CreateSubtaskDto,
  UpdateSubtaskDto,
  SubtaskResponseDto,
  UpdateSubtaskStatusDto,
  ReorderSubtasksDto,
} from '../dto/subtask.dto';

@ApiTags('subtasks')
@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all subtasks',
    description: 'Retrieve a list of all subtasks in the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of subtasks retrieved successfully',
    type: [SubtaskResponseDto],
  })
  async findAll(): Promise<Subtask[]> {
    return this.subtasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get subtask by ID',
    description: 'Retrieve a specific subtask by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Subtask ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subtask retrieved successfully',
    type: SubtaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subtask not found',
  })
  async findOne(@Param('id') id: string): Promise<Subtask> {
    return this.subtasksService.findOne(id);
  }

  @Get('task/:taskId')
  @ApiOperation({
    summary: 'Get subtasks by task',
    description: 'Retrieve all subtasks for a specific task',
  })
  @ApiParam({
    name: 'taskId',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subtasks retrieved successfully',
    type: [SubtaskResponseDto],
  })
  async findByTask(@Param('taskId') taskId: string): Promise<Subtask[]> {
    return this.subtasksService.findByTask(taskId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new subtask',
    description: 'Create a new subtask with the provided data',
  })
  @ApiBody({
    type: CreateSubtaskDto,
    description: 'Subtask data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subtask created successfully',
    type: SubtaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid subtask data',
  })
  async create(@Body() subtaskData: CreateSubtaskDto): Promise<Subtask> {
    return this.subtasksService.create(subtaskData);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a subtask',
    description: 'Update an existing subtask with new data',
  })
  @ApiParam({
    name: 'id',
    description: 'Subtask ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateSubtaskDto,
    description: 'Updated subtask data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subtask updated successfully',
    type: SubtaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subtask not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid subtask data',
  })
  async update(
    @Param('id') id: string,
    @Body() subtaskData: UpdateSubtaskDto,
  ): Promise<Subtask> {
    return this.subtasksService.update(id, subtaskData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a subtask',
    description: 'Delete a subtask by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Subtask ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Subtask deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subtask not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.subtasksService.remove(id);
  }

  @Put(':id/status')
  @ApiOperation({
    summary: 'Update subtask status',
    description: 'Update the status of a specific subtask',
  })
  @ApiParam({
    name: 'id',
    description: 'Subtask ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateSubtaskStatusDto,
    description: 'New subtask status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subtask status updated successfully',
    type: SubtaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subtask not found',
  })
  async updateStatus(
    @Param('id') subtaskId: string,
    @Body() body: UpdateSubtaskStatusDto,
  ): Promise<Subtask> {
    return this.subtasksService.updateStatus(subtaskId, body.status);
  }

  @Put('task/:taskId/reorder')
  @ApiOperation({
    summary: 'Reorder subtasks',
    description:
      'Reorder subtasks within a task by providing an array of subtask IDs in the desired order',
  })
  @ApiParam({
    name: 'taskId',
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: ReorderSubtasksDto,
    description: 'Subtask IDs in desired order',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subtasks reordered successfully',
    type: [SubtaskResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid subtask IDs',
  })
  async reorder(
    @Param('taskId') taskId: string,
    @Body() body: ReorderSubtasksDto,
  ): Promise<Subtask[]> {
    return this.subtasksService.reorder(taskId, body.subtaskIds);
  }

  @Get('statuses/available')
  @ApiOperation({
    summary: 'Get available subtask statuses',
    description: 'Retrieve all available subtask statuses',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Available statuses retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        statuses: {
          type: 'array',
          items: { type: 'string' },
          example: ['todo', 'in_progress', 'done'],
        },
      },
    },
  })
  getAvailableStatuses(): { statuses: string[] } {
    return {
      statuses: Object.values(SubtaskStatus),
    };
  }
}
