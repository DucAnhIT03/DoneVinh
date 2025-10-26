# 🚀 Quick Start - Test Mail Queue Upload File

## Bước 1: Cài đặt Dependencies

```bash
# Cài đặt các package cần thiết
npm install axios form-data

# Hoặc nếu chưa có
npm install
```

## Bước 2: Cấu hình Environment

Tạo file `.env` với nội dung:

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
```

## Bước 3: Khởi động Services

```bash
# 1. Khởi động Redis (Docker)
docker run -d --name redis -p 6379:6379 redis:alpine

# 2. Khởi động ứng dụng
npm run start:dev
```

## Bước 4: Test với Postman

### 4.1. Import Collection
1. Mở Postman
2. Import file `Mail_Queue_Upload_Test_Collection.json`
3. Set environment variable `baseUrl = http://localhost:3000`

### 4.2. Test Các Endpoint Chính

**Test Email Queue:**
1. `1. Email Test - Config` - Kiểm tra cấu hình
2. `4. Email Test - Queue Email` - Gửi email qua queue
3. `10. Queue Stats - All Queues` - Xem thống kê

**Test File Upload Queue:**
1. `7. File Upload - Async (Queue)` - Upload file qua queue
2. `10. Queue Stats - All Queues` - Xem thống kê
3. `8. File Upload - List Files` - Xem danh sách file

## Bước 5: Test với Script

```bash
# Chạy script test tự động
node quick-test-mail-queue.js
```

## Bước 6: Kiểm tra Kết Quả

### Email Queue:
- ✅ Email được gửi thành công
- ✅ Queue stats hiển thị completed jobs
- ✅ Không có failed jobs

### File Upload Queue:
- ✅ File được upload thành công
- ✅ File xuất hiện trong danh sách
- ✅ Queue stats hiển thị completed jobs

## 🔧 Troubleshooting

### Lỗi Redis Connection:
```bash
# Kiểm tra Redis
docker ps | grep redis

# Khởi động lại Redis
docker restart redis
```

### Lỗi Email:
- Kiểm tra Gmail App Password
- Đảm bảo đã bật 2FA
- Kiểm tra SMTP settings

### Lỗi File Upload:
- Kiểm tra folder `uploads` tồn tại
- Kiểm tra permissions
- Kiểm tra MAX_FILE_SIZE

## 📊 Expected Results

Sau khi test thành công:

```json
// Queue Stats Response
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
    }
  }
}
```

## 🎯 Next Steps

1. **Test với file lớn** - Upload file > 1MB
2. **Test với nhiều file** - Upload multiple files
3. **Test error handling** - Upload file không hợp lệ
4. **Test queue management** - Pause/Resume/Clear queues

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs của ứng dụng
2. Kiểm tra Redis connection
3. Kiểm tra email configuration
4. Xem file `MAIL_QUEUE_UPLOAD_TEST_GUIDE.md` để biết thêm chi tiết



