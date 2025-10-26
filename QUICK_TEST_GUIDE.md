# 🚀 HƯỚNG DẪN TEST NHANH - KHẮC PHỤC LỖI 401

## ❌ **VẤN ĐỀ HIỆN TẠI:**
- Lỗi 401 Unauthorized khi gọi API `/schedules`
- Cần JWT token để xác thực

## ✅ **GIẢI PHÁP:**

### **Bước 1: Khởi động Server**
```bash
cd D:\Vinh\vinh
npm run start:dev
```

### **Bước 2: Test Authentication trước**

#### **2.1. Test Login API:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Nếu chưa có user, tạo user mới:**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User", 
  "email": "admin@example.com",
  "password": "password123"
}
```

#### **2.2. Copy JWT Token từ response:**
Response sẽ có dạng:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

### **Bước 3: Test Schedule API với Token**

#### **3.1. Thêm Authorization Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **3.2. Test Create Schedule:**
```
POST http://localhost:3000/schedules
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "routeId": 1,
  "busId": 1,
  "departureTime": "2024-01-15T08:00:00Z",
  "arrivalTime": "2024-01-15T12:00:00Z",
  "availableSeat": 40,
  "totalSeats": 40
}
```

## 🔧 **CÁCH THIẾT LẬP TRONG POSTMAN:**

### **Method 1: Manual Setup**
1. Tạo request mới
2. Chọn method POST
3. URL: `http://localhost:3000/schedules`
4. Headers tab:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer <your_token>`
5. Body tab (raw JSON):
   ```json
   {
     "routeId": 1,
     "busId": 1,
     "departureTime": "2024-01-15T08:00:00Z",
     "arrivalTime": "2024-01-15T12:00:00Z",
     "availableSeat": 40,
     "totalSeats": 40
   }
   ```

### **Method 2: Sử dụng Collection Variables**
1. Import file `Schedule_API_Postman_Collection.json`
2. Chạy request "Login" trước
3. Token sẽ tự động được lưu vào variable
4. Các request khác sẽ tự động sử dụng token

## 🎯 **TEST SEQUENCE ĐÚNG:**

### **1. Authentication (Bắt buộc):**
```
POST /auth/login → Lấy token
```

### **2. Schedule Management (Cần token):**
```
POST /schedules → Tạo lịch trình
GET /schedules → Lấy danh sách  
GET /schedules/1 → Chi tiết
PATCH /schedules/1 → Cập nhật
DELETE /schedules/1 → Xóa
```

### **3. Public APIs (Không cần token):**
```
GET /schedules/popular-routes
GET /schedules/route/1?departureDate=2024-01-15
GET /schedules/bus/1?departureDate=2024-01-15
```

## 🚨 **LƯU Ý QUAN TRỌNG:**

1. **Luôn login trước** khi test các API cần authentication
2. **Copy token chính xác** từ response login
3. **Kiểm tra server đang chạy** tại `http://localhost:3000`
4. **Database phải có dữ liệu** route và bus để test

## 🎉 **SAU KHI KHẮC PHỤC:**
- ✅ 401 Unauthorized sẽ biến mất
- ✅ API sẽ trả về 201 Created cho tạo mới
- ✅ Có thể test đầy đủ tất cả endpoints

