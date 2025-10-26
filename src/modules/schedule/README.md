# Schedule Module - API Lịch trình di chuyển

Module này cung cấp các API để quản lý lịch trình di chuyển của xe buýt.

## Cấu trúc Module

```
src/modules/schedule/
├── controllers/
│   └── schedule.controller.ts     # Controller xử lý HTTP requests
├── services/
│   └── schedule.service.ts        # Business logic
├── repositories/
│   └── schedule.repository.ts     # Database operations
├── dtos/
│   ├── create-schedule.dto.ts     # DTO cho tạo lịch trình
│   ├── update-schedule.dto.ts     # DTO cho cập nhật lịch trình
│   ├── schedule-response.dto.ts   # DTO cho response
│   └── schedule-query.dto.ts      # DTO cho query parameters
├── schedule.module.ts             # Module definition
└── README.md                      # Documentation
```

## API Endpoints

### 1. Tạo lịch trình mới
- **POST** `/schedules`
- **Auth**: Required (JWT)
- **Body**: CreateScheduleDto
- **Response**: ScheduleResponseDto

### 2. Lấy danh sách lịch trình
- **GET** `/schedules`
- **Query Parameters**:
  - `page`: Số trang (default: 1)
  - `limit`: Số lượng per page (default: 10)
  - `search`: Tìm kiếm theo tên xe hoặc nhà xe
  - `routeId`: Lọc theo tuyến đường
  - `busId`: Lọc theo xe
  - `departureDate`: Lọc theo ngày khởi hành
  - `status`: Lọc theo trạng thái (AVAILABLE, FULL, CANCELLED)
  - `sortBy`: Sắp xếp theo trường (default: departureTime)
  - `sortOrder`: Thứ tự sắp xếp (ASC/DESC, default: ASC)

### 3. Lấy lịch trình theo ID
- **GET** `/schedules/:id`
- **Response**: ScheduleWithDetailsResponseDto

### 4. Cập nhật lịch trình
- **PATCH** `/schedules/:id`
- **Auth**: Required (JWT)
- **Body**: UpdateScheduleDto
- **Response**: ScheduleResponseDto

### 5. Xóa lịch trình
- **DELETE** `/schedules/:id`
- **Auth**: Required (JWT)

### 6. Lấy tuyến đường phổ biến
- **GET** `/schedules/popular-routes`
- **Response**: ScheduleWithDetailsResponseDto[]

### 7. Lấy lịch trình theo tuyến đường và ngày
- **GET** `/schedules/route/:routeId?departureDate=YYYY-MM-DD`
- **Response**: ScheduleWithDetailsResponseDto[]

### 8. Lấy lịch trình theo xe và ngày
- **GET** `/schedules/bus/:busId?departureDate=YYYY-MM-DD`
- **Response**: ScheduleWithDetailsResponseDto[]

### 9. Cập nhật số ghế có sẵn
- **PATCH** `/schedules/:id/update-seats`
- **Auth**: Required (JWT)
- **Body**: `{ "seatsToBook": number }`

## DTOs

### CreateScheduleDto
```typescript
{
  routeId: number;
  busId: number;
  departureTime: string; // ISO date string
  arrivalTime: string;   // ISO date string
  availableSeat: number;
  totalSeats: number;
  status?: ScheduleStatus; // Optional
}
```

### UpdateScheduleDto
```typescript
// Tất cả fields của CreateScheduleDto đều optional
```

### ScheduleResponseDto
```typescript
{
  id: number;
  routeId: number;
  busId: number;
  departureTime: Date;
  arrivalTime: Date;
  availableSeat: number;
  totalSeats: number;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### ScheduleWithDetailsResponseDto
```typescript
// Extends ScheduleResponseDto với thông tin chi tiết:
{
  route?: {
    id: number;
    price: number;
    duration: number;
    distance: number;
    departureStation: { id, name, location };
    arrivalStation: { id, name, location };
  };
  bus?: {
    id: number;
    name: string;
    licensePlate: string;
    capacity: number;
    company: { id, companyName };
  };
}
```

## Business Logic

### Validation Rules
1. **Thời gian**: Thời gian khởi hành phải trước thời gian đến nơi
2. **Ghế**: Số ghế có sẵn không được vượt quá tổng số ghế
3. **Trạng thái**: Tự động cập nhật thành FULL khi hết ghế

### Auto Status Update
- Khi `availableSeat = 0` → `status = FULL`
- Khi `availableSeat > 0` → `status = AVAILABLE`

## Database Relations

- **Schedule** belongs to **Route** (many-to-one)
- **Schedule** belongs to **Bus** (many-to-one)
- **Schedule** has many **Tickets** (one-to-many)

## Usage Examples

### Tạo lịch trình mới
```bash
POST /schedules
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "routeId": 1,
  "busId": 1,
  "departureTime": "2024-01-15T08:00:00Z",
  "arrivalTime": "2024-01-15T12:00:00Z",
  "availableSeat": 40,
  "totalSeats": 40
}
```

### Tìm kiếm lịch trình
```bash
GET /schedules?routeId=1&departureDate=2024-01-15&status=AVAILABLE&page=1&limit=10
```

### Lấy tuyến đường phổ biến
```bash
GET /schedules/popular-routes
```


