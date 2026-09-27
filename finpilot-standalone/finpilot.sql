-- ========================================================
-- FinPilot – Smart Expense Tracker Database Schema
-- Database: MySQL 8.0+
-- ========================================================

CREATE DATABASE IF NOT EXISTS finpilot
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finpilot;

-- --------------------------------------------------------
-- 1. Table structure for table 'users'
-- --------------------------------------------------------
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 2. Table structure for table 'transactions'
-- --------------------------------------------------------
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    category VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Card',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, transaction_date),
    INDEX idx_user_category (user_id, category),
    INDEX idx_user_type (user_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Table structure for table 'budgets'
-- --------------------------------------------------------
CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget_amount DECIMAL(12, 2) NOT NULL,
    budget_month INT NOT NULL CHECK (budget_month BETWEEN 1 AND 12),
    budget_year INT NOT NULL CHECK (budget_year >= 2020),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_user_category_period UNIQUE (user_id, category, budget_month, budget_year),
    INDEX idx_budget_lookup (user_id, budget_year, budget_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- Sample Seed Data for Testing & Demonstration
-- Note: Default demo user password is: Password@123
-- BCrypt Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ========================================================

INSERT INTO users (id, full_name, email, password_hash) VALUES
(1, 'Alex Morgan', 'alex@finpilot.dev', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Sarah Jenkins', 'sarah@finpilot.dev', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample Budgets for Current Period
INSERT INTO budgets (user_id, category, budget_amount, budget_month, budget_year) VALUES
(1, 'Food & Dining', 600.00, 9, 2026),
(1, 'Housing & Rent', 1200.00, 9, 2026),
(1, 'Transportation', 250.00, 9, 2026),
(1, 'Entertainment', 200.00, 9, 2026),
(1, 'Shopping', 300.00, 9, 2026),
(1, 'Utilities', 180.00, 9, 2026);

-- Sample Transactions
INSERT INTO transactions (user_id, title, amount, type, category, transaction_date, payment_method, description) VALUES
(1, 'Monthly Salary Deposit', 4850.00, 'INCOME', 'Salary', '2026-09-01', 'Bank Transfer', 'Primary tech company salary direct deposit'),
(1, 'Apartment Monthly Rent', 1200.00, 'EXPENSE', 'Housing & Rent', '2026-09-02', 'Bank Transfer', 'Downtown 1-bedroom apartment lease'),
(1, 'Freelance UI Design', 850.00, 'INCOME', 'Freelance', '2026-09-05', 'PayPal', 'Mobile app mockups & prototype milestone'),
(1, 'Supermarket Groceries', 142.50, 'EXPENSE', 'Food & Dining', '2026-09-07', 'Credit Card', 'Whole Foods weekly groceries'),
(1, 'Electric & Fiber Internet', 135.00, 'EXPENSE', 'Utilities', '2026-09-10', 'Direct Debit', 'Monthly electricity and 1Gbps fiber internet'),
(1, 'Metro Subway Card Reload', 60.00, 'EXPENSE', 'Transportation', '2026-09-12', 'Debit Card', 'Monthly transit pass reload'),
(1, 'Weekend Dinner & Bistro', 84.20, 'EXPENSE', 'Food & Dining', '2026-09-15', 'Credit Card', 'Dinner with college friends'),
(1, 'Cinema & Concert Tickets', 75.00, 'EXPENSE', 'Entertainment', '2026-09-18', 'Credit Card', 'Movie night and live jazz tickets'),
(1, 'Running Shoes & Apparel', 129.99, 'EXPENSE', 'Shopping', '2026-09-20', 'Credit Card', 'Nike running shoes from outlet'),
(1, 'Consulting Advisory Call', 400.00, 'INCOME', 'Investments', '2026-09-22', 'Bank Wire', 'Fintech architecture advisory session'),
(1, 'Artisan Coffee Roasters', 32.50, 'EXPENSE', 'Food & Dining', '2026-09-24', 'Apple Pay', 'Specialty beans & cold brew');
