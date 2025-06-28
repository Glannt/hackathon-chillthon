# Employee Task Management System - Setup Guide

## 🎯 Tổng quan dự án
Ứng dụng Django hoàn chỉnh để quản lý nhân viên và phân chia task cho nhóm 10-20 người với các tính năng:
- ✅ Authentication với 3 cấp quyền (Admin, Manager, User)
- ✅ Dashboard tổng quan với real-time statistics
- ✅ Quản lý Tasks và Projects với workflow tracking
- ✅ Chấm công (Check-in/Check-out) với báo cáo
- ✅ Quản lý Users và Settings
- ✅ Responsive UI với Bootstrap 5
- ✅ Sample data sẵn có cho demo

## 📋 Yêu cầu hệ thống
- Python 3.8+ (đã có SQLite built-in)
- pip (Python package manager)
- Git (optional, để clone project)
- **Không cần MySQL, Visual C++ Build Tools**

## 🚀 Hướng dẫn cài đặt (Windows-optimized)

### Bước 1: Chuẩn bị môi trường
```bash
# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### Bước 2: Cài đặt Dependencies (Đơn giản hóa)

#### 🔧 Cách 1: Cài đặt từ requirements.txt (Khuyến nghị)
```bash
pip install -r requirements.txt
```

#### 🔧 Cách 2: Cài đặt từng package
```bash
pip install Django==4.2.7
pip install django-crispy-forms==2.1
pip install crispy-bootstrap5==0.7
pip install python-decouple==3.8
```

**✅ Không cần cài thêm:**
- ❌ ~~mysqlclient~~ (dùng SQLite)
- ❌ ~~Pillow~~ (avatar feature disabled)
- ❌ ~~Visual C++ Build Tools~~

### Bước 3: ~~Cấu hình MySQL Database~~ (Bỏ qua)
**SQLite được cấu hình tự động - không cần setup database server!**

### Bước 4: Chạy Setup Script (Đơn giản)
```bash
cd django_project
python setup_project.py
```

**Script sẽ tự động:**
- Tạo SQLite database (db.sqlite3)
- Chạy migrations
- Collect static files  
- Tạo sample data

### Bước 5: Chạy Development Server
```bash
# Để truy cập từ localhost và IP LAN:
python manage.py runserver 0.0.0.0:8000

# Hoặc chỉ localhost:
python manage.py runserver 8000
```

Truy cập: 
- Local: http://127.0.0.1:8000 hoặc http://localhost:8000
- Network: http://[your-ip]:8000 (truy cập từ các thiết bị khác trên mạng)

**Lưu ý:** Để truy cập từ IP LAN, phải sử dụng `0.0.0.0:8000` thay vì chỉ `8000`

## 🔑 Demo Accounts

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin | admin123 | Quản trị toàn hệ thống |
| Manager | manager1 | manager123 | Development Manager |
| Manager | manager2 | manager123 | Design Manager |
| User | user1 | user123 | Development Specialist |
| User | user2 | user123 | Development Specialist |
| User | user3 | user123 | Design Specialist |
| User | user4 | user123 | QA Specialist |
| User | user5 | user123 | Marketing Specialist |

## 📊 Sample Data có sẵn

### Projects (3)
- **Website Development** - Modern UI/UX website
- **Mobile App** - iOS/Android application
- **Database Migration** - Legacy to cloud migration

### Tasks (10)
- Đa dạng trạng thái: New, In Progress, Review, Completed
- Các mức độ ưu tiên: Low, Medium, High, Urgent
- Có comments và tracking time

### Attendance Records
- Dữ liệu chấm công 7 ngày gần nhất
- Đa dạng trường hợp: đúng giờ, muộn, vắng, nửa ngày

## 🌟 Tính năng chính

### 1. Authentication & Authorization
- Đăng nhập/đăng xuất an toàn
- Phân quyền 3 cấp với permission checks
- Session management

### 2. Dashboard
- Thống kê task cá nhân real-time
- Quick access tới chấm công
- Notifications từ admin/manager
- Team overview cho managers

### 3. Task Management
- CRUD tasks với role-based permissions
- Project organization
- Status tracking và comments
- Deadline management với overdue alerts

### 4. Attendance System
- Check-in/Check-out một click
- Tự động tính toán giờ làm
- Lịch sử chấm công cá nhân
- Team attendance overview cho managers

### 5. User Management
- Profile management
- Password change
- User CRUD cho admins
- Department và position tracking

## 📱 Responsive Design
- ✅ Mobile-friendly navigation
- ✅ Bootstrap 5 với custom CSS
- ✅ Touch-friendly buttons
- ✅ Responsive tables và cards
- ✅ Modern gradient design

## 🔧 Django Admin
Truy cập admin panel: 
- Local: http://127.0.0.1:8000/admin/
- Network: http://[your-ip]:8000/admin/
- Username: admin
- Password: admin123

Admin interface có đầy đủ CRUD cho tất cả models với:
- Advanced filtering và searching
- Inline editing
- Custom displays và readonly fields
- Bulk actions

## 📁 Cấu trúc Project

```
tasking_project/
├── describe_project/           # Tài liệu dự án
│   ├── CHANGELOG.md           # Lịch sử thay đổi
│   ├── WORKFLOWS.md           # Mô tả workflow
│   ├── README.md              # Tài liệu chính
│   ├── PROJECT_OVERVIEW.md    # Tổng quan dự án
│   ├── SETUP_GUIDE.md         # Hướng dẫn cài đặt
│   └── requirements.txt       # Dependencies backup
├── debugs_project/            # Debug files
├── django_project/            # Django source code
│   ├── tasking_project/       # Project settings
│   ├── apps/                  # Django applications
│   │   ├── authentication/    # Login/logout/register
│   │   ├── dashboard/         # Main dashboard
│   │   ├── tasks/            # Task và project management
│   │   ├── attendance/        # Chấm công
│   │   └── users/            # User management
│   ├── templates/            # HTML templates
│   ├── static/               # CSS, JS, images
│   ├── media/                # Upload files
│   ├── manage.py             # Django management
│   ├── create_sample_data.py # Sample data script
│   └── setup_project.py      # Auto setup script
├── requirements.txt          # Python dependencies (chính)
├── README.md                 # Main documentation
└── SETUP_GUIDE.md           # Setup instructions
```

## 🐛 Troubleshooting

### Lỗi Database Connection
```bash
# Kiểm tra MySQL service đang chạy
# Windows:
net start mysql
# Linux:
sudo service mysql start
```

### Lỗi Permission Denied
```bash
# Đảm bảo virtual environment được activate
# Kiểm tra ownership của thư mục project
```

### Lỗi Static Files
```bash
# Collect static files lại
python manage.py collectstatic --noinput
```

### Lỗi Migration
```bash
# Reset migrations nếu cần
python manage.py migrate --fake-initial
```

### Lỗi Port đã được sử dụng
```bash
# Nếu port 8000 đã được sử dụng, thử port khác:
python manage.py runserver 8001
# Hoặc tìm process đang sử dụng port 8000:
# Windows: netstat -ano | findstr :8000
# Linux: lsof -i :8000
```

### Lỗi Pillow Installation
```bash
# Cách 1: Cài đặt từ wheel
pip install --only-binary=all Pillow

# Cách 2: Cài đặt phiên bản mới hơn
pip install Pillow

# Cách 3: Cài đặt riêng từng package
pip install Django==4.2.7 mysqlclient==2.2.0 django-crispy-forms==2.1 crispy-bootstrap5==0.7 python-decouple==3.8
pip install --only-binary=all Pillow

# Cách 4: Cài đặt Visual C++ Build Tools
# Tải từ: https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

### Lỗi mysqlclient
```bash
# Windows: Cài đặt Visual C++ Build Tools
# Linux: sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
# Mac: brew install mysql-connector-c
```

## 🎨 Customization

### Thay đổi Colors/Styling
- Chỉnh sửa `django_project/static/css/custom.css`
- Update CSS variables cho color scheme mới

### Thêm Functionality
- Tạo app mới: `python manage.py startapp app_name`
- Add vào `INSTALLED_APPS` trong settings.py
- Tạo models, views, templates theo pattern có sẵn

### Database khác MySQL
- Update `DATABASES` setting
- Cài driver tương ứng (postgresql, sqlite3, etc.)

## 📞 Support
Nếu gặp vấn đề:
1. Kiểm tra console logs trong browser (F12)
2. Xem Django error logs trong terminal
3. Verify database connection và permissions
4. Đảm bảo tất cả dependencies đã được cài đặt
5. Thử cài đặt từng package riêng nếu gặp lỗi build

## 🎉 Demo Features
Project này bao gồm tất cả tính năng được yêu cầu:
- ✅ Authentication với 3 cấp quyền
- ✅ Dashboard responsive với real-time stats
- ✅ Task management với workflow tracking
- ✅ Attendance system với check-in/out
- ✅ User management và settings
- ✅ Modern UI với Bootstrap 5
- ✅ Sample data để demo ngay lập tức
- ✅ Admin interface đầy đủ tính năng
- ✅ Mobile-responsive design

**Project sẵn sàng cho demo và deployment!** 🚀 