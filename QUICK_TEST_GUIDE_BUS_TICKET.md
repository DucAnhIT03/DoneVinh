# 🚀 HƯỚNG DẪN TEST NHANH - BUS & TICKET API

## ⚡ **TEST NHANH TRONG 5 PHÚT**

### **Bước 1: Khởi động server**
```bash
cd D:\Vinh\vinh
npm run start:dev
```

### **Bước 2: Import Postman Collection**
1. Mở Postman
2. Import file: `Bus_Ticket_Postman_Collection.json`
3. Collection sẽ có sẵn tất cả requests

### **Bước 3: Test theo thứ tự**

#### **🔐 1. Authentication (Bắt buộc)**
```
1. POST /auth/register → Tạo tài khoản
2. POST /auth/login → Lấy JWT token
```

#### **🚌 2. Bus Management**
```
3. POST /buses → Tạo xe mới (cần token)
4. GET /buses → Xem danh sách xe
5. GET /buses/1 → Chi tiết xe
6. GET /buses/available → Xe có sẵn
7. GET /buses/1/statistics → Thống kê xe
8. PATCH /buses/1 → Cập nhật xe (cần token)
```

#### **🎫 3. Ticket Management**
```
9. POST /tickets/book → Đặt vé (cần token)
10. GET /tickets → Xem danh sách vé
11. GET /tickets/1 → Chi tiết vé
12. GET /tickets/statistics → Thống kê vé
13. POST /tickets/cancel → Hủy vé (cần token)
```

---

## 🎯 **TEST CASES QUAN TRỌNG**

### **✅ Success Cases:**
- Tạo xe với dữ liệu hợp lệ
- Đặt vé với ghế có sẵn
- Lấy thống kê chính xác
- Cập nhật thông tin thành công

### **❌ Error Cases:**
- Tạo xe với dữ liệu không hợp lệ
- Đặt vé với ghế đã được đặt
- Truy cập resource không tồn tại
- Thiếu JWT token

---

## 📋 **CHECKLIST TEST**

### **Bus API:**
- [ ] POST /buses (tạo xe)
- [ ] GET /buses (danh sách)
- [ ] GET /buses/:id (chi tiết)
- [ ] GET /buses/available (xe có sẵn)
- [ ] GET /buses/with-schedules (xe có lịch trình)
- [ ] GET /buses/company/:id (xe theo nhà xe)
- [ ] GET /buses/:id/statistics (thống kê)
- [ ] PATCH /buses/:id (cập nhật)
- [ ] DELETE /buses/:id (xóa)

### **Ticket API:**
- [ ] POST /tickets (tạo vé)
- [ ] POST /tickets/book (đặt vé)
- [ ] POST /tickets/cancel (hủy vé)
- [ ] GET /tickets (danh sách)
- [ ] GET /tickets/:id (chi tiết)
- [ ] GET /tickets/statistics (thống kê)
- [ ] GET /tickets/date-range (theo thời gian)
- [ ] GET /tickets/schedule/:id (theo lịch trình)
- [ ] GET /tickets/seat/:id (theo ghế)
- [ ] PATCH /tickets/:id (cập nhật)
- [ ] DELETE /tickets/:id (xóa)

---

## 🚨 **LƯU Ý QUAN TRỌNG**

1. **Server phải chạy** tại `http://localhost:3000`
2. **Login trước** để lấy JWT token
3. **Database phải có dữ liệu** company, route, schedule
4. **Copy token chính xác** vào Authorization header
5. **Test theo thứ tự** để tránh lỗi dependencies

---

## 🎉 **KẾT QUẢ MONG ĐỢI**

- ✅ **20 API endpoints** hoạt động bình thường
- ✅ **Authentication** hoạt động đúng
- ✅ **Validation** trả về lỗi phù hợp
- ✅ **Business logic** hoạt động chính xác
- ✅ **Statistics** hiển thị đúng dữ liệu

**API Bus & Ticket Management sẵn sàng sử dụng!** 🚀

