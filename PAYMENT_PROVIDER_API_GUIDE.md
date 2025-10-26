# Payment Provider API Documentation

## Tổng quan

API quản lý nhà cung cấp thanh toán cho hệ thống đặt vé xe bus. Hỗ trợ các loại thanh toán: CARD, E-WALLET, BANK_TRANSFER, QR_CODE.

## Endpoints

### 1. Tạo nhà cung cấp thanh toán mới
- **POST** `/payment-providers`
- **Auth Required**: Yes
- **Body**:
```json
{
  "provider_name": "ZaloPay",
  "provider_type": "E-WALLET",
  "api_endpoint": "https://api.zalopay.vn/v1/payment"
}
```

### 2. Lấy danh sách nhà cung cấp thanh toán
- **GET** `/payment-providers`
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10, max: 100)
  - `provider_type` (enum: CARD, E-WALLET, BANK_TRANSFER, QR_CODE)
  - `search` (string, optional)
  - `sortBy` (string, default: 'id')
  - `sortOrder` ('ASC' | 'DESC', default: 'ASC')
  - `minAmount` (number, optional)
  - `maxAmount` (number, optional)

### 3. Lấy nhà cung cấp thanh toán theo ID
- **GET** `/payment-providers/:id`

### 4. Lấy nhà cung cấp thanh toán đang hoạt động
- **GET** `/payment-providers/active`

### 5. Lấy nhà cung cấp thanh toán theo doanh thu
- **GET** `/payment-providers/by-revenue`
- **Query Parameters**:
  - `limit` (number, default: 10)

### 6. Lấy thống kê theo loại nhà cung cấp
- **GET** `/payment-providers/statistics/by-type`

### 7. Lấy nhà cung cấp thanh toán theo loại
- **GET** `/payment-providers/type/:providerType`
- **Path Parameters**:
  - `providerType` (enum: CARD, E-WALLET, BANK_TRANSFER, QR_CODE)

### 8. Lấy thống kê nhà cung cấp thanh toán
- **GET** `/payment-providers/:id/statistics`

### 9. Cập nhật nhà cung cấp thanh toán
- **PATCH** `/payment-providers/:id`
- **Auth Required**: Yes
- **Body**:
```json
{
  "provider_name": "ZaloPay Updated",
  "provider_type": "E-WALLET",
  "api_endpoint": "https://api.zalopay.vn/v2/payment"
}
```

### 10. Xóa nhà cung cấp thanh toán
- **DELETE** `/payment-providers/:id`
- **Auth Required**: Yes

---

## Response Formats

### Payment Provider Response
```json
{
  "id": 1,
  "provider_name": "ZaloPay",
  "provider_type": "E-WALLET",
  "api_endpoint": "https://api.zalopay.vn/v1/payment",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Payment Provider with Details Response
```json
{
  "id": 1,
  "provider_name": "ZaloPay",
  "provider_type": "E-WALLET",
  "api_endpoint": "https://api.zalopay.vn/v1/payment",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "statistics": {
    "totalPayments": 150,
    "totalAmount": 15000000,
    "successRate": 95.5,
    "lastPaymentDate": "2024-01-15T10:30:00.000Z"
  },
  "payments": [
    {
      "id": 1,
      "amount": 150000,
      "status": "COMPLETED",
      "payment_method": "ONLINE",
      "created_at": "2024-01-01T08:00:00.000Z",
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      }
    }
  ]
}
```

### Provider Statistics by Type
```json
{
  "CARD": {
    "count": 2,
    "totalPayments": 50,
    "totalAmount": 5000000
  },
  "E-WALLET": {
    "count": 3,
    "totalPayments": 200,
    "totalAmount": 20000000
  },
  "BANK_TRANSFER": {
    "count": 1,
    "totalPayments": 30,
    "totalAmount": 3000000
  },
  "QR_CODE": {
    "count": 2,
    "totalPayments": 80,
    "totalAmount": 8000000
  }
}
```

### Paginated Response
```json
{
  "paymentProviders": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

## Provider Types

### CARD
- Thanh toán qua thẻ tín dụng/ghi nợ
- Ví dụ: Visa, Mastercard, JCB

### E-WALLET
- Thanh toán qua ví điện tử
- Ví dụ: ZaloPay, MoMo, VNPay

### BANK_TRANSFER
- Chuyển khoản ngân hàng
- Ví dụ: Internet Banking, ATM

### QR_CODE
- Thanh toán qua QR Code
- Ví dụ: QR Code của các ngân hàng

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Payment provider with this name already exists",
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
  "message": "Payment provider with ID 999 not found",
  "error": "Not Found"
}
```

---

## Business Rules

### Validation Rules
- **Provider Name**: Bắt buộc, tối đa 255 ký tự, không được trùng lặp
- **Provider Type**: Bắt buộc, phải là một trong các giá trị enum
- **API Endpoint**: Tùy chọn, phải là URL hợp lệ nếu được cung cấp

### Business Logic
- Không thể xóa nhà cung cấp thanh toán đã có giao dịch
- Tên nhà cung cấp thanh toán phải duy nhất
- API endpoint phải là URL hợp lệ
- Chỉ người dùng đã xác thực mới có thể tạo/sửa/xóa

### Statistics
- **Total Payments**: Tổng số giao dịch
- **Total Amount**: Tổng số tiền giao dịch
- **Success Rate**: Tỷ lệ giao dịch thành công (%)
- **Last Payment Date**: Ngày giao dịch gần nhất

---

## Test Cases

### 1. Create Payment Provider
```bash
# Valid creation
curl -X POST http://localhost:3000/payment-providers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "provider_name": "ZaloPay",
    "provider_type": "E-WALLET",
    "api_endpoint": "https://api.zalopay.vn/v1/payment"
  }'

# Invalid provider type
curl -X POST http://localhost:3000/payment-providers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "provider_name": "Test Provider",
    "provider_type": "INVALID_TYPE"
  }'

# Duplicate provider name
curl -X POST http://localhost:3000/payment-providers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "provider_name": "ZaloPay",
    "provider_type": "E-WALLET"
  }'
```

### 2. Get Payment Providers
```bash
# Get all providers
curl -X GET "http://localhost:3000/payment-providers"

# Get with filters
curl -X GET "http://localhost:3000/payment-providers?provider_type=E-WALLET&page=1&limit=5"

# Search providers
curl -X GET "http://localhost:3000/payment-providers?search=ZaloPay"
```

### 3. Get Provider Statistics
```bash
# Get provider statistics
curl -X GET http://localhost:3000/payment-providers/1/statistics

# Get statistics by type
curl -X GET http://localhost:3000/payment-providers/statistics/by-type

# Get providers by revenue
curl -X GET "http://localhost:3000/payment-providers/by-revenue?limit=5"
```

### 4. Update Provider
```bash
curl -X PATCH http://localhost:3000/payment-providers/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "provider_name": "ZaloPay Updated",
    "api_endpoint": "https://api.zalopay.vn/v2/payment"
  }'
```

### 5. Delete Provider
```bash
curl -X DELETE http://localhost:3000/payment-providers/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Sample Data

### Test Payment Providers
```sql
-- Insert test payment providers
INSERT INTO payment_providers (provider_name, provider_type, api_endpoint) VALUES 
('ZaloPay', 'E-WALLET', 'https://api.zalopay.vn/v1/payment'),
('MoMo', 'E-WALLET', 'https://api.momo.vn/v1/payment'),
('VNPay', 'CARD', 'https://api.vnpay.vn/v1/payment'),
('Vietcombank', 'BANK_TRANSFER', 'https://api.vietcombank.vn/v1/transfer'),
('QR VietinBank', 'QR_CODE', 'https://api.vietinbank.vn/v1/qr');
```




