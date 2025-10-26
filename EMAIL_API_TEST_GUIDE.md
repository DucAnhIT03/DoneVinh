# Hướng dẫn Test Email API

## 1. Cấu hình Environment Variables

Tạo file `.env` trong thư mục gốc:

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
```

## 2. Test Email API Endpoints

### 2.1. Kiểm tra cấu hình email
```bash
GET http://localhost:3000/email-test/config
```

### 2.2. Gửi email trực tiếp
```bash
POST http://localhost:3000/email-test/send
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Test Email",
  "message": "Hello from Bus Ticket API!"
}
```

### 2.3. Gửi welcome email
```bash
POST http://localhost:3000/email-test/welcome
Content-Type: application/json

{
  "to": "newuser@example.com",
  "name": "John Doe"
}
```

### 2.4. Gửi email qua queue
```bash
POST http://localhost:3000/email-test/queue
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Queue Email",
  "message": "This email was sent via queue"
}
```

## 3. Test File Upload API

### 3.1. Upload file đơn
```bash
POST http://localhost:3000/upload/single
Content-Type: multipart/form-data

file: [select your file]
```

### 3.2. Upload nhiều file
```bash
POST http://localhost:3000/upload/multiple
Content-Type: multipart/form-data

files: [select multiple files]
```

### 3.3. Upload file async (qua queue)
```bash
POST http://localhost:3000/upload/async
Content-Type: multipart/form-data

file: [select your file]
userId: 1
```

## 4. Test Queue Management

### 4.1. Xem thống kê queue
```bash
GET http://localhost:3000/upload/queue/stats
```

### 4.2. Xóa tất cả queue
```bash
POST http://localhost:3000/upload/queue/clear
```

## 5. Cách lấy App Password cho Gmail

1. **Vào Google Account Settings**
2. **Security** → **2-Step Verification** (bật nếu chưa có)
3. **App passwords** → **Select app** → **Mail**
4. **Select device** → **Other (Custom name)**
5. Nhập tên: "Bus Ticket API"
6. **Generate** → Copy mật khẩu 16 ký tự
7. Sử dụng mật khẩu này làm `SMTP_PASS`

## 6. Troubleshooting

### Lỗi "Invalid login"
- Kiểm tra email và App Password
- Đảm bảo đã bật 2FA

### Lỗi "Connection timeout"
- Kiểm tra SMTP_HOST và SMTP_PORT
- Kiểm tra firewall/antivirus

### Lỗi "Authentication failed"
- Sử dụng App Password thay vì mật khẩu thường
- Kiểm tra cài đặt bảo mật Gmail

## 7. Test với Postman

Import collection sau vào Postman:

```json
{
  "info": {
    "name": "Bus Ticket Email API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Test Email Config",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/email-test/config",
          "host": ["{{baseUrl}}"],
          "path": ["email-test", "config"]
        }
      }
    },
    {
      "name": "Send Test Email",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"to\": \"test@example.com\",\n  \"subject\": \"Test Email\",\n  \"message\": \"Hello from Bus Ticket API!\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/email-test/send",
          "host": ["{{baseUrl}}"],
          "path": ["email-test", "send"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```


