<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Hackathon Backend

A NestJS backend application with MySQL database configuration.

## Features

- MySQL database with TypeORM
- RESTful API for projects management
- User management with roles and departments
- Task management with priorities and difficulties
- Subtask management with ordering
- Entity-based data modeling
- Automatic database synchronization (development mode)
- Automatic data seeding on startup

## Installation

```bash
pnpm install
```

## Database Configuration

The application uses MySQL as the database with the following configuration:

- **Database**: MySQL 8.0+
- **Host**: server-mysql (Docker container name)
- **Port**: 3306
- **Database Name**: hackathon_db
- **Username**: root
- **Password**: password
- TypeORM with automatic synchronization (development only)
- Entity location: `src/entities/`

### Docker Setup

The application is configured to work with a MySQL Docker container named `server-mysql`.

1. **Start MySQL Container** (if not already running):

   ```bash
   docker run --name server-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=hackathon_db -p 3306:3306 -d mysql:8.0
   ```

2. **Setup Database** (Windows PowerShell):

   ```powershell
   .\scripts\setup-db.ps1
   ```

   **Or** (Linux/Mac):

   ```bash
   chmod +x scripts/setup-db.sh
   ./scripts/setup-db.sh
   ```

3. **Manual Database Setup** (if scripts don't work):
   ```bash
   docker exec -it server-mysql mysql -u root -ppassword
   ```
   Then run:
   ```sql
   CREATE DATABASE IF NOT EXISTS hackathon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=server-mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=hackathon_db

# Environment
NODE_ENV=development
PORT=3000
```

**Note**: The application will use these default values if no `.env` file is provided.

## Running the application

```bash
# development
pnpm run start:dev

# production mode
pnpm run start:prod
```

## Automatic Data Seeding

The application automatically seeds data on startup:

1. **Users**: 10 users with different roles and departments from `output_user.json`
2. **Tasks**: Movie streaming platform tasks from `tasks.json` with automatic user assignment
3. **Projects**: Default "Movie Streaming Platform" project

The seeding only occurs if the database is empty, so it won't duplicate data on subsequent runs.

## API Documentation

The application includes comprehensive API documentation powered by Swagger/OpenAPI.

### Accessing Swagger UI

Once the application is running, you can access the interactive API documentation at:

```
http://localhost:3000/api
```

### Features

- **Interactive Documentation**: Test API endpoints directly from the browser
- **Request/Response Schemas**: Detailed schemas for all DTOs with validation rules
- **Authentication Support**: Bearer token authentication configured for future use
- **Filtering Examples**: Query parameters for filtering users and tasks
- **Status Codes**: Complete HTTP status code documentation
- **Examples**: Sample requests and responses for all endpoints

### API Groups

The documentation is organized into the following groups:

- **Projects**: Project management endpoints
- **Users**: User management and filtering endpoints
- **Tasks**: Task management, assignment, and progress tracking
- **Subtasks**: Subtask management and reordering

### Validation

All API endpoints use class-validator decorators for request validation:

- **Required Fields**: Validated automatically
- **Data Types**: Type checking for strings, numbers, UUIDs, enums
- **Ranges**: Min/max validation for progress percentages
- **Enums**: Dropdown selection for status, priority, difficulty, etc.

---

## API Endpoints

### Projects

- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Users

- `GET /users` - Get all users
- `GET /users?role=developer` - Get users by role
- `GET /users?department=Backend` - Get users by department
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/seed` - Seed users data
- `GET /users/roles/available` - Get available roles and departments

### Tasks

- `GET /tasks` - Get all tasks
- `GET /tasks?status=todo` - Get tasks by status
- `GET /tasks?priority=high` - Get tasks by priority
- `GET /tasks?projectId=uuid` - Get tasks by project
- `GET /tasks?userId=uuid` - Get tasks by assigned user
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PUT /tasks/:id/assign` - Assign task to user
- `PUT /tasks/:id/status` - Update task status
- `PUT /tasks/:id/progress` - Update task progress
- `GET /tasks/statuses/available` - Get available statuses and priorities

### Subtasks

- `GET /subtasks` - Get all subtasks
- `GET /subtasks/:id` - Get subtask by ID
- `GET /subtasks/task/:taskId` - Get subtasks by task
- `POST /subtasks` - Create new subtask
- `PUT /subtasks/:id` - Update subtask
- `DELETE /subtasks/:id` - Delete subtask
- `PUT /subtasks/:id/status` - Update subtask status
- `PUT /subtasks/task/:taskId/reorder` - Reorder subtasks
- `GET /subtasks/statuses/available` - Get available statuses

## User Roles

- `admin` - Administrator
- `manager` - Project Manager
- `developer` - Developer
- `qa` - Quality Assurance
- `devops` - DevOps Engineer

## Departments

- `Backend` - Backend Development
- `Frontend` - Frontend Development
- `Mobile` - Mobile Development
- `AI` - Artificial Intelligence
- `DevOps` - DevOps
- `Tester` - Quality Assurance

## Task Priorities

- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority
- `urgent` - Urgent priority

## Task Difficulties

- `easy` - Easy difficulty
- `medium` - Medium difficulty
- `hard` - Hard difficulty
- `very_hard` - Very hard difficulty

## Task Statuses

- `todo` - To do
- `in_progress` - In progress
- `review` - Under review
- `done` - Completed
- `cancelled` - Cancelled

## Subtask Statuses

- `todo` - To do
- `in_progress` - In progress
- `done` - Completed

## Project Structure

```
src/
├── config/
│   └── database.config.ts    # Database configuration
├── entities/
│   ├── project.entity.ts     # Project entity
│   ├── user.entity.ts        # User entity
│   ├── task.entity.ts        # Task entity
│   └── subtask.entity.ts     # Subtask entity
├── projects/
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.module.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── tasks/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── subtasks/
│   ├── subtasks.controller.ts
│   ├── subtasks.service.ts
│   └── subtasks.module.ts
└── app.module.ts
```

## Database Schema

### Projects Table

- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `description` (TEXT, nullable)
- `status` (VARCHAR 50, default: 'active')
- `taskCount` (INT, default: 0)
- `progressPercentage` (INT, default: 0)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Users Table

- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `department` (ENUM: Backend, Frontend, Mobile, AI, DevOps, Tester)
- `position` (VARCHAR 255)
- `experience` (VARCHAR 50)
- `projectsDone` (INT, default: 0)
- `avgTaskCompletion` (VARCHAR 100)
- `deadlineMisses` (INT, default: 0)
- `role` (ENUM: admin, manager, developer, qa, devops)
- `email` (VARCHAR 255, unique, nullable)
- `password` (VARCHAR 255, nullable)
- `isActive` (BOOLEAN, default: true)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tasks Table

- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `description` (TEXT, nullable)
- `priority` (ENUM: low, medium, high, urgent)
- `difficulty` (ENUM: easy, medium, hard, very_hard)
- `status` (ENUM: todo, in_progress, review, done, cancelled)
- `dueDate` (DATE, nullable)
- `estimatedHours` (INT, default: 0)
- `actualHours` (INT, default: 0)
- `progress` (INT, default: 0)
- `isCompleted` (BOOLEAN, default: false)
- `projectId` (UUID, Foreign Key to Projects)
- `assignedUserId` (UUID, Foreign Key to Users, nullable)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Subtasks Table

- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `description` (TEXT, nullable)
- `status` (ENUM: todo, in_progress, done)
- `isCompleted` (BOOLEAN, default: false)
- `order` (INT, default: 0)
- `taskId` (UUID, Foreign Key to Tasks)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Relationships

- **Project ↔ Task**: 1 Project → N Tasks (Required)
- **User ↔ Task**: 1 User → N Tasks (Optional - tasks can be unassigned)
- **Task ↔ Subtask**: 1 Task → N Subtasks (Required)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
