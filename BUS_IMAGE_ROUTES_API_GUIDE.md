# Bus Image & Routes API Documentation

## Bus Image API

### Endpoints

#### 1. Tạo ảnh xe mới
- **POST** `/bus-images`
- **Auth Required**: Yes
- **Body**:
```json
{
  "image_url": "https://example.com/bus-image.jpg",
  "bus_id": 1
}
```

#### 2. Lấy danh sách ảnh xe
- **GET** `/bus-images`
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10, max: 100)
  - `bus_id` (number, optional)
  - `search` (string, optional)
  - `sortBy` (string, default: 'id')
  - `sortOrder` ('ASC' | 'DESC', default: 'ASC')

#### 3. Lấy ảnh xe theo ID
- **GET** `/bus-images/:id`

#### 4. Lấy ảnh xe theo Bus ID
- **GET** `/bus-images/bus/:busId`

#### 5. Lấy thống kê ảnh xe theo Bus ID
- **GET** `/bus-images/bus/:busId/statistics`

#### 6. Cập nhật ảnh xe
- **PATCH** `/bus-images/:id`
- **Auth Required**: Yes
- **Body**:
```json
{
  "image_url": "https://example.com/new-bus-image.jpg",
  "bus_id": 2
}
```

#### 7. Xóa ảnh xe
- **DELETE** `/bus-images/:id`
- **Auth Required**: Yes

---

## Routes API

### Endpoints

#### 1. Tạo tuyến đường mới
- **POST** `/routes`
- **Auth Required**: Yes
- **Body**:
```json
{
  "departure_station_id": 1,
  "arrival_station_id": 2,
  "price": 150000,
  "duration": 120,
  "distance": 50
}
```

#### 2. Lấy danh sách tuyến đường
- **GET** `/routes`
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10, max: 100)
  - `departure_station_id` (number, optional)
  - `arrival_station_id` (number, optional)
  - `search` (string, optional)
  - `sortBy` (string, default: 'id')
  - `sortOrder` ('ASC' | 'DESC', default: 'ASC')
  - `minPrice` (number, optional)
  - `maxPrice` (number, optional)
  - `maxDuration` (number, optional)

#### 3. Lấy tuyến đường theo ID
- **GET** `/routes/:id`

#### 4. Lấy tuyến đường phổ biến
- **GET** `/routes/popular`
- **Query Parameters**:
  - `limit` (number, default: 10)

#### 5. Tìm kiếm tuyến đường theo điểm đi và điểm đến
- **GET** `/routes/search`
- **Query Parameters**:
  - `departure_station_id` (number, required)
  - `arrival_station_id` (number, required)

#### 6. Lấy tuyến đường theo điểm đi
- **GET** `/routes/departure/:departureStationId`

#### 7. Lấy tuyến đường theo điểm đến
- **GET** `/routes/arrival/:arrivalStationId`

#### 8. Lấy thống kê tuyến đường
- **GET** `/routes/:id/statistics`

#### 9. Cập nhật tuyến đường
- **PATCH** `/routes/:id`
- **Auth Required**: Yes
- **Body**:
```json
{
  "departure_station_id": 1,
  "arrival_station_id": 3,
  "price": 200000,
  "duration": 150,
  "distance": 75
}
```

#### 10. Xóa tuyến đường
- **DELETE** `/routes/:id`
- **Auth Required**: Yes

---

## Response Formats

### Bus Image Response
```json
{
  "id": 1,
  "image_url": "https://example.com/bus-image.jpg",
  "bus_id": 1,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "bus": {
    "id": 1,
    "name": "Bus Name",
    "license_plate": "ABC-123",
    "capacity": 40,
    "company_id": 1
  }
}
```

### Route Response
```json
{
  "id": 1,
  "departure_station_id": 1,
  "arrival_station_id": 2,
  "price": 150000,
  "duration": 120,
  "distance": 50,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "departureStation": {
    "id": 1,
    "name": "Station A",
    "location": "Location A",
    "image": "station-image.jpg"
  },
  "arrivalStation": {
    "id": 2,
    "name": "Station B",
    "location": "Location B",
    "image": "station-image.jpg"
  },
  "schedules": [
    {
      "id": 1,
      "departure_time": "2024-01-01T08:00:00.000Z",
      "arrival_time": "2024-01-01T10:00:00.000Z",
      "available_seat": 35,
      "total_seats": 40,
      "status": "AVAILABLE",
      "bus": {
        "id": 1,
        "name": "Bus Name",
        "license_plate": "ABC-123",
        "company": {
          "id": 1,
          "company_name": "Company Name"
        }
      }
    }
  ]
}
```

### Paginated Response
```json
{
  "busImages": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

---

## Business Rules

### Bus Image
- Image URL must be a valid URL
- Bus ID must exist in the system
- Only authenticated users can create, update, or delete images

### Routes
- Departure and arrival stations must be different
- Price, duration, and distance must be positive numbers
- Cannot create duplicate routes between the same stations
- Cannot delete routes with active schedules
- Only authenticated users can create, update, or delete routes




