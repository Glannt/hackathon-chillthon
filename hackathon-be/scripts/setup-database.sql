-- Setup Database for Hackathon Project
-- Run this script in MySQL to create the database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hackathon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE hackathon_db;

-- Show database info
SELECT 'Database hackathon_db created successfully!' as message;

-- Note: Tables will be created automatically by TypeORM when the application starts
-- with synchronize: true in development mode
