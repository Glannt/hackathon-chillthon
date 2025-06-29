import { Module } from '@nestjs/common';
import { AiTaskAssignmentService } from './ai-task-assignment.service';
import { AiTaskAssignmentController } from './ai-task-assignment.controller';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TasksModule, UsersModule, ProjectsModule, ConfigModule],
  controllers: [AiTaskAssignmentController],
  providers: [AiTaskAssignmentService],
  exports: [AiTaskAssignmentService],
})
export class AiTaskAssignmentModule {}
