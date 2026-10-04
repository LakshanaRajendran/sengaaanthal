-- ===================================================
-- SENGAANTHAL DATABASE SCHEMA (PostgreSQL / Neon)
-- ===================================================

-- ---------------------------------------------------
-- TABLE: users
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'reader' CHECK (role IN ('admin', 'reader')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- TABLE: poems
-- (Text only: no image column)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS poems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  language VARCHAR(20) NOT NULL CHECK (language IN ('tamil', 'english')),
  type VARCHAR(20) NOT NULL CHECK (type IN ('poem', 'haiku')),
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- TRIGGER: auto-update updated_at on poems
-- ---------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_poems_updated_at ON poems;
CREATE TRIGGER trigger_poems_updated_at
BEFORE UPDATE ON poems
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------
-- TABLE: bookmarks
-- (Cascades on delete, UNIQUE constraint per user & poem)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  poem_id INT NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_poem UNIQUE (user_id, poem_id)
);
