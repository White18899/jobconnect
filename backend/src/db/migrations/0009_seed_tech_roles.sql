-- 0009_seed_tech_roles.sql
-- Reset database with modern technical roles, tech employers, workers, jobs & applications

-- Clear legacy trade applications, jobs, workers, employers
DELETE FROM payments;
DELETE FROM applications;
DELETE FROM jobs;
DELETE FROM worker_profiles;
DELETE FROM employer_profiles;
DELETE FROM users WHERE id IN ('usr_emp_01', 'usr_emp_02', 'usr_emp_03', 'usr_emp_04', 'usr_wrk_01', 'usr_wrk_02', 'usr_wrk_03', 'usr_wrk_04', 'usr_wrk_05', 'usr_wrk_06');

-- 1. Tech Employers & Users
INSERT OR REPLACE INTO users (id, phone, email, role, is_blocked, is_verified)
VALUES
  ('usr_emp_01', '+919876543210', 'careers@hyperscale.tech', 'employer', 0, 1),
  ('usr_emp_02', '+919848012345', 'hiring@finedge.in', 'employer', 0, 1),
  ('usr_emp_03', '+919848099887', 'talent@nextwaveai.com', 'employer', 0, 1),
  ('usr_emp_04', '+919848066554', 'hr@talentsphere.io', 'employer', 0, 1);

INSERT OR REPLACE INTO employer_profiles (
  id, user_id, business_name, business_type, contact_person, city, area,
  exact_address, latitude, longitude, business_proof_type, verification_status
) VALUES
  ('ep_01', 'usr_emp_01', 'HyperScale Cloud Systems', 'SaaS & Cloud Platforms', 'Vikram Malhotra', 'Visakhapatnam', 'Madhurawada IT SEZ Hill 2', 'Floor 8, Tower B, Cyber Gateway, IT SEZ Hill 2, Madhurawada, Visakhapatnam 530048', 17.8252, 83.3533, 'gst', 'verified'),
  ('ep_02', 'usr_emp_02', 'FinEdge Fintech Solutions', 'Banking & Payments Tech', 'Ananya Sen', 'Visakhapatnam', 'Rushikonda Millennium Tech Park', 'Millennium Tower B, Rushikonda IT Park, Visakhapatnam 530045', 17.7816, 83.3779, 'gst', 'verified'),
  ('ep_03', 'usr_emp_03', 'NextWave AI & Automation Labs', 'Enterprise AI Systems', 'Rohan Kapoor', 'Visakhapatnam', 'Duvvada VSEZ Tech Zone', 'Level 14, VSEZ Tower, Special Economic Zone, Duvvada, Visakhapatnam 530046', 17.7042, 83.1518, 'gst', 'verified'),
  ('ep_04', 'usr_emp_04', 'TalentSphere Global Technologies', 'People Ops & HR Tech', 'Meera Nair', 'Visakhapatnam', 'Auto Nagar Technology Park', 'Phase 1, Auto Nagar Industrial Hub, Visakhapatnam 530012', 17.7011, 83.2144, 'gst', 'verified');

-- 2. Tech Workers & Profiles
INSERT OR REPLACE INTO users (id, phone, email, role, is_blocked, is_verified)
VALUES
  ('usr_wrk_01', '+919849123434', 'rohan.sharma.tech@gmail.com', 'worker', 0, 1),
  ('usr_wrk_02', '+919440291889', 'pooja.nair.qa@gmail.com', 'worker', 0, 1),
  ('usr_wrk_03', '+919959234178', 'ankit.verma.lead@gmail.com', 'worker', 0, 1),
  ('usr_wrk_04', '+919701188955', 'sneha.kulkarni.hr@gmail.com', 'worker', 0, 1),
  ('usr_wrk_05', '+919121845612', 'karthik.iyer.devops@gmail.com', 'worker', 0, 1),
  ('usr_wrk_06', '+919391088240', 'divya.menon.apps@gmail.com', 'worker', 0, 1);

INSERT OR REPLACE INTO worker_profiles (
  id, user_id, full_name, trade_title, phone, skills, experience_years,
  education_level, education_institute, education_specialization, educations,
  past_company, preferred_area, city, expected_salary_min, expected_salary_max,
  salary_period, photo_thumb, verification_status
) VALUES
  ('wp_01', 'usr_wrk_01', 'Rohan Sharma', 'Senior Full-Stack Engineer', '+91 98491 23434',
   '["React 19", "Node.js", "TypeScript", "PostgreSQL", "Cloudflare Workers", "Next.js"]', 4.5,
   'B.Tech', 'Andhra University College of Engineering', 'Computer Science & Engineering',
   '[{"level":"B.Tech","institute":"Andhra University College of Engineering","specialization":"Computer Science","year":2022}]',
   'HyperScale Cloud Systems', 'Madhurawada IT SEZ', 'Visakhapatnam', 85000, 130000,
   'monthly', 'assets/trades/software.jpg', 'verified'),

  ('wp_02', 'usr_wrk_02', 'Pooja Nair', 'SDET & QA Automation Lead', '+91 94402 91889',
   '["Playwright", "Cypress", "Selenium", "Postman / RestAssured", "Jest", "CI/CD Actions"]', 4.0,
   'B.Tech', 'GITAM University Visakhapatnam', 'Information Technology',
   '[{"level":"B.Tech","institute":"GITAM University Visakhapatnam","specialization":"Information Technology","year":2022}]',
   'FinEdge Fintech Solutions', 'Rushikonda Millennium Tech Park', 'Visakhapatnam', 65000, 95000,
   'monthly', 'assets/trades/qa.jpg', 'verified'),

  ('wp_03', 'usr_wrk_03', 'Ankit Verma', 'Technical Team Leader & System Architect', '+91 99592 34178',
   '["System Design", "Microservices", "Agile / Scrum", "Spring Boot", "React", "Kafka"]', 6.5,
   'M.Tech', 'Andhra University', 'Software Systems Architecture',
   '[{"level":"M.Tech","institute":"Andhra University","specialization":"Software Systems","year":2020}]',
   'NextWave AI Labs', 'Duvvada VSEZ Corridor', 'Visakhapatnam', 120000, 180000,
   'monthly', 'assets/trades/teamlead.jpg', 'verified'),

  ('wp_04', 'usr_wrk_04', 'Sneha Kulkarni', 'Senior Technical Recruiter & HR Operations Partner', '+91 97011 88955',
   '["Tech Talent Sourcing", "ATS / Greenhouse", "Salary Benchmarking", "Employee Relations", "SHRM Standards"]', 5.0,
   'MBA', 'GITAM Institute of Management', 'Human Resource Management',
   '[{"level":"MBA","institute":"GITAM Institute of Management","specialization":"Human Resource Management","year":2021}]',
   'TalentSphere Global Technologies', 'Auto Nagar Industrial Hub', 'Visakhapatnam', 55000, 80000,
   'monthly', 'assets/trades/hr.jpg', 'verified'),

  ('wp_05', 'usr_wrk_05', 'Karthik Iyer', 'Cloud & DevOps Infrastructure Engineer', '+91 91218 45612',
   '["Kubernetes (EKS)", "Terraform", "Docker", "AWS / GCP", "Prometheus & Grafana", "GitOps"]', 5.0,
   'B.Tech', 'Andhra University College of Engineering', 'Electronics & Communication',
   '[{"level":"B.Tech","institute":"Andhra University","specialization":"Electronics & Communication","year":2021}]',
   'HyperScale Cloud Systems', 'Madhurawada IT SEZ', 'Visakhapatnam', 90000, 140000,
   'monthly', 'assets/trades/devops.jpg', 'verified'),

  ('wp_06', 'usr_wrk_06', 'Divya Menon', 'Lead Mobile App Developer (iOS & Android)', '+91 93910 88240',
   '["React Native", "Flutter / Dart", "Swift (iOS)", "Kotlin (Android)", "Offline-First Sync"]', 4.5,
   'B.Tech', 'GITAM University Visakhapatnam', 'Computer Science',
   '[{"level":"B.Tech","institute":"GITAM University","specialization":"Computer Science","year":2022}]',
   'FinEdge Mobility Team', 'Gajuwaka Industrial Hub', 'Visakhapatnam', 75000, 115000,
   'monthly', 'assets/trades/mobile.jpg', 'verified');

-- 3. Tech Jobs
INSERT OR REPLACE INTO jobs (
  id, employer_id, title, description, category, salary_min, salary_max, salary_period,
  location_area, location_city, working_hours, requirements, vacancies, status, created_at
) VALUES
  ('job_01', 'ep_01', 'Senior Full-Stack Software Engineer (TypeScript & Cloudflare)',
   'Architect and build scalable microservices, edge-native Cloudflare Workers, and high-performance React web applications. Responsible for distributed databases, caching, and CI/CD pipelines.',
   'Software Engineering', 85000, 130000, 'monthly', 'Madhurawada IT SEZ Hill 2', 'Visakhapatnam',
   '10:00 AM - 7:00 PM (Hybrid)', 'B.Tech/BE in Computer Science, 4+ years building full-stack web platforms with TypeScript, React, Node.js, and SQL.', 2, 'open', '2026-10-02'),

  ('job_02', 'ep_02', 'SDET & QA Automation Engineer (Playwright & Cypress)',
   'Design and execute end-to-end automated test suites for fintech payment gateways. Lead regression cycles, performance benchmarks, and automated security sanity checks.',
   'QA & Testing', 65000, 95000, 'monthly', 'Rushikonda Millennium Tech Park', 'Visakhapatnam',
   '9:30 AM - 6:30 PM (Flexible)', '3+ years QA automation with Playwright, Cypress, or Selenium. Strong API testing skills (REST / GraphQL / Postman).', 2, 'open', '2026-10-04'),

  ('job_03', 'ep_03', 'Technical Team Leader & Engineering Manager',
   'Lead a high-performing squad of 8 engineers across frontend, backend, and infrastructure. Drive architecture reviews, sprint grooming, code quality standards, and technical roadmaps.',
   'Team Leadership', 120000, 180000, 'monthly', 'Duvvada VSEZ Tech Zone', 'Visakhapatnam',
   '9:30 AM - 6:30 PM', '6+ years software development experience with at least 2+ years leading engineering teams or tech-leading complex distributed systems.', 1, 'open', '2026-10-06'),

  ('job_04', 'ep_04', 'Senior Technical Recruiter & HR Operations Partner',
   'Manage 360-degree technical hiring lifecycle for software, QA, and cloud engineering squads. Partner with hiring managers, run tech sourcing campaigns, offer management, and onboarding.',
   'Human Resources', 55000, 80000, 'monthly', 'Auto Nagar Technology Park', 'Visakhapatnam',
   '9:00 AM - 6:00 PM', 'MBA / Degree in HR, 4+ years technical recruiting in fast-growth tech startups. Proven proficiency in LinkedIn Recruiter and modern ATS.', 1, 'open', '2026-10-08'),

  ('job_05', 'ep_01', 'Cloud & DevOps Infrastructure Engineer',
   'Manage enterprise Kubernetes clusters, Infrastructure as Code using Terraform, automated GitOps CI/CD pipelines, and 99.99% uptime observability with Prometheus and Datadog.',
   'DevOps & Cloud', 90000, 140000, 'monthly', 'Siripuram / MVP Colony', 'Visakhapatnam',
   '10:00 AM - 7:00 PM (Rotational On-Call)', '4+ years hands-on DevOps / SRE experience, CKA certified preferred, production Docker/Kubernetes and AWS/GCP architecture.', 1, 'open', '2026-10-09'),

  ('job_06', 'ep_02', 'Lead Mobile Application Developer (React Native & Flutter)',
   'Lead mobile development for flagship consumer fintech and worker apps. Implement native modules, smooth 60fps animations, biometric authentication, and offline caching.',
   'Mobile Development', 75000, 115000, 'monthly', 'Gajuwaka Industrial & Tech Zone', 'Visakhapatnam',
   '9:30 AM - 6:30 PM', '4+ years mobile app development with React Native, Flutter, Swift, or Kotlin. Shipped production apps to App Store & Google Play.', 1, 'open', '2026-10-10');

-- 4. Tech Applications (Showing dynamic demand distribution)
INSERT OR REPLACE INTO applications (id, job_id, worker_id, employer_id, status, applied_at)
VALUES
  ('app_01', 'job_01', 'wp_01', 'ep_01', 'applied', '2026-10-08 09:15:00'),
  ('app_02', 'job_03', 'wp_01', 'ep_03', 'applied', '2026-10-08 11:30:00'),
  ('app_03', 'job_02', 'wp_02', 'ep_02', 'unlocked', '2026-10-09 10:00:00'),
  ('app_04', 'job_01', 'wp_02', 'ep_01', 'applied', '2026-10-09 14:20:00'),
  ('app_05', 'job_03', 'wp_03', 'ep_03', 'accepted', '2026-10-09 16:45:00'),
  ('app_06', 'job_04', 'wp_04', 'ep_04', 'applied', '2026-10-10 08:30:00'),
  ('app_07', 'job_05', 'wp_05', 'ep_01', 'applied', '2026-10-10 11:15:00'),
  ('app_08', 'job_06', 'wp_06', 'ep_02', 'applied', '2026-10-10 12:45:00'),
  ('app_09', 'job_01', 'wp_06', 'ep_01', 'applied', '2026-10-10 15:10:00');
