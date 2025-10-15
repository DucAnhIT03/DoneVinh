# Database Setup Guide

## Overview
This guide will help you set up the complete database schema for the bus booking system with all 17 tables as specified.

## Database Schema
The system includes the following tables:

1. **USERS** - User management
2. **ROLES** - User roles (ADMIN, USER)
3. **USER_ROLE** - User-role relationships
4. **STATIONS** - Bus stations
5. **BUS_COMPANIES** - Bus companies
6. **BUSES** - Individual buses
7. **BUS_STATION** - Bus-station relationships
8. **BUS_IMAGES** - Bus images
9. **ROUTES** - Travel routes
10. **SCHEDULES** - Bus schedules
11. **SEATS** - Bus seats
12. **BUS_REVIEWS** - User reviews
13. **TICKETS** - Booking tickets
14. **PAYMENT_PROVIDERS** - Payment providers
15. **PAYMENTS** - Payment records
16. **BANNERS** - Advertisement banners
17. **CANCELLATION_POLICIES** - Cancellation policies

## Setup Instructions

### Step 1: Create Database
Run the SQL script to create the database and all tables:

```sql
-- Option 1: Using MySQL Workbench or phpMyAdmin
-- Import and run the database-setup.sql file

-- Option 2: Using command line (if MySQL is in PATH)
mysql -u root -p < database-setup.sql
```

### Step 2: Environment Configuration
The `.env` file has been created with the following configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=bus_booking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Step 3: Start the Application
```bash
npm run start:dev
```

The application will automatically:
- Connect to the database
- Create tables if they don't exist (in development mode)
- Insert initial data (roles and payment providers)

## Initial Data
The following initial data will be inserted:

### Roles
- ROLE_ADMIN
- ROLE_USER

### Payment Providers
- VNPay (E-WALLET)
- Momo (E-WALLET)
- ZaloPay (E-WALLET)
- Bank Transfer (BANK_TRANSFER)
- Cash Payment (CARD)

## Database Features

### Constraints
- Email uniqueness for users
- Rating validation (1-5 stars)
- Refund percentage validation (0-100%)
- Foreign key constraints with CASCADE delete

### Indexes
- Primary keys on all tables
- Composite primary keys for junction tables
- Foreign key indexes

### Data Types
- Proper VARCHAR lengths
- ENUM types for status fields
- DATETIME with automatic timestamps
- LONGTEXT for descriptions

## Troubleshooting

### Common Issues
1. **Database doesn't exist**: Run the SQL script first
2. **Connection refused**: Check MySQL service is running
3. **Permission denied**: Verify database user permissions
4. **Table already exists**: Drop database and recreate

### Verification
After setup, verify the database by:
1. Checking all 17 tables exist
2. Verifying initial data is inserted
3. Testing application startup
4. Checking TypeORM synchronization logs

## Next Steps
1. Create admin user account
2. Add bus companies and stations
3. Create routes and schedules
4. Set up payment integration
5. Configure cancellation policies
