# 🚌🎫 BUS & TICKET MANAGEMENT API GUIDE

## 📋 **TỔNG QUAN**

API quản lý xe (Bus) và vé (Ticket) với đầy đủ chức năng CRUD, business logic và validation.

---

## 🚌 **BUS MANAGEMENT API**

### **Base URL:** `http://localhost:3000/buses`

### **1. Tạo xe mới**
- **Method:** `POST`
- **URL:** `/buses`
- **Auth:** Required (JWT)
- **Body:**
  ```json
  {
    "name": "Xe khách 45 chỗ",
    "descriptions": "Xe khách hiện đại, tiện nghi",
    "license_plate": "29A-12345",
    "capacity": 45,
    "company_id": 1
  }
  ```

### **2. Lấy danh sách xe**
- **Method:** `GET`
- **URL:** `/buses`
- **Query Parameters:**
  - `page`: Số trang (default: 1)
  - `limit`: Số lượng per page (default: 10)
  - `search`: Tìm kiếm theo tên xe, biển số, nhà xe
  - `company_id`: Lọc theo nhà xe
  - `sortBy`: Sắp xếp theo trường (default: name)
  - `sortOrder`: Thứ tự sắp xếp (ASC/DESC, default: ASC)

### **3. Lấy chi tiết xe**
- **Method:** `GET`
- **URL:** `/buses/:id`

### **4. Cập nhật xe**
- **Method:** `PATCH`
- **URL:** `/buses/:id`
- **Auth:** Required (JWT)
- **Body:** UpdateBusDto (tất cả fields optional)

### **5. Xóa xe**
- **Method:** `DELETE`
- **URL:** `/buses/:id`
- **Auth:** Required (JWT)

### **6. Lấy xe có sẵn**
- **Method:** `GET`
- **URL:** `/buses/available`

### **7. Lấy xe có lịch trình**
- **Method:** `GET`
- **URL:** `/buses/with-schedules`

### **8. Lấy xe theo nhà xe**
- **Method:** `GET`
- **URL:** `/buses/company/:companyId`

### **9. Thống kê xe**
- **Method:** `GET`
- **URL:** `/buses/:id/statistics`
- **Response:**
  ```json
  {
    "totalSchedules": 15,
    "totalTickets": 450,
    "averageRating": 4.5,
    "totalReviews": 25
  }
  ```

---

## 🎫 **TICKET MANAGEMENT API**

### **Base URL:** `http://localhost:3000/tickets`

### **1. Tạo vé mới**
- **Method:** `POST`
- **URL:** `/tickets`
- **Auth:** Required (JWT)
- **Body:**
  ```json
  {
    "schedule_id": 1,
    "seat_id": 5,
    "departure_time": "2024-01-15T08:00:00Z",
    "arrival_time": "2024-01-15T12:00:00Z",
    "seat_type": "LUXURY",
    "price": 200000
  }
  ```

### **2. Đặt vé**
- **Method:** `POST`
- **URL:** `/tickets/book`
- **Auth:** Required (JWT)
- **Body:**
  ```json
  {
    "schedule_id": 1,
    "seat_id": 5,
    "seat_type": "LUXURY",
    "user_id": 1
  }
  ```

### **3. Hủy vé**
- **Method:** `POST`
- **URL:** `/tickets/cancel`
- **Auth:** Required (JWT)
- **Body:**
  ```json
  {
    "ticket_id": 1,
    "reason": "Thay đổi kế hoạch"
  }
  ```

### **4. Lấy danh sách vé**
- **Method:** `GET`
- **URL:** `/tickets`
- **Query Parameters:**
  - `page`: Số trang (default: 1)
  - `limit`: Số lượng per page (default: 10)
  - `search`: Tìm kiếm theo số ghế, lịch trình
  - `schedule_id`: Lọc theo lịch trình
  - `seat_id`: Lọc theo ghế
  - `status`: Lọc theo trạng thái (BOOKED/CANCELLED)
  - `departureDate`: Lọc theo ngày khởi hành
  - `sortBy`: Sắp xếp theo trường (default: created_at)
  - `sortOrder`: Thứ tự sắp xếp (ASC/DESC, default: DESC)

### **5. Lấy chi tiết vé**
- **Method:** `GET`
- **URL:** `/tickets/:id`

### **6. Cập nhật vé**
- **Method:** `PATCH`
- **URL:** `/tickets/:id`
- **Auth:** Required (JWT)
- **Body:** UpdateTicketDto (tất cả fields optional)

### **7. Xóa vé**
- **Method:** `DELETE`
- **URL:** `/tickets/:id`
- **Auth:** Required (JWT)

### **8. Thống kê vé**
- **Method:** `GET`
- **URL:** `/tickets/statistics`
- **Response:**
  ```json
  {
    "totalTickets": 1000,
    "bookedTickets": 850,
    "cancelledTickets": 150,
    "totalRevenue": 150000000
  }
  ```

### **9. Lấy vé theo khoảng thời gian**
- **Method:** `GET`
- **URL:** `/tickets/date-range?startDate=2024-01-01&endDate=2024-01-31`

### **10. Lấy vé theo lịch trình**
- **Method:** `GET`
- **URL:** `/tickets/schedule/:scheduleId`

### **11. Lấy vé theo ghế**
- **Method:** `GET`
- **URL:** `/tickets/seat/:seatId`

---

## 🔧 **BUSINESS LOGIC**

### **Bus Management:**
- ✅ **Validation:** Tên xe, sức chứa, biển số
- ✅ **Unique License Plate:** Kiểm tra biển số trùng lặp
- ✅ **Delete Protection:** Không xóa xe có lịch trình hoạt động
- ✅ **Statistics:** Thống kê lịch trình, vé, đánh giá

### **Ticket Management:**
- ✅ **Seat Availability:** Kiểm tra ghế đã được đặt chưa
- ✅ **Price Calculation:** Tính giá theo loại ghế
- ✅ **Time Validation:** Thời gian khởi hành < thời gian đến
- ✅ **Status Management:** BOOKED ↔ CANCELLED
- ✅ **Revenue Tracking:** Theo dõi doanh thu

---

## 🎯 **API FEATURES**

### **✅ CRUD Operations:**
- Create, Read, Update, Delete cho cả Bus và Ticket
- Validation đầy đủ với class-validator
- Error handling với proper HTTP status codes

### **✅ Advanced Queries:**
- Pagination, sorting, filtering
- Search functionality
- Date range queries
- Statistics và reporting

### **✅ Business Logic:**
- Seat availability checking
- Price calculation based on seat type
- Schedule conflict prevention
- Revenue tracking

### **✅ Security:**
- JWT authentication cho các operations cần thiết
- Input validation và sanitization
- Proper error messages

---

## 🚀 **TESTING WITH POSTMAN**

### **1. Authentication:**
```
POST /auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### **2. Test Bus APIs:**
```
GET /buses
POST /buses (with JWT token)
GET /buses/1
PATCH /buses/1 (with JWT token)
DELETE /buses/1 (with JWT token)
```

### **3. Test Ticket APIs:**
```
GET /tickets
POST /tickets/book (with JWT token)
POST /tickets/cancel (with JWT token)
GET /tickets/statistics
```

---

## 📊 **RESPONSE EXAMPLES**

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

---

## 🎉 **KẾT LUẬN**

API Bus & Ticket Management đã hoàn chỉnh với:
- ✅ **Full CRUD operations**
- ✅ **Advanced business logic**
- ✅ **Comprehensive validation**
- ✅ **Security & authentication**
- ✅ **Statistics & reporting**
- ✅ **Error handling**

**Sẵn sàng để test và sử dụng!** 🚀

