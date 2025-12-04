-- Fix users table structure completely
USE infosysdb;

-- Drop existing users table
DROP TABLE IF EXISTS users;

-- Create users table with correct structure
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

-- Verify table structure
DESCRIBE users;

-- Show empty table
SELECT * FROM users;