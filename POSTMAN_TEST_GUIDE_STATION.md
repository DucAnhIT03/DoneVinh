# 🧪 Postman Test Guide - Station + Bus Station APIs

## 🚀 **Bước 1: Setup Postman**

### 1.1. Import Collection
1. Mở Postman
2. Click **Import**
3. Chọn file `Station_BusStation_API_Collection.json`
4. Click **Import**

### 1.2. Set Environment Variables
Tạo environment mới với các biến:
- `baseUrl`: `http://localhost:3000`
- `jwt_token`: `your-jwt-token-here` (nếu cần)
- `station_id`: `1` (sẽ được cập nhật sau khi tạo)
- `bus_id`: `1` (sẽ được cập nhật sau khi tạo)
- `bus_station_id`: `1` (sẽ được cập nhật sau khi tạo)

## 📊 **Bước 2: Test Sequence**

### **Phase 1: Test Station APIs**

#### 2.1. Test Get All Stations
```
GET {{baseUrl}}/stations
```
**Expected Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

#### 2.2. Test Create Station
```
POST {{baseUrl}}/stations
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "name": "Test Station",
  "address": "Test Address",
  "city": "Test City",
  "province": "Test Province",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "description": "Test station",
  "phone": "+84 28 1234 5678",
  "email": "test@station.com",
  "facilities": ["WiFi", "Restaurant"],
  "capacity": 500
}
```

#### 2.3. Test Get Station by ID
```
GET {{baseUrl}}/stations/1
```

#### 2.4. Test Get Stations by City
```
GET {{baseUrl}}/stations/city/Ho Chi Minh City
```

#### 2.5. Test Get Stations by Province
```
GET {{baseUrl}}/stations/province/Ho Chi Minh
```

#### 2.6. Test Get Nearby Stations
```
GET {{baseUrl}}/stations/nearby?latitude=10.7769&longitude=106.7009&radius=5
```

#### 2.7. Test Get Station Statistics
```
GET {{baseUrl}}/stations/1/statistics
```

#### 2.8. Test Update Station
```
PATCH {{baseUrl}}/stations/1
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "name": "Updated Central Bus Station",
  "capacity": 1200,
  "facilities": ["WiFi", "Restaurant", "ATM", "Parking", "Waiting Room"]
}
```

### **Phase 2: Test Bus Station APIs**

#### 2.9. Test Get All Bus Stations
```
GET {{baseUrl}}/bus-stations
```

#### 2.10. Test Create Bus Station
```
POST {{baseUrl}}/bus-stations
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "stationId": 1,
  "busId": 1,
  "arrivalTime": "2024-01-15T08:00:00.000Z",
  "departureTime": "2024-01-15T08:30:00.000Z",
  "sequence": 1,
  "platform": "Platform A",
  "gate": "Gate 1",
  "price": 50000,
  "notes": "First stop",
  "availableSeats": 45,
  "totalSeats": 50
}
```

#### 2.11. Test Get Bus Station by ID
```
GET {{baseUrl}}/bus-stations/1
```

#### 2.12. Test Get Bus Stations by Station
```
GET {{baseUrl}}/bus-stations/station/1
```

#### 2.13. Test Get Bus Stations by Bus
```
GET {{baseUrl}}/bus-stations/bus/1
```

#### 2.14. Test Get Schedule by Station
```
GET {{baseUrl}}/bus-stations/schedule/station/1?date=2024-01-15
```

#### 2.15. Test Get Schedule by Bus
```
GET {{baseUrl}}/bus-stations/schedule/bus/1?date=2024-01-15
```

#### 2.16. Test Get Bus Station Statistics
```
GET {{baseUrl}}/bus-stations/1/statistics
```

#### 2.17. Test Update Bus Station
```
PATCH {{baseUrl}}/bus-stations/1
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "arrivalTime": "2024-01-15T08:15:00.000Z",
  "departureTime": "2024-01-15T08:45:00.000Z",
  "availableSeats": 40,
  "price": 55000
}
```

## 🔧 **Bước 3: Database Setup (Nếu cần)**

Nếu gặp lỗi database, chạy migration script:

```sql
-- Chạy file station_migration.sql trong MySQL
```

## 📝 **Bước 4: Test Cases**

### **Test Case 1: Station CRUD**
1. ✅ Create Station → Get Station → Update Station → Delete Station
2. ✅ Test validation (duplicate name, invalid data)
3. ✅ Test search and filter

### **Test Case 2: Bus Station CRUD**
1. ✅ Create Bus Station → Get Bus Station → Update Bus Station → Delete Bus Station
2. ✅ Test time validation (arrival < departure)
3. ✅ Test schedule queries

### **Test Case 3: Advanced Queries**
1. ✅ Test geolocation search
2. ✅ Test date range queries
3. ✅ Test statistics endpoints

## 🐛 **Troubleshooting**

### **Lỗi 500 - Internal Server Error**
- Kiểm tra database connection
- Chạy migration script
- Kiểm tra logs của ứng dụng

### **Lỗi 404 - Not Found**
- Kiểm tra URL endpoint
- Kiểm tra ID có tồn tại không

### **Lỗi 401 - Unauthorized**
- Kiểm tra JWT token
- Test endpoints không cần authentication trước

### **Lỗi Validation**
- Kiểm tra dữ liệu đầu vào
- Kiểm tra required fields
- Kiểm tra data types

## 📊 **Expected Results**

### **Successful Station Creation:**
```json
{
  "id": 1,
  "name": "Central Bus Station",
  "address": "123 Main Street",
  "city": "Ho Chi Minh City",
  "province": "Ho Chi Minh",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "isActive": true,
  "capacity": 1000,
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### **Successful Bus Station Creation:**
```json
{
  "id": 1,
  "stationId": 1,
  "busId": 1,
  "arrivalTime": "2024-01-15T08:00:00.000Z",
  "departureTime": "2024-01-15T08:30:00.000Z",
  "sequence": 1,
  "isActive": true,
  "platform": "Platform A",
  "gate": "Gate 1",
  "price": 50000,
  "availableSeats": 45,
  "totalSeats": 50,
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

## 🎯 **Success Criteria**

- ✅ Tất cả CRUD operations hoạt động
- ✅ Search và filter hoạt động
- ✅ Geolocation search hoạt động
- ✅ Schedule queries hoạt động
- ✅ Statistics endpoints hoạt động
- ✅ Validation hoạt động đúng
- ✅ Error handling hoạt động

## 🚀 **Next Steps**

Sau khi test thành công:
1. **Production Setup**: Cấu hình production database
2. **Authentication**: Implement JWT authentication
3. **Documentation**: Tạo API documentation
4. **Monitoring**: Setup logging và monitoring
5. **Testing**: Tạo unit tests và integration tests



