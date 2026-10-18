-- Seed Master Tech Vacancies and Candidates in Cloudflare D1
-- Synchronizes job-way.in, jobway-kup.pages.dev, and localhost

-- 1. Ensure Verified Tech Employers Exist
INSERT OR REPLACE INTO users (id, email, phone, role, is_blocked, is_verified, created_at, updated_at)
VALUES 
  ('usr_emp_01', 'careers@hyperscale.tech', '+919849011223', 'employer', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_emp_02', 'hiring@finedge.in', '+919849022334', 'employer', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_emp_03', 'recruitment@nextwaveai.io', '+919849033445', 'employer', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_emp_04', 'ops@cloudscale.net', '+919849044556', 'employer', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_emp_05', 'careers@appsphere.dev', '+919849055667', 'employer', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_emp_06', 'talent@talentsprint.org', '+919849066778', 'employer', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR REPLACE INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status, created_at, updated_at)
VALUES
  ('emp_01', 'usr_emp_01', 'HyperScale Cloud Systems', 'SaaS & Cloud Platforms', 'Vikramaditya Verma', 'Hyderabad', 'Hitec City Cyber Towers', 'Building 4, Cyber Gateway, Hitec City, Hyderabad - 500081', 17.4474, 78.3762, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('emp_02', 'usr_emp_02', 'FinEdge Fintech Solutions', 'Digital Banking & Payments', 'Ananya Deshmukh', 'Bangalore', 'Outer Ring Road / Bellandur', 'Tower B, RMZ Ecospace, Bellandur, Bangalore - 560103', 12.9279, 77.6848, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('emp_03', 'usr_emp_03', 'NextWave AI & Automation Labs', 'Artificial Intelligence & Robotics', 'Raghavendra Rao', 'Hyderabad', 'Financial District / Gachibowli', '8th Floor, WaveRock Building, Gachibowli, Hyderabad - 500032', 17.4190, 78.3377, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('emp_04', 'usr_emp_04', 'CloudScale Networks', 'Cloud & Security Infrastructure', 'Prakash Murthy', 'Hyderabad', 'Madhapur', 'Plot 42, Mindspace Circle, Madhapur, Hyderabad - 500081', 17.4399, 78.3846, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('emp_05', 'usr_emp_05', 'AppSphere Technologies', 'Mobile & Cross-Platform Systems', 'Divya Sundaram', 'Bangalore', 'Indiranagar', '100 Feet Road, Indiranagar, Bangalore - 560038', 12.9716, 77.6412, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('emp_06', 'usr_emp_06', 'TalentSprint Systems', 'Talent Acquisition & Enterprise HR', 'Meera Joshi', 'Pune', 'Hinjewadi Tech Hub', 'Phase 1, Hinjewadi Rajiv Gandhi Infotech Park, Pune - 411057', 18.5913, 73.7389, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Ensure Verified Technical Vacancies (Jobs) Exist
INSERT OR REPLACE INTO jobs (id, employer_id, title, description, category, salary_min, salary_max, salary_period, location_area, location_city, working_hours, requirements, vacancies, status, created_at, updated_at)
VALUES
  ('job_01', 'emp_01', 'Senior Full-Stack Software Engineer (TypeScript & Cloudflare)', 
   'Architect and build scalable microservices, edge-native Cloudflare Workers, and high-performance React web applications. Responsible for distributed databases, caching, and CI/CD pipelines.', 
   'Software Engineering', 85000, 130000, 'monthly', 'Hitec City Cyber Towers', 'Hyderabad', '10:00 AM - 7:00 PM (Hybrid)', 
   '["B.Tech/BE in Computer Science", "4+ years building full-stack platforms with TypeScript, React, Node.js, and SQL", "Strong expertise in edge computing and distributed systems"]', 2, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('job_02', 'emp_02', 'SDET & QA Automation Engineer (Playwright & Cypress)', 
   'Design and execute end-to-end automated test suites for fintech payment gateways. Lead regression cycles, performance benchmarks, and automated security sanity checks.', 
   'QA & Testing', 65000, 95000, 'monthly', 'Outer Ring Road / Bellandur', 'Bangalore', '9:30 AM - 6:30 PM (5 Days)', 
   '["3+ years writing automated test scripts in TypeScript or Python", "Hands-on expertise with Playwright or Cypress", "Experience with CI/CD integration and load testing using k6 or JMeter"]', 2, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('job_03', 'emp_03', 'Technical Team Leader & Engineering Manager', 
   'Lead a high-velocity squad of 8-12 software engineers delivering generative AI applications, high-concurrency microservices, and robust cloud platforms. Mentor talent and drive architectural standards.', 
   'Team Leadership', 120000, 180000, 'monthly', 'Financial District / Gachibowli', 'Hyderabad', '9:30 AM - 6:30 PM (Hybrid)', 
   '["6+ years software development experience with 2+ years leading engineering teams", "Proven track record in system architecture and technical hiring", "Strong background in Python, Java, or Golang distributed systems"]', 1, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('job_04', 'emp_04', 'Cloud & DevOps Infrastructure Engineer', 
   'Automate infrastructure provisioning across AWS and Cloudflare using Terraform and Kubernetes. Manage CI/CD deployment pipelines, observability with Prometheus and Datadog, and cloud security compliance.', 
   'DevOps & Cloud', 80000, 140000, 'monthly', 'Madhapur', 'Hyderabad', '10:00 AM - 7:00 PM (Hybrid)', 
   '["3+ years in DevOps / SRE role", "Strong hands-on experience with Kubernetes, Docker, and Terraform", "Expertise in AWS (EKS, EC2, S3) and Linux administration"]', 2, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('job_05', 'emp_05', 'Lead Mobile Application Developer (React Native & Flutter)', 
   'Lead cross-platform mobile application architecture for consumer fintech and delivery solutions. Optimize frame rates, offline-first caching with SQLite, and automated app store release workflows.', 
   'Mobile Development', 90000, 140000, 'monthly', 'Indiranagar', 'Bangalore', '10:00 AM - 7:00 PM (Flexible)', 
   '["4+ years mobile app development experience in React Native or Flutter", "Published at least 3 production applications on Google Play Store and Apple App Store", "Deep understanding of mobile security and native bridging"]', 1, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('job_06', 'emp_06', 'Senior Technical Recruiter & HR Operations Partner', 
   'Drive tech talent sourcing, screening, and closing across software engineering, AI, DevOps, and executive positions. Partner with hiring managers to optimize interview loops and employee experience.', 
   'Talent & Operations', 55000, 80000, 'monthly', 'Hinjewadi Tech Hub', 'Pune', '9:30 AM - 6:30 PM (Onsite)', 
   '["4+ years technical recruiting experience in high-growth tech or product startups", "Strong network in software engineering and cloud infrastructure talent", "Expertise in ATS systems (Greenhouse, Lever) and salary benchmarking"]', 2, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Ensure Verified Technical Candidate Profiles Exist
INSERT OR REPLACE INTO users (id, email, phone, role, is_blocked, is_verified, created_at, updated_at)
VALUES
  ('usr_cand_01', 'ankit.verma.tech@gmail.com', '+919988776655', 'worker', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_cand_02', 'sneha.kulkarni.hr@gmail.com', '+919766554433', 'worker', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_cand_03', 'karthik.iyer.cloud@gmail.com', '+919122334412', 'worker', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_cand_04', 'pooja.nair.qa@gmail.com', '+919845012345', 'worker', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_cand_05', 'rohan.sharma.dev@gmail.com', '+919849123434', 'worker', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('usr_cand_06', 'aditya.rao.mobile@gmail.com', '+919900112233', 'worker', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR REPLACE INTO worker_profiles (
  id, user_id, full_name, trade_title, photo_key, photo_thumb, phone, skills, experience_years, 
  education_level, education_institute, education_year, education_specialization, 
  past_company, experience_description, preferred_area, city, expected_salary_min, expected_salary_max, 
  salary_period, verification_status, digilocker_verified, created_at, updated_at
)
VALUES
  ('cand_01', 'usr_cand_01', 'Ankit Verma', 'Technical Team Leader & System Architect', '', 'assets/trades/teamlead.jpg', '+91 9988776655',
   '["System Design", "Microservices", "Agile / Scrum", "Java", "Kubernetes", "AWS"]', 6.5,
   'M.Tech', 'IIT Hyderabad', 2019, 'Computer Science',
   'NextWave AI & Automation Labs', '6.5+ years architecting distributed backend platforms and managing cross-functional development squads.',
   'Financial District / Gachibowli', 'Hyderabad', 120000, 180000, 'monthly', 'verified', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('cand_02', 'usr_cand_02', 'Sneha Kulkarni', 'Senior Technical Recruiter & HR Operations Partner', '', 'assets/trades/hr.jpg', '+91 9766554433',
   '["Tech Talent Sourcing", "ATS / Greenhouse", "Salary Benchmarking", "HR Operations", "Leadership Hiring"]', 5.0,
   'MBA', 'Symbiosis Institute of Business Management', 2021, 'Human Resource Management',
   'TalentSprint Systems', '5+ years driving end-to-end technical hiring for high-growth tech companies and specialized software roles.',
   'Hinjewadi Tech Hub', 'Pune', 60000, 85000, 'monthly', 'verified', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('cand_03', 'usr_cand_03', 'Karthik Iyer', 'Cloud & DevOps Infrastructure Engineer', '', 'assets/trades/devops.jpg', '+91 9122334412',
   '["Kubernetes (EKS)", "Terraform", "Docker", "AWS", "CI/CD", "Prometheus & Grafana"]', 5.0,
   'B.Tech', 'NIT Warangal', 2021, 'Information Technology',
   'CloudScale Networks', '5+ years building immutable cloud infrastructure, automated CI/CD pipelines, and high-availability container clusters.',
   'Hitec City', 'Hyderabad', 85000, 140000, 'monthly', 'verified', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('cand_04', 'usr_cand_04', 'Pooja Nair', 'SDET & QA Automation Lead', '', 'assets/trades/qa.jpg', '+91 9845012345',
   '["Playwright", "Cypress", "Selenium", "API Testing", "CI/CD", "k6 Load Testing"]', 4.0,
   'B.E', 'RV College of Engineering', 2022, 'Computer Science',
   'FinEdge Fintech Solutions', '4+ years designing robust automated testing frameworks for high-frequency banking APIs and web applications.',
   'Bellandur / Koramangala', 'Bangalore', 70000, 100000, 'monthly', 'verified', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('cand_05', 'usr_cand_05', 'Rohan Sharma', 'Senior Full-Stack Engineer', '', 'assets/trades/software.jpg', '+91 9849123434',
   '["React.js", "Node.js", "TypeScript", "PostgreSQL", "Cloudflare Workers", "Next.js"]', 4.5,
   'B.Tech', 'JNTU College of Engineering', 2022, 'Computer Science & Engineering',
   'HyperScale Cloud Systems', '4.5+ years building full-stack web platforms, serverless microservices, and high-performance databases.',
   'Hitec City / Madhapur', 'Hyderabad', 85000, 130000, 'monthly', 'verified', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('cand_06', 'usr_cand_06', 'Aditya Rao', 'Lead Mobile App Developer (iOS & Android)', '', 'assets/trades/mobile.jpg', '+91 9900112233',
   '["React Native", "Flutter", "Swift", "Kotlin", "Mobile Architecture", "Offline First"]', 5.5,
   'B.Tech', 'PES University', 2020, 'Information Science',
   'AppSphere Technologies', '5.5+ years developing native and cross-platform mobile apps for millions of daily active users.',
   'Indiranagar / Whitefield', 'Bangalore', 95000, 145000, 'monthly', 'verified', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Update any existing worker profile for nithin to have proper title and details
UPDATE worker_profiles 
SET trade_title = 'Backend Developer', 
    city = 'Hyderabad', 
    skills = '["Node.js", "Express", "TypeScript", "PostgreSQL", "REST APIs", "Cloudflare Workers"]',
    experience_years = 2.0,
    verification_status = 'verified',
    digilocker_verified = 1
WHERE full_name LIKE '%nithin%' OR user_id IN (SELECT id FROM users WHERE email LIKE '%nithin%' OR email LIKE '%white018899%');
