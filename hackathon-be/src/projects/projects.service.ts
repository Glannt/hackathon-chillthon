import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['users', 'tasks'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['users', 'tasks'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(projectData: Partial<Project>): Promise<Project> {
    const project = this.projectsRepository.create(projectData);
    const savedProject = await this.projectsRepository.save(project);

    // Automatically add 5 users to the newly created project
    try {
      await this.addFiveUsersToProject(savedProject.id);
      // Return the project with users loaded
      return this.findOne(savedProject.id);
    } catch (error) {
      // If adding users fails, still return the created project
      console.warn(
        'Failed to add 5 users to project:',
        (error as Error).message,
      );
      return savedProject;
    }
  }

  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    await this.projectsRepository.update(id, projectData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.projectsRepository.delete(id);
  }

  /**
   * Add users to a project
   */
  async addUsersToProject(
    projectId: string,
    userIds: string[],
  ): Promise<Project> {
    const project = await this.findOne(projectId);
    const users = await this.usersRepository.findBy({ id: In(userIds) });

    if (users.length !== userIds.length) {
      const foundUserIds = users.map((user) => user.id);
      const missingUserIds = userIds.filter((id) => !foundUserIds.includes(id));
      throw new NotFoundException(
        `Users not found: ${missingUserIds.join(', ')}`,
      );
    }

    // Add new users to existing users (avoid duplicates)
    const existingUserIds = project.users?.map((user) => user.id) || [];
    const newUsers = users.filter((user) => !existingUserIds.includes(user.id));

    project.users = [...(project.users || []), ...newUsers];
    return this.projectsRepository.save(project);
  }

  /**
   * Remove users from a project
   */
  async removeUsersFromProject(
    projectId: string,
    userIds: string[],
  ): Promise<Project> {
    const project = await this.findOne(projectId);

    if (!project.users || project.users.length === 0) {
      return project; // No users to remove
    }

    project.users = project.users.filter((user) => !userIds.includes(user.id));
    return this.projectsRepository.save(project);
  }

  /**
   * Add 5 users to a project (convenience method)
   */
  async addFiveUsersToProject(projectId: string): Promise<Project> {
    // Get first 5 active users from database
    const users = await this.usersRepository.find({
      take: 5,
      where: { isActive: true },
      order: { createdAt: 'ASC' }, // Get oldest users first
    });

    if (users.length === 0) {
      throw new NotFoundException('No active users found in database');
    }

    const userIds = users.map((user) => user.id);
    return this.addUsersToProject(projectId, userIds);
  }

  /**
   * Get all users in a project
   */
  async getProjectUsers(projectId: string): Promise<User[]> {
    const project = await this.findOne(projectId);
    return project.users || [];
  }

  /**
   * Check if user is in project
   */
  async isUserInProject(projectId: string, userId: string): Promise<boolean> {
    const project = await this.findOne(projectId);
    return project.users?.some((user) => user.id === userId) || false;
  }

  /**
   * Get projects by user ID
   */
  async getProjectsByUser(userId: string): Promise<Project[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['projects'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.projects || [];
  }

  /**
   * Remove all users from a project
   */
  async removeAllUsersFromProject(projectId: string): Promise<Project> {
    const project = await this.findOne(projectId);
    project.users = [];
    return this.projectsRepository.save(project);
  }
}
