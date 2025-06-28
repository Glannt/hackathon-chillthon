# PROJECT OVERVIEW - TASKING PROJECT

## Tổng quan dự án
**Tên dự án:** Employee Task Management System
**Mục tiêu:** Tạo ứng dụng web Django để quản lý nhân viên và phân chia công việc cho nhóm 10-20 người

## Đối tượng sử dụng
- **Admin:** Quản trị hệ thống, quản lý tất cả users và settings
- **Manager:** Quản lý team, tạo và phân chia task, xem báo cáo
- **User/Employee:** Nhận task, cập nhật tiến độ, chấm công

## Danh sách module/chức năng chính

### 1. Authentication Module
- Đăng nhập/đăng xuất
- Phân quyền 3 cấp: Admin, Manager, User
- Session management
- **Logging:** Login/logout tracking, IP logging, failed attempts

### 2. Dashboard Module  
- Trang tổng quan cá nhân
- Hiển thị task được giao
- Thông báo từ admin/manager
- Thống kê tiến độ real-time
- **Admin Dashboard:** System overview, analytics, user management
- **Logging:** Dashboard access, admin operations, system stats

### 3. User Management Module
- Quản lý thông tin nhân viên
- Phân quyền và nhóm
- CRUD operations (Admin/Manager only)
- **Logging:** User creation, role changes, profile updates

### 4. Task Management Module
- Tạo và phân chia công việc
- Theo dõi tiến độ
- Comment và note
- Lịch sử thay đổi status
- **Logging:** Task creation, assignments, status changes

### 5. Attendance Module
- Check-in/Check-out hàng ngày
- Lịch sử chấm công
- Báo cáo tổng hợp
- **Logging:** Check-in/out times, late arrivals, attendance reports

### 6. Settings Module
- Cập nhật thông tin cá nhân
- Đổi mật khẩu
- Cấu hình hệ thống

### 7. Logging & Monitoring Module ⭐ NEW
- **Real-time Activity Logging:** Tất cả user actions được ghi log
- **Error Tracking:** System errors và exceptions
- **Debug Logging:** Chi tiết operations cho troubleshooting
- **Log Analysis:** Script phân tích logs với statistics
- **System Health Monitoring:** File sizes, recent activities, error counts
- **Log Management:** Cleanup, rotation, retention policies

## Sơ đồ kiến trúc/module
```
Frontend (Templates + Bootstrap 5)
    ↓
Django Views (Authentication, Dashboard, Task, Attendance, Users)
    ↓  
Django Models (UserProfile, Task, Project, Attendance, Notification)
    ↓
SQLite Database (Windows-optimized)
    ↓
Logging System (Activity, Error, Debug logs)
    ↓
Log Manager (Analysis, Monitoring, Cleanup)
```

## Công nghệ, pattern, thư viện sử dụng
- **Backend:** Django 4.2.7, Python 3.8+
- **Database:** SQLite (built-in, no additional drivers needed)
- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript
- **Authentication:** Django built-in auth system
- **Forms:** Django Crispy Forms với Bootstrap 5
- **ORM:** Django ORM
- **Admin:** Django Admin interface
- **Static Files:** Django collectstatic
- **Development:** Auto setup scripts, sample data generation
- **Windows Compatibility:** No C++ build tools required
- **Logging:** Django logging framework với custom handlers
- **Monitoring:** Python log analysis scripts
- **Error Handling:** Comprehensive exception catching và logging

## Milestone phát triển lớn
1. **Phase 1:** Thiết lập project, models, authentication ✅
2. **Phase 2:** Dashboard và UI cơ bản ✅
3. **Phase 3:** Task management system ✅
4. **Phase 4:** Attendance system ✅
5. **Phase 5:** Polish UI, sample data, testing ✅
6. **Phase 6:** Documentation và deployment guide ✅
7. **Phase 7:** Admin dashboard với advanced analytics ✅
8. **Phase 8:** Comprehensive logging system và monitoring ✅

**Status: FULLY COMPLETED** - Project sẵn sàng production với monitoring

## Cấu trúc thư mục dự án
```
tasking_project/
├── describe_project/          # File mô tả dự án
│   ├── CHANGELOG.md          # Lịch sử thay đổi
│   ├── WORKFLOWS.md          # Mô tả workflow
│   ├── README.md             # Tài liệu chính
│   ├── PROJECT_OVERVIEW.md   # File này
│   ├── SETUP_GUIDE.md        # Hướng dẫn setup
│   └── requirements.txt      # Dependencies backup
├── debugs_project/           # File debug và logs ⭐
│   ├── activity.log          # User activity logs
│   ├── error.log             # System error logs
│   ├── debug.log             # Debug information
│   └── log_manager.py        # Log analysis script
├── django_project/           # Django source code
│   ├── tasking_project/      # Django project settings
│   ├── apps/                 # Django applications
│   │   ├── authentication/   # Authentication app (with logging)
│   │   ├── dashboard/        # Dashboard app (with logging)
│   │   ├── tasks/           # Task management app
│   │   ├── attendance/       # Attendance app (with logging)
│   │   └── users/           # User management app
│   ├── templates/           # HTML templates
│   ├── static/             # CSS, JS, images
│   ├── media/              # Upload files
│   ├── manage.py           # Django management
│   ├── create_sample_data.py # Sample data script
│   └── setup_project.py    # Auto setup script
├── requirements.txt         # Python dependencies
└── venv/                   # Virtual environment
```

## Thông tin kỹ thuật
- **Server Port:** 8000 (python manage.py runserver 8000)
- **Network Access:** Hỗ trợ truy cập từ tất cả IP (0.0.0.0) - localhost, 127.0.0.1, và bất kỳ IP nào trên mạng
- **Admin Panel:** http://127.0.0.1:8000/admin/ hoặc http://[your-ip]:8000/admin/
- **Main App:** http://127.0.0.1:8000 hoặc http://[your-ip]:8000
- **Database:** SQLite (db.sqlite3) - no server required
- **Static Files:** Bootstrap 5, Font Awesome, Custom CSS/JS
- **Demo Accounts:** 1 admin, 2 managers, 5 users sẵn có
- **Avatar Feature:** Disabled (can be enabled by installing Pillow)
- **Logging Files:** activity.log, error.log, debug.log
- **Log Analysis:** python debugs_project/log_manager.py [command]

## Logging System Features ⭐ NEW
### Log Types:
- **Activity Log:** User logins, dashboard access, check-in/out, task operations
- **Error Log:** System errors, database issues, permission failures
- **Debug Log:** Detailed system operations, query logs, performance data

### Monitoring Commands:
```bash
# Kiểm tra system health
python debugs_project/log_manager.py health

# Phân tích activity logs (7 ngày)
python debugs_project/log_manager.py analyze 7

# Kiểm tra errors (24 giờ qua)
python debugs_project/log_manager.py errors 24

# Xem recent logs
python debugs_project/log_manager.py tail 20

# Simulate log cleanup
python debugs_project/log_manager.py cleanup 30
```

######## BY Phuoc Nguyen | contact.phuocnguyen@gmail.com ##############