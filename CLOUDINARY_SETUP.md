# 🔧 Cloudinary Configuration Guide

## Bước 1: Tạo tài khoản Cloudinary

1. Truy cập [https://cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

## Bước 2: Lấy thông tin API

1. Đăng nhập vào Cloudinary Dashboard
2. Vào **Settings** > **API Keys**
3. Copy các thông tin sau:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Bước 3: Cấu hình .env

Thêm vào file `.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Bước 4: Test Configuration

Sau khi cấu hình, khởi động ứng dụng và kiểm tra logs:

```
Cloudinary configured successfully
```

## 📝 Lưu ý

- **Cloud Name**: Tên cloud của bạn (ví dụ: `my-bus-booking`)
- **API Key**: Key để xác thực API
- **API Secret**: Secret key (giữ bí mật)

## 🔒 Bảo mật

- Không commit file `.env` vào Git
- Sử dụng environment variables trong production
- Rotate API keys định kỳ

