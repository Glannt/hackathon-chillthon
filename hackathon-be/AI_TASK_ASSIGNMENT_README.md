# AI Task Assignment Integration

## Tổng quan

Hệ thống AI Task Assignment tích hợp model.py với backend NestJS để tự động phân tích và assign task cho users dựa trên:

- File task content (`làm phim.txt`)
- User data từ database (`output_user.json`)
- AI model sử dụng Gemini API

## Cài đặt

### 1. Cài đặt Python dependencies

```bash
pip install google-generativeai pandas streamlit
```

### 2. Cấu hình Gemini API Key

Thêm API key vào environment variable:

```bash
export GEMINI_API_KEY="your-gemini-api-key-here"
```

Hoặc thêm vào file `.env`:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Đảm bảo các file cần thiết

- `model.py` - File model gốc
- `ai_integration.py` - Script tích hợp mới
- `làm phim.txt` - File task content
- `output_user.json` - File user data

## Sử dụng

### API Endpoints

#### 1. Chạy AI Analysis

```bash
POST /ai-task-assignment/{projectId}/run
```

Body (optional):

```json
{
  "taskFileContent": "Custom task content...",
  "userFileContent": "Custom user data..."
}
```

Response:

```json
{
  "taskAnalysis": [
    {
      "Task ID": "TASK01",
      "Tên task": "Xác định yêu cầu chức năng",
      "Loại task": "Medium",
      "Độ khó": "Cần phân tích kỹ các yêu cầu",
      "Kỹ năng chính": "Phân tích yêu cầu, Communication",
      "Khối lượng": "Medium",
      "Ưu tiên": "5"
    }
  ],
  "taskAssignment": [],
  "userTaskMapping": [
    {
      "Task ID": "TASK01",
      "Thành viên (tên)": "A"
    }
  ]
}
```

#### 2. Apply AI Assignments

```bash
POST /ai-task-assignment/{projectId}/apply
```

Body:

```json
{
  "userTaskMapping": [
    {
      "Task ID": "TASK01",
      "Thành viên (tên)": "A"
    }
  ]
}
```

Response:

```json
[
  {
    "taskId": "TASK01",
    "userId": "user-uuid",
    "userName": "A",
    "assigned": true
  }
]
```

#### 3. Get Task Content

```bash
GET /ai-task-assignment/{projectId}/task-content
```

#### 4. Get User Content

```bash
GET /ai-task-assignment/user-content
```

## Workflow

### 1. Chuẩn bị dữ liệu

- **Task Content**: Đọc từ file `làm phim.txt` hoặc custom content
- **User Data**: Lấy từ database và format theo cấu trúc `output_user.json`

### 2. Chạy AI Analysis

- Gọi API `/ai-task-assignment/{projectId}/run`
- AI model phân tích task và tạo mapping user-task
- Trả về kết quả phân tích và mapping

### 3. Apply Assignments

- Gọi API `/ai-task-assignment/{projectId}/apply`
- Hệ thống tìm user ID và task ID tương ứng
- Update task assignment trong database

## Cấu trúc dữ liệu

### Task Content Format

```
1. Phân Tích & Thiết Kế (Planning & Design)
Xác định yêu cầu chức năng: Xem phim, đăng nhập, tìm kiếm, phân loại phim, v.v.

Vẽ sơ đồ use case, user flow (luồng người dùng).

Thiết kế wireframe, mockup giao diện (UI/UX).

Lên danh sách tính năng ưu tiên (MVP/Feature list).
...
```

### User Data Format

```json
[
  {
    "Id": "1",
    "Name": "A",
    "Department": "Backend",
    "Position": "Senior Backend Developer",
    "Experience": "5 years",
    "ProjectsDone": "12",
    "AvgTaskCompletion": "1.5 ngày (Medium)",
    "DeadlineMisses": "2"
  }
]
```

### AI Output Format

```json
{
  "taskAnalysis": [
    {
      "Task ID": "TASK01",
      "Tên task": "Xác định yêu cầu chức năng",
      "Loại task": "Medium",
      "Độ khó": "Cần phân tích kỹ các yêu cầu",
      "Kỹ năng chính": "Phân tích yêu cầu, Communication",
      "Khối lượng": "Medium",
      "Ưu tiên": "5"
    }
  ],
  "userTaskMapping": [
    {
      "Task ID": "TASK01",
      "Thành viên (tên)": "A"
    }
  ]
}
```

## Lưu ý

1. **API Key**: Cần có Gemini API key để sử dụng AI features
2. **Python Script**: Đảm bảo `ai_integration.py` có trong project root
3. **User Mapping**: User name phải match với database (field `name`)
4. **Task Mapping**: Task ID phải có pattern `TASK{number}` trong task name
5. **Error Handling**: Hệ thống có error handling cho các trường hợp lỗi

## Troubleshooting

### Lỗi thường gặp

1. **"AI integration script not found"**
   - Đảm bảo file `ai_integration.py` có trong project root

2. **"Python process failed"**
   - Kiểm tra Python dependencies đã cài đặt
   - Kiểm tra Gemini API key

3. **"User not found in database"**
   - Kiểm tra user name trong mapping có match với database
   - Đảm bảo user đã được tạo trong database

4. **"Task not found in project"**
   - Kiểm tra task name có pattern `TASK{number}`
   - Đảm bảo task đã được tạo trong project

## Development

### Thêm tính năng mới

1. Cập nhật `ai_integration.py` để thêm logic AI mới
2. Cập nhật service để handle response format mới
3. Cập nhật API endpoints nếu cần
4. Test với real data

### Custom AI Prompts

Có thể customize AI prompts trong `ai_integration.py`:

```python
task_analysis_prompt = f"""
Custom prompt for task analysis...
{task_input}
"""
```
