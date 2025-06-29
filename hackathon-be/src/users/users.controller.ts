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
import { UsersService } from './users.service';
import { User, UserRole, Department } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieve a list of all users in the system. Can be filtered by role or department.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filter users by role',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    enum: Department,
    description: 'Filter users by department',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users retrieved successfully',
    type: [UserResponseDto],
  })
  async findAll(
    @Query('role') role?: UserRole,
    @Query('department') department?: Department,
  ): Promise<User[]> {
    if (role) {
      return this.usersService.findByRole(role);
    }
    if (department) {
      return this.usersService.findByDepartment(department);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the provided data',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid user data',
  })
  async create(@Body() userData: CreateUserDto): Promise<User> {
    return this.usersService.create(userData);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Update an existing user with new data',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Updated user data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid user data',
  })
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Delete a user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Seed users data',
    description: 'Seed the database with sample user data from JSON file',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Users seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Users seeded successfully',
        },
      },
    },
  })
  async seedUsers(): Promise<{ message: string }> {
    await this.usersService.seedUsers();
    return { message: 'Users seeded successfully' };
  }

  @Get('roles/available')
  @ApiOperation({
    summary: 'Get available roles and departments',
    description: 'Retrieve all available user roles and departments',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Available roles and departments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: { type: 'string' },
          example: ['admin', 'manager', 'developer', 'qa', 'devops'],
        },
        departments: {
          type: 'array',
          items: { type: 'string' },
          example: ['Backend', 'Frontend', 'Mobile', 'AI', 'DevOps', 'Tester'],
        },
      },
    },
  })
  getAvailableRoles(): { roles: string[]; departments: string[] } {
    return {
      roles: Object.values(UserRole),
      departments: Object.values(Department),
    };
  }
}
