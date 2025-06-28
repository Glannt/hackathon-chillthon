# Employee Task Management System

## Mô tả ngắn
Ứng dụng web Django để quản lý nhân viên và phân chia công việc cho nhóm 10-20 người, bao gồm authentication, dashboard, quản lý task, chấm công và settings.

## Chức năng chính
- **Authentication:** Đăng nhập với 3 cấp quyền (Admin, Manager, User)
- **Dashboard:** Trang tổng quan hiển thị task, tiến độ, thông báo
- **Task Management:** Tạo, phân chia, theo dõi công việc
- **Attendance:** Check-in/check-out hàng ngày, báo cáo chấm công
- **User Management:** Quản lý nhân viên và phân quyền (Admin/Manager)
- **Settings:** Cập nhật thông tin cá nhân, đổi mật khẩu

## Yêu cầu hệ thống
- Python 3.8+
- Django 4.2.7
- MySQL 8.0+
- pip (Python package manager)

## Hướng dẫn cài đặt

### 1. Clone project và setup môi trường
```bash
# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### 2. Cấu hình MySQL Database
```sql
-- Tạo database
CREATE DATABASE tasking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user (optional)
CREATE USER 'tasking_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON tasking_db.* TO 'tasking_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Cấu hình Django settings
```bash
# Chỉnh sửa database config trong django_project/tasking_project/settings.py
# Cập nhật DATABASES section với thông tin MySQL của bạn
```

### 4. Chạy migrations và tạo data mẫu
```bash
cd django_project
python manage.py makemigrations
python manage.py migrate
python setup_project.py
```

### 5. Chạy server development
```bash
# Cách 1: Sử dụng helper script (khuyến nghị)
python run_server.py

# Cách 2: Để truy cập từ localhost và IP LAN:
python manage.py runserver 0.0.0.0:8000

# Cách 3: Hoặc chỉ localhost:
python manage.py runserver 8000
```

Truy cập: 
- Local: http://127.0.0.1:8000 hoặc http://localhost:8000
- Network: http://[your-ip]:8000 (truy cập từ các thiết bị khác trên mạng)

**Lưu ý:** Để truy cập từ IP LAN, phải sử dụng `0.0.0.0:8000` thay vì chỉ `8000`. Helper script sẽ tự động hiển thị IP LAN của bạn.

## Hướng dẫn sử dụng nhanh

### Đăng nhập:
- **Admin:** admin/admin123
- **Manager:** manager1/manager123, manager2/manager123  
- **User:** user1/user123, user2/user123, user3/user123, user4/user123, user5/user123

### Menu chính:
- **Dashboard:** Trang tổng quan cá nhân
- **Tasks:** Quản lý công việc
- **Attendance:** Chấm công  
- **Settings:** Cài đặt cá nhân
- **Admin Panel:** Quản trị hệ thống (Admin/Manager only)

## Cấu trúc file/thư mục
```
tasking_project/
├── describe_project/           # File mô tả dự án
│   ├── CHANGELOG.md           # Lịch sử thay đổi
│   ├── WORKFLOWS.md           # Mô tả workflow
│   ├── README.md              # Tài liệu chính
│   ├── PROJECT_OVERVIEW.md    # Tổng quan dự án
│   ├── SETUP_GUIDE.md         # Hướng dẫn setup
│   └── requirements.txt       # Dependencies backup
├── debugs_project/            # File debug và logs
├── django_project/            # Django source code
│   ├── tasking_project/       # Django project settings
│   ├── apps/                  # Django applications
│   │   ├── authentication/    # Authentication app
│   │   ├── dashboard/         # Dashboard app  
│   │   ├── tasks/            # Task management app
│   │   ├── attendance/        # Attendance app
│   │   └── users/            # User management app
│   ├── templates/            # HTML templates
│   ├── static/               # CSS, JS, images
│   ├── media/                # Upload files
│   ├── manage.py             # Django management
│   ├── create_sample_data.py # Sample data script
│   └── setup_project.py      # Auto setup script
├── requirements.txt          # Python dependencies
└── venv/                     # Virtual environment
```

## Sample Data có sẵn
- **1 Admin:** admin (quyền quản trị toàn hệ thống)
- **2 Managers:** manager1, manager2 (quản lý team, tạo task)
- **5 Users:** user1-user5 (nhân viên làm task, chấm công)
- **3 Projects:** Website Development, Mobile App, Database Migration
- **10 Tasks:** Đa dạng trạng thái và độ ưu tiên

## Django Admin
Truy cập Django Admin: http://127.0.0.1:8000/admin/
- Username: admin
- Password: admin123

## Thông tin liên hệ/đóng góp
- Repository: [Link to repository]
- Issues: [Link to issues]
- Tài liệu kỹ thuật: describe_project/

## Bảng cập nhật gần nhất
| Ngày | Người cập nhật | Thay đổi |
|------|----------------|----------|
| 27/01/2025 | PhuocNguyenNguyen | Cập nhật ALLOWED_HOSTS cho phép tất cả IP (0.0.0.0), hỗ trợ network access |
| 27/01/2025 | PhuocNguyenNguyen | Cập nhật thông tin port 5000, đồng bộ tài liệu |
| 27/06/2025 | PhuocNguyenNguyen | Khởi tạo project, tạo cấu trúc cơ bản |

## Troubleshooting

### Lỗi thường gặp:
1. **Database connection error:** Kiểm tra MySQL service và cấu hình database
2. **Module not found:** Đảm bảo virtual environment được activate và dependencies đã cài
3. **Permission denied:** Kiểm tra quyền user trên thư mục project
4. **Port already in use:** Đổi port với: `python manage.py runserver 5001`

### Debug mode:
```bash
# Enable debug mode trong settings.py
DEBUG = True

# Xem logs chi tiết trong debugs_project/
``` 


######## BY Phuoc Nguyen | contact.phuocnguyen@gmail.com ##############