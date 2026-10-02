-- JobConnect Initial D1 SQLite Schema Migration
-- Migration: 0001_initial_schema.sql

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK(role IN ('worker', 'employer', 'admin')),
    is_blocked INTEGER NOT NULL DEFAULT 0,
    is_verified INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Worker Profiles
CREATE TABLE IF NOT EXISTS worker_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    photo_key TEXT,
    skills TEXT NOT NULL,
    experience_years REAL DEFAULT 0,
    preferred_area TEXT NOT NULL,
    city TEXT NOT NULL,
    expected_salary_min INTEGER,
    expected_salary_max INTEGER,
    salary_period TEXT DEFAULT 'daily' CHECK(salary_period IN ('hourly', 'daily', 'monthly')),
    id_proof_type TEXT CHECK(id_proof_type IN ('aadhaar_masked', 'voter_id', 'driving_licence')),
    id_number_masked TEXT,
    id_doc_key TEXT,
    selfie_key TEXT,
    skill_proof_key TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK(verification_status IN ('pending', 'verified', 'rejected')),
    verification_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Employer Profiles
CREATE TABLE IF NOT EXISTS employer_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    exact_address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    business_proof_type TEXT CHECK(business_proof_type IN ('udyam', 'gst', 'shop_licence', 'trade_licence', 'rent_agreement')),
    business_proof_key TEXT,
    shop_photo_key TEXT,
    utility_bill_key TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK(verification_status IN ('pending', 'verified', 'rejected')),
    verification_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    employer_id TEXT NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    salary_min INTEGER NOT NULL,
    salary_max INTEGER NOT NULL,
    salary_period TEXT DEFAULT 'monthly' CHECK(salary_period IN ('hourly', 'daily', 'monthly')),
    location_area TEXT NOT NULL,
    location_city TEXT NOT NULL,
    working_hours TEXT NOT NULL,
    requirements TEXT,
    vacancies INTEGER DEFAULT 1,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'closed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Applications
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id TEXT NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
    employer_id TEXT NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied' CHECK(status IN (
        'applied',
        'accepted',
        'rejected',
        'pending_verification',
        'unlocked',
        'verification_rejected'
    )),
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, worker_id)
);

-- 6. Payments
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    employer_id TEXT NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL DEFAULT 499,
    order_code TEXT NOT NULL UNIQUE,
    upi_ref TEXT UNIQUE,
    screenshot_key TEXT,
    status TEXT DEFAULT 'awaiting_payment' CHECK(status IN (
        'awaiting_payment',
        'submitted',
        'pending_verification',
        'successful',
        'rejected',
        'refunded'
    )),
    submitted_at DATETIME,
    reviewed_by TEXT REFERENCES users(id),
    reviewed_at DATETIME,
    reject_reason TEXT,
    refund_status TEXT DEFAULT 'none' CHECK(refund_status IN ('none', 'initiated', 'completed')),
    refund_ref TEXT,
    refund_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Verification Documents
CREATE TABLE IF NOT EXISTS verification_documents (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('worker', 'employer', 'payment')),
    entity_id TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    r2_key TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Admin Reviews
CREATE TABLE IF NOT EXISTS admin_reviews (
    id TEXT PRIMARY KEY,
    target_type TEXT NOT NULL CHECK(target_type IN ('worker', 'employer', 'payment', 'job', 'user')),
    target_id TEXT NOT NULL,
    admin_id TEXT NOT NULL REFERENCES users(id),
    action TEXT NOT NULL CHECK(action IN ('approve', 'reject', 'refund', 'block', 'unblock')),
    checklist_json TEXT,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('application', 'payment', 'verification', 'system')),
    is_read INTEGER NOT NULL DEFAULT 0,
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    details_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_worker_user ON worker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_user ON employer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_city_category ON jobs(location_city, category, status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_payments_app ON payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_utr ON payments(upi_ref);
