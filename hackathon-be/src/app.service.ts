import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { TasksService } from './tasks/tasks.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) {}

  async onModuleInit() {
    try {
      console.log('Initializing application...');

      // Seed users first
      await this.usersService.seedUsers();
      console.log('Users seeded successfully!');

      // Then seed tasks (which depend on users and projects)
      await this.tasksService.seedTasks();
      console.log('Tasks seeded successfully!');

      console.log('Application initialized successfully!');
    } catch (error) {
      console.error('Error during application initialization:', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
