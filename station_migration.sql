-- Station + Bus Station Migration Script

-- Create stations table
CREATE TABLE IF NOT EXISTS `stations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL UNIQUE,
  `address` varchar(500) NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `description` text DEFAULT '',
  `phone` varchar(20) DEFAULT '',
  `email` varchar(100) DEFAULT '',
  `facilities` json DEFAULT '[]',
  `imageUrl` varchar(500) DEFAULT '',
  `capacity` int(11) DEFAULT 0,
  `currentOccupancy` int(11) DEFAULT 0,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_city` (`city`),
  KEY `idx_province` (`province`),
  KEY `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create bus_stations table
CREATE TABLE IF NOT EXISTS `bus_stations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stationId` int(11) NOT NULL,
  `busId` int(11) NOT NULL,
  `arrivalTime` datetime NOT NULL,
  `departureTime` datetime NOT NULL,
  `sequence` int(11) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `platform` varchar(50) DEFAULT '',
  `gate` varchar(50) DEFAULT '',
  `price` decimal(10,2) DEFAULT 0,
  `notes` text DEFAULT '',
  `availableSeats` int(11) DEFAULT 0,
  `totalSeats` int(11) DEFAULT 0,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_stationId` (`stationId`),
  KEY `idx_busId` (`busId`),
  KEY `idx_arrivalTime` (`arrivalTime`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `fk_bus_stations_station` FOREIGN KEY (`stationId`) REFERENCES `stations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data
INSERT INTO `stations` (`name`, `address`, `city`, `province`, `latitude`, `longitude`, `description`, `phone`, `email`, `facilities`, `capacity`) VALUES
('Central Bus Station', '123 Main Street', 'Ho Chi Minh City', 'Ho Chi Minh', 10.7769, 106.7009, 'Main bus station in the city center', '+84 28 1234 5678', 'info@centralstation.com', '["WiFi", "Restaurant", "ATM", "Parking"]', 1000),
('North Bus Terminal', '456 North Avenue', 'Ho Chi Minh City', 'Ho Chi Minh', 10.8231, 106.6297, 'Northern bus terminal', '+84 28 2345 6789', 'north@busterminal.com', '["WiFi", "Waiting Room", "ATM"]', 800),
('South Bus Station', '789 South Road', 'Ho Chi Minh City', 'Ho Chi Minh', 10.7374, 106.7226, 'Southern bus station', '+84 28 3456 7890', 'south@busterminal.com', '["WiFi", "Restaurant", "Parking"]', 600);

-- Insert sample bus_stations data
INSERT INTO `bus_stations` (`stationId`, `busId`, `arrivalTime`, `departureTime`, `sequence`, `platform`, `gate`, `price`, `availableSeats`, `totalSeats`) VALUES
(1, 1, '2024-01-15 08:00:00', '2024-01-15 08:30:00', 1, 'Platform A', 'Gate 1', 50000, 45, 50),
(1, 2, '2024-01-15 09:00:00', '2024-01-15 09:30:00', 1, 'Platform B', 'Gate 2', 55000, 40, 50),
(2, 1, '2024-01-15 10:00:00', '2024-01-15 10:30:00', 2, 'Platform C', 'Gate 3', 60000, 35, 50),
(3, 3, '2024-01-15 11:00:00', '2024-01-15 11:30:00', 1, 'Platform D', 'Gate 4', 45000, 50, 50);



