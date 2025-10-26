# Hướng dẫn Test Mail Queue Upload File với Postman

## 🚀 Bước 1: Cấu hình Environment

### 1.1. Tạo file `.env` trong thư mục gốc:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# App Configuration
APP_URL=http://localhost:3000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=bus_ticket_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

### 1.2. Cài đặt Redis:

```bash
# Docker (Khuyến nghị)
docker run -d --name redis -p 6379:6379 redis:alpine

# Hoặc cài đặt trực tiếp
# Windows: Download từ GitHub
# macOS: brew install redis
# Linux: sudo apt-get install redis-server
```

### 1.3. Khởi động ứng dụng:

```bash
npm install
npm run start:dev
```

## 📧 Bước 2: Test Email API

### 2.1. Import Postman Collection

1. Mở Postman
2. Click **Import**
3. Chọn file `Mail_Queue_Upload_Test_Collection.json`
4. Click **Import**

### 2.2. Test Email Configuration

**Request:** `1. Email Test - Config`
- **Method:** GET
- **URL:** `http://localhost:3000/email-test/config`
- **Expected Response:**
```json
{
  "success": true,
  "data": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "your-email@gmail.com"
  }
}
```

### 2.3. Test Direct Email

**Request:** `2. Email Test - Send Direct`
- **Method:** POST
- **URL:** `http://localhost:3000/email-test/send`
- **Body:**
```json
{
  "to": "test@example.com",
  "subject": "Test Email Direct",
  "message": "Hello from Bus Ticket API! This is a direct email test."
}
```

### 2.4. Test Welcome Email

**Request:** `3. Email Test - Welcome Email`
- **Method:** POST
- **URL:** `http://localhost:3000/email-test/welcome`
- **Body:**
```json
{
  "to": "newuser@example.com",
  "name": "John Doe"
}
```

### 2.5. Test Queue Email

**Request:** `4. Email Test - Queue Email`
- **Method:** POST
- **URL:** `http://localhost:3000/email-test/queue`
- **Body:**
```json
{
  "to": "test@example.com",
  "subject": "Queue Email Test",
  "message": "This email was sent via queue system"
}
```

## 📁 Bước 3: Test File Upload API

### 3.1. Test Single File Upload

**Request:** `5. File Upload - Single File`
- **Method:** POST
- **URL:** `http://localhost:3000/upload/single`
- **Body:** Form-data
  - **Key:** `file`
  - **Type:** File
  - **Value:** Chọn file bất kỳ (txt, jpg, pdf, etc.)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "filename": "uploaded-file-name.jpg",
    "originalName": "original-name.jpg",
    "mimeType": "image/jpeg",
    "size": 12345,
    "url": "http://localhost:3000/uploads/uploaded-file-name.jpg"
  }
}
```

### 3.2. Test Multiple Files Upload

**Request:** `6. File Upload - Multiple Files`
- **Method:** POST
- **URL:** `http://localhost:3000/upload/multiple`
- **Body:** Form-data
  - **Key:** `files`
  - **Type:** File
  - **Value:** Chọn nhiều file

### 3.3. Test Async File Upload (Queue)

**Request:** `7. File Upload - Async (Queue)`
- **Method:** POST
- **URL:** `http://localhost:3000/upload/async`
- **Body:** Form-data
  - **Key:** `file`, **Type:** File, **Value:** Chọn file
  - **Key:** `userId`, **Type:** Text, **Value:** `1`

**Expected Response:**
```json
{
  "success": true,
  "message": "File upload job queued successfully"
}
```

### 3.4. Test List Files

**Request:** `8. File Upload - List Files`
- **Method:** GET
- **URL:** `http://localhost:3000/upload/list`

### 3.5. Test File Stats

**Request:** `9. File Upload - File Stats`
- **Method:** GET
- **URL:** `http://localhost:3000/upload/stats/{{filename}}`
- **Note:** Thay `{{filename}}` bằng tên file thực tế

## 📊 Bước 4: Test Queue Management

### 4.1. Test Queue Statistics

**Request:** `10. Queue Stats - All Queues`
- **Method:** GET
- **URL:** `http://localhost:3000/upload/queue/stats`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "email": {
      "waiting": 0,
      "active": 0,
      "completed": 1,
      "failed": 0
    },
    "fileUpload": {
      "waiting": 0,
      "active": 0,
      "completed": 1,
      "failed": 0
    },
    "notification": {
      "waiting": 0,
      "active": 0,
      "completed": 0,
      "failed": 0
    }
  }
}
```

### 4.2. Test Queue Control

**Pause Queues:**
- **Request:** `12. Queue Management - Pause Queues`
- **Method:** POST
- **URL:** `http://localhost:3000/upload/queue/pause`

**Resume Queues:**
- **Request:** `13. Queue Management - Resume Queues`
- **Method:** POST
- **URL:** `http://localhost:3000/upload/queue/resume`

**Clear Queues:**
- **Request:** `11. Queue Management - Clear Queues`
- **Method:** POST
- **URL:** `http://localhost:3000/upload/queue/clear`

## 🔧 Bước 5: Test Workflow Hoàn Chỉnh

### 5.1. Workflow Test Email Queue:

1. **Gửi email qua queue** → `4. Email Test - Queue Email`
2. **Kiểm tra queue stats** → `10. Queue Stats - All Queues`
3. **Đợi 5-10 giây**
4. **Kiểm tra lại queue stats** → `10. Queue Stats - All Queues`
5. **Kiểm tra email đã được gửi**

### 5.2. Workflow Test File Upload Queue:

1. **Upload file async** → `7. File Upload - Async (Queue)`
2. **Kiểm tra queue stats** → `10. Queue Stats - All Queues`
3. **Đợi 5-10 giây**
4. **Kiểm tra lại queue stats** → `10. Queue Stats - All Queues`
5. **Kiểm tra file đã được xử lý** → `8. File Upload - List Files`

## 🐛 Troubleshooting

### Lỗi "Connection refused" (Redis):
```bash
# Kiểm tra Redis đang chạy
docker ps | grep redis

# Khởi động Redis nếu cần
docker start redis
```

### Lỗi "Invalid login" (Email):
1. Kiểm tra email và App Password
2. Đảm bảo đã bật 2FA trên Gmail
3. Sử dụng App Password thay vì mật khẩu thường

### Lỗi "File too large":
- Kiểm tra `MAX_FILE_SIZE` trong `.env`
- Mặc định: 5MB (5242880 bytes)

### Lỗi "Queue not processing":
1. Kiểm tra Redis connection
2. Kiểm tra queue stats
3. Thử clear và resume queue

## 📝 Test Cases Quan Trọng

### Test Case 1: Email Queue Processing
1. Gửi email qua queue
2. Verify queue stats có job waiting
3. Đợi processing
4. Verify email được gửi thành công

### Test Case 2: File Upload Queue Processing
1. Upload file async
2. Verify queue stats có job waiting
3. Đợi processing
4. Verify file được lưu thành công

### Test Case 3: Queue Management
1. Pause queue
2. Gửi email/file
3. Verify job ở trạng thái waiting
4. Resume queue
5. Verify job được xử lý

### Test Case 4: Error Handling
1. Gửi email với địa chỉ không hợp lệ
2. Upload file quá lớn
3. Verify error handling và retry logic

## 🎯 Kết Quả Mong Đợi

Sau khi test thành công, bạn sẽ thấy:

1. **Email được gửi thành công** qua queue system
2. **File được upload và xử lý** qua queue system
3. **Queue statistics** hiển thị đúng trạng thái
4. **Queue management** hoạt động bình thường
5. **Error handling** xử lý lỗi đúng cách

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Redis đang chạy
2. Environment variables đúng
3. Email configuration hợp lệ
4. File permissions cho upload folder



