-- Create the bus_booking database
CREATE DATABASE IF NOT EXISTS bus_booking;

-- Use the database
USE bus_booking;

-- 1. USERS (Người dùng)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(11),
    status ENUM('ACTIVE', 'BLOCKED') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. ROLES (Quyền)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name ENUM('ROLE_ADMIN', 'ROLE_USER') NOT NULL
);

-- 3. USER_ROLE (Quyền của người dùng)
CREATE TABLE user_role (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. STATIONS (Bến xe)
CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    wallpaper VARCHAR(255),
    descriptions LONGTEXT,
    location VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. BUS_COMPANIES (Nhà xe)
CREATE TABLE bus_companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    descriptions LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. BUSES (Xe)
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    descriptions TEXT,
    license_plate VARCHAR(50),
    capacity INT,
    company_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES bus_companies(id) ON DELETE CASCADE
);

-- 7. BUS_STATION (Xe ở bến xe)
CREATE TABLE bus_station (
    station_id INT,
    bus_id INT,
    PRIMARY KEY (station_id, bus_id),
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 8. BUS_IMAGE (Ảnh của xe)
CREATE TABLE bus_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    bus_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 9. ROUTES (Tuyến đường đi)
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure_station_id INT,
    arrival_station_id INT,
    price DOUBLE NOT NULL,
    duration INT NOT NULL,
    distance INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departure_station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (arrival_station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- 10. SCHEDULES (Lịch trình đi)
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT,
    bus_id INT,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    available_seat INT NOT NULL,
    total_seats INT NOT NULL,
    status ENUM('AVAILABLE', 'FULL', 'CANCELLED') DEFAULT 'AVAILABLE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 11. SEATS (Ghế ngồi)
CREATE TABLE seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    seat_number VARCHAR(20) NOT NULL,
    seat_type ENUM('LUXURY', 'VIP', 'STANDARD') DEFAULT 'STANDARD',
    status ENUM('AVAILABLE', 'BOOKED') DEFAULT 'AVAILABLE',
    price_for_seat_type DOUBLE DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 12. BUS_REVIEWS (Đánh giá xe)
CREATE TABLE bus_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bus_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 13. TICKETS (Vé xe)
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT,
    seat_id INT,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    seat_type ENUM('LUXURY', 'VIP', 'STANDARD') NOT NULL,
    price DOUBLE NOT NULL,
    status ENUM('BOOKED', 'CANCELLED') DEFAULT 'BOOKED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

-- 14. PAYMENT_PROVIDERS (Nhà cung cấp thanh toán)
CREATE TABLE payment_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_name VARCHAR(255) NOT NULL,
    provider_type ENUM('CARD', 'E-WALLET', 'BANK_TRANSFER', 'QR_CODE') NOT NULL,
    api_endpoint VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 15. PAYMENTS (Thanh toán)
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_provider_id INT,
    user_id INT,
    ticket_id INT,
    payment_method ENUM('CASH', 'ONLINE') NOT NULL,
    amount DOUBLE NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_provider_id) REFERENCES payment_providers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- 16. BANNERS (Phông quảng cáo)
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    banner_url VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 17. CANCELLATION_POLICIES (Thông tin hủy vé)
CREATE TABLE cancellation_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descriptions TEXT,
    route_id INT,
    cancellation_time_limit INT NOT NULL,
    refund_percentage INT NOT NULL CHECK (refund_percentage >= 0 AND refund_percentage <= 100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- Insert initial data
INSERT INTO roles (role_name) VALUES ('ROLE_ADMIN'), ('ROLE_USER');

-- Insert sample payment providers
INSERT INTO payment_providers (provider_name, provider_type, api_endpoint) VALUES 
('VNPay', 'E-WALLET', 'https://api.vnpay.vn'),
('Momo', 'E-WALLET', 'https://api.momo.vn'),
('ZaloPay', 'E-WALLET', 'https://api.zalopay.vn'),
('Bank Transfer', 'BANK_TRANSFER', NULL),
('Cash Payment', 'CARD', NULL);
