-- JobConnect / JobWay: Complete Database Reset & Clean Seed (2 Workers + 2 Employers + Super Admin)
-- Target: Cloudflare D1 Database (jobconnect-db)

-- 1. Wipe all existing payments, applications, jobs, documents, and non-admin profiles
DELETE FROM payments;
DELETE FROM applications;
DELETE FROM jobs;
DELETE FROM worker_profiles;
DELETE FROM employer_profiles;
DELETE FROM verification_documents;
DELETE FROM admin_reviews;
DELETE FROM notifications;
DELETE FROM audit_logs;
DELETE FROM users;

-- 2. Master Super Admin Account
-- Password: JobConnect@Admin2026
INSERT INTO users (
  id, email, password_hash, password_salt, phone, role, is_blocked, is_verified, created_at, updated_at
) VALUES (
  'usr_admin_01',
  'admin@job-way.in',
  'e725f2bcdf69072f276cb4725f937410f05e818b3b99fb2049b2aef954b3dab6',
  '853f0f0f6e7d26de0b73db270dab0584',
  '+919999999999',
  'admin',
  0,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 3. Worker User Accounts (Password: Password@123)
INSERT INTO users (
  id, email, password_hash, password_salt, phone, role, is_blocked, is_verified, created_at, updated_at
) VALUES
(
  'usr_worker_01',
  'worker1@job-way.in',
  'e725f2bcdf69072f276cb4725f937410f05e818b3b99fb2049b2aef954b3dab6',
  '853f0f0f6e7d26de0b73db270dab0584',
  '+919876543211',
  'worker',
  0,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'usr_worker_02',
  'worker2@job-way.in',
  'e725f2bcdf69072f276cb4725f937410f05e818b3b99fb2049b2aef954b3dab6',
  '853f0f0f6e7d26de0b73db270dab0584',
  '+919876543212',
  'worker',
  0,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 4. Worker Profiles (Showing in Verified Candidates Directory)
INSERT INTO worker_profiles (
  id, user_id, full_name, phone, trade_title, skills, experience_years,
  education_level, education_institute, education_specialization, education_year,
  past_company, experience_description, preferred_area, city,
  expected_salary_min, expected_salary_max, salary_period,
  verification_status, digilocker_verified, photo_thumb, created_at, updated_at
) VALUES
(
  'wp_worker_01',
  'usr_worker_01',
  'Rohan Sharma',
  '+919876543211',
  'Senior Full-Stack Engineer',
  '["React.js", "Node.js", "TypeScript", "PostgreSQL", "Cloudflare Workers", "Next.js"]',
  4.5,
  'B.Tech / Professional Degree',
  'JNTU Hyderabad College of Engineering',
  'Computer Science & Engineering',
  '2021',
  'CloudScale Systems',
  'Senior Full-Stack Engineer with 4.5+ years building edge-native microservices, scalable distributed APIs, and performant React applications.',
  'Hitec City / Madhapur',
  'Hyderabad',
  85000,
  130000,
  'monthly',
  'verified',
  1,
  'assets/trades/software.jpg',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'wp_worker_02',
  'usr_worker_02',
  'Pooja Nair',
  '+919876543212',
  'SDET & QA Automation Lead',
  '["Playwright", "Cypress", "Selenium", "API Testing", "CI/CD", "k6 Load Testing"]',
  4.0,
  'B.Tech / Professional Degree',
  'BMS College of Engineering',
  'Information Science & Engineering',
  '2022',
  'FinEdge Solutions',
  'SDET & QA Automation Lead specializing in Playwright end-to-end testing, high-concurrency performance benchmarks, and automated CI/CD quality pipelines.',
  'Bellandur / Koramangala',
  'Bangalore',
  65000,
  95000,
  'monthly',
  'verified',
  1,
  'assets/trades/qa.jpg',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 5. Employer User Accounts (Password: Password@123)
INSERT INTO users (
  id, email, password_hash, password_salt, phone, role, is_blocked, is_verified, created_at, updated_at
) VALUES
(
  'usr_emp_01',
  'employer1@job-way.in',
  'e725f2bcdf69072f276cb4725f937410f05e818b3b99fb2049b2aef954b3dab6',
  '853f0f0f6e7d26de0b73db270dab0584',
  '+919876543221',
  'employer',
  0,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'usr_emp_02',
  'employer2@job-way.in',
  'e725f2bcdf69072f276cb4725f937410f05e818b3b99fb2049b2aef954b3dab6',
  '853f0f0f6e7d26de0b73db270dab0584',
  '+919876543222',
  'employer',
  0,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 6. Employer Profiles
INSERT INTO employer_profiles (
  id, user_id, business_name, business_type, contact_person, city, area,
  exact_address, latitude, longitude, verification_status, created_at, updated_at
) VALUES
(
  'ep_emp_01',
  'usr_emp_01',
  'HyperScale Cloud Systems',
  'Enterprise SaaS & Cloud Platforms',
  'Vikram Patel',
  'Hyderabad',
  'Hitec City Cyber Towers',
  'Tower B, 6th Floor, Hitec City Tech Zone, Hyderabad, Telangana 500081',
  17.4504,
  78.3808,
  'verified',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'ep_emp_02',
  'usr_emp_02',
  'FinEdge Fintech Solutions',
  'Digital Banking & Payments',
  'Arjun Mehta',
  'Bangalore',
  'Outer Ring Road / Bellandur',
  'EcoSpace Business Park, Campus 3A, Outer Ring Rd, Bellandur, Bengaluru 560103',
  12.9260,
  77.6762,
  'verified',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 7. Verified Open Tech Jobs Posted by the 2 Employers
INSERT INTO jobs (
  id, employer_id, title, description, category, salary_min, salary_max, salary_period,
  location_area, location_city, working_hours, requirements, vacancies, status, created_at, updated_at
) VALUES
(
  'job_01',
  'ep_emp_01',
  'Senior Full-Stack Software Engineer (TypeScript & Cloudflare)',
  'Architect and build scalable microservices, edge-native Cloudflare Workers, and high-performance React web applications. Responsible for distributed databases, caching, and CI/CD pipelines.',
  'Software Engineering',
  85000,
  130000,
  'monthly',
  'Hitec City Cyber Towers',
  'Hyderabad',
  '10:00 AM - 7:00 PM (Hybrid)',
  '["B.Tech/BE in Computer Science", "4+ years building full-stack platforms with TypeScript, React, Node.js, and SQL", "Strong expertise in edge computing and distributed systems"]',
  2,
  'open',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'job_02',
  'ep_emp_02',
  'SDET & QA Automation Engineer (Playwright & Cypress)',
  'Design and execute end-to-end automated test suites for fintech payment gateways. Lead regression cycles, performance benchmarks, and automated security sanity checks.',
  'QA & Testing',
  65000,
  95000,
  'monthly',
  'Outer Ring Road / Bellandur',
  'Bangalore',
  '9:30 AM - 6:30 PM (5 Days)',
  '["3+ years writing automated test scripts in TypeScript or Python", "Hands-on expertise with Playwright or Cypress", "Experience with CI/CD integration and load testing using k6 or JMeter"]',
  2,
  'open',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
