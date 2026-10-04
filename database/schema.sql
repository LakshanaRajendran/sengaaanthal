-- ===================================================
-- SENGAANTHAL DATABASE SCHEMA
-- Database: sengaanthal_db
-- ===================================================

CREATE DATABASE IF NOT EXISTS sengaanthal_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sengaanthal_db;

-- ---------------------------------------------------
-- TABLE: users
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'reader') DEFAULT 'reader',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------
-- TABLE: poems
-- (Text only: no image column)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS poems (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  language ENUM('tamil', 'english') NOT NULL,
  type ENUM('poem', 'haiku') NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------
-- TABLE: bookmarks
-- (Cascades on delete, UNIQUE constraint per user & poem)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS bookmarks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  poem_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_poem (user_id, poem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
