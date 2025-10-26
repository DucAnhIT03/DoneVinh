# Hướng dẫn cấu hình Email Service

## 1. Cấu hình SMTP trong file .env

Tạo file `.env` trong thư mục gốc của dự án với các cấu hình sau:

### Gmail SMTP (Khuyến nghị)
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# App Configuration
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

### Outlook/Hotmail SMTP
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

### Yahoo SMTP
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@yahoo.com
```

## 2. Cách lấy App Password cho Gmail

1. **Bật 2-Factor Authentication** trên tài khoản Google
2. Vào **Google Account Settings** → **Security**
3. Tìm **App passwords** (mật khẩu ứng dụng)
4. Chọn **Mail** và **Other (Custom name)**
5. Nhập tên: "Bus Ticket API"
6. Copy mật khẩu được tạo (16 ký tự)
7. Sử dụng mật khẩu này làm `SMTP_PASS`

## 3. Cấu hình Redis (cho Queue)

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## 4. Cài đặt Redis

### Windows:
```bash
# Tải Redis từ: https://github.com/microsoftarchive/redis/releases
# Hoặc sử dụng Docker:
docker run -d -p 6379:6379 redis:alpine
```

### Linux/Mac:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis
```

## 5. Test Email Service

Tạo file test để kiểm tra:

```typescript
// test-email.ts
import { EmailService } from './src/shared/services/email.service';

async function testEmail() {
  const emailService = new EmailService();
  
  try {
    await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Hello from Bus Ticket API!</h1>'
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Email failed:', error.message);
  }
}

testEmail();
```

## 6. API Endpoints để test

### Gửi email đơn giản:
```bash
POST http://localhost:3000/upload/queue/stats
```

### Upload file và gửi email:
```bash
POST http://localhost:3000/upload/async
Content-Type: multipart/form-data

file: [your-file]
userId: 1
```

## 7. Troubleshooting

### Lỗi thường gặp:

1. **"Invalid login"**: Kiểm tra email/password
2. **"Connection timeout"**: Kiểm tra SMTP_HOST và SMTP_PORT
3. **"Authentication failed"**: Sử dụng App Password thay vì mật khẩu thường
4. **"Less secure app access"**: Bật 2FA và sử dụng App Password

### Debug mode:
```env
NODE_ENV=development
DEBUG=email:*
```

## 8. Production Settings

```env
# Production Email (SendGrid, Mailgun, etc.)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```


