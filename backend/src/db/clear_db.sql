-- Wipe all user data, jobs, applications, payments, and profiles from JobConnect DB
-- Retaining only the Super Admin account

DELETE FROM payments;
DELETE FROM applications;
DELETE FROM jobs;
DELETE FROM worker_profiles;
DELETE FROM employer_profiles;
DELETE FROM verification_documents;
DELETE FROM admin_reviews;
DELETE FROM notifications;
DELETE FROM audit_logs;
DELETE FROM users WHERE role != 'admin';

-- Ensure system super admin account is present
INSERT OR REPLACE INTO users (id, email, phone, role, is_blocked, is_verified, created_at, updated_at)
VALUES ('usr_admin_01', 'admin@job-way.in', '+919999999999', 'admin', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
