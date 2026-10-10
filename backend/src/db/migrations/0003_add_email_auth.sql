-- JobConnect Email Authentication Migration
-- Migration: 0003_add_email_auth.sql

ALTER TABLE users ADD COLUMN email TEXT;
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN password_salt TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Assign default emails for sample seed users
UPDATE users SET email = 'admin@job-way.in' WHERE id = 'usr_admin_01' OR role = 'admin';
UPDATE users SET email = 'employer@job-way.in' WHERE id = 'usr_emp_01';
UPDATE users SET email = 'employer2@job-way.in' WHERE id = 'usr_emp_02';
UPDATE users SET email = 'worker@job-way.in' WHERE id = 'usr_wrk_01';
UPDATE users SET email = 'worker2@job-way.in' WHERE id = 'usr_wrk_02';
