-- Fix users table structure
USE infosysdb;

-- Drop existing users table
DROP TABLE IF EXISTS users;

-- Create users table with correct structure
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Verify table structure
DESCRIBE users;