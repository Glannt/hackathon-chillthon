import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { AiTaskAssignmentModule } from './ai-task-assignment/ai-task-assignment.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'hackathon_db',
      entities: [User, Task, Subtask], // ⚠️ Nhớ khai báo đúng path entity
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
      },
      // logging: true,
    }),
    ProjectsModule,
    UsersModule,
    TasksModule,
    SubtasksModule,
    AiTaskAssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
