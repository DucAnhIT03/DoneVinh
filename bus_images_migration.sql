-- Migration: Add created_at and updated_at to bus_images table
-- Run this SQL to update the existing database

ALTER TABLE bus_images 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update existing records to have proper timestamps
UPDATE bus_images 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL OR updated_at IS NULL;




