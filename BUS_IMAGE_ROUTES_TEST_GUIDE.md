# Test Cases for Bus Image & Routes API

## Bus Image API Tests

### 1. Create Bus Image
```bash
# Test valid creation
curl -X POST http://localhost:3000/bus-images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "image_url": "https://example.com/bus-image.jpg",
    "bus_id": 1
  }'

# Test invalid URL
curl -X POST http://localhost:3000/bus-images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "image_url": "invalid-url",
    "bus_id": 1
  }'

# Test missing bus_id
curl -X POST http://localhost:3000/bus-images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "image_url": "https://example.com/bus-image.jpg"
  }'
```

### 2. Get Bus Images
```bash
# Get all bus images
curl -X GET "http://localhost:3000/bus-images"

# Get with pagination
curl -X GET "http://localhost:3000/bus-images?page=1&limit=5"

# Get by bus_id
curl -X GET "http://localhost:3000/bus-images?bus_id=1"

# Search
curl -X GET "http://localhost:3000/bus-images?search=bus"
```

### 3. Get Bus Image by ID
```bash
curl -X GET http://localhost:3000/bus-images/1
```

### 4. Update Bus Image
```bash
curl -X PATCH http://localhost:3000/bus-images/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "image_url": "https://example.com/new-bus-image.jpg"
  }'
```

### 5. Delete Bus Image
```bash
curl -X DELETE http://localhost:3000/bus-images/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Routes API Tests

### 1. Create Route
```bash
# Test valid creation
curl -X POST http://localhost:3000/routes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "departure_station_id": 1,
    "arrival_station_id": 2,
    "price": 150000,
    "duration": 120,
    "distance": 50
  }'

# Test same departure and arrival station
curl -X POST http://localhost:3000/routes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "departure_station_id": 1,
    "arrival_station_id": 1,
    "price": 150000,
    "duration": 120,
    "distance": 50
  }'

# Test negative price
curl -X POST http://localhost:3000/routes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "departure_station_id": 1,
    "arrival_station_id": 2,
    "price": -100,
    "duration": 120,
    "distance": 50
  }'
```

### 2. Get Routes
```bash
# Get all routes
curl -X GET "http://localhost:3000/routes"

# Get with filters
curl -X GET "http://localhost:3000/routes?departure_station_id=1&arrival_station_id=2"

# Get with price range
curl -X GET "http://localhost:3000/routes?minPrice=100000&maxPrice=200000"

# Get with duration filter
curl -X GET "http://localhost:3000/routes?maxDuration=180"

# Search routes
curl -X GET "http://localhost:3000/routes?search=station"
```

### 3. Get Route by ID
```bash
curl -X GET http://localhost:3000/routes/1
```

### 4. Search Routes
```bash
curl -X GET "http://localhost:3000/routes/search?departure_station_id=1&arrival_station_id=2"
```

### 5. Get Popular Routes
```bash
curl -X GET "http://localhost:3000/routes/popular?limit=5"
```

### 6. Get Routes by Station
```bash
# By departure station
curl -X GET http://localhost:3000/routes/departure/1

# By arrival station
curl -X GET http://localhost:3000/routes/arrival/2
```

### 7. Get Route Statistics
```bash
curl -X GET http://localhost:3000/routes/1/statistics
```

### 8. Update Route
```bash
curl -X PATCH http://localhost:3000/routes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "price": 200000,
    "duration": 150
  }'
```

### 9. Delete Route
```bash
curl -X DELETE http://localhost:3000/routes/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Expected Responses

### Success Response (200)
```json
{
  "id": 1,
  "image_url": "https://example.com/bus-image.jpg",
  "bus_id": 1,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": [
    "image_url must be a valid URL",
    "bus_id should not be empty"
  ],
  "error": "Bad Request"
}
```

### Not Found Error (404)
```json
{
  "statusCode": 404,
  "message": "Bus image with ID 999 not found",
  "error": "Not Found"
}
```

### Unauthorized Error (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## Test Data Setup

Before running tests, ensure you have:

1. **Stations** in the database
2. **Bus Companies** in the database  
3. **Buses** in the database
4. **Valid JWT token** for authenticated endpoints

### Sample Test Data
```sql
-- Insert test stations
INSERT INTO stations (name, location, image) VALUES 
('Hanoi Station', 'Hanoi', 'hanoi-station.jpg'),
('Ho Chi Minh Station', 'Ho Chi Minh City', 'hcm-station.jpg');

-- Insert test bus company
INSERT INTO bus_companies (company_name, image, descriptions) VALUES 
('Test Bus Company', 'company-logo.jpg', 'Test company description');

-- Insert test bus
INSERT INTO buses (name, descriptions, license_plate, capacity, company_id) VALUES 
('Test Bus', 'Test bus description', 'TEST-001', 40, 1);
```




