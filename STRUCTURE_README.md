# Cấu trúc dự án Bus Booking System

## Tổng quan cấu trúc

Dự án được tổ chức theo cấu trúc chuẩn NestJS với các thư mục chính:

```
src/
├── modules/           # Các module chức năng
│   ├── auth/         # Module xác thực
│   └── bus-company/  # Module quản lý nhà xe
├── common/           # Các thành phần dùng chung
│   ├── types/        # Interface và types
│   ├── constraints/   # Enums và constants
│   ├── guards/        # Authentication guards
│   └── decorators/    # Custom decorators
├── shared/           # Tài nguyên chia sẻ
│   ├── providers/     # Cấu hình third-party
│   ├── schemas/       # Database entities
│   └── utils/         # Utility functions
├── locales/          # File dịch ngôn ngữ
├── public/           # Tài nguyên tĩnh
├── app.module.ts     # Module gốc
└── main.ts          # Entry point
```

## Chi tiết từng thư mục

### 1. Modules (`src/modules/`)

Chứa các module chức năng chính của ứng dụng. Mỗi module có cấu trúc:

```
modules/
└── [module-name]/
    ├── controllers/     # API controllers
    ├── services/        # Business logic
    ├── repositories/    # Database operations
    ├── dtos/           # Data Transfer Objects
    │   ├── request/    # Request DTOs
    │   └── response/   # Response DTOs
    ├── middlewares/    # Custom middlewares
    └── [module].module.ts  # Module definition
```

#### Auth Module
- **Controllers**: `auth.controller.ts` - Xử lý API đăng ký, đăng nhập, logout
- **Services**: `auth.service.ts` - Logic xác thực, hash password, JWT
- **DTOs**: 
  - Request: `auth.dto.ts` - Validation input
  - Response: `auth-response.dto.ts` - Format output

#### Bus Company Module
- **Controllers**: `bus-company.controller.ts` - CRUD operations
- **Services**: `bus-company.service.ts` - Business logic
- **DTOs**:
  - Request: `bus-company.dto.ts` - Validation input
  - Response: `bus-company-response.dto.ts` - Format output

### 2. Common (`src/common/`)

Chứa các thành phần dùng chung trong toàn bộ ứng dụng:

#### Types (`src/common/types/`)
- `index.ts` - Interface và types chung
- `ApiResponse<T>` - Format response API
- `PaginationMeta` - Metadata phân trang
- `PaginatedResponse<T>` - Response có phân trang

#### Constraints (`src/common/constraints/`)
- `index.ts` - Enums và constants hệ thống
- `UserStatus`, `RoleName`, `SeatType`, etc.

#### Guards (`src/common/guards/`)
- `jwt-auth.guard.ts` - JWT authentication guard
- `jwt.strategy.ts` - JWT strategy cho Passport

#### Decorators (`src/common/decorators/`)
- Custom decorators cho validation, authorization, etc.

### 3. Shared (`src/shared/`)

Chứa tài nguyên chia sẻ và cấu hình:

#### Providers (`src/shared/providers/`)
- `database.provider.ts` - Cấu hình TypeORM
- Cấu hình các third-party services

#### Schemas (`src/shared/schemas/`)
- Database entities (User, Role, BusCompany, etc.)
- Được di chuyển từ `src/entities/`

#### Utils (`src/shared/utils/`)
- `index.ts` - Utility functions
- `DateUtils`, `StringUtils` - Helper functions

### 4. Locales (`src/locales/`)
- File dịch ngôn ngữ (i18n)
- Hỗ trợ đa ngôn ngữ

### 5. Public (`src/public/`)
- Tài nguyên tĩnh (images, videos, svg)
- Có thể truy cập trực tiếp từ browser

## Cách sử dụng

### 1. Thêm module mới
```bash
# Tạo cấu trúc module mới
mkdir src/modules/[module-name]
mkdir src/modules/[module-name]/{controllers,services,repositories,dtos,middlewares}
mkdir src/modules/[module-name]/dtos/{request,response}
```

### 2. Thêm entity mới
```bash
# Tạo entity trong shared/schemas
touch src/shared/schemas/[entity-name].entity.ts
```

### 3. Thêm guard mới
```bash
# Tạo guard trong common/guards
touch src/common/guards/[guard-name].guard.ts
```

### 4. Thêm utility mới
```bash
# Tạo utility trong shared/utils
touch src/shared/utils/[utility-name].ts
```

## API Endpoints

### Auth Endpoints
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `GET /auth/profile` - Lấy thông tin profile

### Bus Company Endpoints
- `GET /bus-companies` - Lấy danh sách nhà xe (có phân trang, tìm kiếm)
- `GET /bus-companies/:id` - Lấy chi tiết nhà xe
- `POST /bus-companies` - Tạo nhà xe mới
- `PATCH /bus-companies/:id` - Cập nhật nhà xe
- `DELETE /bus-companies/:id` - Xóa nhà xe

## Cấu hình môi trường

Tạo file `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=bus_booking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application Configuration
NODE_ENV=development
PORT=3000
```

## Chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy development
npm run start:dev

# Chạy production
npm run start:prod

# Chạy tests
npm run test
```

## Lợi ích của cấu trúc này

1. **Tách biệt rõ ràng**: Mỗi module có trách nhiệm riêng
2. **Dễ bảo trì**: Code được tổ chức logic
3. **Tái sử dụng**: Common và shared components
4. **Mở rộng**: Dễ dàng thêm module mới
5. **Testing**: Cấu trúc rõ ràng cho unit tests
6. **Team work**: Nhiều developer có thể làm việc song song

