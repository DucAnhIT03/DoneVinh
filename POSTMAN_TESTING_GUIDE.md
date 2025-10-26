# 🚀 HƯỚNG DẪN TEST API LỊCH TRÌNH DI CHUYỂN BẰNG POSTMAN

## 📋 **Bước 1: Khởi động Server**

```bash
# Trong terminal, chạy lệnh:
cd D:\Vinh\vinh
npm run start:dev
```

Server sẽ chạy tại: `http://localhost:3000`

---

## 🔧 **Bước 2: Cấu hình Postman**

### **Base URL:**
```
http://localhost:3000
```

### **Headers mặc định:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (cho các API cần auth)
```

---

## 📝 **Bước 3: Test các API Endpoints**

### **1. TẠO LỊCH TRÌNH MỚI**
- **Method:** `POST`
- **URL:** `http://localhost:3000/schedules`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <jwt_token>
  ```
- **Body (JSON):**
  ```json
  {
    "routeId": 1,
    "busId": 1,
    "departureTime": "2024-01-15T08:00:00Z",
    "arrivalTime": "2024-01-15T12:00:00Z",
    "availableSeat": 40,
    "totalSeats": 40,
    "status": "AVAILABLE"
  }
  ```

### **2. LẤY DANH SÁCH LỊCH TRÌNH**
- **Method:** `GET`
- **URL:** `http://localhost:3000/schedules`
- **Query Parameters (tùy chọn):**
  ```
  page=1
  limit=10
  search=bus_name
  routeId=1
  busId=1
  departureDate=2024-01-15
  status=AVAILABLE
  sortBy=departureTime
  sortOrder=ASC
  ```

**Ví dụ URL đầy đủ:**
```
http://localhost:3000/schedules?page=1&limit=10&status=AVAILABLE&sortBy=departureTime&sortOrder=ASC
```

### **3. LẤY CHI TIẾT LỊCH TRÌNH**
- **Method:** `GET`
- **URL:** `http://localhost:3000/schedules/1`

### **4. CẬP NHẬT LỊCH TRÌNH**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/schedules/1`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <jwt_token>
  ```
- **Body (JSON):**
  ```json
  {
    "availableSeat": 35,
    "status": "AVAILABLE"
  }
  ```

### **5. XÓA LỊCH TRÌNH**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/schedules/1`
- **Headers:** 
  ```
  Authorization: Bearer <jwt_token>
  ```

### **6. LẤY TUYẾN ĐƯỜNG PHỔ BIẾN**
- **Method:** `GET`
- **URL:** `http://localhost:3000/schedules/popular-routes`

### **7. LẤY LỊCH TRÌNH THEO TUYẾN ĐƯỜNG**
- **Method:** `GET`
- **URL:** `http://localhost:3000/schedules/route/1?departureDate=2024-01-15`

### **8. LẤY LỊCH TRÌNH THEO XE**
- **Method:** `GET`
- **URL:** `http://localhost:3000/schedules/bus/1?departureDate=2024-01-15`

### **9. CẬP NHẬT SỐ GHẾ CÓ SẴN**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/schedules/1/update-seats`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer <jwt_token>
  ```
- **Body (JSON):**
  ```json
  {
    "seatsToBook": 5
  }
  ```

---

## 🧪 **Bước 4: Test Cases Chi Tiết**

### **Test Case 1: Tạo lịch trình hợp lệ**
```json
POST /schedules
{
  "routeId": 1,
  "busId": 1,
  "departureTime": "2024-01-15T08:00:00Z",
  "arrivalTime": "2024-01-15T12:00:00Z",
  "availableSeat": 40,
  "totalSeats": 40
}
```
**Expected:** Status 201, trả về schedule mới

### **Test Case 2: Tạo lịch trình với thời gian không hợp lệ**
```json
POST /schedules
{
  "routeId": 1,
  "busId": 1,
  "departureTime": "2024-01-15T12:00:00Z",
  "arrivalTime": "2024-01-15T08:00:00Z",
  "availableSeat": 40,
  "totalSeats": 40
}
```
**Expected:** Status 400, lỗi "Departure time must be before arrival time"

### **Test Case 3: Tạo lịch trình với số ghế không hợp lệ**
```json
POST /schedules
{
  "routeId": 1,
  "busId": 1,
  "departureTime": "2024-01-15T08:00:00Z",
  "arrivalTime": "2024-01-15T12:00:00Z",
  "availableSeat": 50,
  "totalSeats": 40
}
```
**Expected:** Status 400, lỗi "Available seats cannot exceed total seats"

### **Test Case 4: Lấy lịch trình không tồn tại**
```
GET /schedules/999
```
**Expected:** Status 404, lỗi "Schedule with ID 999 not found"

### **Test Case 5: Tìm kiếm với filter**
```
GET /schedules?routeId=1&departureDate=2024-01-15&status=AVAILABLE&page=1&limit=5
```
**Expected:** Status 200, trả về danh sách lịch trình phù hợp

---

## 🔐 **Bước 5: Authentication**

### **Lấy JWT Token:**
1. **Đăng nhập để lấy token:**
   ```
   POST /auth/login
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   ```

2. **Sử dụng token trong header:**
   ```
   Authorization: Bearer <token_from_login_response>
   ```

---

## 📊 **Bước 6: Response Examples**

### **Success Response (201/200):**
```json
{
  "id": 1,
  "routeId": 1,
  "busId": 1,
  "departureTime": "2024-01-15T08:00:00.000Z",
  "arrivalTime": "2024-01-15T12:00:00.000Z",
  "availableSeat": 40,
  "totalSeats": 40,
  "status": "AVAILABLE",
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}
```

### **Error Response (400/404):**
```json
{
  "statusCode": 400,
  "message": "Departure time must be before arrival time",
  "error": "Bad Request"
}
```

### **List Response với Pagination:**
```json
{
  "schedules": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

## 🎯 **Bước 7: Test Scenarios**

### **Scenario 1: Quản lý lịch trình hoàn chỉnh**
1. Tạo lịch trình mới
2. Lấy danh sách lịch trình
3. Lấy chi tiết lịch trình
4. Cập nhật lịch trình
5. Cập nhật số ghế
6. Xóa lịch trình

### **Scenario 2: Tìm kiếm và lọc**
1. Tìm kiếm theo tuyến đường
2. Tìm kiếm theo xe
3. Tìm kiếm theo ngày
4. Sắp xếp kết quả
5. Phân trang

### **Scenario 3: Business Logic**
1. Test auto status update (FULL khi hết ghế)
2. Test validation rules
3. Test error handling

---

## 🚨 **Lưu ý quan trọng:**

1. **Database**: Đảm bảo database đã được setup và có dữ liệu mẫu
2. **Authentication**: Một số API cần JWT token
3. **Date Format**: Sử dụng ISO 8601 format cho dates
4. **Validation**: API sẽ validate input và trả về lỗi chi tiết
5. **Relations**: API sẽ load đầy đủ thông tin Route, Bus, Company

---

## 🎉 **Kết luận**

API lịch trình di chuyển đã sẵn sàng để test với Postman! Tất cả endpoints đều hoạt động và có validation đầy đủ.

