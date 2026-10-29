/**
 * JobConnect Master Job Titles & Technical Skills Knowledge Base
 * Centralized, expansive industry-standard library for titles, skills, disciplines,
 * instant search autocomplete, and filter synchronization.
 */

(function (window) {
  'use strict';

  // =========================================================================
  // 1. EXTENSIVE MASTER JOB TITLES LIBRARY (160+ Standardized Roles)
  // =========================================================================
  const JOB_TITLES_LIBRARY = [
    // --- Software & Web Engineering (Full-Stack, Frontend, Backend) ---
    { title: "Full-Stack Developer", category: "Software Engineering", aliases: ["fullstack", "full stack", "full stack engineer", "fullstack developer", "mern developer", "mean developer", "web developer", "software engineer", "full-stack"] },
    { title: "Senior Full-Stack Engineer", category: "Software Engineering", aliases: ["senior full stack", "sr fullstack", "lead fullstack developer", "senior software engineer"] },
    { title: "Frontend Developer", category: "Software Engineering", aliases: ["frontend", "front-end", "ui developer", "front end engineer", "web developer", "client engineer"] },
    { title: "Senior Frontend Engineer", category: "Software Engineering", aliases: ["sr frontend", "lead frontend", "staff frontend engineer", "principal frontend"] },
    { title: "Backend Developer", category: "Software Engineering", aliases: ["backend", "back-end", "server engineer", "api developer", "backend engineer", "core engineer"] },
    { title: "Senior Backend Engineer", category: "Software Engineering", aliases: ["sr backend", "lead backend developer", "principal backend engineer"] },
    { title: "React & Next.js Developer", category: "Software Engineering", aliases: ["react", "nextjs", "next.js", "react developer", "next developer", "reactjs engineer", "react front end"] },
    { title: "Vue.js & Nuxt Developer", category: "Software Engineering", aliases: ["vue", "vuejs", "nuxt", "nuxtjs", "vue developer", "vue 3"] },
    { title: "Angular Developer", category: "Software Engineering", aliases: ["angular", "angularjs", "ng developer", "angular engineer", "angular 17"] },
    { title: "Svelte & SvelteKit Developer", category: "Software Engineering", aliases: ["svelte", "sveltekit", "svelte developer", "sveltekit engineer"] },
    { title: "Node.js Backend Engineer", category: "Software Engineering", aliases: ["node", "nodejs", "express", "fastify", "node developer", "server-side javascript", "node api"] },
    { title: "NestJS Backend Developer", category: "Software Engineering", aliases: ["nestjs", "nest", "typescript backend", "enterprise node", "nest.js"] },
    { title: "Python / Django Developer", category: "Software Engineering", aliases: ["python", "django", "drf", "python developer", "python backend", "django developer"] },
    { title: "FastAPI / Python Engineer", category: "Software Engineering", aliases: ["fastapi", "python async", "async api", "python microservices"] },
    { title: "Java / Spring Boot Engineer", category: "Software Engineering", aliases: ["java", "spring boot", "spring", "enterprise java", "java developer", "jvm engineer", "core java"] },
    { title: "Senior Java Architect", category: "Software Engineering", aliases: ["java architect", "enterprise java architect", "spring cloud architect"] },
    { title: "Golang Backend Engineer", category: "Software Engineering", aliases: ["go", "golang", "go developer", "golang engineer", "microservices go", "go backend"] },
    { title: "C# / .NET Core Developer", category: "Software Engineering", aliases: ["c#", ".net", "dotnet", "asp.net", "dotnet core", "csharp developer", ".net developer"] },
    { title: "PHP & Laravel Developer", category: "Software Engineering", aliases: ["php", "laravel", "full stack php", "artisan", "php developer", "symfony"] },
    { title: "Ruby on Rails Developer", category: "Software Engineering", aliases: ["ruby", "rails", "ror", "ruby on rails", "ruby developer"] },
    { title: "Rust Systems Engineer", category: "Software Engineering", aliases: ["rust", "rustlang", "systems programmer", "high performance engineer", "low latency rust"] },
    { title: "C++ Systems Engineer", category: "Software Engineering", aliases: ["c++", "cpp", "c/c++", "low level", "systems software", "high performance c++"] },
    { title: "C++ Game Developer", category: "Software Engineering", aliases: ["game developer", "unreal engine", "game programmer", "game engine engineer"] },
    { title: "Unity 3D / C# Developer", category: "Software Engineering", aliases: ["unity", "unity developer", "c# unity", "game developer", "ar/vr developer"] },
    { title: "Blockchain & Smart Contract Developer", category: "Software Engineering", aliases: ["blockchain", "solidity", "web3", "smart contracts", "ethereum", "crypto engineer"] },
    { title: "Quantitative Developer (Quant)", category: "Software Engineering", aliases: ["quant", "algorithmic trading", "hft", "fintech developer", "low latency trading"] },
    { title: "Elixir / Phoenix Developer", category: "Software Engineering", aliases: ["elixir", "phoenix", "functional programming", "erlang"] },
    { title: "Scala / Functional Engineer", category: "Software Engineering", aliases: ["scala", "akka", "play framework", "functional backend"] },
    { title: "Senior Software Architect", category: "Software Engineering", aliases: ["software architect", "system architect", "solutions architect", "principal engineer", "lead architect"] },
    { title: "Staff Software Engineer", category: "Software Engineering", aliases: ["staff engineer", "principal software engineer", "lead engineer"] },
    { title: "Principal Software Engineer", category: "Software Engineering", aliases: ["principal engineer", "chief engineer", "architect"] },
    { title: "API & Microservices Architect", category: "Software Engineering", aliases: ["api", "microservices", "rest", "graphql", "grpc", "integration engineer"] },
    { title: "GraphQL API Engineer", category: "Software Engineering", aliases: ["graphql", "apollo", "relay", "schema designer"] },
    { title: "WordPress & CMS Developer", category: "Software Engineering", aliases: ["wordpress", "cms", "woocommerce", "elementor", "php wordpress"] },
    { title: "Shopify / Liquid Theme Developer", category: "Software Engineering", aliases: ["shopify", "liquid", "ecommerce developer", "headless shopify"] },
    { title: "Webflow & No-Code Developer", category: "Software Engineering", aliases: ["webflow", "no-code", "low-code", "framer"] },
    { title: "Web Accessibility (a11y) Specialist", category: "Software Engineering", aliases: ["accessibility", "a11y", "wcag", "aria"] },

    // --- DevOps, Cloud Infrastructure & Systems ---
    { title: "DevOps Engineer", category: "DevOps & Cloud", aliases: ["devops", "ci/cd", "automation", "infrastructure engineer", "devops specialist", "build engineer"] },
    { title: "Senior DevOps Architect", category: "DevOps & Cloud", aliases: ["sr devops", "lead devops", "principal devops", "devops lead"] },
    { title: "Site Reliability Engineer (SRE)", category: "DevOps & Cloud", aliases: ["sre", "reliability engineer", "production engineer", "systems reliability"] },
    { title: "Lead SRE / Reliability Manager", category: "DevOps & Cloud", aliases: ["sre lead", "reliability manager", "infrastructure lead"] },
    { title: "Cloud Solutions Architect", category: "DevOps & Cloud", aliases: ["cloud architect", "aws architect", "azure architect", "gcp architect", "enterprise cloud"] },
    { title: "AWS Cloud Infrastructure Engineer", category: "DevOps & Cloud", aliases: ["aws", "amazon web services", "cloud engineer", "terraform", "iac", "aws engineer"] },
    { title: "Azure Cloud Specialist", category: "DevOps & Cloud", aliases: ["azure", "microsoft azure", "azure devops", "azure architect", "azure engineer"] },
    { title: "Google Cloud (GCP) Engineer", category: "DevOps & Cloud", aliases: ["gcp", "google cloud platform", "gke", "cloud run", "gcp architect"] },
    { title: "Kubernetes & Platform Engineer", category: "DevOps & Cloud", aliases: ["kubernetes", "k8s", "docker", "platform engineer", "container specialist", "helm", "c trace"] },
    { title: "Infrastructure as Code (IaC) Engineer", category: "DevOps & Cloud", aliases: ["terraform", "terragrunt", "ansible", "iac", "cloudformation", "pulumi"] },
    { title: "Linux Systems Administrator", category: "DevOps & Cloud", aliases: ["linux", "sysadmin", "system administrator", "ubuntu", "rhel", "centos", "debian"] },
    { title: "Windows Server Administrator", category: "DevOps & Cloud", aliases: ["windows admin", "active directory", "hyper-v", "powershell admin"] },
    { title: "Build & Release Engineer", category: "DevOps & Cloud", aliases: ["release engineer", "build engineer", "ci/cd pipelines", "gitops"] },
    { title: "Database Administrator (DBA)", category: "DevOps & Cloud", aliases: ["dba", "database admin", "postgres dba", "mysql dba", "oracle dba", "sql server dba"] },
    { title: "Network Operations Engineer (NOC)", category: "DevOps & Cloud", aliases: ["noc", "network engineer", "routing", "switching", "dns", "bgp"] },
    { title: "FinOps / Cloud Cost Engineer", category: "DevOps & Cloud", aliases: ["finops", "cloud cost", "aws cost optimization", "cloud economics"] },

    // --- Quality Assurance & Automation Testing ---
    { title: "QA Automation Engineer", category: "QA & Testing", aliases: ["qa automation", "automation tester", "selenium", "playwright", "cypress", "test engineer", "automation engineer"] },
    { title: "Senior Automation Test Lead", category: "QA & Testing", aliases: ["sr qa", "lead qa", "test automation architect", "qa lead"] },
    { title: "SDET (Software Development Engineer in Test)", category: "QA & Testing", aliases: ["sdet", "test developer", "qa developer", "automation framework architect", "sdet 2"] },
    { title: "Staff SDET / Test Architect", category: "QA & Testing", aliases: ["test architect", "principal sdet", "qa architect", "quality architect"] },
    { title: "Performance & Load Test Engineer", category: "QA & Testing", aliases: ["performance tester", "load testing", "jmeter", "k6", "stress testing", "loadrunner"] },
    { title: "Manual QA Tester & Quality Analyst", category: "QA & Testing", aliases: ["manual tester", "qa analyst", "functional testing", "test cases", "uat", "qa engineer"] },
    { title: "Mobile QA Engineer (iOS / Android)", category: "QA & Testing", aliases: ["appium", "mobile tester", "ios testing", "android testing", "mobile automation"] },
    { title: "API Test Automation Specialist", category: "QA & Testing", aliases: ["api testing", "postman", "rest assured", "karate", "newman", "api qa"] },
    { title: "Security QA & Penetration Tester", category: "QA & Testing", aliases: ["security tester", "pentester", "vapt", "ethical hacker", "appsec tester"] },
    { title: "QA Lead / Test Manager", category: "QA & Testing", aliases: ["qa lead", "test lead", "test manager", "quality manager", "head of qa"] },
    { title: "Director of Quality Engineering", category: "QA & Testing", aliases: ["qa director", "director qa", "vp quality", "head of testing"] },

    // --- Mobile Application Development ---
    { title: "Mobile Application Developer", category: "Mobile Development", aliases: ["mobile developer", "app developer", "cross platform mobile", "native mobile"] },
    { title: "React Native Developer", category: "Mobile Development", aliases: ["react native", "rn developer", "expo", "hybrid mobile", "react native engineer"] },
    { title: "Senior React Native Architect", category: "Mobile Development", aliases: ["sr react native", "react native lead", "cross platform lead"] },
    { title: "Flutter & Dart Developer", category: "Mobile Development", aliases: ["flutter", "dart", "flutter developer", "cross platform", "flutter engineer"] },
    { title: "iOS Developer (Swift / SwiftUI)", category: "Mobile Development", aliases: ["ios", "swift", "swiftui", "apple developer", "iphone app", "xcode", "ios engineer"] },
    { title: "Senior iOS Engineer", category: "Mobile Development", aliases: ["sr ios", "lead ios", "staff ios engineer", "ios architect"] },
    { title: "Android Developer (Kotlin / Jetpack)", category: "Mobile Development", aliases: ["android", "kotlin", "jetpack compose", "android studio", "android engineer"] },
    { title: "Senior Android Engineer", category: "Mobile Development", aliases: ["sr android", "lead android", "staff android engineer", "android architect"] },
    { title: "Kotlin Multiplatform (KMP) Developer", category: "Mobile Development", aliases: ["kmp", "kmm", "kotlin multiplatform", "cross platform kotlin"] },
    { title: "Mobile Solutions Architect", category: "Mobile Development", aliases: ["mobile architect", "enterprise mobile", "app performance", "head of mobile"] },

    // --- AI, Machine Learning & Data Science ---
    { title: "AI / Machine Learning Engineer", category: "Data & AI", aliases: ["ai", "ml", "machine learning", "deep learning", "pytorch", "tensorflow", "ml engineer"] },
    { title: "Senior Machine Learning Engineer", category: "Data & AI", aliases: ["sr ml", "senior mle", "lead ai engineer", "staff ml engineer"] },
    { title: "LLM & Generative AI Engineer", category: "Data & AI", aliases: ["genai", "prompt engineer", "langchain", "llm developer", "rag", "llama", "chatgpt", "fine tuning"] },
    { title: "Prompt Engineer & AI Specialist", category: "Data & AI", aliases: ["prompt engineer", "prompt designer", "llm prompt engineer"] },
    { title: "Data Scientist", category: "Data & AI", aliases: ["data science", "statistical modeling", "predictive analytics", "machine learning researcher"] },
    { title: "Senior Data Scientist", category: "Data & AI", aliases: ["sr data scientist", "lead data scientist", "principal data scientist"] },
    { title: "MLOps Engineer", category: "Data & AI", aliases: ["mlops", "model deployment", "ai infrastructure", "model monitoring", "mlflow", "kubeflow"] },
    { title: "Computer Vision Specialist", category: "Data & AI", aliases: ["computer vision", "opencv", "image processing", "yolo", "object detection", "cv engineer"] },
    { title: "NLP & Conversational AI Engineer", category: "Data & AI", aliases: ["nlp", "natural language processing", "text processing", "chatbots", "bert", "hugging face"] },
    { title: "AI Research Scientist", category: "Data & AI", aliases: ["research scientist", "ai research", "deep learning researcher", "phd ai"] },

    // --- Big Data & Data Engineering ---
    { title: "Data Engineer", category: "Data & AI", aliases: ["data pipeline", "etl", "big data", "spark", "hadoop", "airflow", "data warehousing", "data engineer"] },
    { title: "Senior Data Engineer", category: "Data & AI", aliases: ["sr data engineer", "lead data engineer", "staff data engineer"] },
    { title: "Data Architect", category: "Data & AI", aliases: ["data architect", "enterprise data", "lakehouse", "snowflake architect", "databricks architect"] },
    { title: "Analytics Engineer", category: "Data & AI", aliases: ["analytics engineer", "dbt", "data modeling", "bi modeling", "dbt developer"] },
    { title: "Big Data Spark / Hadoop Engineer", category: "Data & AI", aliases: ["spark developer", "hadoop", "pyspark", "kafka streaming", "big data engineer"] },
    { title: "Snowflake & Databricks Specialist", category: "Data & AI", aliases: ["snowflake", "databricks", "lakehouse engineer", "delta lake"] },
    { title: "Business Intelligence (BI) Analyst", category: "Data & AI", aliases: ["bi analyst", "tableau", "power bi", "sql analyst", "data reporting", "looker", "bi developer"] },
    { title: "Data Analyst", category: "Data & AI", aliases: ["data analyst", "business analyst", "sql analyst", "excel modeling", "product analyst"] },

    // --- Cybersecurity & Information Security ---
    { title: "Cybersecurity Analyst", category: "Cybersecurity", aliases: ["infosec", "soc analyst", "security analyst", "incident response", "blue team", "cyber analyst"] },
    { title: "Senior Security Engineer", category: "Cybersecurity", aliases: ["security engineer", "sr infosec", "security architect", "cybersecurity specialist"] },
    { title: "Penetration Tester / Ethical Hacker", category: "Cybersecurity", aliases: ["pentester", "ethical hacker", "red team", "vapt", "offensive security", "oscp"] },
    { title: "Cloud Security Specialist", category: "Cybersecurity", aliases: ["cloud security", "devsecops", "iam security", "compliance", "aws security", "azure security"] },
    { title: "DevSecOps Engineer", category: "Cybersecurity", aliases: ["devsecops", "security automation", "sast", "dast", "container security", "shift left security"] },
    { title: "SOC Analyst (Tier 1 / Tier 2)", category: "Cybersecurity", aliases: ["soc", "siem", "splunk", "security operations center", "incident response analyst"] },
    { title: "Network Security Engineer", category: "Cybersecurity", aliases: ["network security", "firewall", "vpn", "palo alto", "cisco security", "fortinet"] },
    { title: "IAM & Identity Specialist", category: "Cybersecurity", aliases: ["iam", "identity access management", "okta", "active directory", "keycloak", "sailpoint"] },
    { title: "Governance, Risk & Compliance (GRC) Analyst", category: "Cybersecurity", aliases: ["grc", "iso 27001", "soc 2", "compliance analyst", "it auditor", "gdpr"] },
    { title: "Chief Information Security Officer (CISO)", category: "Cybersecurity", aliases: ["ciso", "security director", "head of security", "vp cybersecurity"] },

    // --- Product Management & Business Analysis ---
    { title: "Product Manager (Technical)", category: "Product & Design", aliases: ["pm", "product manager", "technical product manager", "tpm", "product lead"] },
    { title: "Senior Product Manager", category: "Product & Design", aliases: ["sr product manager", "lead pm", "group product manager", "gpm"] },
    { title: "Associate Product Manager (APM)", category: "Product & Design", aliases: ["apm", "junior product manager", "product owner"] },
    { title: "Product Owner", category: "Product & Design", aliases: ["po", "product owner", "scrum product owner", "user stories", "backlog owner"] },
    { title: "IT Project Manager (PMP)", category: "Product & Design", aliases: ["project manager", "pmp", "it project manager", "technical project manager", "project lead"] },
    { title: "Business Analyst (IT & Systems)", category: "Product & Design", aliases: ["business analyst", "ba", "requirements analyst", "systems analyst", "technical ba"] },
    { title: "Vice President of Product (VP Product)", category: "Product & Design", aliases: ["vp product", "head of product", "chief product officer", "cpo"] },

    // --- UI/UX & Product Design ---
    { title: "UI/UX Designer", category: "Product & Design", aliases: ["ui designer", "ux designer", "ui/ux", "product designer", "figma designer", "web designer"] },
    { title: "Senior Product Designer", category: "Product & Design", aliases: ["lead product designer", "sr ux designer", "staff designer", "principal designer"] },
    { title: "Visual & Graphic Designer", category: "Product & Design", aliases: ["graphic designer", "visual designer", "branding", "brand designer", "marketing designer"] },
    { title: "UX Researcher", category: "Product & Design", aliases: ["ux researcher", "user research", "usability testing", "interviews", "user researcher"] },
    { title: "Design System Lead / Architect", category: "Product & Design", aliases: ["design system", "ui component architect", "token designer", "figma lead"] },
    { title: "Interaction & Motion Designer", category: "Product & Design", aliases: ["motion designer", "interaction designer", "after effects", "lottie", "framer"] },
    { title: "Head of Design / Creative Director", category: "Product & Design", aliases: ["design lead", "creative director", "head of ui/ux", "vp design"] },

    // --- Systems, Embedded & Hardware Engineering ---
    { title: "Embedded Systems Engineer", category: "Systems & Hardware", aliases: ["embedded", "embedded c", "microcontroller", "firmware", "iot", "bare metal"] },
    { title: "Senior Firmware Engineer", category: "Systems & Hardware", aliases: ["firmware", "rtos", "bsp", "bootloader", "device driver", "lead firmware"] },
    { title: "IoT Solutions Developer", category: "Systems & Hardware", aliases: ["iot", "internet of things", "smart devices", "mqtt", "esp32", "iot engineer"] },
    { title: "Robotics Software Engineer", category: "Systems & Hardware", aliases: ["robotics", "ros", "ros2", "motion planning", "slam", "autonomous systems"] },
    { title: "Hardware & PCB Design Engineer", category: "Systems & Hardware", aliases: ["electronics", "circuit design", "pcb", "hardware engineer", "kicad", "altium"] },
    { title: "FPGA / ASIC Design Engineer", category: "Systems & Hardware", aliases: ["fpga", "verilog", "vhdl", "asic", "semiconductor", "digital design"] },

    // --- IT Support, Enterprise Systems & ERP ---
    { title: "IT Support Specialist", category: "IT & Systems", aliases: ["it support", "helpdesk", "desktop support", "technical support", "service desk", "tier 2 support"] },
    { title: "IT Operations Manager", category: "IT & Systems", aliases: ["it manager", "it director", "head of it", "infrastructure manager"] },
    { title: "Salesforce Developer & Admin", category: "IT & Systems", aliases: ["salesforce", "sfdc", "apex", "lwc", "salesforce admin", "lightning"] },
    { title: "Salesforce Solutions Architect", category: "IT & Systems", aliases: ["salesforce architect", "sfdc architect", "enterprise salesforce"] },
    { title: "SAP / ERP Technical Consultant", category: "IT & Systems", aliases: ["sap", "abap", "erp", "hana", "sap consultant", "sap fico", "sap mm"] },
    { title: "ServiceNow Developer & Admin", category: "IT & Systems", aliases: ["servicenow", "itsm", "now platform", "workflow automation", "csm"] },
    { title: "Workday / HRIS Technical Analyst", category: "IT & Systems", aliases: ["workday", "hris", "workday integrations", "hcm"] },

    // --- Engineering Leadership, People & Operations ---
    { title: "Engineering Manager", category: "Team Leadership", aliases: ["engineering lead", "em", "director of engineering", "vp engineering", "software manager"] },
    { title: "Technical Team Lead", category: "Team Leadership", aliases: ["tech lead", "team lead", "lead engineer", "scrum lead", "development lead"] },
    { title: "Director of Engineering", category: "Team Leadership", aliases: ["engineering director", "head of engineering", "vp software"] },
    { title: "Chief Technology Officer (CTO)", category: "Team Leadership", aliases: ["cto", "chief technology officer", "vp technology", "founder cto"] },
    { title: "Scrum Master / Agile Delivery Lead", category: "Team Leadership", aliases: ["scrum master", "agile coach", "delivery manager", "release train engineer"] },
    { title: "Technical Recruiter / Talent Acquisition", category: "Talent & Operations", aliases: ["technical recruiter", "tech recruiter", "talent acquisition", "it recruiter", "sourcer"] },
    { title: "Human Resources (HR) Generalist", category: "Talent & Operations", aliases: ["hr", "hr generalist", "people operations", "human resources", "talent manager", "hr business partner"] },
    { title: "Technical Writer & Documentation Lead", category: "Talent & Operations", aliases: ["technical writer", "tech writer", "api documentation", "docs engineer", "information developer"] },
    { title: "Developer Relations (DevRel) / Advocate", category: "Talent & Operations", aliases: ["devrel", "developer advocate", "developer relations", "tech evangelist"] },

    // =========================================================================
    // NON-TECHNICAL & INDUSTRY-WIDE MASTER ROLES
    // =========================================================================

    // --- Sales, Retail & Business Development ---
    { title: "Sales Executive", category: "Sales, Retail & Business Development", aliases: ["sales", "field sales", "sales officer", "sales rep", "b2c sales", "sales executive"] },
    { title: "Business Development Manager (BDM)", category: "Sales, Retail & Business Development", aliases: ["bdm", "business development", "b2b sales", "bd manager", "sales lead"] },
    { title: "Retail Store Manager", category: "Sales, Retail & Business Development", aliases: ["store manager", "shop manager", "outlet manager", "retail manager"] },
    { title: "Retail Sales Associate / Cashier", category: "Sales, Retail & Business Development", aliases: ["cashier", "store assistant", "retail sales", "counter sales", "billing executive"] },
    { title: "Tele-Sales & Inside Sales Executive", category: "Sales, Retail & Business Development", aliases: ["telesales", "inside sales", "telemarketing", "outbound sales", "calling executive"] },
    { title: "Corporate Account Executive (B2B)", category: "Sales, Retail & Business Development", aliases: ["account executive", "client relationship executive", "enterprise sales", "key account"] },
    { title: "Area Sales Manager", category: "Sales, Retail & Business Development", aliases: ["asm", "regional sales", "territory sales manager", "zonal sales"] },

    // --- Finance, Banking & Accounting ---
    { title: "Chartered Accountant (CA)", category: "Finance, Banking & Accounting", aliases: ["ca", "chartered accountant", "senior auditor", "finance controller"] },
    { title: "Senior Accountant", category: "Finance, Banking & Accounting", aliases: ["accountant", "sr accountant", "chief accountant", "tally accountant", "bookkeeper"] },
    { title: "Accounts Executive / Junior Accountant", category: "Finance, Banking & Accounting", aliases: ["accounts executive", "junior accountant", "tally operator", "ap/ar accountant"] },
    { title: "Financial Analyst", category: "Finance, Banking & Accounting", aliases: ["finance analyst", "financial modeling", "investment analyst", "equity analyst"] },
    { title: "Bank Branch Officer / Executive", category: "Finance, Banking & Accounting", aliases: ["bank officer", "banking executive", "branch clerk", "bank clerk"] },
    { title: "Tax & GST Consultant", category: "Finance, Banking & Accounting", aliases: ["gst consultant", "tax consultant", "tax practitioner", "income tax advisor"] },
    { title: "Internal Auditor", category: "Finance, Banking & Accounting", aliases: ["auditor", "internal audit", "statutory auditor", "financial auditor"] },

    // --- Marketing, Advertising & Content ---
    { title: "Digital Marketing Specialist", category: "Marketing, Advertising & Content", aliases: ["digital marketer", "digital marketing executive", "performance marketer", "growth hacker"] },
    { title: "SEO Specialist / Strategist", category: "Marketing, Advertising & Content", aliases: ["seo", "seo executive", "search engine optimizer", "seo analyst"] },
    { title: "Social Media Manager", category: "Marketing, Advertising & Content", aliases: ["social media", "smm", "social media executive", "community manager"] },
    { title: "Content Writer & Copywriter", category: "Marketing, Advertising & Content", aliases: ["content writer", "copywriter", "blog writer", "creative writer", "content strategist"] },
    { title: "Performance Marketing / PPC Lead", category: "Marketing, Advertising & Content", aliases: ["ppc specialist", "google ads specialist", "meta ads", "media buyer"] },
    { title: "Brand & Creative Designer", category: "Marketing, Advertising & Content", aliases: ["brand designer", "marketing designer", "creative lead", "ad designer"] },

    // --- Customer Support, BPO & Telecalling ---
    { title: "Customer Support Executive", category: "Customer Support, BPO & Telecalling", aliases: ["customer support", "customer care", "customer service rep", "csr", "support executive"] },
    { title: "International Voice Process Associate", category: "Customer Support, BPO & Telecalling", aliases: ["bpo voice", "voice associate", "call center agent", "international call center"] },
    { title: "Chat & Email Support Specialist", category: "Customer Support, BPO & Telecalling", aliases: ["chat support", "email support", "non-voice bpo", "ticket specialist"] },
    { title: "Customer Success Manager", category: "Customer Support, BPO & Telecalling", aliases: ["csm", "customer success", "client success", "account manager support"] },
    { title: "Call Center Team Leader", category: "Customer Support, BPO & Telecalling", aliases: ["team lead bpo", "call center supervisor", "support lead", "floor manager"] },

    // --- Healthcare, Nursing & Pharmacy ---
    { title: "General Physician / Medical Officer", category: "Healthcare, Nursing & Pharmacy", aliases: ["doctor", "mbbs", "general physician", "medical officer", "resident doctor"] },
    { title: "Registered Staff Nurse", category: "Healthcare, Nursing & Pharmacy", aliases: ["nurse", "staff nurse", "icu nurse", "clinical nurse", "gnm", "bsc nursing"] },
    { title: "Hospital / Retail Pharmacist", category: "Healthcare, Nursing & Pharmacy", aliases: ["pharmacist", "chemist", "b.pharm", "d.pharm", "pharmacy technician"] },
    { title: "Medical Laboratory Technician (MLT)", category: "Healthcare, Nursing & Pharmacy", aliases: ["lab technician", "mlt", "pathology technician", "diagnostic technician"] },
    { title: "Physiotherapist", category: "Healthcare, Nursing & Pharmacy", aliases: ["physio", "bpt", "physical therapist", "rehab specialist"] },
    { title: "Dental Surgeon / Dentist", category: "Healthcare, Nursing & Pharmacy", aliases: ["dentist", "bds", "dental surgeon", "orthodontist"] },
    { title: "Patient Care Assistant / Ward Boy", category: "Healthcare, Nursing & Pharmacy", aliases: ["ward boy", "nursing assistant", "patient care", "hospital attendant", "ayush helper"] },

    // --- Education, Teaching & Training ---
    { title: "High School Teacher", category: "Education, Teaching & Training", aliases: ["teacher", "school teacher", "pgt", "tgt", "b.ed teacher", "science teacher", "math teacher"] },
    { title: "College Lecturer / Professor", category: "Education, Teaching & Training", aliases: ["lecturer", "assistant professor", "professor", "faculty", "college teacher"] },
    { title: "Primary School Teacher (PRT)", category: "Education, Teaching & Training", aliases: ["primary teacher", "prt", "elementary teacher", "kindergarten teacher"] },
    { title: "Private Tutor / Subject Coach", category: "Education, Teaching & Training", aliases: ["tutor", "tuition teacher", "coaching instructor", "home tutor"] },
    { title: "Academic Counselor & Admissions Officer", category: "Education, Teaching & Training", aliases: ["academic counselor", "admissions counselor", "education counselor", "student advisor"] },
    { title: "Corporate / Soft Skills Trainer", category: "Education, Teaching & Training", aliases: ["soft skills trainer", "corporate trainer", "voice and accent trainer", "training manager"] },

    // --- Hospitality, Hotel & Food Service ---
    { title: "Head Chef / Executive Chef", category: "Hospitality, Hotel & Food Service", aliases: ["chef", "head chef", "master chef", "executive chef", "sous chef"] },
    { title: "Commercial Cook / Line Cook", category: "Hospitality, Hotel & Food Service", aliases: ["cook", "restaurant cook", "fast food cook", "line cook", "kitchen cook"] },
    { title: "Restaurant / Hotel Operations Manager", category: "Hospitality, Hotel & Food Service", aliases: ["hotel manager", "restaurant manager", "hospitality manager", "general manager hotel"] },
    { title: "Food & Beverage (F&B) Steward / Waiter", category: "Hospitality, Hotel & Food Service", aliases: ["waiter", "steward", "f&b associate", "server", "captain"] },
    { title: "Front Desk Receptionist (Hotel)", category: "Hospitality, Hotel & Food Service", aliases: ["front desk receptionist", "hotel receptionist", "front office executive", "guest service associate"] },
    { title: "Barista & Beverage Specialist", category: "Hospitality, Hotel & Food Service", aliases: ["barista", "cafe manager", "coffee maker", "bartender"] },
    { title: "Housekeeping Supervisor / Attendant", category: "Hospitality, Hotel & Food Service", aliases: ["housekeeping", "room attendant", "housekeeper", "facility cleaning supervisor"] },

    // --- Logistics, Supply Chain & Delivery ---
    { title: "Delivery Partner / Courier Rider", category: "Logistics, Supply Chain & Delivery", aliases: ["delivery boy", "delivery partner", "courier delivery", "bike rider", "last mile delivery"] },
    { title: "Warehouse Operations Supervisor", category: "Logistics, Supply Chain & Delivery", aliases: ["warehouse supervisor", "warehouse incharge", "store keeper", "inventory supervisor"] },
    { title: "Supply Chain & Procurement Executive", category: "Logistics, Supply Chain & Delivery", aliases: ["supply chain", "procurement officer", "purchase executive", "vendor manager"] },
    { title: "Logistics & Dispatch Coordinator", category: "Logistics, Supply Chain & Delivery", aliases: ["logistics coordinator", "dispatch incharge", "shipping coordinator", "transport coordinator"] },
    { title: "Commercial Heavy Vehicle / Fleet Driver", category: "Logistics, Supply Chain & Delivery", aliases: ["driver", "truck driver", "commercial driver", "fleet driver", "heavy vehicle driver"] },

    // --- Construction, Architecture & Real Estate ---
    { title: "Civil Site Engineer", category: "Construction, Architecture & Real Estate", aliases: ["civil engineer", "site engineer", "construction engineer", "b.tech civil"] },
    { title: "Construction Site Supervisor", category: "Construction, Architecture & Real Estate", aliases: ["site supervisor", "construction supervisor", "building supervisor"] },
    { title: "Architect & Spatial Designer", category: "Construction, Architecture & Real Estate", aliases: ["architect", "b.arch", "building designer", "landscape architect"] },
    { title: "Interior Designer & Decorator", category: "Construction, Architecture & Real Estate", aliases: ["interior designer", "interior decorator", "3d visualizer interior"] },
    { title: "Real Estate Property Consultant", category: "Construction, Architecture & Real Estate", aliases: ["real estate agent", "property advisor", "property dealer", "realtor"] },
    { title: "Quantity Surveyor & Cost Estimator", category: "Construction, Architecture & Real Estate", aliases: ["quantity surveyor", "estimator", "boq engineer", "billing civil engineer"] },

    // --- Manufacturing, Mechanical & Production ---
    { title: "Mechanical Design Engineer", category: "Manufacturing, Mechanical & Production", aliases: ["mechanical engineer", "cad engineer", "solidworks designer", "b.tech mechanical"] },
    { title: "Production Floor Supervisor", category: "Manufacturing, Mechanical & Production", aliases: ["production supervisor", "shopfloor supervisor", "manufacturing lead", "shift supervisor"] },
    { title: "Quality Control (QC) Inspector", category: "Manufacturing, Mechanical & Production", aliases: ["qc inspector", "qa qc engineer", "quality control", "iso inspector"] },
    { title: "CNC Machine Operator & Programmer", category: "Manufacturing, Mechanical & Production", aliases: ["cnc operator", "cnc programmer", "vmc operator", "lathe machinist"] },
    { title: "Industrial Plant Maintenance Technician", category: "Manufacturing, Mechanical & Production", aliases: ["plant technician", "maintenance engineer", "electro-mechanical technician"] },

    // --- Administration, Office & Clerical ---
    { title: "Office Administrator / Facility Lead", category: "Administration, Office & Clerical", aliases: ["office admin", "office manager", "administrative officer", "admin executive"] },
    { title: "Executive Assistant / Personal Secretary", category: "Administration, Office & Clerical", aliases: ["executive assistant", "ea", "personal assistant", "pa to md", "secretary"] },
    { title: "Data Entry Operator (DEO)", category: "Administration, Office & Clerical", aliases: ["data entry", "deo", "computer operator", "back office executive", "typist"] },
    { title: "Front Desk Executive / Receptionist", category: "Administration, Office & Clerical", aliases: ["receptionist", "front desk", "front office", "office receptionist"] },
    { title: "Billing & Documentation Clerk", category: "Administration, Office & Clerical", aliases: ["billing clerk", "documentation executive", "office clerk", "filing clerk"] },

    // --- Skilled Trades & Technical Services ---
    { title: "Licensed Commercial Electrician", category: "Skilled Trades & Technical Services", aliases: ["electrician", "wireman", "iti electrician", "electrical technician", "maintenance electrician"] },
    { title: "Master Plumber & Pipefitter", category: "Skilled Trades & Technical Services", aliases: ["plumber", "pipefitter", "sanitary plumber", "plumbing technician"] },
    { title: "HVAC & AC Service Technician", category: "Skilled Trades & Technical Services", aliases: ["ac technician", "hvac technician", "refrigeration mechanic", "air conditioning repair"] },
    { title: "Automotive / Car Mechanic", category: "Skilled Trades & Technical Services", aliases: ["mechanic", "auto mechanic", "car technician", "automobile engineer", "diesel mechanic"] },
    { title: "Industrial Welder & Fabricator", category: "Skilled Trades & Technical Services", aliases: ["welder", "tig welder", "mig welder", "arc welder", "fabricator", "fitter"] },

    // --- Legal & Corporate Compliance ---
    { title: "Corporate Legal Advisor", category: "Legal & Corporate Compliance", aliases: ["legal advisor", "legal counsel", "corporate lawyer", "company legal lead"] },
    { title: "Legal Associate / Advocate", category: "Legal & Corporate Compliance", aliases: ["advocate", "legal associate", "lawyer", "llb associate", "litigation lawyer"] },
    { title: "Regulatory & Compliance Officer", category: "Legal & Corporate Compliance", aliases: ["compliance officer", "regulatory compliance", "risk officer", "legal compliance"] },

    // --- Security, Facilities & Maintenance ---
    { title: "Security Officer / Guard Incharge", category: "Security, Facilities & Maintenance", aliases: ["security guard", "security officer", "chief security officer", "security supervisor"] },
    { title: "Facility & Building Maintenance Officer", category: "Security, Facilities & Maintenance", aliases: ["facility manager", "building maintenance", "property maintenance supervisor"] }
  ];

  // =========================================================================
  // 2. EXTENSIVE MASTER TECHNICAL SKILLS LIBRARY (350+ Standardized Skills)
  // =========================================================================
  const SKILLS_LIBRARY = [
    // --- 1. Programming Languages (32) ---
    { name: "JavaScript (ES6+)", category: "Languages", aliases: ["js", "javascript", "vanilla js", "ecmascript"] },
    { name: "TypeScript", category: "Languages", aliases: ["ts", "typescript", "typed js"] },
    { name: "Python", category: "Languages", aliases: ["py", "python", "python3"] },
    { name: "Java", category: "Languages", aliases: ["java", "core java", "jvm"] },
    { name: "Go / Golang", category: "Languages", aliases: ["go", "golang"] },
    { name: "C++", category: "Languages", aliases: ["cpp", "c++", "c/c++"] },
    { name: "C# (.NET)", category: "Languages", aliases: ["c#", "csharp", "dotnet", ".net"] },
    { name: "Rust", category: "Languages", aliases: ["rust", "rustlang"] },
    { name: "PHP", category: "Languages", aliases: ["php", "php8", "php 8"] },
    { name: "Ruby", category: "Languages", aliases: ["ruby", "ruby on rails"] },
    { name: "Kotlin", category: "Languages", aliases: ["kotlin", "android kotlin"] },
    { name: "Swift", category: "Languages", aliases: ["swift", "ios swift"] },
    { name: "Dart", category: "Languages", aliases: ["dart", "flutter dart"] },
    { name: "SQL", category: "Languages", aliases: ["sql", "rdbms", "database query", "relational"] },
    { name: "PL/SQL & T-SQL", category: "Languages", aliases: ["plsql", "tsql", "stored procedures"] },
    { name: "Bash & Linux Shell", category: "Languages", aliases: ["bash", "shell", "sh", "zsh", "terminal"] },
    { name: "PowerShell", category: "Languages", aliases: ["powershell", "ps1", "windows scripting"] },
    { name: "HTML5", category: "Languages", aliases: ["html", "html5", "semantic web"] },
    { name: "CSS3", category: "Languages", aliases: ["css", "css3", "scss", "sass"] },
    { name: "SCSS / SASS", category: "Languages", aliases: ["scss", "sass", "css preprocessor"] },
    { name: "Scala", category: "Languages", aliases: ["scala", "functional jvm"] },
    { name: "R Language", category: "Languages", aliases: ["r", "r stats", "r programming"] },
    { name: "Elixir", category: "Languages", aliases: ["elixir", "erlang", "beam"] },
    { name: "Erlang", category: "Languages", aliases: ["erlang", "otp"] },
    { name: "C (Embedded & Systems)", category: "Languages", aliases: ["ansi c", "c programming", "c language"] },
    { name: "Lua", category: "Languages", aliases: ["lua", "scripting", "game scripting"] },
    { name: "Perl", category: "Languages", aliases: ["perl", "perl5"] },
    { name: "Haskell", category: "Languages", aliases: ["haskell", "pure functional"] },
    { name: "Clojure", category: "Languages", aliases: ["clojure", "lisp", "clojurescript"] },
    { name: "Solidity", category: "Languages", aliases: ["solidity", "smart contracts", "ethereum"] },
    { name: "Assembly Language (x86/ARM)", category: "Languages", aliases: ["assembly", "asm", "arm asm"] },
    { name: "MATLAB", category: "Languages", aliases: ["matlab", "simulink"] },

    // --- 2. Frontend Frameworks, UI & Styling (38) ---
    { name: "React.js", category: "Frontend", aliases: ["react", "reactjs", "jsx"] },
    { name: "Next.js", category: "Frontend", aliases: ["next", "nextjs", "next.js", "ssr", "ssg", "app router"] },
    { name: "Vue.js", category: "Frontend", aliases: ["vue", "vuejs", "vue 3", "vuex", "composition api"] },
    { name: "Nuxt.js", category: "Frontend", aliases: ["nuxt", "nuxtjs", "vue ssr"] },
    { name: "Angular", category: "Frontend", aliases: ["angular", "angular 17", "ng", "angular universal"] },
    { name: "Svelte & SvelteKit", category: "Frontend", aliases: ["svelte", "sveltekit", "svelte framework"] },
    { name: "Solid.js", category: "Frontend", aliases: ["solidjs", "solid.js"] },
    { name: "Remix", category: "Frontend", aliases: ["remix", "remix run", "react remix"] },
    { name: "Astro", category: "Frontend", aliases: ["astro", "content site", "static site"] },
    { name: "Tailwind CSS", category: "Frontend", aliases: ["tailwind", "tailwindcss", "utility css"] },
    { name: "Bootstrap 5", category: "Frontend", aliases: ["bootstrap", "bootstrap css"] },
    { name: "Material-UI (MUI)", category: "Frontend", aliases: ["mui", "material ui", "material design"] },
    { name: "Chakra UI", category: "Frontend", aliases: ["chakra", "chakra-ui"] },
    { name: "Ant Design", category: "Frontend", aliases: ["antd", "ant design"] },
    { name: "Shadcn UI", category: "Frontend", aliases: ["shadcn", "radix ui", "tailwind components"] },
    { name: "Radix UI & Headless UI", category: "Frontend", aliases: ["radix", "headless ui", "accessible components"] },
    { name: "Styled Components & Emotion", category: "Frontend", aliases: ["styled components", "css-in-js", "emotion"] },
    { name: "Redux & Redux Toolkit (RTK)", category: "Frontend", aliases: ["redux", "rtk", "state management", "redux-thunk"] },
    { name: "Zustand & Jotai", category: "Frontend", aliases: ["zustand", "jotai", "atomic state"] },
    { name: "MobX", category: "Frontend", aliases: ["mobx", "reactive state"] },
    { name: "TanStack Query (React Query)", category: "Frontend", aliases: ["react query", "tanstack", "server state", "swr"] },
    { name: "Vite", category: "Frontend", aliases: ["vite", "vitejs", "esbuild"] },
    { name: "Webpack & Babel", category: "Frontend", aliases: ["webpack", "babel", "rollup", "turbopack", "bundlers"] },
    { name: "Responsive Web Design (Grid & Flexbox)", category: "Frontend", aliases: ["responsive", "flexbox", "css grid", "mobile friendly"] },
    { name: "WebSockets & Socket.IO", category: "Frontend", aliases: ["websockets", "socket.io", "sse", "realtime web"] },
    { name: "WebRTC (Audio/Video)", category: "Frontend", aliases: ["webrtc", "video streaming", "peer to peer"] },
    { name: "Three.js & WebGL", category: "Frontend", aliases: ["three.js", "threejs", "webgl", "3d web", "canvas"] },
    { name: "D3.js & Chart.js (Data Viz)", category: "Frontend", aliases: ["d3", "d3.js", "chart.js", "charts", "data visualization"] },
    { name: "Progressive Web Apps (PWA)", category: "Frontend", aliases: ["pwa", "service workers", "offline web"] },
    { name: "Web Accessibility (WCAG / a11y)", category: "Frontend", aliases: ["a11y", "wcag", "screen readers", "accessibility", "aria"] },
    { name: "Microfrontends Architecture", category: "Frontend", aliases: ["microfrontend", "module federation", "single-spa"] },
    { name: "WebAssembly (Wasm)", category: "Frontend", aliases: ["wasm", "webassembly", "rust wasm"] },
    { name: "Framer Motion", category: "Frontend", aliases: ["framer motion", "animations", "web animations"] },
    { name: "Storybook", category: "Frontend", aliases: ["storybook", "component driven", "ui catalog"] },
    { name: "jQuery (Legacy Web)", category: "Frontend", aliases: ["jquery", "dom scripting"] },
    { name: "WordPress Theme & Plugin Dev", category: "Frontend", aliases: ["wordpress", "php wordpress", "elementor", "woocommerce"] },
    { name: "Shopify Liquid Theme Dev", category: "Frontend", aliases: ["shopify", "liquid", "ecommerce frontend"] },
    { name: "Webflow Development", category: "Frontend", aliases: ["webflow", "no-code web"] },

    // --- 3. Backend Frameworks, APIs & Microservices (42) ---
    { name: "Node.js & Express", category: "Backend & APIs", aliases: ["node", "nodejs", "express", "express.js", "server"] },
    { name: "NestJS", category: "Backend & APIs", aliases: ["nestjs", "nest", "ts backend", "enterprise node"] },
    { name: "Fastify", category: "Backend & APIs", aliases: ["fastify", "node fastify", "high performance node"] },
    { name: "Django & REST Framework", category: "Backend & APIs", aliases: ["django", "drf", "django rest framework"] },
    { name: "FastAPI", category: "Backend & APIs", aliases: ["fastapi", "python api", "async python", "pydantic"] },
    { name: "Flask", category: "Backend & APIs", aliases: ["flask", "python microframework"] },
    { name: "Spring Boot", category: "Backend & APIs", aliases: ["spring", "springboot", "java spring", "spring mvc", "spring cloud"] },
    { name: "Spring Security", category: "Backend & APIs", aliases: ["spring security", "oauth spring", "jwt spring"] },
    { name: "Micronaut & Quarkus", category: "Backend & APIs", aliases: ["micronaut", "quarkus", "graalvm"] },
    { name: "ASP.NET Core", category: "Backend & APIs", aliases: ["asp.net", "dotnet core", ".net core api", "c# web"] },
    { name: "Entity Framework Core", category: "Backend & APIs", aliases: ["ef core", "entity framework", "dotnet orm"] },
    { name: "Laravel (PHP)", category: "Backend & APIs", aliases: ["laravel", "php laravel", "artisan", "eloquent"] },
    { name: "Symfony", category: "Backend & APIs", aliases: ["symfony", "php symfony"] },
    { name: "Ruby on Rails", category: "Backend & APIs", aliases: ["rails", "ror", "ruby rails", "active record"] },
    { name: "Gin / Fiber (Golang)", category: "Backend & APIs", aliases: ["gin", "fiber", "go web framework", "echo"] },
    { name: "Actix Web & Axum (Rust)", category: "Backend & APIs", aliases: ["actix", "actix-web", "axum", "rust backend"] },
    { name: "Phoenix Framework (Elixir)", category: "Backend & APIs", aliases: ["phoenix", "liveview", "elixir phoenix"] },
    { name: "Ktor (Kotlin)", category: "Backend & APIs", aliases: ["ktor", "kotlin server", "coroutines"] },
    { name: "RESTful API Architecture", category: "Backend & APIs", aliases: ["rest", "rest api", "apis", "swagger", "openapi"] },
    { name: "GraphQL & Apollo Server", category: "Backend & APIs", aliases: ["graphql", "gql", "apollo server", "relay", "hasura"] },
    { name: "gRPC & Protocol Buffers", category: "Backend & APIs", aliases: ["grpc", "protobuf", "rpc", "binary protocol"] },
    { name: "tRPC", category: "Backend & APIs", aliases: ["trpc", "end-to-end typesafe api"] },
    { name: "SOAP & XML Web Services", category: "Backend & APIs", aliases: ["soap", "wsdl", "xml", "enterprise web services"] },
    { name: "Microservices Architecture", category: "Backend & APIs", aliases: ["microservices", "service oriented", "distributed architecture"] },
    { name: "Domain-Driven Design (DDD)", category: "Backend & APIs", aliases: ["ddd", "ubiquitous language", "bounded contexts"] },
    { name: "CQRS & Event Sourcing", category: "Backend & APIs", aliases: ["cqrs", "event sourcing", "axon", "kafka event sourcing"] },
    { name: "Apache Kafka", category: "Backend & APIs", aliases: ["kafka", "event streaming", "event-driven", "pub/sub", "kafka streams"] },
    { name: "RabbitMQ", category: "Backend & APIs", aliases: ["rabbitmq", "message broker", "amqp"] },
    { name: "AWS SQS & SNS", category: "Backend & APIs", aliases: ["sqs", "sns", "aws messaging", "queue"] },
    { name: "Google Cloud Pub/Sub", category: "Backend & APIs", aliases: ["gcp pubsub", "pub/sub", "google messaging"] },
    { name: "Celery & Background Workers", category: "Backend & APIs", aliases: ["celery", "python background tasks", "distributed task queue"] },
    { name: "BullMQ & Redis Queues", category: "Backend & APIs", aliases: ["bullmq", "bull", "redis queue", "node background tasks"] },
    { name: "Temporal.io Workflows", category: "Backend & APIs", aliases: ["temporal", "durable execution", "stateful orchestrator"] },
    { name: "Webhooks Architecture", category: "Backend & APIs", aliases: ["webhooks", "event notifications", "stripe webhooks"] },
    { name: "Rate Limiting & Throttling", category: "Backend & APIs", aliases: ["rate limiting", "token bucket", "leaky bucket", "ddos prevention"] },
    { name: "Reverse Proxies & API Gateways", category: "Backend & APIs", aliases: ["api gateway", "kong", "tyk", "traefik", "envoy"] },
    { name: "Load Balancing Algorithms", category: "Backend & APIs", aliases: ["load balancing", "round robin", "least connections"] },
    { name: "Distributed Caching Strategies", category: "Backend & APIs", aliases: ["cache-aside", "write-through", "caching patterns"] },
    { name: "Authentication Middleware", category: "Backend & APIs", aliases: ["auth middleware", "jwt verification", "session handling"] },
    { name: "OpenAPI / Swagger Specs", category: "Backend & APIs", aliases: ["openapi", "swagger", "api documentation spec"] },
    { name: "Clean Architecture Backend", category: "Backend & APIs", aliases: ["hexagonal architecture", "onion architecture", "ports and adapters"] },
    { name: "Server-Sent Events (SSE)", category: "Backend & APIs", aliases: ["sse", "server sent events", "event stream"] },

    // --- 4. Databases, ORMs & Storage (35) ---
    { name: "PostgreSQL", category: "Databases", aliases: ["postgres", "psql", "postgresql", "pg"] },
    { name: "MySQL", category: "Databases", aliases: ["mysql", "mariadb", "innodb"] },
    { name: "MongoDB", category: "Databases", aliases: ["mongo", "mongodb", "nosql", "document db", "bson"] },
    { name: "Redis", category: "Databases", aliases: ["redis", "in-memory", "cache", "caching", "redis cluster"] },
    { name: "SQLite", category: "Databases", aliases: ["sqlite", "sqlite3", "embedded db"] },
    { name: "Microsoft SQL Server", category: "Databases", aliases: ["mssql", "sql server", "t-sql"] },
    { name: "Oracle Database", category: "Databases", aliases: ["oracle db", "oracle sql", "pl/sql"] },
    { name: "Amazon DynamoDB", category: "Databases", aliases: ["dynamodb", "nosql aws", "key-value db", "single table design"] },
    { name: "Supabase (Postgres BaaS)", category: "Databases", aliases: ["supabase", "baas", "postgres supabase", "rls"] },
    { name: "Firebase Firestore", category: "Databases", aliases: ["firebase", "firestore", "google firebase"] },
    { name: "Cassandra & ScyllaDB", category: "Databases", aliases: ["cassandra", "scylladb", "columnar", "wide column"] },
    { name: "Elasticsearch & OpenSearch", category: "Databases", aliases: ["elastic", "elasticsearch", "opensearch", "elk", "full text search"] },
    { name: "Neo4j (Graph Database)", category: "Databases", aliases: ["neo4j", "graph database", "cypher"] },
    { name: "ClickHouse (OLAP)", category: "Databases", aliases: ["clickhouse", "olap", "columnar db", "fast analytics"] },
    { name: "TimescaleDB & InfluxDB", category: "Databases", aliases: ["timescaledb", "influxdb", "time-series database"] },
    { name: "Snowflake Data Cloud", category: "Databases", aliases: ["snowflake", "cloud data warehouse", "snowsql"] },
    { name: "Google BigQuery", category: "Databases", aliases: ["bigquery", "gbq", "cloud data analytics"] },
    { name: "Amazon Redshift", category: "Databases", aliases: ["redshift", "aws data warehouse"] },
    { name: "Databricks & Delta Lake", category: "Databases", aliases: ["databricks", "delta lake", "lakehouse"] },
    { name: "Prisma ORM", category: "Databases", aliases: ["prisma", "prisma orm", "prisma client"] },
    { name: "Drizzle ORM", category: "Databases", aliases: ["drizzle", "drizzle orm", "typesafe sql"] },
    { name: "TypeORM", category: "Databases", aliases: ["typeorm", "typescript orm"] },
    { name: "Mongoose (MongoDB ORM)", category: "Databases", aliases: ["mongoose", "mongodb odm"] },
    { name: "SQLAlchemy (Python)", category: "Databases", aliases: ["sqlalchemy", "python orm"] },
    { name: "Hibernate / JPA (Java)", category: "Databases", aliases: ["hibernate", "jpa", "java persistence"] },
    { name: "Knex.js (SQL Query Builder)", category: "Databases", aliases: ["knex", "knexjs", "query builder"] },
    { name: "Database Indexing & B-Trees", category: "Databases", aliases: ["indexing", "b-tree", "composite index", "gin index"] },
    { name: "Query Optimization & EXPLAIN", category: "Databases", aliases: ["query tuning", "explain plan", "slow query analysis"] },
    { name: "Database Sharding & Partitioning", category: "Databases", aliases: ["sharding", "horizontal partitioning", "table partitions"] },
    { name: "Replication & High Availability", category: "Databases", aliases: ["read replicas", "master slave", "failover", "aurora"] },
    { name: "Connection Pooling (PgBouncer)", category: "Databases", aliases: ["pgbouncer", "hikaricp", "connection pool"] },
    { name: "Database Migrations (Flyway/Liquibase)", category: "Databases", aliases: ["flyway", "liquibase", "alembic", "db migrations"] },
    { name: "Vector Databases (Pinecone / Chroma)", category: "Databases", aliases: ["pinecone", "chromadb", "weaviate", "qdrant", "milvus", "vector db"] },
    { name: "Cloudflare D1 (Serverless SQL)", category: "Databases", aliases: ["d1", "cloudflare d1", "sqlite edge"] },
    { name: "Cloudflare KV & R2 Storage", category: "Databases", aliases: ["cloudflare kv", "r2", "object storage", "blob"] },

    // --- 5. Cloud, DevOps & Infrastructure (40) ---
    { name: "Amazon Web Services (AWS)", category: "Cloud & DevOps", aliases: ["aws", "amazon cloud", "ec2", "s3", "lambda", "ecs"] },
    { name: "Google Cloud Platform (GCP)", category: "Cloud & DevOps", aliases: ["gcp", "google cloud", "cloud run", "bigquery", "gcs"] },
    { name: "Microsoft Azure", category: "Cloud & DevOps", aliases: ["azure", "microsoft azure", "azure devops", "azure portal"] },
    { name: "Docker", category: "Cloud & DevOps", aliases: ["docker", "container", "dockerfile", "docker-compose"] },
    { name: "Kubernetes (K8s)", category: "Cloud & DevOps", aliases: ["k8s", "kubernetes", "helm", "pods", "ingress", "deployments"] },
    { name: "Helm (Kubernetes Package Manager)", category: "Cloud & DevOps", aliases: ["helm", "helm charts", "k8s package manager"] },
    { name: "Terraform & IaC", category: "Cloud & DevOps", aliases: ["terraform", "iac", "infrastructure as code", "terragrunt"] },
    { name: "Ansible", category: "Cloud & DevOps", aliases: ["ansible", "configuration management", "playbooks"] },
    { name: "AWS CloudFormation & CDK", category: "Cloud & DevOps", aliases: ["cloudformation", "cdk", "aws cdk"] },
    { name: "Pulumi", category: "Cloud & DevOps", aliases: ["pulumi", "code as infrastructure"] },
    { name: "Cloudflare Workers & Pages", category: "Cloud & DevOps", aliases: ["cloudflare", "edge computing", "workers", "wrangler"] },
    { name: "Nginx & Reverse Proxies", category: "Cloud & DevOps", aliases: ["nginx", "reverse proxy", "load balancer", "caddy"] },
    { name: "Linux Administration (Ubuntu/RHEL)", category: "Cloud & DevOps", aliases: ["linux", "ubuntu", "debian", "centos", "sysadmin", "systemctl"] },
    { name: "Serverless Architecture (AWS Lambda)", category: "Cloud & DevOps", aliases: ["serverless", "lambda", "cloud functions"] },
    { name: "AWS ECS & Fargate", category: "Cloud & DevOps", aliases: ["ecs", "fargate", "container service"] },
    { name: "AWS EKS / GKE / AKS", category: "Cloud & DevOps", aliases: ["eks", "gke", "aks", "managed kubernetes"] },
    { name: "GitHub Actions", category: "Cloud & DevOps", aliases: ["github actions", "gh actions", "workflows"] },
    { name: "GitLab CI/CD", category: "Cloud & DevOps", aliases: ["gitlab ci", "gitlab pipeline"] },
    { name: "Jenkins", category: "Cloud & DevOps", aliases: ["jenkins", "ci/cd pipeline", "jenkinsfile"] },
    { name: "ArgoCD & GitOps", category: "Cloud & DevOps", aliases: ["argocd", "gitops", "kubernetes cd"] },
    { name: "CircleCI & TeamCity", category: "Cloud & DevOps", aliases: ["circleci", "teamcity", "ci tools"] },
    { name: "Prometheus & Grafana", category: "Cloud & DevOps", aliases: ["prometheus", "grafana", "metrics", "monitoring dashboards"] },
    { name: "Datadog & APM", category: "Cloud & DevOps", aliases: ["datadog", "apm", "monitoring"] },
    { name: "ELK Stack (Elastic, Logstash, Kibana)", category: "Cloud & DevOps", aliases: ["elk", "logstash", "kibana", "centralized logging"] },
    { name: "Splunk Enterprise", category: "Cloud & DevOps", aliases: ["splunk", "siem", "log analysis"] },
    { name: "Sentry & Error Tracking", category: "Cloud & DevOps", aliases: ["sentry", "error tracking", "apm", "crash analytics"] },
    { name: "OpenTelemetry (OTel)", category: "Cloud & DevOps", aliases: ["opentelemetry", "otel", "distributed tracing", "jaeger"] },
    { name: "Istio Service Mesh", category: "Cloud & DevOps", aliases: ["istio", "service mesh", "envoy", "mtls"] },
    { name: "HashiCorp Vault (Secrets Management)", category: "Cloud & DevOps", aliases: ["vault", "hashicorp vault", "secrets manager"] },
    { name: "DNS, SSL/TLS & Certificates", category: "Cloud & DevOps", aliases: ["dns", "route 53", "ssl", "tls", "cert-manager", "let's encrypt"] },
    { name: "Vercel & Netlify Deployment", category: "Cloud & DevOps", aliases: ["vercel", "netlify", "jamstack"] },
    { name: "DigitalOcean & Linode", category: "Cloud & DevOps", aliases: ["digitalocean", "droplets", "linode"] },
    { name: "CDN Architecture (Cloudflare/CloudFront)", category: "Cloud & DevOps", aliases: ["cdn", "cloudfront", "edge cache"] },
    { name: "Disaster Recovery & Backup Automation", category: "Cloud & DevOps", aliases: ["disaster recovery", "dr", "rpo", "rto", "snapshots"] },
    { name: "FinOps & Cloud Cost Optimization", category: "Cloud & DevOps", aliases: ["finops", "aws cost explorer", "cost optimization"] },

    // --- 6. QA, Testing & Test Automation (30) ---
    { name: "Playwright", category: "QA & Testing", aliases: ["playwright", "e2e testing", "browser automation"] },
    { name: "Cypress", category: "QA & Testing", aliases: ["cypress", "e2e testing", "ui automation"] },
    { name: "Selenium WebDriver", category: "QA & Testing", aliases: ["selenium", "selenium grid", "webdriver"] },
    { name: "Jest & Vitest", category: "QA & Testing", aliases: ["jest", "vitest", "unit testing"] },
    { name: "Mocha & Chai", category: "QA & Testing", aliases: ["mocha", "chai", "node testing"] },
    { name: "Postman & Newman", category: "QA & Testing", aliases: ["postman", "api testing", "newman", "collection runner"] },
    { name: "REST Assured (Java)", category: "QA & Testing", aliases: ["rest assured", "api automation java"] },
    { name: "PyTest (Python Testing)", category: "QA & Testing", aliases: ["pytest", "python unit tests", "fixtures"] },
    { name: "JUnit 5 & TestNG", category: "QA & Testing", aliases: ["junit", "testng", "java testing", "junit5"] },
    { name: "JMeter & LoadRunner", category: "QA & Testing", aliases: ["jmeter", "loadrunner", "stress testing", "performance testing"] },
    { name: "k6 (Modern Load Testing)", category: "QA & Testing", aliases: ["k6", "grafana k6", "load testing javascript"] },
    { name: "Appium (Mobile Automation)", category: "QA & Testing", aliases: ["appium", "mobile automation", "ios testing", "android testing"] },
    { name: "Cucumber & BDD", category: "QA & Testing", aliases: ["cucumber", "bdd", "gherkin"] },
    { name: "Test-Driven Development (TDD)", category: "QA & Testing", aliases: ["tdd", "unit tests first", "clean test architecture"] },
    { name: "Contract Testing (Pact)", category: "QA & Testing", aliases: ["pact", "contract testing", "consumer driven contracts"] },
    { name: "SonarQube & Static Analysis", category: "QA & Testing", aliases: ["sonarqube", "code coverage", "code quality", "linter"] },
    { name: "TestRail & Zephyr (Test Case Management)", category: "QA & Testing", aliases: ["testrail", "zephyr", "test management"] },
    { name: "Cross-Browser Testing (BrowserStack/Sauce)", category: "QA & Testing", aliases: ["browserstack", "saucelabs", "cross browser"] },
    { name: "Visual Regression Testing (Percy/Chromatic)", category: "QA & Testing", aliases: ["percy", "chromatic", "visual regression"] },
    { name: "OWASP ZAP & Security QA", category: "QA & Testing", aliases: ["owasp zap", "security testing", "dast testing"] },

    // --- 7. Mobile Development (22) ---
    { name: "React Native", category: "Mobile", aliases: ["react native", "rn", "expo"] },
    { name: "Expo SDK", category: "Mobile", aliases: ["expo", "managed workflow expo", "eas"] },
    { name: "Flutter", category: "Mobile", aliases: ["flutter", "dart", "flutter framework"] },
    { name: "Swift & SwiftUI", category: "Mobile", aliases: ["swift", "swiftui", "ios development", "xcode"] },
    { name: "UIKit & Objective-C", category: "Mobile", aliases: ["uikit", "obj-c", "legacy ios"] },
    { name: "Kotlin & Jetpack Compose", category: "Mobile", aliases: ["kotlin", "android studio", "jetpack compose", "android sdk"] },
    { name: "Kotlin Multiplatform (KMP)", category: "Mobile", aliases: ["kmp", "kmm", "shared kotlin"] },
    { name: "App Store & Play Store Deployment", category: "Mobile", aliases: ["app store", "google play", "mobile release", "fastlane"] },
    { name: "Fastlane Mobile Automation", category: "Mobile", aliases: ["fastlane", "mobile ci/cd", "automated builds"] },
    { name: "Push Notifications (FCM / APNs / OneSignal)", category: "Mobile", aliases: ["fcm", "apns", "onesignal", "push alerts"] },
    { name: "Mobile Offline-First Architecture", category: "Mobile", aliases: ["offline first", "watermelondb", "sqlite mobile", "realm"] },
    { name: "Deep Linking & Universal Links", category: "Mobile", aliases: ["deep linking", "universal links", "app links"] },
    { name: "In-App Purchases & RevenueCat", category: "Mobile", aliases: ["revenuecat", "iap", "storekit", "google play billing"] },
    { name: "Mobile App Security (ProGuard / R8)", category: "Mobile", aliases: ["proguard", "r8", "obfuscation", "mobile security"] },

    // --- 8. Data Science, AI & Machine Learning (38) ---
    { name: "Machine Learning (Scikit-Learn)", category: "Data & AI", aliases: ["scikit-learn", "sklearn", "ml algorithms", "regression", "classification"] },
    { name: "XGBoost & LightGBM", category: "Data & AI", aliases: ["xgboost", "lightgbm", "catboost", "gradient boosting"] },
    { name: "Deep Learning (PyTorch)", category: "Data & AI", aliases: ["pytorch", "torch", "deep learning", "neural networks"] },
    { name: "TensorFlow & Keras", category: "Data & AI", aliases: ["tensorflow", "keras", "neural nets"] },
    { name: "Pandas & NumPy", category: "Data & AI", aliases: ["pandas", "numpy", "data manipulation", "dataframe"] },
    { name: "Polars (Fast Dataframes)", category: "Data & AI", aliases: ["polars", "rust dataframe", "fast python data"] },
    { name: "Computer Vision (OpenCV)", category: "Data & AI", aliases: ["opencv", "computer vision", "image processing", "yolo"] },
    { name: "YOLO Object Detection (v8/v11)", category: "Data & AI", aliases: ["yolo", "yolov8", "object detection", "ultralytics"] },
    { name: "Natural Language Processing (NLP)", category: "Data & AI", aliases: ["nlp", "spacy", "nltk", "transformers", "bert"] },
    { name: "Hugging Face Transformers", category: "Data & AI", aliases: ["huggingface", "transformers", "pretrained models", "diffusers"] },
    { name: "Large Language Models (LLMs) & LangChain", category: "Data & AI", aliases: ["llm", "langchain", "llamaindex", "openai api", "rag", "vector databases"] },
    { name: "LlamaIndex & Agentic Workflows", category: "Data & AI", aliases: ["llamaindex", "ai agents", "crewai", "autogen"] },
    { name: "Retrieval-Augmented Generation (RAG)", category: "Data & AI", aliases: ["rag", "semantic search", "embedding models", "hybrid search"] },
    { name: "LLM Fine-Tuning (LoRA / QLoRA)", category: "Data & AI", aliases: ["lora", "qlora", "fine tuning", "peft", "axolotl"] },
    { name: "OpenAI, Anthropic & Gemini APIs", category: "Data & AI", aliases: ["openai", "claude", "gemini", "gpt-4", "ai api"] },
    { name: "Local LLM Serving (Ollama / vLLM)", category: "Data & AI", aliases: ["ollama", "vllm", "llama.cpp", "model serving"] },
    { name: "Apache Spark & PySpark", category: "Data & AI", aliases: ["spark", "pyspark", "big data", "distributed computing"] },
    { name: "Apache Airflow (Data Pipelines)", category: "Data & AI", aliases: ["airflow", "etl pipelines", "data workflows", "dag"] },
    { name: "dbt (Data Build Tool)", category: "Data & AI", aliases: ["dbt", "data transformations", "data modeling", "dbt core"] },
    { name: "MLflow & Experiment Tracking", category: "Data & AI", aliases: ["mlflow", "weights and biases", "wandb", "model registry"] },
    { name: "Power BI & Tableau", category: "Data & AI", aliases: ["power bi", "tableau", "dashboards", "data viz", "dax"] },
    { name: "Looker & Apache Superset", category: "Data & AI", aliases: ["looker", "superset", "metabase", "bi dashboard"] },
    { name: "Statistical Hypothesis Testing", category: "Data & AI", aliases: ["a/b testing", "statistics", "hypothesis testing", "p-value"] },
    { name: "Feature Engineering & Data Preprocessing", category: "Data & AI", aliases: ["feature engineering", "imputation", "scaling", "one-hot"] },

    // --- 9. Cybersecurity & Information Security (28) ---
    { name: "OAuth 2.0, OpenID Connect & JWT", category: "Cybersecurity", aliases: ["oauth", "jwt", "tokens", "authentication", "auth0", "oidc"] },
    { name: "Web Security & OWASP Top 10", category: "Cybersecurity", aliases: ["owasp", "xss", "csrf", "sql injection", "web security", "ssrf"] },
    { name: "SSL / TLS & Public Key Infrastructure (PKI)", category: "Cybersecurity", aliases: ["ssl", "tls", "certificates", "https", "pki", "cryptography"] },
    { name: "Vulnerability Assessment & Pentesting (VAPT)", category: "Cybersecurity", aliases: ["vapt", "burp suite", "nmap", "wireshark", "metasploit", "nessus"] },
    { name: "Burp Suite Professional", category: "Cybersecurity", aliases: ["burp suite", "burp", "web pentesting", "proxy scanner"] },
    { name: "SOC Analysis & Incident Response", category: "Cybersecurity", aliases: ["soc", "siem", "splunk", "incident response", "triage"] },
    { name: "Identity & Access Management (IAM)", category: "Cybersecurity", aliases: ["iam", "okta", "active directory", "rbac", "abac", "keycloak"] },
    { name: "DevSecOps & SAST / DAST Tools", category: "Cybersecurity", aliases: ["sast", "dast", "snyk", "trivy", "sonar", "checkmarx"] },
    { name: "Cloud Security Posture Management (CSPM)", category: "Cybersecurity", aliases: ["cspm", "cloud security", "wiz", "prisma cloud"] },
    { name: "Firewalls & VPNs (Palo Alto / Fortinet)", category: "Cybersecurity", aliases: ["firewall", "palo alto", "fortinet", "vpn", "ipsec"] },
    { name: "Zero Trust Architecture", category: "Cybersecurity", aliases: ["zero trust", "ztna", "microsegmentation"] },
    { name: "SOC 2 & ISO 27001 Compliance", category: "Cybersecurity", aliases: ["soc2", "iso 27001", "hipaa", "pci-dss", "compliance"] },

    // --- 10. Systems, Hardware & Embedded IoT (25) ---
    { name: "Embedded C / C++", category: "Systems & Hardware", aliases: ["embedded c", "microcontroller", "firmware", "bare metal"] },
    { name: "FreeRTOS & Embedded RTOS", category: "Systems & Hardware", aliases: ["freertos", "rtos", "real time operating system", "zephyr"] },
    { name: "ARM Cortex-M (STM32 / NXP)", category: "Systems & Hardware", aliases: ["stm32", "arm cortex", "arm", "microcontroller"] },
    { name: "ESP32 & ESP8266 IoT", category: "Systems & Hardware", aliases: ["esp32", "esp8266", "espressif", "wifi iot"] },
    { name: "Arduino Prototyping", category: "Systems & Hardware", aliases: ["arduino", "arduino ide", "makers"] },
    { name: "IoT Protocols (MQTT, CoAP, BLE)", category: "Systems & Hardware", aliases: ["mqtt", "ble", "bluetooth", "iot protocols", "coap", "zigbee"] },
    { name: "Hardware Interfaces (UART, SPI, I2C, CAN)", category: "Systems & Hardware", aliases: ["uart", "spi", "i2c", "can bus", "rs485"] },
    { name: "Raspberry Pi & Embedded Linux", category: "Systems & Hardware", aliases: ["raspberry pi", "sbc", "linux embedded", "yocto"] },
    { name: "PCB Design (KiCad / Altium)", category: "Systems & Hardware", aliases: ["pcb", "kicad", "altium", "hardware design", "schematics"] },
    { name: "Oscilloscopes & Logic Analyzers", category: "Systems & Hardware", aliases: ["oscilloscope", "logic analyzer", "multimeter", "hardware debug"] },
    { name: "ROS / ROS 2 (Robot Operating System)", category: "Systems & Hardware", aliases: ["ros", "ros2", "robotics", "slam", "nav2"] },

    // --- 11. Tools, Methodologies & Operations (30) ---
    { name: "Git & GitHub Version Control", category: "Tools & Practices", aliases: ["git", "github", "gitlab", "branching", "pull requests", "merge"] },
    { name: "Git Flow & Trunk-Based Development", category: "Tools & Practices", aliases: ["git flow", "trunk based", "release branch"] },
    { name: "Monorepos (Turborepo / Nx)", category: "Tools & Practices", aliases: ["monorepo", "turborepo", "nx", "lerna"] },
    { name: "Figma & UI Wireframing", category: "Tools & Practices", aliases: ["figma", "wireframing", "ui design", "prototyping", "figjam"] },
    { name: "Jira & Agile Sprint Planning", category: "Tools & Practices", aliases: ["jira", "agile", "scrum", "sprints", "kanban", "atlassian"] },
    { name: "Confluence & Team Documentation", category: "Tools & Practices", aliases: ["confluence", "wiki", "tech specs"] },
    { name: "Postman API Workspace", category: "Tools & Practices", aliases: ["postman", "api testing", "mock server", "environments"] },
    { name: "Clean Architecture & SOLID Principles", category: "Tools & Practices", aliases: ["clean architecture", "solid principles", "design patterns", "dry"] },
    { name: "System Design & High Availability", category: "Tools & Practices", aliases: ["system design", "scalability", "fault tolerance", "caching"] },
    { name: "Technical Writing & API Docs", category: "Tools & Practices", aliases: ["tech writing", "api documentation", "swagger ui", "readme", "docusaurus"] },
    { name: "Salesforce CRM & Apex", category: "Tools & Practices", aliases: ["salesforce", "sfdc", "apex", "soql", "lwc"] },
    { name: "SAP ERP & ABAP", category: "Tools & Practices", aliases: ["sap", "abap", "sap erp", "hana"] },
    { name: "ServiceNow ITSM", category: "Tools & Practices", aliases: ["servicenow", "itsm", "cmdb", "service catalog"] },
    { name: "Technical Recruiting & Talent Sourcing", category: "Tools & Practices", aliases: ["tech recruiting", "boolean search", "talent screening", "ats"] },
    { name: "Human Resources (HR) & People Ops", category: "Tools & Practices", aliases: ["human resources", "people operations", "onboarding", "payroll"] },

    // --- 12. Sales, CRM & Business Development ---
    { name: "Lead Generation & Prospecting", category: "Business & Sales", aliases: ["lead gen", "cold outreach", "prospecting", "b2b leads"] },
    { name: "B2B & Enterprise Sales", category: "Business & Sales", aliases: ["b2b sales", "corporate sales", "enterprise sales", "solution selling"] },
    { name: "CRM Software (Salesforce, Zoho, HubSpot)", category: "Business & Sales", aliases: ["crm", "zoho crm", "hubspot", "lead tracking"] },
    { name: "Cold Calling & Telesales", category: "Business & Sales", aliases: ["cold calling", "telecalling", "inside sales", "outbound calls"] },
    { name: "Contract Negotiation & Deal Closing", category: "Business & Sales", aliases: ["negotiation", "deal closing", "sales closing", "pricing strategy"] },
    { name: "Client Relationship Management (CRM)", category: "Business & Sales", aliases: ["client retention", "account management", "customer relations"] },
    { name: "Retail Store Merchandising", category: "Business & Sales", aliases: ["merchandising", "visual merchandising", "retail operations", "store inventory"] },

    // --- 13. Finance, Banking & Accounting ---
    { name: "Tally Prime & ERP 9", category: "Finance & Accounts", aliases: ["tally", "tally prime", "tally erp", "tally accounting"] },
    { name: "GST Return Filing & Compliance", category: "Finance & Accounts", aliases: ["gst", "gstr-1", "gstr-3b", "gst compliance", "input tax credit"] },
    { name: "QuickBooks & Xero Accounting", category: "Finance & Accounts", aliases: ["quickbooks", "xero", "cloud accounting"] },
    { name: "Financial Statement Analysis", category: "Finance & Accounts", aliases: ["balance sheet", "p&l statement", "financial reporting", "cash flow"] },
    { name: "Income Tax & TDS Filing", category: "Finance & Accounts", aliases: ["tds", "income tax", "tax audit", "advance tax"] },
    { name: "Auditing & Internal Verification", category: "Finance & Accounts", aliases: ["auditing", "statutory audit", "internal controls", "vouching"] },
    { name: "Bank Reconciliation Statement (BRS)", category: "Finance & Accounts", aliases: ["brs", "bank reconciliation", "ledger balancing"] },
    { name: "Accounts Payable & Receivable (AP/AR)", category: "Finance & Accounts", aliases: ["ap", "ar", "accounts payable", "accounts receivable", "invoicing"] },
    { name: "Payroll Management & Statutory Compliance", category: "Finance & Accounts", aliases: ["payroll", "pf", "esi", "salary processing"] },
    { name: "Advanced MS Excel (VLOOKUP, Pivot, Macros)", category: "Finance & Accounts", aliases: ["vlookup", "pivot tables", "excel formulas", "macros", "spreadsheet modeling"] },

    // --- 14. Marketing, Advertising & Media ---
    { name: "Search Engine Optimization (SEO)", category: "Marketing & Media", aliases: ["seo", "on page seo", "off page seo", "backlinks", "keyword research"] },
    { name: "Google Ads & PPC Campaigns", category: "Marketing & Media", aliases: ["google ads", "ppc", "adwords", "search ads", "display ads"] },
    { name: "Meta Ads (Facebook & Instagram Advertising)", category: "Marketing & Media", aliases: ["meta ads", "facebook ads", "instagram marketing", "fb ad manager"] },
    { name: "Social Media Strategy & Marketing", category: "Marketing & Media", aliases: ["social media", "instagram growth", "linkedin marketing", "content calendar"] },
    { name: "Content Writing & Copywriting", category: "Marketing & Media", aliases: ["content writing", "copywriting", "blog posts", "seo articles", "ad copy"] },
    { name: "Canva & Visual Content Creation", category: "Marketing & Media", aliases: ["canva", "graphic design basic", "social posts", "banners"] },
    { name: "Adobe Photoshop & Premiere Pro", category: "Marketing & Media", aliases: ["photoshop", "premiere pro", "video editing", "photo editing"] },
    { name: "Email Marketing & Automation", category: "Marketing & Media", aliases: ["email marketing", "mailchimp", "klaviyo", "newsletters"] },
    { name: "Google Analytics 4 (GA4)", category: "Marketing & Media", aliases: ["ga4", "google analytics", "web traffic", "conversion tracking"] },

    // --- 15. Customer Support & BPO ---
    { name: "Voice & Inbound Calling Support", category: "Customer Support", aliases: ["voice support", "inbound calls", "customer care voice", "telephony"] },
    { name: "Chat & Email Support (Non-Voice)", category: "Customer Support", aliases: ["chat support", "non-voice", "email ticketing", "livechat"] },
    { name: "Helpdesk Ticketing (Zendesk / Freshdesk)", category: "Customer Support", aliases: ["zendesk", "freshdesk", "jira service desk", "tickets"] },
    { name: "Customer De-escalation & Conflict Resolution", category: "Customer Support", aliases: ["de-escalation", "conflict resolution", "complaint management"] },
    { name: "Active Listening & English Fluency", category: "Customer Support", aliases: ["english communication", "accent neutralization", "active listening"] },
    { name: "Telecalling & Lead Follow-up", category: "Customer Support", aliases: ["telecalling", "lead follow up", "customer outreach"] },

    // --- 16. Healthcare & Clinical Practice ---
    { name: "Patient Assessment & Vital Signs Monitoring", category: "Healthcare & Clinical", aliases: ["vitals", "blood pressure", "pulse", "patient triage"] },
    { name: "Medication Administration & Dosage", category: "Healthcare & Clinical", aliases: ["medication", "injections", "iv drip", "pharmacology"] },
    { name: "Phlebotomy & Sample Collection", category: "Healthcare & Clinical", aliases: ["blood sample", "phlebotomy", "vacutainer", "specimen collection"] },
    { name: "First Aid & Basic Life Support (BLS)", category: "Healthcare & Clinical", aliases: ["cpr", "bls", "first aid", "emergency triage"] },
    { name: "Clinical Documentation & EHR Systems", category: "Healthcare & Clinical", aliases: ["ehr", "emr", "medical records", "patient charting"] },
    { name: "Infection Control & Sterilization Protocols", category: "Healthcare & Clinical", aliases: ["autoclave", "infection control", "hospital hygiene", "aseptic technique"] },
    { name: "Diagnostic Laboratory Equipment Handling", category: "Healthcare & Clinical", aliases: ["centrifuge", "microscope", "hematology analyzer", "biochemistry analyzer"] },

    // --- 17. Logistics, Supply Chain & Operations ---
    { name: "Warehouse Inventory Management", category: "Logistics & Operations", aliases: ["inventory management", "stock taking", "fifo", "warehouse operations"] },
    { name: "Dispatch & Route Optimization", category: "Logistics & Operations", aliases: ["route planning", "dispatching", "last mile logistics", "delivery routing"] },
    { name: "Purchase Order & Vendor Tracking", category: "Logistics & Operations", aliases: ["po tracking", "vendor management", "inward outward"] },
    { name: "Barcode & RFID Scanner Operation", category: "Logistics & Operations", aliases: ["barcode scanning", "rfid", "handheld scanner"] },
    { name: "Supply Chain ERP Systems", category: "Logistics & Operations", aliases: ["erp logistics", "wms", "warehouse management system"] },

    // --- 18. Construction & Architecture ---
    { name: "AutoCAD 2D & 3D Drafting", category: "Trades & Engineering", aliases: ["autocad", "cad drafting", "architectural drawing", "engineering drawing"] },
    { name: "Revit & Building Information Modeling (BIM)", category: "Trades & Engineering", aliases: ["revit", "bim", "3d modeling construction"] },
    { name: "Construction Site Supervision & Safety", category: "Trades & Engineering", aliases: ["site safety", "site execution", "osha", "construction supervision"] },
    { name: "Bill of Quantities (BOQ) & Cost Estimation", category: "Trades & Engineering", aliases: ["boq", "quantity estimation", "rate analysis", "civil billing"] },
    { name: "Structural Analysis & Blueprint Reading", category: "Trades & Engineering", aliases: ["blueprint reading", "reinforcement detailing", "structural drawing"] },

    // --- 19. Skilled Trades & Mechanical ---
    { name: "Electrical Wiring & Circuit Installation", category: "Trades & Engineering", aliases: ["electrical wiring", "switchgear", "circuit breaker", "db dressing"] },
    { name: "Plumbing Installation & Pipe Fitting", category: "Trades & Engineering", aliases: ["plumbing", "pvc pipes", "drainage", "pipe fitting", "cpvc"] },
    { name: "HVAC & Air Conditioning Maintenance", category: "Trades & Engineering", aliases: ["hvac repair", "ac servicing", "gas charging", "compressor repair"] },
    { name: "Arc, MIG & TIG Welding", category: "Trades & Engineering", aliases: ["welding", "tig welding", "mig welding", "gas cutting", "fabrication"] },
    { name: "Automotive Engine Diagnostics & Repair", category: "Trades & Engineering", aliases: ["engine repair", "transmission", "brakes", "vehicle servicing"] },
    { name: "CNC & VMC Machine Operation", category: "Trades & Engineering", aliases: ["cnc machine", "vmc machine", "g-code", "lathe machine"] },

    // --- 20. Administration & Office Tools ---
    { name: "Data Entry & High-Speed Typing (40+ WPM)", category: "Office & Productivity", aliases: ["typing", "data entry speed", "computer typing", "numeric keypad"] },
    { name: "MS Office Suite (Word, Excel, PowerPoint)", category: "Office & Productivity", aliases: ["ms office", "word processing", "excel sheets", "powerpoint presentations"] },
    { name: "Google Workspace (Docs, Sheets, Drive)", category: "Office & Productivity", aliases: ["google docs", "google sheets", "google drive", "gmail for business"] },
    { name: "Office Calendar & Executive Scheduling", category: "Office & Productivity", aliases: ["calendar management", "meeting scheduling", "travel booking"] },
    { name: "Business English & Written Correspondence", category: "Office & Productivity", aliases: ["business email", "formal letter writing", "minutes of meeting", "drafting"] }
  ];

  // =========================================================================
  // 3. INTELLIGENT HELPER & CATEGORY SYNCHRONIZATION API
  // =========================================================================
  const JobLibrary = {
    titles: JOB_TITLES_LIBRARY,
    skills: SKILLS_LIBRARY,

    // Search Job Titles with fuzzy/token and alias matching
    searchJobTitles(query) {
      if (!query || !query.trim()) return JOB_TITLES_LIBRARY.slice(0, 25);
      const q = query.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);

      const exact = [];
      const starts = [];
      const alias = [];
      const contains = [];

      JOB_TITLES_LIBRARY.forEach(item => {
        const tLower = item.title.toLowerCase();
        const catLower = (item.category || '').toLowerCase();
        const aliases = (item.aliases || []).map(a => a.toLowerCase());

        if (tLower === q || aliases.includes(q)) {
          exact.push(item);
        } else if (tLower.startsWith(q)) {
          starts.push(item);
        } else if (aliases.some(a => a.startsWith(q))) {
          alias.push(item);
        } else if (
          tokens.every(token => tLower.includes(token) || catLower.includes(token) || aliases.some(a => a.includes(token)))
        ) {
          contains.push(item);
        }
      });

      return [...exact, ...starts, ...alias, ...contains].slice(0, 30);
    },

    // Search Skills with prefix, alias, category, and token matching
    searchSkills(query, excludeSkills = []) {
      const q = (query || '').trim().toLowerCase();
      const excludeSet = new Set(excludeSkills.map(s => s.toLowerCase()));
      const available = SKILLS_LIBRARY.filter(s => !excludeSet.has(s.name.toLowerCase()));
      if (!q) return available.slice(0, 30);

      const tokens = q.split(/\s+/).filter(Boolean);
      const exact = [];
      const starts = [];
      const alias = [];
      const contains = [];

      available.forEach(s => {
        const sLower = s.name.toLowerCase();
        const catLower = (s.category || '').toLowerCase();
        const aliases = (s.aliases || []).map(a => a.toLowerCase());

        if (sLower === q || aliases.includes(q)) {
          exact.push(s);
        } else if (sLower.startsWith(q)) {
          starts.push(s);
        } else if (aliases.some(a => a.startsWith(q))) {
          alias.push(s);
        } else if (
          tokens.every(token => sLower.includes(token) || catLower.includes(token) || aliases.some(a => a.includes(token)))
        ) {
          contains.push(s);
        }
      });

      return [...exact, ...starts, ...alias, ...contains].slice(0, 30);
    },

    // Master Standardized Industry Categories
    MASTER_CATEGORIES: [
      "Software & Web Development",
      "DevOps, Cloud & Infrastructure",
      "QA & Automation Testing",
      "Mobile Application Development",
      "Data Science, AI & Analytics",
      "Cybersecurity & InfoSec",
      "Product Management & UI/UX Design",
      "IT Support & Enterprise Systems",
      "Sales, Retail & Business Development",
      "Finance, Banking & Accounting",
      "Marketing, Advertising & Content",
      "Customer Support, BPO & Telecalling",
      "Healthcare, Nursing & Pharmacy",
      "Education, Teaching & Training",
      "Human Resources & Talent Acquisition",
      "Logistics, Supply Chain & Delivery",
      "Hospitality, Hotel & Food Service",
      "Construction, Architecture & Real Estate",
      "Manufacturing, Mechanical & Production",
      "Administration, Office & Clerical",
      "Skilled Trades & Technical Services",
      "Legal & Corporate Compliance",
      "Security, Facilities & Maintenance"
    ],

    // LocalStorage Key for Employer-Defined Custom Categories
    CUSTOM_CATEGORY_KEY: 'jc_employer_custom_categories',

    // Retrieve employer's custom categories
    getCustomCategories() {
      try {
        const raw = localStorage.getItem(this.CUSTOM_CATEGORY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.map(c => String(c).trim()).filter(c => c.length >= 2);
          }
        }
      } catch (err) {
        console.warn("Could not parse custom employer categories:", err);
      }
      return [];
    },

    // Save a custom category created by an employer
    saveCustomCategory(categoryName) {
      if (!categoryName) return null;
      const clean = String(categoryName).trim();
      if (clean.length < 2) return null;

      try {
        const current = this.getCustomCategories();
        const lower = clean.toLowerCase();
        if (!current.some(c => c.toLowerCase() === lower)) {
          current.unshift(clean);
          localStorage.setItem(this.CUSTOM_CATEGORY_KEY, JSON.stringify(current));
        }
        return clean;
      } catch (err) {
        console.error("Failed to persist custom category:", err);
        return clean;
      }
    },

    // Remove a custom category
    deleteCustomCategory(categoryName) {
      if (!categoryName) return;
      try {
        const clean = String(categoryName).trim().toLowerCase();
        let current = this.getCustomCategories();
        current = current.filter(c => c.toLowerCase() !== clean);
        localStorage.setItem(this.CUSTOM_CATEGORY_KEY, JSON.stringify(current));
      } catch (err) {
        console.error("Failed to delete custom category:", err);
      }
    },

    // Get list of distinct categories (built-in + employer custom categories)
    getCategories() {
      const set = new Set();
      // Add standard master categories
      this.MASTER_CATEGORIES.forEach(c => set.add(c));
      // Add existing roles categories
      JOB_TITLES_LIBRARY.forEach(j => {
        if (j.category) set.add(j.category);
      });
      // Add employer custom categories
      this.getCustomCategories().forEach(c => set.add(c));
      return Array.from(set);
    },

    // Predict standard category from any title string
    getCategoryForTitle(title) {
      if (!title) return "Software Engineering";
      const q = title.trim().toLowerCase();

      // Check if matches any employer custom category directly or by keyword tokens
      const customCats = this.getCustomCategories();
      const customMatch = customCats.find(c => {
        const cLower = c.toLowerCase();
        if (cLower === q || q.includes(cLower) || cLower.includes(q)) return true;
        const tokens = cLower.split(/\s+/).filter(t => t.length > 3);
        return tokens.some(token => q.includes(token));
      });
      if (customMatch) return customMatch;

      // Direct match from Master Titles Library
      const directMatch = JOB_TITLES_LIBRARY.find(j => {
        return j.title.toLowerCase() === q ||
               (j.aliases && j.aliases.some(a => a.toLowerCase() === q));
      });
      if (directMatch) return directMatch.category;

      // Heuristic rules for real-time synchronization across all fields:
      // 1. Sales & Retail
      if (q.includes("sales") || q.includes("bdm") || q.includes("retail") || q.includes("cashier") || q.includes("tele-sales") || q.includes("telesales") || q.includes("account executive") || q.includes("merchandis")) {
        return "Sales, Retail & Business Development";
      }
      // 2. Finance & Accounting
      if (q.includes("accountant") || q.includes("ca ") || q.includes("chartered") || q.includes("finance") || q.includes("audit") || q.includes("tax") || q.includes("gst") || q.includes("bookkeep") || q.includes("banking") || q.includes("billing clerk")) {
        return "Finance, Banking & Accounting";
      }
      // 3. Marketing & Content
      if (q.includes("marketing") || q.includes("seo") || q.includes("social media") || q.includes("copywriter") || q.includes("content writer") || q.includes("ppc") || q.includes("growth hacker") || q.includes("brand designer")) {
        return "Marketing, Advertising & Content";
      }
      // 4. Customer Support & BPO
      if (q.includes("customer support") || q.includes("customer care") || q.includes("call center") || q.includes("bpo") || q.includes("telecaller") || q.includes("voice process") || q.includes("chat support") || q.includes("customer success")) {
        return "Customer Support, BPO & Telecalling";
      }
      // 5. Healthcare & Nursing
      if (q.includes("doctor") || q.includes("physician") || q.includes("nurse") || q.includes("pharmacist") || q.includes("chemist") || q.includes("medical") || q.includes("clinic") || q.includes("hospital") || q.includes("lab tech") || q.includes("dentist") || q.includes("physiotherap") || q.includes("ward boy")) {
        return "Healthcare, Nursing & Pharmacy";
      }
      // 6. Education & Teaching
      if (q.includes("teacher") || q.includes("lecturer") || q.includes("professor") || q.includes("tutor") || q.includes("teaching") || q.includes("faculty") || q.includes("trainer") || q.includes("counselor") || q.includes("admissions")) {
        return "Education, Teaching & Training";
      }
      // 7. Hospitality, Hotel & Food Service
      if (q.includes("chef") || q.includes("cook") || q.includes("hotel") || q.includes("restaurant") || q.includes("waiter") || q.includes("steward") || q.includes("barista") || q.includes("bartender") || q.includes("hospitality") || q.includes("housekeeping")) {
        return "Hospitality, Hotel & Food Service";
      }
      // 8. Logistics, Delivery & Supply Chain
      if (q.includes("delivery") || q.includes("courier") || q.includes("rider") || q.includes("driver") || q.includes("logistics") || q.includes("supply chain") || q.includes("warehouse") || q.includes("dispatch") || q.includes("fleet")) {
        return "Logistics, Supply Chain & Delivery";
      }
      // 9. Construction, Real Estate & Architecture
      if (q.includes("civil") || q.includes("construction") || q.includes("site engineer") || q.includes("site supervisor") || q.includes("architect") || q.includes("interior design") || q.includes("real estate") || q.includes("property consultant") || q.includes("surveyor")) {
        return "Construction, Architecture & Real Estate";
      }
      // 10. Manufacturing, Mechanical & Production
      if (q.includes("mechanical") || q.includes("manufacturing") || q.includes("production") || q.includes("qc inspector") || q.includes("cnc") || q.includes("vmc") || q.includes("lathe") || q.includes("plant technician") || q.includes("shopfloor")) {
        return "Manufacturing, Mechanical & Production";
      }
      // 11. Administration, Office & Clerical
      if (q.includes("data entry") || q.includes("deo") || q.includes("receptionist") || q.includes("office admin") || q.includes("executive assistant") || q.includes("personal assistant") || q.includes("clerk") || q.includes("back office")) {
        return "Administration, Office & Clerical";
      }
      // 12. Skilled Trades & Technical Services
      if (q.includes("electrician") || q.includes("plumber") || q.includes("ac technician") || q.includes("hvac") || q.includes("welder") || q.includes("fabricator") || q.includes("mechanic") || q.includes("auto repair") || q.includes("wireman") || q.includes("fitter")) {
        return "Skilled Trades & Technical Services";
      }
      // 13. Legal & Compliance
      if (q.includes("lawyer") || q.includes("advocate") || q.includes("legal") || q.includes("compliance officer") || q.includes("paralegal") || q.includes("regulatory")) {
        return "Legal & Corporate Compliance";
      }
      // 14. Security & Facilities
      if (q.includes("security") && (q.includes("guard") || q.includes("officer") || q.includes("supervisor") || q.includes("facility"))) {
        return "Security, Facilities & Maintenance";
      }
      // 15. HR & Talent
      if (q.includes("recruiter") || q.includes("hr") || q.includes("talent") || q.includes("human resources") || q.includes("people ops") || q.includes("payroll")) {
        return "Human Resources & Talent Acquisition";
      }

      // Tech Roles Heuristics
      if (q.includes("devops") || q.includes("sre") || q.includes("cloud") || q.includes("aws") || q.includes("azure") || q.includes("kubernetes") || q.includes("sysadmin") || q.includes("infrastructure") || q.includes("platform engineer")) {
        return "DevOps & Cloud";
      }
      if (q.includes("qa") || q.includes("test") || q.includes("sdet") || q.includes("automation tester") || q.includes("quality")) {
        return "QA & Testing";
      }
      if (q.includes("mobile") || q.includes("android") || q.includes("ios") || q.includes("flutter") || q.includes("swift") || q.includes("react native") || q.includes("kmp")) {
        return "Mobile Development";
      }
      if (q.includes("ai") || q.includes("ml") || q.includes("data") || q.includes("deep learning") || q.includes("analytics") || q.includes("bi analyst") || q.includes("spark") || q.includes("llm") || q.includes("genai")) {
        return "Data & AI";
      }
      if (q.includes("cyber") || q.includes("pentest") || q.includes("soc") || q.includes("vapt") || q.includes("infosec")) {
        return "Cybersecurity";
      }
      if (q.includes("product") || q.includes("ui") || q.includes("ux") || q.includes("design") || q.includes("figma") || q.includes("scrum product owner")) {
        return "Product & Design";
      }
      if (q.includes("lead") || q.includes("manager") || q.includes("director") || q.includes("cto") || q.includes("scrum master") || q.includes("head of")) {
        return "Team Leadership";
      }
      if (q.includes("embedded") || q.includes("firmware") || q.includes("iot") || q.includes("hardware") || q.includes("robotics") || q.includes("pcb")) {
        return "Systems & Hardware";
      }
      if (q.includes("it support") || q.includes("helpdesk") || q.includes("salesforce") || q.includes("sap") || q.includes("servicenow") || q.includes("systems admin")) {
        return "IT & Systems";
      }

      return "Software Engineering";
    },

    /**
     * Smart Candidate-Job Match Scoring Algorithm (Hybrid Jaccard + Cosine Similarity)
     * Evaluates skill overlap (45%), role/title alignment (25%), experience suitability (18%), and location proximity (12%).
     * @param {Object} candidate - Candidate pass object (skills, trade_title, category, experience, city)
     * @param {Object|string|null} job - Target job vacancy object or 'benchmark'
     * @returns {Object} MatchResult - score (0-100), tier, label, badgeColor, breakdown
     */
    calculateMatchScore: function (candidate, job) {
      if (!candidate) {
        return {
          score: 70,
          tier: 'moderate',
          label: 'Market Qualified',
          badgeColor: '#64748B',
          targetJobTitle: 'Industry Benchmark',
          breakdown: {
            skills: { score: 70, matched: [], missing: [], detail: 'Standard qualifications' },
            role: { score: 70, detail: 'General technical role' },
            experience: { score: 70, detail: 'Baseline experience' },
            location: { score: 85, detail: 'Visakhapatnam Corridor' }
          }
        };
      }

      // =========================================================================
      // 1. General Market Benchmark Mode (if job is not provided or 'benchmark')
      // =========================================================================
      if (!job || job === 'benchmark') {
        const skillsList = Array.isArray(candidate.skills) ? candidate.skills : [];
        const skillsCount = skillsList.length;
        const exp = Number(candidate.experience) || 0;
        let baseScore = 75;

        if (skillsCount >= 5) baseScore += 12;
        else if (skillsCount >= 3) baseScore += 8;
        else if (skillsCount >= 1) baseScore += 4;

        if (exp >= 4) baseScore += 11;
        else if (exp >= 2) baseScore += 7;
        else if (exp >= 1) baseScore += 3;

        const score = Math.min(97, Math.max(52, baseScore));
        const tier = score >= 90 ? 'exceptional' : (score >= 80 ? 'strong' : (score >= 65 ? 'moderate' : 'exploring'));
        const label = score >= 90 ? 'Exceptional Readiness' : (score >= 80 ? 'High Market Match' : 'Market Qualified');
        const badgeColor = score >= 90 ? '#059669' : (score >= 80 ? '#0D9488' : (score >= 65 ? '#D97706' : '#64748B'));

        return {
          score,
          tier,
          label,
          badgeColor,
          targetJobTitle: 'General Industry Benchmark',
          breakdown: {
            skills: {
              score: Math.min(100, Math.max(40, skillsCount * 18)),
              matched: skillsList.slice(0, 4),
              missing: [],
              detail: `${skillsCount} verified technical skills listed`
            },
            role: {
              score: 95,
              detail: candidate.trade_title || 'Technical Specialist'
            },
            experience: {
              score: Math.min(100, Math.max(30, Math.round((exp / 4) * 100))),
              detail: `${exp} Yrs practical industry experience`
            },
            location: {
              score: 95,
              detail: candidate.city || 'Visakhapatnam Corridor'
            }
          }
        };
      }

      // =========================================================================
      // 2. Specific Job Vacancy Matching Algorithm
      // =========================================================================
      const candSkills = (Array.isArray(candidate.skills) ? candidate.skills : []);
      const jobReqCorpus = `${job.requirements || ''} ${job.description || ''} ${job.title || ''} ${job.category || ''}`.toLowerCase();

      // Step A: Skill Intersection & Keyword Matching
      const matchedSkills = [];
      const missingSkills = [];

      candSkills.forEach(s => {
        const str = String(s);
        const tokens = str.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 1);
        if (tokens.some(t => jobReqCorpus.includes(t))) {
          matchedSkills.push(str);
        }
      });

      // Extract skills commonly required in this domain that candidate might be missing
      const cat = (job.category || '').toLowerCase();
      let domainCoreSkills = [];
      if (cat.includes('devops') || cat.includes('cloud')) domainCoreSkills = ['Kubernetes', 'Terraform', 'Docker', 'AWS', 'CI/CD'];
      else if (cat.includes('mobile')) domainCoreSkills = ['React Native', 'Flutter', 'Swift', 'Kotlin', 'REST APIs'];
      else if (cat.includes('qa') || cat.includes('test')) domainCoreSkills = ['Playwright', 'Cypress', 'Selenium', 'Postman', 'API Testing'];
      else if (cat.includes('team') || cat.includes('lead')) domainCoreSkills = ['System Design', 'Microservices', 'Agile / Scrum', 'Architecture'];
      else if (cat.includes('hr') || cat.includes('recruit')) domainCoreSkills = ['Tech Talent Sourcing', 'ATS', 'Salary Benchmarking', 'Interviews'];
      else domainCoreSkills = ['React', 'Node.js', 'TypeScript', 'SQL', 'APIs'];

      domainCoreSkills.forEach(ds => {
        const dsLower = ds.toLowerCase();
        const hasIt = candSkills.some(cs => cs.toLowerCase().includes(dsLower) || dsLower.includes(cs.toLowerCase()));
        if (!hasIt && !missingSkills.includes(ds)) {
          missingSkills.push(ds);
        }
      });

      // Calculate Skill Score (Weight 45%)
      let skillScore = 35;
      if (matchedSkills.length >= 4) skillScore = 98;
      else if (matchedSkills.length === 3) skillScore = 95;
      else if (matchedSkills.length === 2) skillScore = 84;
      else if (matchedSkills.length === 1) skillScore = 65;
      else {
        // Fallback: check general skill depth
        if (candSkills.length >= 4 && (job.category === candidate.category)) skillScore = 75;
        else skillScore = 32;
      }

      // Step B: Role & Title Alignment Score (Weight 25%)
      let titleScore = 45;
      const jCat = (job.category || '').toLowerCase();
      const cCat = (candidate.category || candidate.trade_title || '').toLowerCase();
      const jTitle = (job.title || '').toLowerCase();
      const cTitle = (candidate.trade_title || '').toLowerCase();

      if (jCat && cCat && (jCat === cCat || jCat.includes(cCat) || cCat.includes(jCat))) {
        titleScore = 100;
      } else if (jTitle && cTitle && (jTitle.includes(cTitle) || cTitle.includes(jTitle))) {
        titleScore = 95;
      } else {
        const jTokens = jTitle.split(/[^a-z0-9]+/).filter(t => t.length > 2);
        const cTokens = cTitle.split(/[^a-z0-9]+/).filter(t => t.length > 2);
        const shared = jTokens.filter(t => cTokens.includes(t));
        if (shared.length >= 2) titleScore = 90;
        else if (shared.length === 1) titleScore = 72;
        else titleScore = 45;
      }

      // Step C: Experience Fit Score (Weight 18%)
      let reqYears = 3;
      const expMatch = (job.requirements || '').match(/(\d+)\+?\s*(?:years|yrs)/i);
      if (expMatch) {
        reqYears = Number(expMatch[1]);
      } else if (jTitle.includes('lead') || jTitle.includes('manager') || jTitle.includes('architect') || jTitle.includes('director')) {
        reqYears = 5;
      } else if (jTitle.includes('senior') || jTitle.includes('sr')) {
        reqYears = 4;
      }

      const candYears = Number(candidate.experience) || 0;
      let expScore = 50;
      if (candYears >= reqYears) {
        if (candYears <= reqYears + 3) expScore = 100; // Optimal fit
        else expScore = 92; // Senior / Overqualified
      } else {
        expScore = Math.max(35, Math.round((candYears / reqYears) * 100));
      }

      // Step D: Location Proximity Score (Weight 12%)
      let locScore = 70;
      const jCity = (job.location_city || 'visakhapatnam').toLowerCase();
      const cCity = (candidate.city || 'visakhapatnam').toLowerCase();
      if (jCity === cCity || jCity.includes(cCity) || cCity.includes(jCity)) {
        locScore = 100;
      } else {
        locScore = 55;
      }

      // Composite Match Score
      // Skills: 45%, Role: 25%, Experience: 18%, Location: 12%
      let composite = Math.round((0.45 * skillScore) + (0.25 * titleScore) + (0.18 * expScore) + (0.12 * locScore));
      composite = Math.min(99, Math.max(42, composite));

      const tier = composite >= 90 ? 'exceptional' : (composite >= 80 ? 'strong' : (composite >= 65 ? 'moderate' : 'exploring'));
      const label = composite >= 90 ? 'Exceptional Fit' : (composite >= 80 ? 'Strong Match' : (composite >= 65 ? 'Good Potential' : 'Partial Match'));
      const badgeColor = composite >= 90 ? '#059669' : (composite >= 80 ? '#0D9488' : (composite >= 65 ? '#D97706' : '#64748B'));

      return {
        score: composite,
        tier,
        label,
        badgeColor,
        targetJobTitle: job.title,
        breakdown: {
          skills: {
            score: skillScore,
            matched: matchedSkills.slice(0, 5),
            missing: missingSkills.slice(0, 3),
            detail: `${matchedSkills.length} matching verified skill${matchedSkills.length === 1 ? '' : 's'} (${skillScore}%)`
          },
          role: {
            score: titleScore,
            detail: titleScore >= 90 ? 'Direct Specialization & Title Alignment' : 'Cross-Discipline Background'
          },
          experience: {
            score: expScore,
            detail: `${candYears} yrs vs ${reqYears}+ yrs required (${expScore}%)`
          },
          location: {
            score: locScore,
            detail: locScore === 100 ? 'Direct Vizag Corridor Match (Zero Relocation)' : 'Non-local corridor'
          }
        }
      };
    }
  };

  // Expose to window
  window.JOB_TITLES_LIBRARY = JOB_TITLES_LIBRARY;
  window.SKILLS_LIBRARY = SKILLS_LIBRARY;
  window.JobLibrary = JobLibrary;

})(typeof window !== 'undefined' ? window : this);
