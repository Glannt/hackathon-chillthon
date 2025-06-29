# CHANGELOG.md

## [2024-12-19-18:00] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi hiển thị tên user trong column "Assign To" của project-detail

**Nội dung thay đổi:**

- Cập nhật `src/pages/project-detail.tsx`:
  - Sửa phần convert tasks từ backend sang frontend format
  - Thay đổi `assignedTo.name: "User"` thành `assignedTo.name: task.assignedUser?.name || "Unassigned"`
  - Sử dụng thông tin `assignedUser` từ backend thay vì hardcode
  - Backend đã include `relations: ['assignedUser']` trong `findByProject()` method

**Lý do:**

- Column "Assign To" trong TaskTable chỉ hiển thị "User" thay vì tên thực tế của user được assign
- Backend đã trả về đầy đủ thông tin `assignedUser` nhưng frontend không sử dụng
- Cần hiển thị tên thực tế của user để user có thể biết task được assign cho ai

**Tác động:**

- Trực tiếp: `src/pages/project-detail.tsx`
- Rủi ro: Không có - chỉ cải thiện hiển thị data

**Mô tả workflows/logic:**

- **Backend Data**: `TasksService.findByProject()` trả về tasks với `assignedUser` relation loaded
- **Frontend Conversion**: Convert `task.assignedUser.name` thành `assignedTo.name` trong Task interface
- **Fallback**: Nếu không có assignedUser thì hiển thị "Unassigned"
- **Display**: TaskTable component hiển thị `task.assignedTo.name` trong Avatar và text

**Ghi chú:**

- Giờ đây column "Assign To" sẽ hiển thị tên thực tế của user được assign task
- Nếu task chưa được assign thì hiển thị "Unassigned"
- Backend đã có sẵn thông tin này, chỉ cần frontend sử dụng đúng cách
- Cải thiện user experience khi xem danh sách tasks

## [2024-12-19-17:50] [AI Assistant] [LOẠI: Tính năng]

### Cập nhật method create trong ProjectsService để tự động thêm 5 users vào project mới

**Nội dung thay đổi:**

- Cập nhật `src/projects/projects.service.ts`:
  - Method `create(projectData: Partial<Project>)` giờ tự động thêm 5 users vào project sau khi tạo
  - Sử dụng `addFiveUsersToProject()` để thêm 5 users active đầu tiên
  - Return project với users đã được load thông qua `findOne()`
  - Thêm error handling: nếu thêm users fail thì vẫn return project đã tạo
  - Fix linter error về unsafe member access với type cast `(error as Error).message`

**Lý do:**

- User muốn khi tạo project mới thì tự động có 5 users được thêm vào
- Cần automation để không phải thực hiện 2 bước riêng biệt (tạo project + thêm users)
- Cải thiện user experience khi tạo project

**Tác động:**

- Trực tiếp: `src/projects/projects.service.ts`
- Rủi ro: Không có - chỉ cải thiện existing functionality

**Mô tả workflows/logic:**

- **Create Project Flow**:

  1. Tạo project với data được cung cấp
  2. Lưu project vào database
  3. Tự động gọi `addFiveUsersToProject()` để thêm 5 users
  4. Return project với users đã được load
  5. Nếu thêm users fail thì vẫn return project (không fail toàn bộ operation)

- **Error Handling**:
  - Try-catch block để handle lỗi khi thêm users
  - Console warning nếu thêm users fail
  - Project vẫn được tạo thành công ngay cả khi thêm users fail

**Ghi chú:**

- Project mới tạo sẽ luôn có 5 users active đầu tiên
- Nếu không có users trong database thì project vẫn được tạo (chỉ có warning)
- Method `findOne()` được gọi để return project với relations loaded
- Type safety được cải thiện với proper error handling

## [2024-12-19-17:45] [AI Assistant] [LOẠI: Cải thiện]

### Cập nhật frontend project-detail để sử dụng API getProjectUsers thay vì getAllUsers

**Nội dung thay đổi:**

- Cập nhật `src/services/projects.service.ts`:
  - Thêm interface `ProjectUser` với các fields: id, firstName, lastName, email, role, isActive, createdAt, updatedAt
  - Thêm method `getProjectUsers(id: string): Promise<ProjectUser[]>` để gọi API `/projects/:id/users`
- Cập nhật `src/pages/project-detail.tsx`:
  - Thay thế `getAllUsers.execute()` bằng `ProjectsService.getProjectUsers(id)`
  - Import `ProjectsService` từ `@/services/projects.service`
  - Xóa import `useUsers` và `getAllUsers` vì không còn sử dụng
  - Cập nhật loading và error state để không còn phụ thuộc vào `getAllUsers`
  - Thêm error handling cho việc load project users với fallback về empty array
  - Cập nhật phần convert users thành team members format

**Lý do:**

- User muốn lấy team members từ project cụ thể thông qua API `/projects/:id/users` thay vì lấy tất cả users
- Cần hiển thị chính xác những users nào đang tham gia vào project
- Cải thiện performance bằng cách chỉ load users cần thiết

**Tác động:**

- Trực tiếp: `src/services/projects.service.ts`, `src/pages/project-detail.tsx`
- Rủi ro: Không có - chỉ thay đổi data source

**Mô tả workflows/logic:**

- **API Call**: `GET /projects/:id/users` trả về danh sách users của project
- **Data Conversion**: Convert `ProjectUser[]` thành `TeamMember[]` format cho frontend
- **Error Handling**: Nếu API fail thì fallback về empty team members array
- **Loading State**: Chỉ phụ thuộc vào `getProjectById` và `getTasksByProject`, không còn `getAllUsers`

**Ghi chú:**

- Team members giờ sẽ hiển thị chính xác users tham gia vào project
- Performance được cải thiện vì không load tất cả users
- Error handling robust hơn với fallback mechanism
- Code cleaner hơn với việc loại bỏ unused imports

## [2024-12-19-17:40] [AI Assistant] [LOẠI: Cải thiện]

### Cải thiện relationship many-to-many giữa User và Project

**Nội dung thay đổi:**

- Cập nhật `src/entities/project.entity.ts`:
  - Thêm cascade options cho relationships
  - `@OneToMany(() => Task, (task) => task.project, { cascade: true, onDelete: 'CASCADE' })`
  - `@ManyToMany(() => User, (user) => user.projects, { cascade: false, onDelete: 'CASCADE' })`
- Cập nhật `src/entities/user.entity.ts`:
  - Thêm cascade options cho relationships
  - `@OneToMany(() => Task, (task) => task.assignedUser, { cascade: false, onDelete: 'SET NULL' })`
  - `@ManyToMany(() => Project, (project) => project.users, { cascade: false, onDelete: 'CASCADE' })`
- Cập nhật `src/projects/projects.service.ts`:
  - Sử dụng `In` operator cho `findBy` method
  - Cải thiện `addUsersToProject()` để tránh duplicate users
  - Thêm method `getProjectsByUser(userId)` - lấy projects của user
  - Thêm method `removeAllUsersFromProject(projectId)` - xóa tất cả users khỏi project
  - Cải thiện error handling với thông báo chi tiết hơn
  - Thêm order by `createdAt: 'ASC'` trong `addFiveUsersToProject()`
- Tạo `scripts/migration-project-users.sql`:
  - Script migration để tạo table `project_users` với đúng structure
  - Thêm foreign key constraints và indexes
  - Sử dụng UTF-8 charset cho tiếng Việt

**Lý do:**

- Cần cải thiện relationship many-to-many để hoạt động ổn định hơn
- Cần cascade options phù hợp để tránh lỗi khi xóa data
- Cần migration script để đảm bảo database structure đúng
- Cần cải thiện error handling và performance

**Tác động:**

- Trực tiếp: `src/entities/project.entity.ts`, `src/entities/user.entity.ts`, `src/projects/projects.service.ts`, `scripts/migration-project-users.sql`
- Rủi ro: Cần chạy migration script để cập nhật database structure

**Mô tả workflows/logic:**

- **Cascade Options**:

  - Project → Tasks: `cascade: true, onDelete: 'CASCADE'` (xóa project thì xóa tasks)
  - Project ↔ Users: `cascade: false, onDelete: 'CASCADE'` (xóa project/user thì xóa relationship)
  - User → Tasks: `cascade: false, onDelete: 'SET NULL'` (xóa user thì set task.assignedUser = null)

- **Improved Methods**:

  - `addUsersToProject()`: Tránh duplicate users, error handling chi tiết
  - `addFiveUsersToProject()`: Lấy 5 users cũ nhất (order by createdAt ASC)
  - `getProjectsByUser()`: Lấy tất cả projects của một user
  - `removeAllUsersFromProject()`: Xóa tất cả users khỏi project

- **Database Migration**:
  - Tạo table `project_users` với composite primary key
  - Foreign key constraints với CASCADE options
  - Indexes cho performance
  - UTF-8 charset cho tiếng Việt

**Ghi chú:**

- Cần chạy `scripts/migration-project-users.sql` để cập nhật database
- Relationship many-to-many giờ hoạt động ổn định với proper cascade
- Error handling chi tiết hơn với thông báo user nào không tìm thấy
- Performance được cải thiện với proper indexes

## [2024-12-19-17:35] [AI Assistant] [LOẠI: Tính năng]

### Thêm relationship Project-User và cập nhật ProjectsService để quản lý users trong project

**Nội dung thay đổi:**

- Cập nhật `src/entities/project.entity.ts`:
  - Thêm ManyToMany relationship với User entity
  - Thêm `@JoinTable` với table `project_users`
  - Thêm field `users: User[]` để lưu danh sách users trong project
- Cập nhật `src/entities/user.entity.ts`:
  - Thêm ManyToMany relationship với Project entity
  - Thêm field `projects: Project[]` để lưu danh sách projects của user
- Cập nhật `src/projects/projects.service.ts`:
  - Thêm `UsersRepository` để truy cập User entity
  - Thêm method `addUsersToProject(projectId, userIds)` - thêm users vào project
  - Thêm method `removeUsersFromProject(projectId, userIds)` - xóa users khỏi project
  - Thêm method `addFiveUsersToProject(projectId)` - tự động thêm 5 users đầu tiên vào project
  - Thêm method `getProjectUsers(projectId)` - lấy danh sách users trong project
  - Thêm method `isUserInProject(projectId, userId)` - kiểm tra user có trong project không
  - Cập nhật `findAll()` và `findOne()` để load relations `users` và `tasks`
- Cập nhật `src/projects/projects.module.ts`:
  - Thêm User entity vào `TypeOrmModule.forFeature([Project, User])`
- Cập nhật `src/projects/projects.controller.ts`:
  - Thêm endpoint `POST /projects/:id/users` - thêm users vào project
  - Thêm endpoint `POST /projects/:id/users/add-five` - thêm 5 users vào project
  - Thêm endpoint `DELETE /projects/:id/users` - xóa users khỏi project
  - Thêm endpoint `GET /projects/:id/users` - lấy danh sách users trong project
  - Thêm DTO `AddUsersToProjectDto` cho request body
- Cập nhật `src/ai-task-assignment/ai-task-assignment.service.ts`:
  - Cập nhật `getUserFileContent()` để sử dụng users từ project relationship
  - Thay đổi logic từ lấy users từ tasks sang lấy users từ project.users

**Lý do:**

- User muốn thêm 5 users vào project service
- Cần relationship nhiều-nhiều giữa Project và User
- Cần API endpoints để quản lý users trong project
- AI Task Assignment cần sử dụng users thực tế trong project thay vì tất cả users

**Tác động:**

- Trực tiếp: `src/entities/project.entity.ts`, `src/entities/user.entity.ts`, `src/projects/projects.service.ts`, `src/projects/projects.module.ts`, `src/projects/projects.controller.ts`, `src/ai-task-assignment/ai-task-assignment.service.ts`
- Rủi ro: Cần migration database để tạo table `project_users`

**Mô tả workflows/logic:**

- **Project-User Relationship**: ManyToMany với join table `project_users`
- **Add Users to Project**:
  - `POST /projects/:id/users` với body `{userIds: ["id1", "id2"]}`
  - `POST /projects/:id/users/add-five` tự động thêm 5 users đầu tiên
- **Remove Users from Project**: `DELETE /projects/:id/users` với body `{userIds: ["id1", "id2"]}`
- **Get Project Users**: `GET /projects/:id/users` trả về danh sách users
- **AI Task Assignment**: Sử dụng `project.users` thay vì tất cả users trong database

**Ghi chú:**

- Cần chạy migration để tạo table `project_users` nếu chưa có
- AI Task Assignment giờ sẽ chỉ phân tích users thực tế trong project
- Method `addFiveUsersToProject()` tự động lấy 5 users active đầu tiên
- Tất cả endpoints đều có Swagger documentation đầy đủ

## [2024-12-19-17:30] [AI Assistant] [LOẠI: Tính năng]

### Cập nhật AI Task Assignment Service để sử dụng ConfigService và tạo task/user content từ database

**Nội dung thay đổi:**

- Cập nhật `src/ai-task-assignment/ai-task-assignment.service.ts`:
  - Thay thế `process.env` bằng `ConfigService` của NestJS ConfigModule
  - Thêm method `getTaskFileContent(projectId)` để lấy tasks từ project và convert thành JSON format như `lam_phim.json`
  - Thêm method `getUserFileContent(projectId?)` để lấy users từ project và convert thành JSON format như `output_user.json`
  - Thêm helper methods: `groupTasksByStatus()`, `formatStatusName()`
  - Thêm proper TypeScript interfaces: `UserTaskMapping`, `TaskData`, `UserData`, `TaskGroup`
  - Cải thiện type safety và error handling
  - Fix linter errors và formatting issues
- Cập nhật `src/ai-task-assignment/ai-task-assignment.controller.ts`:
  - Truyền `projectId` vào `getUserFileContent()` method
- Cập nhật `ai_integration.py`:
  - Thêm fallback để sử dụng environment variable `GEMINI_API_KEY` nếu không có API key parameter
  - Thêm mock data fallback khi không có API key
  - Cải thiện error handling và logging

**Lý do:**

- User muốn `getTaskFileContent` lấy tasks từ database project và convert thành format như `lam_phim.json`
- User muốn `getUserFileContent` lấy users từ project và convert thành format như `output_user.json`
- Cần chuyển `process.env` thành `ConfigService` để tuân thủ NestJS best practices
- Cần cải thiện type safety và error handling

**Tác động:**

- Trực tiếp: `src/ai-task-assignment/ai-task-assignment.service.ts`, `src/ai-task-assignment/ai-task-assignment.controller.ts`, `ai_integration.py`
- Rủi ro: Không có - chỉ cải thiện existing functionality

**Mô tả workflows/logic:**

- `getTaskFileContent(projectId)`:

  - Lấy project từ database
  - Lấy tất cả tasks của project đó
  - Group tasks theo status (todo, in_progress, review, done, cancelled)
  - Convert thành format JSON như `lam_phim.json` với structure `[{step: "Status", tasks: ["task1", "task2"]}]`
  - Fallback về default task structure nếu không có tasks

- `getUserFileContent(projectId?)`:

  - Nếu có projectId: lấy users được assign vào tasks của project đó
  - Nếu không có users assigned: lấy tất cả users
  - Convert thành format JSON như `output_user.json` với fields: Id, Name, Department, Position, Experience, ProjectsDone, AvgTaskCompletion, DeadlineMisses
  - Map user data từ database fields sang expected format

- ConfigService integration:
  - Sử dụng `this.configService.get<string>('GEMINI_API_KEY')` thay vì `process.env.GEMINI_API_KEY`
  - Tuân thủ NestJS dependency injection pattern

**Ghi chú:**

- Task grouping theo status giúp AI model hiểu rõ hơn về project structure
- User data format match với `output_user.json` để AI model có thể process
- ConfigService giúp code testable và configurable hơn
- Type safety được cải thiện với proper interfaces
- Error handling robust hơn với try-catch blocks và fallback values

## [2024-12-19-17:25] [AI Assistant] [LOẠI: Tính năng]

### Thêm button "Assign Task with AI" vào frontend project detail page

**Nội dung thay đổi:**

- Cập nhật `src/pages/project-detail.tsx`:
  - Thêm button "Assign with AI" với icon 🤖 bên cạnh button "Add Task"
  - Thêm state `isAssigningAI` và `aiAssignmentResult` để handle AI assignment
  - Thêm function `handleAssignTaskWithAI()` để gọi API AI assignment
  - Hiển thị loading state và error handling cho AI assignment
  - Reload project data sau khi AI assignment thành công
- Tạo `src/components/projects/ai-assignment-result.tsx`:
  - Component hiển thị kết quả AI assignment một cách đẹp mắt
  - Hiển thị success rate với progress bar
  - Hiển thị danh sách successful và failed assignments
  - Hiển thị AI analysis summary
  - Sử dụng emoji icons thay vì heroicons
- Tạo `src/services/ai-task-assignment.service.ts`:
  - Service class để handle AI task assignment API calls
  - Methods: `runAIAnalysis()`, `applyAssignments()`, `assignTasksWithAI()`
  - Type definitions cho AI analysis và assignment results
  - Complete workflow từ analysis đến assignment

**Lý do:**

- User muốn có button trên frontend để trigger AI task assignment
- Cần UI đẹp để hiển thị kết quả AI assignment
- Cần service layer để handle API calls một cách organized
- Cần loading states và error handling cho user experience tốt

**Tác động:**

- Trực tiếp: `src/pages/project-detail.tsx`, `src/components/projects/ai-assignment-result.tsx`, `src/services/ai-task-assignment.service.ts`
- Rủi ro: Không có - chỉ thêm UI và service layer

**Mô tả workflows/logic:**

- User click button "Assign with AI" → `handleAssignTaskWithAI()` → `AITaskAssignmentService.assignTasksWithAI()`
- Service gọi API `/ai-task-assignment/{projectId}/run` để chạy AI analysis
- Service gọi API `/ai-task-assignment/{projectId}/apply` để apply assignments
- Kết quả được hiển thị qua `AIAssignmentResult` component
- Project data được reload để hiển thị updated assignments
- Loading state và error handling được handle đầy đủ

**Ghi chú:**

- Button chỉ hiển thị khi `canEdit = true`
- Loading state hiển thị spinner và disable button
- Error state hiển thị error message với retry option
- Success state hiển thị success rate và assignment details
- Component sử dụng emoji icons để tránh dependency issues
- Service layer giúp code organized và reusable

## [2024-12-19-17:20] [AI Assistant] [LOẠI: Tính năng]

### Tích hợp AI Task Assignment với model.py và Gemini API

**Nội dung thay đổi:**

- Tạo `src/ai-task-assignment/ai-task-assignment.service.ts`:
  - Service tích hợp model.py với backend NestJS
  - Chạy AI analysis sử dụng Gemini API
  - Tự động assign task cho users dựa trên AI recommendations
  - Handle file input/output cho Python model
  - Error handling và logging
- Tạo `src/ai-task-assignment/ai-task-assignment.controller.ts`:
  - API endpoints cho AI task assignment
  - POST `/ai-task-assignment/{projectId}/run` - Chạy AI analysis
  - POST `/ai-task-assignment/{projectId}/apply` - Apply assignments
  - GET `/ai-task-assignment/{projectId}/task-content` - Lấy task content
  - GET `/ai-task-assignment/user-content` - Lấy user data
- Tạo `src/ai-task-assignment/ai-task-assignment.module.ts`:
  - Module configuration cho AI task assignment
  - Import dependencies từ Tasks, Users, Projects modules
- Tạo `ai_integration.py`:
  - Script Python tích hợp với model.py gốc
  - Sử dụng Gemini API cho task analysis và assignment
  - Parse markdown tables và extract user-task mapping
  - Handle API key configuration
- Tạo `AI_TASK_ASSIGNMENT_README.md`:
  - Hướng dẫn cài đặt và sử dụng
  - API documentation
  - Troubleshooting guide
- Cập nhật `src/app.module.ts`:
  - Thêm AiTaskAssignmentModule vào imports

**Lý do:**

- User muốn tích hợp model.py để tự động assign task
- Cần tích hợp AI model với backend NestJS
- Sử dụng file `làm phim.txt` làm task input
- Sử dụng file `output_user.json` làm user data
- Tạo mapping giống file `User_Task_Mapping (2).json`
- Tự động assign task vào database dựa trên AI recommendations

**Tác động:**

- Trực tiếp: `src/ai-task-assignment/`, `ai_integration.py`, `AI_TASK_ASSIGNMENT_README.md`, `src/app.module.ts`
- Rủi ro: Cần cài đặt Python dependencies và Gemini API key

**Mô tả workflows/logic:**

- User gọi API `/ai-task-assignment/{projectId}/run`
- Service đọc task content từ file hoặc custom input
- Service lấy user data từ database và format theo cấu trúc cần thiết
- Chạy Python script `ai_integration.py` với input files
- AI model phân tích task và tạo user-task mapping
- Trả về kết quả analysis và mapping
- User gọi API `/ai-task-assignment/{projectId}/apply` với mapping
- Service tìm user ID và task ID tương ứng trong database
- Update task assignment trong database
- Trả về kết quả assignment với success/error status

**Ghi chú:**

- Cần cài đặt Python dependencies: `google-generativeai pandas streamlit`
- Cần cấu hình Gemini API key trong environment variable
- AI model sử dụng prompts từ model.py gốc
- User name phải match với database field `name`
- Task name phải có pattern `TASK{number}` để mapping
- Có fallback mock data khi không có API key
- Error handling cho các trường hợp lỗi Python script, API key, user/task not found

## [2024-12-19-17:15] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi TaskTable status badge error - Cannot read properties of undefined (reading 'color')

**Nội dung thay đổi:**

- Cập nhật `src/components/projects/task-table.tsx`:
  - Sửa `getStatusBadge` function để handle backend status values đúng cách
  - Thêm backend status values: `todo`, `done`, `cancelled` thay vì `pending`, `completed`
  - Thêm fallback handling cho unknown status values
  - Thêm error handling để tránh undefined config error
- Cập nhật `src/types/project-detail.ts`:
  - Đổi Task interface status field từ `"pending" | "in_progress" | "review" | "completed"` thành `"todo" | "in_progress" | "review" | "done" | "cancelled"`
  - Match với backend TaskStatus enum values
- Cập nhật `src/pages/project-detail.tsx`:
  - Sửa task conversion logic để handle backend status values
  - Thêm fallback values cho status và priority fields
  - Sửa `calculateStats` function để sử dụng `"done"` thay vì `"completed"`

**Lý do:**

- Lỗi "Cannot read properties of undefined (reading 'color')" xảy ra vì frontend expected status values khác với backend
- Backend sử dụng: `todo`, `in_progress`, `review`, `done`, `cancelled`
- Frontend expected: `pending`, `in_progress`, `review`, `completed`
- Status config object không có entry cho backend status values nên trả về undefined
- Cần align frontend types và logic với backend actual values

**Tác động:**

- Trực tiếp: `src/components/projects/task-table.tsx`, `src/types/project-detail.ts`, `src/pages/project-detail.tsx`
- Rủi ro: Có thể cần cập nhật các components khác nếu sử dụng old status values

**Mô tả workflows/logic:**

- Backend TaskStatus enum: `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`, `CANCELLED`
- Frontend Task interface giờ match với backend values
- getStatusBadge function handle cả backend và frontend status values
- Fallback handling cho unknown status values
- Stats calculation sử dụng `"done"` thay vì `"completed"`

**Ghi chú:**

- Lỗi này xảy ra do mismatch giữa frontend expected status values và backend actual values
- Backend enum values được convert thành lowercase strings khi serialize
- Fallback handling đảm bảo component không crash với unknown status values
- Type safety được cải thiện với proper status value alignment

## [2024-12-19-17:10] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi ProjectOverview component error với date handling và error boundaries

**Nội dung thay đổi:**

- Cập nhật `src/components/tasks/project-overview.tsx`:
  - Sửa `formatDate` function để handle cả Date object và string
  - Thêm try-catch block để handle date parsing errors
  - Thêm null checks cho projects array và project properties
  - Thêm fallback values cho missing properties (name, taskCount, status, progressPercentage)
  - Cải thiện error handling với console.error logging
- Cập nhật `src/pages/create-task.tsx`:
  - Cải thiện `convertProjectForOverview` function để handle date conversion
  - Thêm type checking cho createdAt và updatedAt fields
  - Convert string dates thành Date objects nếu cần

**Lý do:**

- ProjectOverview component bị crash do date formatting errors
- API response có thể trả về dates dưới dạng string thay vì Date objects
- Missing properties có thể gây runtime errors
- Cần robust error handling để tránh component crashes

**Tác động:**

- Trực tiếp: `src/components/tasks/project-overview.tsx`, `src/pages/create-task.tsx`
- Rủi ro: Không có - chỉ thêm error handling và safety checks

**Mô tả workflows/logic:**

- formatDate function giờ handle cả string và Date input
- Try-catch block bắt date parsing errors và return "Invalid date"
- Null checks đảm bảo component không crash với empty data
- Fallback values hiển thị meaningful defaults thay vì undefined
- Date conversion trong create-task page đảm bảo type consistency

**Ghi chú:**

- Error này xảy ra do mismatch giữa expected Date objects và actual string dates từ API
- Component giờ robust hơn với proper error boundaries
- Date handling works với cả frontend Date objects và API string dates
- Fallback values đảm bảo UI luôn hiển thị meaningful information

## [2024-12-19-17:05] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi Project ID không tồn tại bằng cách fetch real projects từ API

**Nội dung thay đổi:**

- Cập nhật `src/pages/create-task.tsx`:
  - Thay thế mock `projectsData` và `usersData` bằng real API calls
  - Thêm `useEffect` để load projects và users từ API khi component mount
  - Sử dụng `ProjectsService.getAllProjects()` và `UsersService.getAllUsers()`
  - Thêm loading states và error handling cho data fetching
  - Thêm "Unassigned" user option vào users list từ API
  - Xử lý type conversion giữa API Project và TaskForm Project types
  - Thêm `convertProjectForOverview()` function để convert data types

**Lý do:**

- Lỗi "Project with ID 2 not found" xảy ra vì frontend sử dụng mock project data với IDs "1", "2", "3", "4"
- Backend database có project IDs thực tế (UUIDs) khác với mock data
- Cần fetch real projects từ API để có đúng project IDs
- Cần fetch real users từ API để có đúng user IDs

**Tác động:**

- Trực tiếp: `src/pages/create-task.tsx`
- Rủi ro: Có thể cần cập nhật các components khác nếu có type conflicts

**Mô tả workflows/logic:**

- Component mount → `useEffect` → `loadData()` → Fetch projects + users từ API → Set state
- Loading state hiển thị spinner trong khi fetch data
- Error state hiển thị error message với retry button
- "Unassigned" user được thêm vào đầu users list
- Project data được convert để tương thích với ProjectOverview component
- Task creation sử dụng real project IDs từ API

**Ghi chú:**

- Lỗi này xảy ra do mismatch giữa mock project IDs và real database IDs
- API calls được thực hiện song song để tối ưu performance
- Type conversion cần thiết vì API Project và TaskForm Project có cấu trúc khác nhau
- "Unassigned" user vẫn được xử lý đặc biệt (id = "unassigned")

## [2024-12-19-17:00] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi Controlled/Uncontrolled Input Warning và cải thiện xử lý Unassigned User

**Nội dung thay đổi:**

- Cập nhật `src/components/tasks/task-form.tsx`:
  - Sửa lỗi "A component is changing an uncontrolled input to be controlled"
  - Đổi `estimatedHours` default từ `undefined` thành `0` để tránh controlled/uncontrolled warning
  - Cải thiện `handleNumberChange` để luôn trả về số (0 nếu undefined)
  - Cập nhật `handleSubmit` để xử lý "unassigned" user đúng cách
  - Nếu `estimatedHours` là 0 thì set thành `undefined` cho API call
- Cập nhật `src/pages/create-task.tsx`:
  - Sửa logic xử lý `assignedUserId` để check chính xác "unassigned"
  - Đơn giản hóa logic: nếu là "unassigned" thì set thành `undefined`

**Lý do:**

- React warning về controlled/uncontrolled input khi value thay đổi từ undefined sang defined
- Cần đảm bảo estimatedHours luôn có giá trị xác định (0 thay vì undefined)
- Cần xử lý "unassigned" user đúng cách để tránh lỗi API
- Cần đảm bảo projectId mapping hoạt động đúng với project hiện tại

**Tác động:**

- Trực tiếp: `src/components/tasks/task-form.tsx`, `src/pages/create-task.tsx`
- Rủi ro: Không có - chỉ sửa lỗi warning và cải thiện logic

**Mô tả workflows/logic:**

- estimatedHours luôn có giá trị xác định (0 hoặc số dương)
- Khi submit: nếu estimatedHours = 0 thì gửi undefined cho API
- assignedUserId = "unassigned" → undefined cho API
- ProjectId được map đúng với project được chọn
- Không còn React warning về controlled/uncontrolled input

**Ghi chú:**

- Warning này xảy ra khi input value thay đổi từ undefined sang defined
- estimatedHours = 0 trong form nhưng undefined trong API call (optional field)
- "unassigned" user có id "unassigned" và được xử lý đặc biệt
- ProjectId mapping hoạt động với URL params và form selection

## [2024-12-19-16:55] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi preventDefault không phải function trong TaskForm

**Nội dung thay đổi:**

- Cập nhật `src/components/tasks/task-form.tsx`:
  - Sửa lỗi `e.preventDefault is not a function`
  - Loại bỏ `<form>` wrapper và `onSubmit` handler
  - Đổi `handleSubmit` từ `(e: React.FormEvent)` thành `()` (không cần event parameter)
  - Gọi `handleSubmit` trực tiếp từ Button `onPress` thay vì form submit
  - Thay `<form>` bằng `<div>` wrapper

**Lý do:**

- HeroUI Button component sử dụng `onPress` event (PressEvent) thay vì form submit event
- PressEvent không có `preventDefault()` method
- Cần loại bỏ form submission logic và sử dụng button press logic

**Tác động:**

- Trực tiếp: `src/components/tasks/task-form.tsx`
- Rủi ro: Không có - chỉ sửa lỗi event handling

**Mô tả workflows/logic:**

- User click "Create Task" button → `onPress` event → `handleSubmit()` → `validateForm()` → `onSubmit(formData)`
- Không còn form submission, chỉ sử dụng button press events
- Validation logic vẫn hoạt động bình thường
- Form data được truyền đúng cách đến parent component

**Ghi chú:**

- Lỗi này xảy ra do conflict giữa traditional form submission và HeroUI Button events
- HeroUI Button sử dụng `onPress` thay vì `onClick` hoặc form submit
- Form validation vẫn hoạt động đúng cách
- Không ảnh hưởng đến functionality, chỉ sửa event handling

## [2024-12-19-16:50] [AI Assistant] [LOẠI: Tính năng]

### Tích hợp Create Task API từ Backend và xử lý Unassigned Users

**Nội dung thay đổi:**

- Cập nhật `src/types/task-form.ts`:
  - Sửa `CreateTaskForm` interface để match với backend `CreateTaskDto`
  - Loại bỏ `status` và `dueDate` fields (không có trong backend DTO)
  - Đổi `description` thành required field
  - Đổi `priority`, `difficulty`, `estimatedHours` thành optional
  - Cập nhật `TaskFormValidation` interface tương ứng
- Cập nhật `src/data/task-form.ts`:
  - Thêm "Unassigned" user option với id "unassigned"
  - Đặt "Unassigned" làm option đầu tiên trong usersData
- Cập nhật `src/pages/create-task.tsx`:
  - Thay thế mock API call bằng `TasksService.createTask()`
  - Thêm error handling và display
  - Xử lý `assignedUserId`: nếu là "unassigned" thì set thành `undefined`
  - Navigate đến project detail page sau khi tạo task thành công
  - Cập nhật breadcrumbs và navigation links
- Cập nhật `src/components/tasks/task-form.tsx`:
  - Loại bỏ `status` và `dueDate` fields khỏi form
  - Đổi `priority` và `difficulty` thành optional (không required)
  - Set default `assignedUserId` thành "unassigned"
  - Cập nhật validation logic
  - Sửa event handlers cho compatibility

**Lý do:**

- Đồng bộ frontend với cấu trúc dữ liệu từ tasks.json
- Cung cấp form tạo task đầy đủ với tất cả fields cần thiết
- Cải thiện UX với skill categorization và validation
- Chuẩn hóa data structure giữa frontend và backend

**Tác động:**

- Trực tiếp: `src/types/task-form.ts`, `src/data/task-form.ts`, `src/components/tasks/`, `src/pages/create-task.tsx`
- Rủi ro: Có thể cần cập nhật các components khác sử dụng Project/User types cũ

**Mô tả workflows/logic:**

- Task form giờ có đầy đủ fields: name, description, priority, difficulty, status, projectId, assignedUserId, dueDate, estimatedHours, taskType, mainSkill, workload, priorityReason
- Skill selector được group theo Backend, Frontend, General categories
- Validation đảm bảo tất cả required fields được điền
- Form layout responsive với grid system

**Ghi chú:**

- Cần test form với backend API để đảm bảo compatibility
- Skill options được extract từ tasks.json và phân loại
- Project và User data được cập nhật để match với backend structure
- Form validation bao gồm tất cả required fields

## [2024-12-19-16:45] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi toISOString không phải function trong project-detail page

**Nội dung thay đổi:**

- Cập nhật `src/pages/project-detail.tsx`:
  - Sửa lỗi `projectData.createdAt.toISOString is not a function`
  - Thêm type checking cho `createdAt` và `updatedAt` fields
  - Xử lý cả trường hợp string và Date object từ API response
  - Sử dụng conditional logic: nếu là string thì giữ nguyên, nếu là Date thì convert sang ISO string

**Lý do:**

- API response trả về `createdAt` và `updatedAt` dưới dạng string, không phải Date object
- Code cũ giả định đây là Date object và gọi `.toISOString()` trực tiếp
- Cần xử lý cả hai trường hợp để đảm bảo compatibility

**Tác động:**

- Trực tiếp: `src/pages/project-detail.tsx`
- Rủi ro: Không có - chỉ sửa lỗi type conversion

**Mô tả workflows/logic:**

- Kiểm tra type của `projectData.createdAt` và `projectData.updatedAt`
- Nếu là string: sử dụng trực tiếp
- Nếu là Date object: convert sang ISO string bằng `new Date().toISOString()`
- Đảm bảo frontend ProjectDetail interface nhận được string format cho dates

**Ghi chú:**

- Lỗi này xảy ra khi API trả về date dưới dạng string thay vì Date object
- Type checking giúp handle cả hai format để tương thích với backend
- Frontend ProjectDetail interface expect string format cho createdAt và updatedAt
- Tương tự có thể áp dụng cho task dueDate nếu cần

## [2024-12-19-16:40] [AI Assistant] [LOẠI: Sửa lỗi]

### Sửa lỗi require() không được định nghĩa trong useApi.ts

**Nội dung thay đổi:**

- Cập nhật `src/hooks/useApi.ts`:
  - Thay thế `require()` statements bằng ES6 imports
  - Import trực tiếp các service classes: `ProjectsService`, `UsersService`, `TasksService`
  - Sử dụng static methods từ service classes thay vì instance methods
  - Xóa import `subtasksService` vì file service này hiện tại trống
  - Xóa `useSubtasks()` hook vì chưa có implementation

**Lý do:**

- `require()` không được hỗ trợ trong browser environment (ES modules)
- Cần sử dụng ES6 import syntax cho frontend React app
- Service classes sử dụng static methods nên cần import class names
- Subtasks service chưa được implement nên cần xóa để tránh lỗi

**Tác động:**

- Trực tiếp: `src/hooks/useApi.ts`
- Rủi ro: Không có - chỉ sửa lỗi import syntax

**Mô tả workflows/logic:**

- Thay đổi từ `const { projectsService } = require("../services")` thành `import { ProjectsService } from "../services/projects.service"`
- Sử dụng `ProjectsService.getAllProjects` thay vì `projectsService.getAllProjects`
- Tương tự cho UsersService và TasksService
- Xóa useSubtasks hook vì chưa có implementation

**Ghi chú:**

- Lỗi này xảy ra khi project-detail page cố gắng sử dụng useApi hooks
- require() chỉ hoạt động trong Node.js environment, không phải browser
- ES6 imports là cách chuẩn cho frontend React applications
- Cần implement subtasks service nếu muốn sử dụng useSubtasks hook sau này

## [2024-12-19-16:35] [AI Assistant] [LOẠI: Tính năng]

### Cập nhật Project Detail Page để sử dụng API thay vì Mock Data

**Nội dung thay đổi:**

- Cập nhật `src/pages/project-detail.tsx`:
  - Thêm `useParams` để lấy project ID từ URL route `/projects/:id`
  - Thêm `useNavigate` để navigation giữa các pages
  - Sử dụng API hooks: `useProjects`, `useTasks`, `useUsers`
  - Thay thế mock data bằng real API calls:
    - `getProjectById.execute(id)` để lấy project details
    - `getTasksByProject.execute(id)` để lấy tasks của project
    - `getAllUsers.execute()` để lấy danh sách users cho team members
  - Thêm state management cho project data, tasks, team members, stats
  - Thêm loading states và error handling
  - Thêm data conversion từ backend format sang frontend format
  - Thêm `calculateStats()` function để tính toán statistics từ tasks
  - Cập nhật navigation handlers để sử dụng React Router
  - Thêm loading spinner và error UI components

**Lý do:**

- Thay thế mock data bằng real API data để có dữ liệu thực từ backend
- Cần fetch project details, tasks, và team members từ database
- Cần tính toán statistics dựa trên real task data
- Cần proper error handling và loading states cho UX tốt hơn
- Cần navigation thực tế giữa các pages

**Tác động:**

- Trực tiếp: `src/pages/project-detail.tsx`
- Rủi ro: Có thể cần cập nhật data conversion logic nếu backend API thay đổi

**Mô tả workflows/logic:**

- Page load: Lấy project ID từ URL params → Fetch project details → Fetch tasks → Fetch users → Calculate stats → Render UI
- Data conversion: Backend Project → Frontend ProjectDetail, Backend Task → Frontend Task, Backend User → Frontend TeamMember
- Stats calculation: Dựa trên task status và due dates để tính completed, in-progress, overdue tasks
- Error handling: Hiển thị error message và retry button nếu API calls fail
- Loading states: Hiển thị spinner trong khi đang fetch data

**Ghi chú:**

- Project ID được lấy từ URL route `/projects/:id`
- Tasks được filter theo projectId từ backend
- Team members hiện tại lấy tất cả users, có thể cần filter theo project team sau này
- Stats được tính real-time từ task data
- Navigation "Add Task" redirects đến `/projects/:id/task`

## [2024-12-19-16:30] [AI Assistant] [LOẠI: Refactor]

### Chuyển đổi field names từ tiếng Việt sang tiếng Anh

**Nội dung thay đổi:**

- Cập nhật file `tasks.json`: chuyển tất cả field names từ tiếng Việt sang tiếng Anh
  - `"Task ID"` → `"taskId"`
  - `"Tên task"` → `"taskName"`
  - `"Loại task"` → `"taskType"`
  - `"Độ khó (giải thích)"` → `"difficultyExplanation"`
  - `"Kỹ năng chính"` → `"mainSkill"`
  - `"Khối lượng"` → `"workload"`
  - `"Ưu tiên (1-5, lý do)"` → `"priorityReason"`
- Cập nhật TypeScript interface `TaskSeedData` trong `src/types/task-seed.interface.ts`
- Cập nhật `TasksService.seedTasks()` method để sử dụng field names mới

**Lý do:**

- Field names were in Vietnamese, causing confusion and inconsistency
- Need for English field names to match database schema
- Required consistency across the application

**Tác động:**

- Trực tiếp: `tasks.json`, `src/types/task-seed.interface.ts`, `src/tasks/tasks.service.ts`
- Rủi ro: Không có - chỉ thay đổi field names, không ảnh hưởng logic

**Mô tả workflows/logic:**

- Seeding logic vẫn hoạt động như cũ, chỉ thay đổi cách truy cập field names
- Task assignment logic dựa trên skills vẫn được giữ nguyên
- Priority và difficulty mapping vẫn hoạt động bình thường

**Ghi chú:**

- Tất cả 38 tasks trong file JSON đã được cập nhật
- Interface TypeScript đã được đồng bộ với cấu trúc JSON mới
- Service method đã được cập nhật để sử dụng field names mới

## [2024-12-19-16:25] [AI Assistant] [LOẠI: Refactor]

### Cập nhật Task Form Components theo cấu trúc tasks.json

**Nội dung thay đổi:**

- Cập nhật `src/types/task-form.ts`:
  - Thay đổi `CreateTaskForm` interface để phù hợp với cấu trúc tasks.json
  - Thêm các fields mới: `difficulty`, `status`, `taskType`, `mainSkill`, `workload`, `priorityReason`
  - Cập nhật `Project` và `User` interfaces để match với backend API
  - Thêm các option interfaces: `DifficultyOption`, `StatusOption`, `WorkloadOption`, `TaskTypeOption`, `SkillOption`
- Cập nhật `src/data/task-form.ts`:
  - Thêm `difficultyOptions`, `statusOptions`, `workloadOptions`, `taskTypeOptions`, `skillOptions`
  - Cập nhật `projectsData` và `usersData` với cấu trúc mới
  - Thêm 25+ skill options được phân loại theo Backend, Frontend, General
- Cập nhật `src/components/tasks/task-form.tsx`:
  - Thêm tất cả fields mới vào form với validation
  - Cải thiện layout với grid system responsive
  - Thêm skill selector với optgroup phân loại
  - Cập nhật validation logic cho các fields mới
- Cập nhật `src/pages/create-task.tsx`:
  - Truyền đúng props cho TaskForm component
  - Cập nhật initialData structure
- Cập nhật `src/components/tasks/project-overview.tsx`:
  - Sử dụng Project interface từ task-form types
  - Hiển thị project status thay vì completedTasks
- Cập nhật `src/components/tasks/team-members.tsx`:
  - Sử dụng User interface mới với name thay vì firstName/lastName
  - Hiển thị role và department của user

**Lý do:**

- Đồng bộ frontend với cấu trúc dữ liệu từ tasks.json
- Cung cấp form tạo task đầy đủ với tất cả fields cần thiết
- Cải thiện UX với skill categorization và validation
- Chuẩn hóa data structure giữa frontend và backend

**Tác động:**

- Trực tiếp: `src/types/task-form.ts`, `src/data/task-form.ts`, `src/components/tasks/`, `src/pages/create-task.tsx`
- Rủi ro: Có thể cần cập nhật các components khác sử dụng Project/User types cũ

**Mô tả workflows/logic:**

- Task form giờ có đầy đủ fields: name, description, priority, difficulty, status, projectId, assignedUserId, dueDate, estimatedHours, taskType, mainSkill, workload, priorityReason
- Skill selector được group theo Backend, Frontend, General categories
- Validation đảm bảo tất cả required fields được điền
- Form layout responsive với grid system

**Ghi chú:**

- Cần test form với backend API để đảm bảo compatibility
- Skill options được extract từ tasks.json và phân loại
- Project và User data được cập nhật để match với backend structure
- Form validation bao gồm tất cả required fields

## [2024-12-19-16:20] [AI Assistant] [LOẠI: Tính năng]

### Thêm EditIcon và CheckIcon vào icons.tsx

**Nội dung thay đổi:**

- Thêm `EditIcon` component vào `src/components/icons.tsx`:
  - Icon chỉnh sửa với pencil và document design
  - Stroke-based SVG với viewBox "0 0 24 24"
  - Hỗ trợ tất cả props từ IconSvgProps interface
- Thêm `CheckIcon` component vào `src/components/icons.tsx`:
  - Icon checkmark đơn giản với stroke design
  - Stroke-based SVG với viewBox "0 0 24 24"
  - Hỗ trợ tất cả props từ IconSvgProps interface
- Tạo `IconDemo` component trong `src/components/IconDemo.tsx`:
  - Showcase tất cả icons có sẵn trong library
  - Hiển thị size variations (16px, 24px, 32px, 48px)
  - Hiển thị color variations (success, info, warning, error)
  - Usage examples với buttons và interactive elements

**Lý do:**

- Cung cấp icons cần thiết cho UI components
- EditIcon cho các action chỉnh sửa (edit, update, modify)
- CheckIcon cho các action xác nhận (confirm, complete, approve)
- Chuẩn hóa design system với consistent icon style
- Demo component giúp developers hiểu cách sử dụng icons

**Tác động:**

- Trực tiếp: `src/components/icons.tsx`, `src/components/IconDemo.tsx`
- Rủi ro: Không có - chỉ thêm icons mới và demo component

**Mô tả workflows/logic:**

- Icons sử dụng stroke-based design consistent với các icons khác
- Có thể sử dụng với size, color, và các props khác từ IconSvgProps
- Export sẵn sàng để import và sử dụng trong components
- IconDemo component được tổ chức theo groups: Action Icons và Entity Icons

**Ghi chú:**

- EditIcon có 2 paths: document outline và pencil tip
- CheckIcon có 1 path đơn giản cho checkmark
- Cả hai icons đều responsive và scalable
- Có thể sử dụng với className để customize styling
- IconDemo component có thể được sử dụng để test và preview icons

## [2024-12-19-16:15] [AI] [FEATURE: ProjectGrid API Integration]

**Updated ProjectGrid component to fetch projects from backend API**

### Nội dung thay đổi

- **Updated `src/components/projects/project-grid.tsx`**: Added API integration for fetching projects
  - Added state management for projects, loading, and error states
  - Added `fetchProjects()` function using `ProjectsService.getAllProjects()`
  - Added loading spinner and error handling UI
  - Added refresh functionality with refresh button
  - Removed projects prop dependency, now fetches data internally
  - Added type conversion from API response to frontend Project type
- **Updated `src/components/projects/project-card.tsx`**: Updated to use correct Project type
  - Changed import from `@/types/project` to `@/types/task-form`
  - Updated to use `ProjectStatus` enum instead of string status
  - Added status color and icon mapping functions
  - Updated stats display to match new Project structure
  - Removed dependency on `createdBy` and `completedTasks` fields
  - Added proper date formatting for `updatedAt` field

### Lý do

- ProjectGrid was using static data instead of real API data
- Need for real-time project data from backend
- Required proper error handling and loading states
- Need for consistent type usage across components

### Tác động

**Trực tiếp**:

- ProjectGrid component with API integration
- ProjectCard component with updated types
- ProjectsService API usage

**Rủi ro**:

- API endpoint must be available and working
- Type conversion may need updates if backend structure changes
- Error handling may need enhancement for different error types

### Mô tả workflows/logic

**Before**: ProjectGrid used static projects prop, no API integration
**After**: ProjectGrid fetches projects from API with loading/error states and refresh functionality

### Ghi chú

- API response is converted to match frontend Project type structure
- Loading and error states provide better user experience
- Refresh button allows manual data reload
- Type conversion handles nullable description and enum status values
- Removed tasks field to avoid type conflicts between different Task types

## [2024-12-19-16:00] [AI] [FEATURE: Create Project API Integration]

**Created frontend API integration for creating projects with backend**

### Nội dung thay đổi

- **Updated `src/types/task-form.ts`**: Added ProjectStatus enum and updated Project interface
  - Added `ProjectStatus` enum matching backend: `ACTIVE`, `INACTIVE`, `COMPLETED`, `CANCELLED`
  - Updated `Project` interface to use `ProjectStatus` instead of string
  - Updated `CreateProjectForm` and `UpdateProjectForm` to use proper types
  - Added `ProjectStatusOption` interface for form selects
- **Updated `src/data/task-form.ts`**: Added project status options and updated project data
  - Added `projectStatusOptions` array with all project status options
  - Updated `projectsData` to use `ProjectStatus` enum values
  - Fixed project descriptions to be non-nullable strings
- **Created `src/components/projects/project-form.tsx`**: New ProjectForm component
  - Form fields: name (required), description (required), status (required)
  - Form validation with error handling
  - Support for both create and edit modes
  - Proper TypeScript types matching backend DTO
- **Created `src/pages/create-project.tsx`**: New create project page
  - Uses ProjectForm component
  - Integrates with ProjectsService.createProject API
  - Proper error handling and loading states
  - Navigation to projects list after successful creation

### Lý do

- Needed frontend API integration for creating projects
- Required form component matching backend CreateProjectDto structure
- Need for proper type safety and validation
- Required user interface for project creation workflow

### Tác động

**Trực tiếp**:

- New ProjectForm component
- New create-project page
- Updated types and data files
- ProjectsService API integration

**Rủi ro**:

- Form validation must match backend validation rules
- API endpoint must be available and working
- Error handling may need enhancement

### Mô tả workflows/logic

**Before**: No frontend API integration for project creation
**After**: Complete frontend form with backend API integration for creating projects

### Ghi chú

- Form matches backend CreateProjectDto exactly: name, description, status
- ProjectStatus enum values match backend exactly
- Form validation ensures required fields are provided
- API call uses ProjectsService.createProject method
- Navigation redirects to projects list after successful creation

## [2024-12-19-15:45] [AI Assistant] [LOẠI: Sửa lỗi]

### Fix Database Connection cho MySQL Docker Container

**Nội dung thay đổi:**

- Cập nhật `src/config/database.config.ts`: thay đổi cấu hình mặc định cho Docker container
  - Host: `localhost` → `server-mysql`
  - Password: `''` → `password`
  - Thêm `retryAttempts: 10` và `retryDelay: 3000` để xử lý kết nối
- Tạo `scripts/setup-database.sql`: script SQL để tạo database
- Tạo `scripts/setup-db.sh`: script bash cho Linux/Mac
- Tạo `scripts/setup-db.ps1`: script PowerShell cho Windows
- Cập nhật `README.md`: thêm hướng dẫn Docker setup và database configuration

**Lý do:**

- Fix lỗi "Unknown database 'test'" khi kết nối MySQL
- Cấu hình đúng cho Docker container `server-mysql`
- Cung cấp scripts tự động setup database

**Tác động:**

- Trực tiếp: `src/config/database.config.ts`, `scripts/`, `README.md`
- Rủi ro: Không có - chỉ cập nhật cấu hình kết nối

**Mô tả workflows/logic:**

- Database config giờ sử dụng host `server-mysql` thay vì `localhost`
- Thêm retry logic để xử lý kết nối chậm từ Docker
- Scripts tự động tạo database `hackathon_db` nếu chưa tồn tại

**Ghi chú:**

- Cần chạy script setup database trước khi start application
- Docker container phải có tên `server-mysql` và password `password`
- Application sẽ tự động retry kết nối nếu database chưa sẵn sàng

## [2024-12-19-15:30] [AI Assistant] [LOẠI: Refactor]

### Chuyển đổi field names từ tiếng Việt sang tiếng Anh

**Nội dung thay đổi:**

- Cập nhật file `tasks.json`: chuyển tất cả field names từ tiếng Việt sang tiếng Anh
  - `"Task ID"` → `"taskId"`
  - `"Tên task"` → `"taskName"`
  - `"Loại task"` → `"taskType"`
  - `"Độ khó (giải thích)"` → `"difficultyExplanation"`
  - `"Kỹ năng chính"` → `"mainSkill"`
  - `"Khối lượng"` → `"workload"`
  - `"Ưu tiên (1-5, lý do)"` → `"priorityReason"`
- Cập nhật TypeScript interface `TaskSeedData` trong `src/types/task-seed.interface.ts`
- Cập nhật `TasksService.seedTasks()` method để sử dụng field names mới

**Lý do:**

- Field names were in Vietnamese, causing confusion and inconsistency
- Need for English field names to match database schema
- Required consistency across the application

**Tác động:**

- Trực tiếp: `tasks.json`, `src/types/task-seed.interface.ts`, `src/tasks/tasks.service.ts`
- Rủi ro: Không có - chỉ thay đổi field names, không ảnh hưởng logic

**Mô tả workflows/logic:**

- Seeding logic vẫn hoạt động như cũ, chỉ thay đổi cách truy cập field names
- Task assignment logic dựa trên skills vẫn được giữ nguyên
- Priority và difficulty mapping vẫn hoạt động bình thường

**Ghi chú:**

- Tất cả 38 tasks trong file JSON đã được cập nhật
- Interface TypeScript đã được đồng bộ với cấu trúc JSON mới
- Service method đã được cập nhật để sử dụng field names mới

## [2024-12-19-15:30] [AI] [REFACTOR: Type System Alignment]

**Comprehensive refactor of frontend types to match backend entities exactly**

### Nội dung thay đổi

- **Updated `src/types/task-form.ts`**: Completely restructured all types to match backend entities exactly
  - Added proper enums: `UserRole`, `Department`, `TaskPriority`, `TaskDifficulty`, `TaskStatus`, `SubtaskStatus`
  - Updated entity interfaces: `Project`, `User`, `Task`, `Subtask` to match backend exactly
  - Added form interfaces: `CreateTaskForm`, `UpdateTaskForm`, `CreateUserForm`, `UpdateUserForm`, etc.
  - Added validation interfaces and option interfaces for form components
- **Updated `src/data/task-form.ts`**: Refactored data to use new enums and types
  - Updated all option arrays to use enum values instead of strings
  - Updated `projectsData` and `usersData` to use proper types and Date objects
  - Added `subtaskStatusOptions`, `roleOptions`, `departmentOptions`
- **Updated all service files**: Refactored to use new types and remove conflicting declarations
  - `src/services/users.service.ts`: Removed old interfaces, updated to use imported types
  - `src/services/tasks.service.ts`: Removed old interfaces, updated to use imported types
  - `src/services/subtasks.service.ts`: Recreated with new types, removed old interfaces
  - `src/services/projects.service.ts`: Already using correct types
- **Updated `src/components/tasks/task-form.tsx`**: Simplified to match backend entity fields
  - Removed non-existent fields: `taskType`, `mainSkill`, `workload`, `priorityReason`
  - Updated to use enum values for default values
  - Fixed type handling for number fields
  - Simplified form structure to match backend entity exactly
- **Updated `src/pages/create-task.tsx`**: Removed unused props for simplified TaskForm

### Lý do

- Frontend types were inconsistent with backend entities, causing type mismatches
- Some fields in frontend forms didn't exist in backend entities
- Need for proper type safety and consistency across the application
- Backend entities have specific field types and relationships that frontend should respect

### Tác động

**Trực tiếp**:

- All type definitions in `src/types/task-form.ts`
- All service files in `src/services/`
- TaskForm component and create-task page
- Data files using the types

**Rủi ro**:

- Breaking changes to any components using old type structures
- Form validation may need updates for new field requirements
- API integration points may need adjustment for new data structures

### Mô tả workflows/logic
