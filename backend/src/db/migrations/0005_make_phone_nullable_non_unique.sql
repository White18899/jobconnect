-- Migration: 0005_make_phone_nullable_non_unique.sql
-- In the Email Authentication system, email is the primary unique identifier.
-- Phone numbers are optional, nullable, and non-unique to prevent registration conflicts.

PRAGMA foreign_keys=OFF;

CREATE TABLE users_new (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    password_salt TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK(role IN ('worker', 'employer', 'admin')),
    is_blocked INTEGER NOT NULL DEFAULT 0,
    is_verified INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users_new (id, email, password_hash, password_salt, phone, role, is_blocked, is_verified, created_at, updated_at)
SELECT id, email, password_hash, password_salt, phone, role, is_blocked, is_verified, created_at, updated_at FROM users;

DROP TABLE users;

ALTER TABLE users_new RENAME TO users;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

PRAGMA foreign_keys=ON;
