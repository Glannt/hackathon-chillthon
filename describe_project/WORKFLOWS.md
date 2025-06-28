# WORKFLOWS - EMPLOYEE TASK MANAGEMENT SYSTEM

## Sơ đồ/chu trình xử lý chính

### 1. Authentication Workflow
```
User Access → Login Page → Validate Credentials → Check Role → Redirect to Dashboard
                ↓ (Failed)
            Error Message → Login Page
```

### 2. Task Management Workflow

#### Manager creates task:
```
Manager Dashboard → Create Task → Fill Details (title, description, assignee, deadline) 
→ Save → Notification to User → Task appears in User's dashboard
```

#### User works on task:
```
User Dashboard → View Task → Update Status → Add Comments → Save
→ Manager receives notification → Updated in reports
```

### 3. Attendance Workflow
```
User Login → Dashboard → Check-in Button → Record Time 
→ Work Period → Check-out Button → Calculate Hours → Save to Database
```

### 4. Admin Management Workflow
```
Admin Dashboard → User Management → Add/Edit/Delete Users → Assign Roles
→ View Reports → System Settings
```

### 5. Logging & Monitoring Workflow
```
User Action → System Event → Log to File → Daily/Weekly Reports
    ↓
Activity Log → Debug Log → Error Log → Admin Notifications
```

## Mô tả từng bước workflow

### Authentication Process:
1. User accesses any protected page
2. System checks session/authentication
3. If not authenticated → redirect to login
4. Login form validation
5. Check user credentials against database
6. Create session and redirect based on role
7. **Log successful/failed login attempts**

### Task Lifecycle:
1. **Created:** Manager creates new task
2. **Assigned:** Task assigned to specific user(s)
3. **In Progress:** User starts working and updates status
4. **Review:** Manager reviews completed task
5. **Completed:** Task marked as finished
6. **Archived:** Old tasks moved to archive
7. **Logged:** All status changes recorded with timestamps

### Daily Attendance Flow:
1. User logs in to system
2. Dashboard shows check-in status
3. User clicks check-in (recorded with timestamp)
4. During day: status shows "Working"
5. User clicks check-out (calculates work hours)
6. Daily summary generated
7. **All check-in/out activities logged**

### Logging System Flow:
1. **Activity Logging:** User actions (login, check-in/out, task updates)
2. **Error Logging:** System errors, failed operations
3. **Debug Logging:** Detailed system operations for troubleshooting
4. **Log Rotation:** Automatic cleanup of old logs
5. **Report Generation:** Daily/weekly activity summaries

## Luồng dữ liệu vào/ra

### Input Data:
- User credentials (login)
- Task details (title, description, deadline, priority)
- Attendance timestamps (check-in/out)
- User profile information
- Comments and status updates

### Output Data:
- Dashboard summaries
- Task progress reports
- Attendance reports
- User activity logs
- System notifications
- **Log files (activity.log, error.log, debug.log)**

### Log Files Structure:
```
debugs_project/
├── activity.log     # User activities and system events
├── error.log        # System errors and exceptions
└── debug.log        # Detailed debugging information
```

## Trường hợp đặc biệt hoặc rẽ nhánh

### Exception Cases:
1. **Forgot Password:** Email reset link workflow
2. **Late Check-in:** Flag and notify manager + log late arrival
3. **Task Overdue:** Automatic notifications and alerts + log overdue tasks
4. **Concurrent Access:** Handle multiple users editing same task
5. **Role Changes:** Update permissions and access rights + log permission changes
6. **System Errors:** Auto-log errors, notify admins, graceful fallback

### Role-based Redirects:
- **Admin:** → Admin dashboard with system overview
- **Manager:** → Manager dashboard with team overview  
- **User:** → Personal dashboard with assigned tasks

### Error Handling & Logging:
- **Failed Login:** Log attempt, IP address, timestamp
- **Database Errors:** Log query, user, context
- **Permission Denied:** Log user, attempted action
- **System Exceptions:** Full stack trace logged

## Lịch sử cập nhật workflows

**27/01/2025 - AI Assistant:**
- Cập nhật network access configuration cho phép tất cả IP (0.0.0.0)
- Hỗ trợ truy cập từ các thiết bị khác trên mạng
- Cập nhật server access patterns và security considerations
- Thêm comprehensive logging system cho toàn bộ ứng dụng
- Cập nhật workflow với monitoring và error handling
- Thêm log files structure và logging patterns
- Cập nhật exception handling workflows

**27/06/2025 - AI Assistant:** 
- Tạo initial workflows cho Employee Task Management System
- Định nghĩa authentication, task management, attendance flows
- Thiết lập role-based access patterns

**TODO:**
- Implement log analysis dashboard
- Add automated log rotation
- Create alert system for critical errors
- Implement performance monitoring logs

## Log Monitoring Commands

### Kiểm tra logs real-time:
```bash
# Theo dõi activity log
tail -f debugs_project/activity.log

# Theo dõi error log
tail -f debugs_project/error.log

# Theo dõi tất cả logs
tail -f debugs_project/*.log
```

### Phân tích logs:
```bash
# Thống kê login attempts
grep "Login attempt" debugs_project/activity.log | wc -l

# Tìm failed logins
grep "Failed login" debugs_project/activity.log

# Kiểm tra errors trong ngày
grep "$(date +%Y-%m-%d)" debugs_project/error.log
```

### Log Retention Policy:
- **Activity logs:** Giữ 30 ngày
- **Error logs:** Giữ 90 ngày  
- **Debug logs:** Giữ 7 ngày
- **Auto rotation:** Hàng ngày lúc 00:00 