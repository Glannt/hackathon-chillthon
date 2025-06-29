import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskDifficulty,
} from '../entities/task.entity';
import { User, Department } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { TaskSeedData } from '../types/task-seed.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['project', 'assignedUser', 'subtasks'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'assignedUser', 'subtasks'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async findByProject(projectId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { projectId },
      relations: ['assignedUser', 'subtasks'],
    });
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assignedUserId: userId },
      relations: ['project', 'subtasks'],
    });
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { status },
      relations: ['project', 'assignedUser', 'subtasks'],
    });
  }

  async findByPriority(priority: TaskPriority): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { priority },
      relations: ['project', 'assignedUser', 'subtasks'],
    });
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    // Validate project exists
    if (taskData.projectId) {
      const project = await this.projectsRepository.findOne({
        where: { id: taskData.projectId },
      });
      if (!project) {
        throw new NotFoundException(
          `Project with ID ${taskData.projectId} not found`,
        );
      }
    }

    // Validate user exists if assigned
    if (taskData.assignedUserId) {
      const user = await this.usersRepository.findOne({
        where: { id: taskData.assignedUserId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${taskData.assignedUserId} not found`,
        );
      }
    }

    const task = this.tasksRepository.create(taskData);
    return this.tasksRepository.save(task);
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);

    // Validate project exists if changing
    if (taskData.projectId && taskData.projectId !== task.projectId) {
      const project = await this.projectsRepository.findOne({
        where: { id: taskData.projectId },
      });
      if (!project) {
        throw new NotFoundException(
          `Project with ID ${taskData.projectId} not found`,
        );
      }
    }

    // Validate user exists if changing assignment
    if (
      taskData.assignedUserId &&
      taskData.assignedUserId !== task.assignedUserId
    ) {
      const user = await this.usersRepository.findOne({
        where: { id: taskData.assignedUserId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${taskData.assignedUserId} not found`,
        );
      }
    }

    await this.tasksRepository.update(id, taskData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async assignToUser(taskId: string, userId: string): Promise<Task> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.tasksRepository.update(taskId, { assignedUserId: userId });
    return this.findOne(taskId);
  }

  async updateStatus(taskId: string, status: TaskStatus): Promise<Task> {
    await this.tasksRepository.update(taskId, { status });
    return this.findOne(taskId);
  }

  async updateProgress(taskId: string, progress: number): Promise<Task> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    const isCompleted = progress === 100;
    await this.tasksRepository.update(taskId, { progress, isCompleted });
    return this.findOne(taskId);
  }

  async seedTasks(): Promise<void> {
    try {
      // Check if tasks already exist
      const existingTasks = await this.tasksRepository.count();
      if (existingTasks > 0) {
        console.log('Tasks already exist, skipping seeding');
        return;
      }

      // Get or create a default project
      let project = await this.projectsRepository.findOne({
        where: { name: 'Movie Streaming Platform' },
      });

      if (!project) {
        project = await this.projectsRepository.save({
          name: 'Movie Streaming Platform',
          description:
            'A comprehensive movie streaming platform with user management, video streaming, and content management features',
          status: 'active',
          taskCount: 0,
          progressPercentage: 0,
        });
      }

      // Get users for assignment
      const users = await this.usersRepository.find();
      const backendUsers = users.filter(
        (u) => u.department === Department.BACKEND,
      );
      const frontendUsers = users.filter(
        (u) => u.department === Department.FRONTEND,
      );
      const aiUsers = users.filter((u) => u.department === Department.AI);

      // Read tasks from JSON file
      const tasksPath = path.join(process.cwd(), 'tasks.json');
      const tasksData = JSON.parse(
        fs.readFileSync(tasksPath, 'utf8'),
      ) as TaskSeedData[];

      const priorityMap: Record<number, TaskPriority> = {
        1: TaskPriority.LOW,
        2: TaskPriority.LOW,
        3: TaskPriority.MEDIUM,
        4: TaskPriority.HIGH,
        5: TaskPriority.URGENT,
      };

      const difficultyMap: Record<string, TaskDifficulty> = {
        Low: TaskDifficulty.EASY,
        Medium: TaskDifficulty.MEDIUM,
        High: TaskDifficulty.HARD,
      };

      for (const taskData of tasksData) {
        // Determine assigned user based on task type
        let assignedUser: User | null = null;
        const skills = taskData.mainSkill;

        if (skills.includes('Backend') && backendUsers.length > 0) {
          assignedUser =
            backendUsers[Math.floor(Math.random() * backendUsers.length)];
        } else if (skills.includes('Frontend') && frontendUsers.length > 0) {
          assignedUser =
            frontendUsers[Math.floor(Math.random() * frontendUsers.length)];
        } else if (skills.includes('AI') && aiUsers.length > 0) {
          assignedUser = aiUsers[Math.floor(Math.random() * aiUsers.length)];
        } else if (users.length > 0) {
          assignedUser = users[Math.floor(Math.random() * users.length)];
        }

        const task = this.tasksRepository.create({
          name: taskData.taskName,
          description: taskData.difficultyExplanation,
          priority: priorityMap[taskData.priorityReason] || TaskPriority.MEDIUM,
          difficulty: difficultyMap[taskData.taskType] || TaskDifficulty.MEDIUM,
          status: TaskStatus.TODO,
          estimatedHours:
            taskData.workload === 'Large'
              ? 40
              : taskData.workload === 'Medium'
                ? 20
                : 8,
          projectId: project.id,
          assignedUserId: assignedUser?.id,
        });

        await this.tasksRepository.save(task);
      }

      // Update project task count
      const totalTasks = await this.tasksRepository.count({
        where: { projectId: project.id },
      });
      await this.projectsRepository.update(project.id, {
        taskCount: totalTasks,
      });

      console.log(`Seeded ${tasksData.length} tasks successfully`);
    } catch (error) {
      console.error('Error seeding tasks:', error);
    }
  }
}
