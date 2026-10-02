-- JobConnect Seed Data Migration
-- Migration: 0002_seed_sample_data.sql

-- 1. Users
-- Admin user
INSERT OR IGNORE INTO users (id, phone, role, is_blocked, is_verified)
VALUES ('usr_admin_01', '+919999999999', 'admin', 0, 1);

-- Employers
INSERT OR IGNORE INTO users (id, phone, role, is_blocked, is_verified)
VALUES ('usr_emp_01', '+919876543210', 'employer', 0, 1);

INSERT OR IGNORE INTO users (id, phone, role, is_blocked, is_verified)
VALUES ('usr_emp_02', '+919848012345', 'employer', 0, 1);

-- Workers
INSERT OR IGNORE INTO users (id, phone, role, is_blocked, is_verified)
VALUES ('usr_wrk_01', '+919123456780', 'worker', 0, 1);

INSERT OR IGNORE INTO users (id, phone, role, is_blocked, is_verified)
VALUES ('usr_wrk_02', '+919888877771', 'worker', 0, 1);


-- 2. Worker Profiles
INSERT OR IGNORE INTO worker_profiles (
    id, user_id, full_name, photo_key, skills, experience_years, preferred_area, city,
    expected_salary_min, expected_salary_max, salary_period, id_proof_type, id_number_masked,
    id_doc_key, selfie_key, verification_status
) VALUES (
    'wp_01', 'usr_wrk_01', 'Ramesh Kumar Goud', 'workers/selfie_ramesh.jpg',
    '["Two-Wheeler Mechanic", "Welder", "Electrical Helper"]', 4.5,
    'Kukatpally', 'Hyderabad', 16000, 22000, 'monthly',
    'aadhaar_masked', 'XXXX-XXXX-4912', 'docs/aadhaar_ramesh.pdf', 'workers/selfie_ramesh.jpg', 'verified'
);

INSERT OR IGNORE INTO worker_profiles (
    id, user_id, full_name, photo_key, skills, experience_years, preferred_area, city,
    expected_salary_min, expected_salary_max, salary_period, id_proof_type, id_number_masked,
    id_doc_key, selfie_key, verification_status
) VALUES (
    'wp_02', 'usr_wrk_02', 'Suresh Babu', 'workers/selfie_suresh.jpg',
    '["Cook", "Kitchen Helper", "Packing Worker"]', 3.0,
    'Ameerpet', 'Hyderabad', 14000, 18000, 'monthly',
    'voter_id', 'VTR-XXX892', 'docs/voter_suresh.pdf', 'workers/selfie_suresh.jpg', 'verified'
);


-- 3. Employer Profiles
INSERT OR IGNORE INTO employer_profiles (
    id, user_id, business_name, business_type, contact_person, city, area,
    exact_address, latitude, longitude, business_proof_type, business_proof_key,
    shop_photo_key, verification_status
) VALUES (
    'ep_01', 'usr_emp_01', 'Sri Balaji Auto Care & Service', 'Automobile Workshop',
    'Venkat Rao', 'Hyderabad', 'Kukatpally Housing Board',
    'Plot 42, Phase 3, Near Ganesh Temple, KPHB Colony, Hyderabad 500072',
    17.4938, 78.3995, 'udyam', 'docs/udyam_balaji.pdf',
    'shops/balaji_storefront.jpg', 'verified'
);

INSERT OR IGNORE INTO employer_profiles (
    id, user_id, business_name, business_type, contact_person, city, area,
    exact_address, latitude, longitude, business_proof_type, business_proof_key,
    shop_photo_key, verification_status
) VALUES (
    'ep_02', 'usr_emp_02', 'Annapurna Traditional Sweets & Bakery', 'Food & Confectionery',
    'Satyanarayana', 'Hyderabad', 'SR Nagar',
    'Shop No 14/B, Main Road, Beside Metro Pillar 1042, SR Nagar, Hyderabad 500038',
    17.4435, 78.4482, 'shop_licence', 'docs/shop_licence_annapurna.pdf',
    'shops/annapurna_storefront.jpg', 'verified'
);


-- 4. Jobs
INSERT OR IGNORE INTO jobs (
    id, employer_id, title, description, category, salary_min, salary_max, salary_period,
    location_area, location_city, working_hours, requirements, vacancies, status
) VALUES (
    'job_01', 'ep_01', 'Experienced Two-Wheeler Mechanic Wanted',
    'Looking for a reliable mechanic for servicing Honda, Hero, and Bajaj motorcycles. General service, engine tuning, and brake repairs required.',
    'Mechanic', 18000, 24000, 'monthly', 'KPHB Colony', 'Hyderabad',
    '9:30 AM - 7:30 PM (Weekly Off on Tuesday)',
    '["Must have 2+ years experience in two-wheeler servicing", "Basic electrical troubleshooting knowledge", "Punctual and honest"]',
    2, 'open'
);

INSERT OR IGNORE INTO jobs (
    id, employer_id, title, description, category, salary_min, salary_max, salary_period,
    location_area, location_city, working_hours, requirements, vacancies, status
) VALUES (
    'job_02', 'ep_02', 'Sweet Maker & Counter Assistant',
    'Need sweet maker and packing helper for busy festival season. Fast preparation of laddu, mysore pak, and mixture snacks.',
    'Cook', 15000, 20000, 'monthly', 'SR Nagar', 'Hyderabad',
    '8:00 AM - 5:00 PM',
    '["Hygiene oriented", "Prior sweet stall experience preferred", "Food provided on site"]',
    1, 'open'
);

INSERT OR IGNORE INTO jobs (
    id, employer_id, title, description, category, salary_min, salary_max, salary_period,
    location_area, location_city, working_hours, requirements, vacancies, status
) VALUES (
    'job_03', 'ep_01', 'Workshop Helper & Washing Boy',
    'Water wash, bike cleaning, and workshop assistance. Freshers welcome.',
    'Helper', 10000, 13000, 'monthly', 'KPHB Colony', 'Hyderabad',
    '9:00 AM - 7:00 PM',
    '["Hard working", "Willing to learn bike mechanics"]',
    1, 'open'
);


-- 5. Applications
-- Application 1: Ramesh applied to Auto Mechanic, accepted by employer, payment submitted (pending verification)
INSERT OR IGNORE INTO applications (
    id, job_id, worker_id, employer_id, status
) VALUES (
    'app_01', 'job_01', 'wp_01', 'ep_01', 'pending_verification'
);

-- Application 2: Suresh applied to Sweet Maker, accepted by employer
INSERT OR IGNORE INTO applications (
    id, job_id, worker_id, employer_id, status
) VALUES (
    'app_02', 'job_02', 'wp_02', 'ep_02', 'accepted'
);


-- 6. Payments
-- Payment for app_01: submitted with UTR, awaiting admin review
INSERT OR IGNORE INTO payments (
    id, application_id, employer_id, amount, order_code, upi_ref, screenshot_key, status, submitted_at
) VALUES (
    'pay_01', 'app_01', 'ep_01', 499, 'JC-202610-8812', '428190581920', 'payments/proof_balaji_01.jpg',
    'pending_verification', CURRENT_TIMESTAMP
);
