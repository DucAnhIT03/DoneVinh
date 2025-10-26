# 🚌 Station & Bus Station API Guide

## 📋 Tổng quan

API này cung cấp đầy đủ chức năng quản lý trạm xe buýt (Station) và lịch trình xe buýt tại trạm (Bus Station).

## 🏗️ Cấu trúc API

### Station APIs
- **CRUD Operations**: Tạo, đọc, cập nhật, xóa trạm
- **Search & Filter**: Tìm kiếm theo thành phố, tỉnh, vị trí
- **Geolocation**: Tìm trạm gần nhất
- **Statistics**: Thống kê trạm

### Bus Station APIs  
- **CRUD Operations**: Tạo, đọc, cập nhật, xóa lịch trình
- **Schedule Management**: Quản lý lịch trình theo trạm/xe
- **Time Management**: Quản lý thời gian đến/đi
- **Seat Management**: Quản lý ghế ngồi

## 🚀 API Endpoints

### Station Endpoints

#### 1. Tạo trạm mới
```http
POST /stations
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Central Bus Station",
  "address": "123 Main Street",
  "city": "Ho Chi Minh City", 
  "province": "Ho Chi Minh",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "isActive": true,
  "description": "Main bus station in the city center",
  "phone": "+84 28 1234 5678",
  "email": "info@centralstation.com",
  "facilities": ["WiFi", "Restaurant", "ATM", "Parking"],
  "capacity": 1000
}
```

#### 2. Lấy danh sách trạm
```http
GET /stations?page=1&limit=10&sortBy=name&sortOrder=asc
```

**Query Parameters:**
- `search`: Tìm kiếm theo tên, địa chỉ, thành phố
- `city`: Lọc theo thành phố
- `province`: Lọc theo tỉnh
- `isActive`: Lọc theo trạng thái hoạt động
- `page`: Trang (mặc định: 1)
- `limit`: Số lượng/trang (mặc định: 10)
- `sortBy`: Sắp xếp theo (mặc định: name)
- `sortOrder`: Thứ tự sắp xếp (asc/desc)

#### 3. Lấy trạm theo ID
```http
GET /stations/{id}
```

#### 4. Lấy trạm theo thành phố
```http
GET /stations/city/{city}
```

#### 5. Lấy trạm theo tỉnh
```http
GET /stations/province/{province}
```

#### 6. Tìm trạm gần nhất
```http
GET /stations/nearby?latitude=10.7769&longitude=106.7009&radius=5
```

**Query Parameters:**
- `latitude`: Vĩ độ
- `longitude`: Kinh độ  
- `radius`: Bán kính tìm kiếm (km, mặc định: 10)

#### 7. Thống kê trạm
```http
GET /stations/{id}/statistics
```

#### 8. Cập nhật trạm
```http
PATCH /stations/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Updated Central Bus Station",
  "capacity": 1200,
  "facilities": ["WiFi", "Restaurant", "ATM", "Parking", "Waiting Room"]
}
```

#### 9. Xóa trạm
```http
DELETE /stations/{id}
Authorization: Bearer {jwt_token}
```

### Bus Station Endpoints

#### 1. Tạo lịch trình xe buýt
```http
POST /bus-stations
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "stationId": "station_id_here",
  "busId": "bus_id_here", 
  "arrivalTime": "2024-01-15T08:00:00.000Z",
  "departureTime": "2024-01-15T08:30:00.000Z",
  "sequence": 1,
  "isActive": true,
  "platform": "Platform A",
  "gate": "Gate 1",
  "price": 50000,
  "notes": "First stop",
  "availableSeats": 45,
  "totalSeats": 50
}
```

#### 2. Lấy danh sách lịch trình
```http
GET /bus-stations?page=1&limit=10&sortBy=arrivalTime&sortOrder=asc
```

**Query Parameters:**
- `stationId`: Lọc theo trạm
- `busId`: Lọc theo xe buýt
- `startDate`: Ngày bắt đầu
- `endDate`: Ngày kết thúc
- `isActive`: Trạng thái hoạt động
- `page`: Trang
- `limit`: Số lượng/trang
- `sortBy`: Sắp xếp theo
- `sortOrder`: Thứ tự sắp xếp

#### 3. Lấy lịch trình theo ID
```http
GET /bus-stations/{id}
```

#### 4. Lấy lịch trình theo trạm
```http
GET /bus-stations/station/{stationId}
```

#### 5. Lấy lịch trình theo xe buýt
```http
GET /bus-stations/bus/{busId}
```

#### 6. Lấy lịch trình trạm theo ngày
```http
GET /bus-stations/schedule/station/{stationId}?date=2024-01-15
```

#### 7. Lấy lịch trình xe theo ngày
```http
GET /bus-stations/schedule/bus/{busId}?date=2024-01-15
```

#### 8. Thống kê lịch trình
```http
GET /bus-stations/{id}/statistics
```

#### 9. Cập nhật lịch trình
```http
PATCH /bus-stations/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "arrivalTime": "2024-01-15T08:15:00.000Z",
  "departureTime": "2024-01-15T08:45:00.000Z", 
  "availableSeats": 40,
  "price": 55000
}
```

#### 10. Xóa lịch trình
```http
DELETE /bus-stations/{id}
Authorization: Bearer {jwt_token}
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🔐 Authentication

Tất cả các endpoint tạo, cập nhật, xóa đều yêu cầu JWT token:

```http
Authorization: Bearer {jwt_token}
```

## 📝 Validation Rules

### Station Validation
- `name`: Bắt buộc, duy nhất
- `address`: Bắt buộc
- `city`: Bắt buộc
- `province`: Bắt buộc
- `latitude`: Bắt buộc, số
- `longitude`: Bắt buộc, số
- `email`: Email hợp lệ (nếu có)
- `phone`: Số điện thoại hợp lệ (nếu có)

### Bus Station Validation
- `stationId`: Bắt buộc, ObjectId hợp lệ
- `busId`: Bắt buộc, ObjectId hợp lệ
- `arrivalTime`: Bắt buộc, ISO date string
- `departureTime`: Bắt buộc, ISO date string
- `arrivalTime` < `departureTime`: Thời gian đến phải trước thời gian đi

## 🧪 Testing với Postman

1. **Import Collection**: Import file `Station_BusStation_API_Collection.json`
2. **Set Variables**: 
   - `baseUrl`: http://localhost:3000
   - `jwt_token`: Your JWT token
3. **Test Sequence**:
   - Tạo Station trước
   - Tạo Bus Station với Station ID
   - Test các endpoint khác

## 🚀 Quick Start

1. **Khởi động ứng dụng**:
```bash
npm run start:dev
```

2. **Test API**:
```bash
# Test Station API
curl -X GET http://localhost:3000/stations

# Test Bus Station API  
curl -X GET http://localhost:3000/bus-stations
```

3. **Import Postman Collection** và test đầy đủ

## 📈 Features

### Station Features
- ✅ CRUD Operations
- ✅ Search & Filter
- ✅ Geolocation Search
- ✅ Statistics
- ✅ City/Province Filtering

### Bus Station Features  
- ✅ CRUD Operations
- ✅ Schedule Management
- ✅ Time Validation
- ✅ Seat Management
- ✅ Statistics & Analytics

## 🔧 Troubleshooting

### Common Issues
1. **Validation Errors**: Kiểm tra dữ liệu đầu vào
2. **Authentication**: Đảm bảo JWT token hợp lệ
3. **Time Validation**: Thời gian đến phải trước thời gian đi
4. **ObjectId**: Sử dụng ObjectId hợp lệ cho MongoDB

### Debug Tips
- Kiểm tra logs của ứng dụng
- Sử dụng Postman để test API
- Kiểm tra database connection
- Verify JWT token expiration



