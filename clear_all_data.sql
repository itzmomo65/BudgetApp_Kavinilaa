-- Clear all data from database and start fresh
USE infosysdb;

-- Delete all data from all tables
DELETE FROM savings_goals;
DELETE FROM budgets;
DELETE FROM expenses;
DELETE FROM incomes;
DELETE FROM profiles;
DELETE FROM users;

-- Reset auto-increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE profiles AUTO_INCREMENT = 1;
ALTER TABLE incomes AUTO_INCREMENT = 1;
ALTER TABLE expenses AUTO_INCREMENT = 1;
ALTER TABLE budgets AUTO_INCREMENT = 1;
ALTER TABLE savings_goals AUTO_INCREMENT = 1;

-- Verify all tables are empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'incomes', COUNT(*) FROM incomes
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'budgets', COUNT(*) FROM budgets
UNION ALL
SELECT 'savings_goals', COUNT(*) FROM savings_goals;