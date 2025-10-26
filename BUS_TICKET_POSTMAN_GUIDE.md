# 🚌🎫 HƯỚNG DẪN TEST POSTMAN - BUS & TICKET MANAGEMENT

## 📋 **BƯỚC 1: KHỞI ĐỘNG SERVER**

```bash
cd D:\Vinh\vinh
npm run start:dev
```

Server sẽ chạy tại: `http://localhost:3000`

---

## 🔧 **BƯỚC 2: IMPORT POSTMAN COLLECTION**

1. **Mở Postman**
2. **Click "Import"**
3. **Chọn file:** `Bus_Ticket_Postman_Collection.json`
4. **Collection sẽ được import** với tất cả requests sẵn sàng

---

## 🔐 **BƯỚC 3: AUTHENTICATION (BẮT BUỘC)**

### **3.1. Register (Tạo tài khoản)**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### **3.2. Login (Đăng nhập)**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Copy JWT token từ response để sử dụng trong các API cần authentication!**

---

## 🚌 **BƯỚC 4: TEST BUS MANAGEMENT API**

### **4.1. Tạo xe mới**
```
POST http://localhost:3000/buses
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Xe khách 45 chỗ",
  "descriptions": "Xe khách hiện đại, tiện nghi",
  "license_plate": "29A-12345",
  "capacity": 45,
  "company_id": 1
}
```

### **4.2. Lấy danh sách xe**
```
GET http://localhost:3000/buses?page=1&limit=10&sortBy=name&sortOrder=ASC
```

### **4.3. Lấy chi tiết xe**
```
GET http://localhost:3000/buses/1
```

### **4.4. Lấy xe có sẵn**
```
GET http://localhost:3000/buses/available
```

### **4.5. Lấy xe có lịch trình**
```
GET http://localhost:3000/buses/with-schedules
```

### **4.6. Lấy xe theo nhà xe**
```
GET http://localhost:3000/buses/company/1
```

### **4.7. Thống kê xe**
```
GET http://localhost:3000/buses/1/statistics
```

### **4.8. Cập nhật xe**
```
PATCH http://localhost:3000/buses/1
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Xe khách 50 chỗ",
  "capacity": 50
}
```

### **4.9. Xóa xe**
```
DELETE http://localhost:3000/buses/1
Authorization: Bearer <your_jwt_token>
```

---

## 🎫 **BƯỚC 5: TEST TICKET MANAGEMENT API**

### **5.1. Tạo vé mới**
```
POST http://localhost:3000/tickets
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "schedule_id": 1,
  "seat_id": 5,
  "departure_time": "2024-01-15T08:00:00Z",
  "arrival_time": "2024-01-15T12:00:00Z",
  "seat_type": "LUXURY",
  "price": 200000
}
```

### **5.2. Đặt vé**
```
POST http://localhost:3000/tickets/book
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "schedule_id": 1,
  "seat_id": 5,
  "seat_type": "LUXURY",
  "user_id": 1
}
```

### **5.3. Hủy vé**
```
POST http://localhost:3000/tickets/cancel
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "ticket_id": 1,
  "reason": "Thay đổi kế hoạch"
}
```

### **5.4. Lấy danh sách vé**
```
GET http://localhost:3000/tickets?page=1&limit=10&sortBy=created_at&sortOrder=DESC
```

### **5.5. Lấy chi tiết vé**
```
GET http://localhost:3000/tickets/1
```

### **5.6. Thống kê vé**
```
GET http://localhost:3000/tickets/statistics
```

### **5.7. Lấy vé theo khoảng thời gian**
```
GET http://localhost:3000/tickets/date-range?startDate=2024-01-01&endDate=2024-01-31
```

### **5.8. Lấy vé theo lịch trình**
```
GET http://localhost:3000/tickets/schedule/1
```

### **5.9. Lấy vé theo ghế**
```
GET http://localhost:3000/tickets/seat/1
```

### **5.10. Cập nhật vé**
```
PATCH http://localhost:3000/tickets/1
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "price": 250000,
  "status": "BOOKED"
}
```

### **5.11. Xóa vé**
```
DELETE http://localhost:3000/tickets/1
Authorization: Bearer <your_jwt_token>
```

---

## 🧪 **BƯỚC 6: TEST ERROR CASES**

### **6.1. Test validation errors**
```
POST http://localhost:3000/buses
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "",
  "capacity": -1,
  "company_id": 999
}
```

### **6.2. Test seat already booked**
```
POST http://localhost:3000/tickets/book
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "schedule_id": 1,
  "seat_id": 1,
  "seat_type": "LUXURY"
}
```

### **6.3. Test non-existent resources**
```
GET http://localhost:3000/buses/999
GET http://localhost:3000/tickets/999
```

---

## 🎯 **BƯỚC 7: TEST SEQUENCE ĐÚNG**

### **Sequence 1: Bus Management**
1. **Register/Login** → Lấy JWT token
2. **Create Bus** → Tạo xe mới
3. **Get All Buses** → Xem danh sách
4. **Get Bus Details** → Xem chi tiết
5. **Update Bus** → Cập nhật thông tin
6. **Get Bus Statistics** → Xem thống kê
7. **Delete Bus** → Xóa xe (nếu cần)

### **Sequence 2: Ticket Management**
1. **Create Ticket** → Tạo vé mới
2. **Book Ticket** → Đặt vé
3. **Get All Tickets** → Xem danh sách vé
4. **Get Ticket Details** → Xem chi tiết vé
5. **Get Ticket Statistics** → Xem thống kê
6. **Cancel Ticket** → Hủy vé
7. **Update Ticket** → Cập nhật vé

### **Sequence 3: Advanced Queries**
1. **Get Available Buses** → Xe có sẵn
2. **Get Buses with Schedules** → Xe có lịch trình
3. **Get Tickets by Date Range** → Vé theo thời gian
4. **Get Tickets by Schedule** → Vé theo lịch trình
5. **Get Tickets by Seat** → Vé theo ghế

---

## 📊 **EXPECTED RESPONSES**

### **Bus Response:**
```json
{
  "id": 1,
  "name": "Xe khách 45 chỗ",
  "descriptions": "Xe khách hiện đại, tiện nghi",
  "license_plate": "29A-12345",
  "capacity": 45,
  "company_id": 1,
  "created_at": "2024-01-10T10:00:00.000Z",
  "updated_at": "2024-01-10T10:00:00.000Z"
}
```

### **Ticket Response:**
```json
{
  "id": 1,
  "schedule_id": 1,
  "seat_id": 5,
  "departure_time": "2024-01-15T08:00:00.000Z",
  "arrival_time": "2024-01-15T12:00:00.000Z",
  "seat_type": "LUXURY",
  "price": 200000,
  "status": "BOOKED",
  "created_at": "2024-01-10T10:00:00.000Z",
  "updated_at": "2024-01-10T10:00:00.000Z"
}
```

### **Statistics Response:**
```json
{
  "totalTickets": 1000,
  "bookedTickets": 850,
  "cancelledTickets": 150,
  "totalRevenue": 150000000
}
```

---

## 🚨 **LƯU Ý QUAN TRỌNG**

### **Authentication:**
- ✅ **Luôn login trước** khi test các API cần authentication
- ✅ **Copy JWT token chính xác** từ login response
- ✅ **Sử dụng token trong Authorization header**

### **Data Requirements:**
- ✅ **Database phải có dữ liệu** company, route, schedule, seat
- ✅ **Server phải chạy** tại `http://localhost:3000`
- ✅ **Kiểm tra relations** giữa các entities

### **Error Handling:**
- ✅ **Validation errors** sẽ trả về 400 Bad Request
- ✅ **Not found** sẽ trả về 404 Not Found
- ✅ **Unauthorized** sẽ trả về 401 Unauthorized

---

## 🎉 **KẾT LUẬN**

API Bus & Ticket Management đã sẵn sàng test với Postman! 

**Tất cả 20 endpoints** đã được cấu hình sẵn trong collection với:
- ✅ **Authentication** tự động
- ✅ **Request examples** đầy đủ
- ✅ **Error testing** cases
- ✅ **Response validation**

**Hãy import collection và bắt đầu test!** 🚀

