/**
 * JobConnect Master Job Titles & Technical Skills Knowledge Base
 * Centralized library for standardized titles, skills, disciplines and filter synchronization
 */

(function (window) {
  'use strict';

  // 1. COMPREHENSIVE JOB TITLES & TECHNICAL SPECIALIZATIONS LIBRARY
  const JOB_TITLES_LIBRARY = [
    // --- Software & Web Engineering ---
    { title: "Full-Stack Developer", category: "Software Engineering", aliases: ["fullstack", "full stack", "mern", "mean", "web developer", "software engineer", "full-stack engineer"] },
    { title: "Frontend Developer", category: "Software Engineering", aliases: ["frontend", "front-end", "ui developer", "react developer", "web engineer", "vue developer", "angular developer"] },
    { title: "Backend Developer", category: "Software Engineering", aliases: ["backend", "back-end", "api developer", "server engineer", "node developer", "java developer"] },
    { title: "Senior Software Architect", category: "Software Engineering", aliases: ["software architect", "system architect", "solutions architect", "principal engineer", "lead architect"] },
    { title: "React & Next.js Developer", category: "Software Engineering", aliases: ["react", "nextjs", "next.js", "frontend engineer", "reactjs", "react developer"] },
    { title: "Node.js Backend Engineer", category: "Software Engineering", aliases: ["node", "nodejs", "express", "backend engineer", "node.js developer"] },
    { title: "Python / Django Developer", category: "Software Engineering", aliases: ["python", "django", "fastapi", "python developer", "python engineer"] },
    { title: "Java / Spring Boot Engineer", category: "Software Engineering", aliases: ["java", "spring boot", "spring", "enterprise java", "java developer"] },
    { title: "Golang Backend Engineer", category: "Software Engineering", aliases: ["go", "golang", "go developer", "microservices engineer"] },
    { title: "Rust Systems Engineer", category: "Software Engineering", aliases: ["rust", "rustlang", "systems programmer", "low latency"] },
    { title: "PHP & Laravel Developer", category: "Software Engineering", aliases: ["php", "laravel", "full stack php", "wordpress"] },
    { title: ".NET / C# Developer", category: "Software Engineering", aliases: [".net", "c#", "dotnet", "asp.net", "microsoft stack"] },
    { title: "API & Microservices Architect", category: "Software Engineering", aliases: ["api", "microservices", "rest", "graphql", "grpc"] },

    // --- DevOps, Cloud Infrastructure & Systems ---
    { title: "DevOps Engineer", category: "DevOps & Cloud", aliases: ["devops", "ci/cd", "automation", "infrastructure engineer", "devops specialist"] },
    { title: "Cloud Solutions Architect", category: "DevOps & Cloud", aliases: ["cloud architect", "aws architect", "azure architect", "gcp architect", "solutions architect"] },
    { title: "Site Reliability Engineer (SRE)", category: "DevOps & Cloud", aliases: ["sre", "reliability engineer", "production engineer", "sysadmin"] },
    { title: "Kubernetes & Platform Engineer", category: "DevOps & Cloud", aliases: ["kubernetes", "k8s", "docker", "platform engineer", "container specialist"] },
    { title: "AWS Cloud Infrastructure Engineer", category: "DevOps & Cloud", aliases: ["aws", "amazon web services", "cloud engineer", "terraform", "iac"] },
    { title: "Azure Cloud Specialist", category: "DevOps & Cloud", aliases: ["azure", "microsoft cloud", "cloud engineer"] },
    { title: "GCP Cloud Engineer", category: "DevOps & Cloud", aliases: ["gcp", "google cloud", "cloud platform"] },
    { title: "Linux Systems Administrator", category: "DevOps & Cloud", aliases: ["linux", "sysadmin", "system administrator", "ubuntu", "rhel"] },
    { title: "Build & Release Engineer", category: "DevOps & Cloud", aliases: ["release engineer", "build engineer", "ci/cd pipelines"] },

    // --- Quality Assurance & Automation Testing ---
    { title: "QA Automation Engineer", category: "QA & Testing", aliases: ["qa automation", "automation tester", "selenium", "playwright", "cypress", "test engineer"] },
    { title: "SDET (Software Development Engineer in Test)", category: "QA & Testing", aliases: ["sdet", "test developer", "qa developer", "automation framework"] },
    { title: "Performance & Load Test Engineer", category: "QA & Testing", aliases: ["performance tester", "load testing", "jmeter", "k6", "stress testing"] },
    { title: "Manual QA Tester & Quality Analyst", category: "QA & Testing", aliases: ["manual tester", "qa analyst", "functional testing", "test cases"] },
    { title: "Mobile QA Engineer", category: "QA & Testing", aliases: ["appium", "mobile tester", "ios testing", "android testing"] },
    { title: "Security & Penetration Test Specialist", category: "QA & Testing", aliases: ["security tester", "pentester", "vapt", "ethical hacker"] },

    // --- Mobile Application Development ---
    { title: "Mobile Application Developer", category: "Mobile Development", aliases: ["mobile developer", "app developer", "cross platform"] },
    { title: "React Native Developer", category: "Mobile Development", aliases: ["react native", "rn developer", "hybrid mobile"] },
    { title: "Flutter & Dart Developer", category: "Mobile Development", aliases: ["flutter", "dart", "flutter developer", "cross platform mobile"] },
    { title: "iOS Developer (Swift / SwiftUI)", category: "Mobile Development", aliases: ["ios", "swift", "swiftui", "apple developer", "iphone app"] },
    { title: "Android Developer (Kotlin / Jetpack)", category: "Mobile Development", aliases: ["android", "kotlin", "jetpack compose", "android engineer"] },

    // --- AI, Machine Learning & Data Engineering ---
    { title: "AI / Machine Learning Engineer", category: "Data & AI", aliases: ["ai", "ml", "machine learning", "deep learning", "pytorch", "tensorflow"] },
    { title: "Data Scientist", category: "Data & AI", aliases: ["data science", "statistical modeling", "predictive analytics", "nlp"] },
    { title: "Data Engineer", category: "Data & AI", aliases: ["data pipeline", "etl", "big data", "spark", "hadoop", "airflow"] },
    { title: "MLOps Engineer", category: "Data & AI", aliases: ["mlops", "model deployment", "ai infrastructure", "model monitoring"] },
    { title: "LLM & GenAI Application Engineer", category: "Data & AI", aliases: ["genai", "prompt engineer", "langchain", "llm developer", "rag"] },
    { title: "Computer Vision Specialist", category: "Data & AI", aliases: ["computer vision", "opencv", "image processing", "yolo"] },
    { title: "NLP & Conversational AI Engineer", category: "Data & AI", aliases: ["nlp", "text processing", "chatbots", "bert", "hugging face"] },
    { title: "Business Intelligence & SQL Analyst", category: "Data & AI", aliases: ["bi analyst", "tableau", "power bi", "sql analyst", "data reporting"] },

    // --- Cybersecurity & Information Security ---
    { title: "Cybersecurity Analyst", category: "Cybersecurity", aliases: ["infosec", "soc analyst", "security analyst", "incident response"] },
    { title: "Cloud Security Specialist", category: "Cybersecurity", aliases: ["cloud security", "devsecops", "iam", "compliance"] },
    { title: "Network Security Engineer", category: "Cybersecurity", aliases: ["network security", "firewall", "vpn", "cisco", "palo alto"] },

    // --- Product, Design & Engineering Leadership ---
    { title: "Engineering Manager", category: "Team Leadership", aliases: ["engineering lead", "em", "director of engineering", "vp engineering"] },
    { title: "Technical Team Lead", category: "Team Leadership", aliases: ["tech lead", "team lead", "lead engineer", "scrum lead"] },
    { title: "Product Manager (Technical)", category: "Product & Design", aliases: ["pm", "product manager", "product owner", "technical product manager"] },
    { title: "UI/UX Designer", category: "Product & Design", aliases: ["ui designer", "ux designer", "product designer", "figma", "interaction designer"] },
    { title: "Scrum Master / Agile Delivery Lead", category: "Team Leadership", aliases: ["scrum master", "agile coach", "delivery manager"] },

    // --- Systems, Embedded & Hardware Engineering ---
    { title: "Embedded Systems Engineer", category: "Systems & Embedded", aliases: ["embedded", "embedded c", "microcontroller", "firmware", "iot"] },
    { title: "IoT Solutions Developer", category: "Systems & Embedded", aliases: ["iot", "internet of things", "smart devices", "mqtt"] },
    { title: "Electrical & Electronics Engineer", category: "Systems & Embedded", aliases: ["electronics", "circuit design", "pcb", "hardware engineer"] }
  ];

  // 2. COMPREHENSIVE TECHNICAL SKILLS, FRAMEWORKS & TOOLS LIBRARY (160+ Standardized Skills)
  const SKILLS_LIBRARY = [
    // --- Core Programming Languages ---
    { name: "JavaScript (ES6+)", category: "Languages", aliases: ["js", "javascript", "vanilla js", "ecmascript"] },
    { name: "TypeScript", category: "Languages", aliases: ["ts", "typescript", "typed js"] },
    { name: "Python", category: "Languages", aliases: ["py", "python", "python3"] },
    { name: "Java", category: "Languages", aliases: ["java", "core java", "jvm"] },
    { name: "Go / Golang", category: "Languages", aliases: ["go", "golang"] },
    { name: "C++", category: "Languages", aliases: ["cpp", "c++", "c/c++"] },
    { name: "C# (.NET)", category: "Languages", aliases: ["c#", "csharp", "dotnet", ".net"] },
    { name: "Rust", category: "Languages", aliases: ["rust", "rustlang"] },
    { name: "PHP", category: "Languages", aliases: ["php", "php8"] },
    { name: "Ruby", category: "Languages", aliases: ["ruby", "ruby on rails"] },
    { name: "Kotlin", category: "Languages", aliases: ["kotlin", "android kotlin"] },
    { name: "Swift", category: "Languages", aliases: ["swift", "ios swift"] },
    { name: "Dart", category: "Languages", aliases: ["dart", "flutter dart"] },
    { name: "SQL", category: "Languages", aliases: ["sql", "rdbms", "database query"] },
    { name: "Bash & Linux Shell", category: "Languages", aliases: ["bash", "shell", "sh", "zsh", "terminal"] },
    { name: "HTML5", category: "Languages", aliases: ["html", "html5", "semantic web"] },
    { name: "CSS3", category: "Languages", aliases: ["css", "css3", "scss", "sass"] },
    { name: "Scala", category: "Languages", aliases: ["scala", "functional"] },
    { name: "R", category: "Languages", aliases: ["r language", "r stats"] },

    // --- Frontend Frameworks, UI & Styling ---
    { name: "React.js", category: "Frontend", aliases: ["react", "reactjs", "jsx"] },
    { name: "Next.js", category: "Frontend", aliases: ["next", "nextjs", "next.js", "ssr", "ssg"] },
    { name: "Vue.js", category: "Frontend", aliases: ["vue", "vuejs", "vue 3"] },
    { name: "Nuxt.js", category: "Frontend", aliases: ["nuxt", "nuxtjs", "vue ssr"] },
    { name: "Angular", category: "Frontend", aliases: ["angular", "angular 17", "ng"] },
    { name: "Svelte & SvelteKit", category: "Frontend", aliases: ["svelte", "sveltekit"] },
    { name: "Tailwind CSS", category: "Frontend", aliases: ["tailwind", "tailwindcss", "utility css"] },
    { name: "Bootstrap 5", category: "Frontend", aliases: ["bootstrap", "bootstrap css"] },
    { name: "Material-UI (MUI)", category: "Frontend", aliases: ["mui", "material ui"] },
    { name: "Chakra UI", category: "Frontend", aliases: ["chakra", "chakra-ui"] },
    { name: "Redux Toolkit & Zustand", category: "Frontend", aliases: ["redux", "zustand", "state management", "rtk"] },
    { name: "Vite & Webpack", category: "Frontend", aliases: ["vite", "webpack", "bundler", "esbuild"] },
    { name: "Responsive Web Design", category: "Frontend", aliases: ["responsive", "flexbox", "css grid", "mobile friendly"] },
    { name: "WebSockets & Realtime Web", category: "Frontend", aliases: ["websockets", "socket.io", "realtime"] },
    { name: "Three.js & WebGL", category: "Frontend", aliases: ["three.js", "threejs", "webgl", "3d web"] },
    { name: "Progressive Web Apps (PWA)", category: "Frontend", aliases: ["pwa", "service workers", "offline web"] },

    // --- Backend Frameworks, APIs & Microservices ---
    { name: "Node.js & Express", category: "Backend", aliases: ["node", "nodejs", "express", "express.js", "server"] },
    { name: "NestJS", category: "Backend", aliases: ["nestjs", "nest", "ts backend"] },
    { name: "Fastify", category: "Backend", aliases: ["fastify", "node fastify"] },
    { name: "Django & REST Framework", category: "Backend", aliases: ["django", "drf", "django rest framework"] },
    { name: "FastAPI", category: "Backend", aliases: ["fastapi", "python api", "async python"] },
    { name: "Flask", category: "Backend", aliases: ["flask", "microframework"] },
    { name: "Spring Boot", category: "Backend", aliases: ["spring", "springboot", "java spring", "spring mvc"] },
    { name: "ASP.NET Core", category: "Backend", aliases: ["asp.net", "dotnet core", ".net core api"] },
    { name: "Laravel (PHP)", category: "Backend", aliases: ["laravel", "php laravel", "artisan"] },
    { name: "Ruby on Rails", category: "Backend", aliases: ["rails", "ror", "ruby rails"] },
    { name: "RESTful API Design", category: "Backend", aliases: ["rest", "rest api", "apis", "swagger", "openapi"] },
    { name: "GraphQL & Apollo", category: "Backend", aliases: ["graphql", "gql", "apollo server", "relay"] },
    { name: "gRPC & Protocol Buffers", category: "Backend", aliases: ["grpc", "protobuf", "rpc"] },
    { name: "Microservices Architecture", category: "Backend", aliases: ["microservices", "service oriented", "distributed architecture"] },
    { name: "Apache Kafka", category: "Backend", aliases: ["kafka", "event streaming", "event-driven"] },
    { name: "RabbitMQ & Message Queues", category: "Backend", aliases: ["rabbitmq", "message broker", "amqp", "sqs"] },
    { name: "Celery & BullMQ", category: "Backend", aliases: ["celery", "bullmq", "redis queue", "background tasks"] },

    // --- Databases, ORMs & Caching ---
    { name: "PostgreSQL", category: "Database", aliases: ["postgres", "psql", "postgresql"] },
    { name: "MySQL", category: "Database", aliases: ["mysql", "mariadb"] },
    { name: "MongoDB", category: "Database", aliases: ["mongo", "mongodb", "nosql", "document db"] },
    { name: "Redis", category: "Database", aliases: ["redis", "in-memory", "cache", "caching"] },
    { name: "SQLite", category: "Database", aliases: ["sqlite", "sqlite3", "embedded db"] },
    { name: "Supabase", category: "Database", aliases: ["supabase", "baas", "postgres supabase"] },
    { name: "Firebase Firestore", category: "Database", aliases: ["firebase", "firestore", "google firebase"] },
    { name: "Amazon DynamoDB", category: "Database", aliases: ["dynamodb", "nosql aws", "key-value db"] },
    { name: "Elasticsearch", category: "Database", aliases: ["elastic", "elasticsearch", "elk", "full text search"] },
    { name: "Prisma ORM", category: "Database", aliases: ["prisma", "prisma orm"] },
    { name: "Drizzle ORM", category: "Database", aliases: ["drizzle", "drizzle orm"] },
    { name: "TypeORM & Mongoose", category: "Database", aliases: ["typeorm", "mongoose", "orm"] },
    { name: "Database Indexing & Query Tuning", category: "Database", aliases: ["indexing", "query optimization", "explain analyze"] },

    // --- Cloud, DevOps & Infrastructure ---
    { name: "Amazon Web Services (AWS)", category: "Cloud & DevOps", aliases: ["aws", "amazon cloud", "ec2", "s3", "lambda", "ecs"] },
    { name: "Google Cloud Platform (GCP)", category: "Cloud & DevOps", aliases: ["gcp", "google cloud", "cloud run", "bigquery", "gcs"] },
    { name: "Microsoft Azure", category: "Cloud & DevOps", aliases: ["azure", "microsoft azure", "azure devops"] },
    { name: "Docker", category: "Cloud & DevOps", aliases: ["docker", "container", "dockerfile", "docker-compose"] },
    { name: "Kubernetes (K8s)", category: "Cloud & DevOps", aliases: ["k8s", "kubernetes", "helm", "pods", "ingress"] },
    { name: "Terraform & IaC", category: "Cloud & DevOps", aliases: ["terraform", "iac", "infrastructure as code", "terragrunt"] },
    { name: "Ansible", category: "Cloud & DevOps", aliases: ["ansible", "configuration management", "playbooks"] },
    { name: "Cloudflare Workers & Pages", category: "Cloud & DevOps", aliases: ["cloudflare", "edge computing", "workers", "wrangler"] },
    { name: "Nginx & Reverse Proxies", category: "Cloud & DevOps", aliases: ["nginx", "reverse proxy", "load balancer"] },
    { name: "Linux Administration (Ubuntu/Debian)", category: "Cloud & DevOps", aliases: ["linux", "ubuntu", "debian", "centos", "sysadmin"] },
    { name: "Serverless Architecture (AWS Lambda)", category: "Cloud & DevOps", aliases: ["serverless", "lambda", "cloud functions"] },

    // --- CI/CD, Observability & Monitoring ---
    { name: "GitHub Actions", category: "Cloud & DevOps", aliases: ["github actions", "gh actions", "workflows"] },
    { name: "GitLab CI/CD", category: "Cloud & DevOps", aliases: ["gitlab ci", "gitlab pipeline"] },
    { name: "Jenkins", category: "Cloud & DevOps", aliases: ["jenkins", "ci/cd pipeline"] },
    { name: "ArgoCD", category: "Cloud & DevOps", aliases: ["argocd", "gitops", "kubernetes cd"] },
    { name: "Prometheus & Grafana", category: "Cloud & DevOps", aliases: ["prometheus", "grafana", "metrics", "monitoring dashboards"] },
    { name: "Datadog", category: "Cloud & DevOps", aliases: ["datadog", "apm", "monitoring"] },
    { name: "ELK Stack (Elastic, Logstash, Kibana)", category: "Cloud & DevOps", aliases: ["elk", "logstash", "kibana", "centralized logging"] },
    { name: "Sentry & Error Tracking", category: "Cloud & DevOps", aliases: ["sentry", "error tracking", "apm"] },

    // --- QA, Testing & Test Automation ---
    { name: "Jest & Vitest", category: "QA & Testing", aliases: ["jest", "vitest", "unit testing"] },
    { name: "Playwright", category: "QA & Testing", aliases: ["playwright", "e2e testing", "browser automation"] },
    { name: "Cypress", category: "QA & Testing", aliases: ["cypress", "e2e testing", "ui automation"] },
    { name: "Selenium WebDriver", category: "QA & Testing", aliases: ["selenium", "selenium grid", "webdriver"] },
    { name: "Postman & Newman", category: "QA & Testing", aliases: ["postman", "api testing", "newman"] },
    { name: "PyTest (Python Testing)", category: "QA & Testing", aliases: ["pytest", "python unit tests"] },
    { name: "JUnit & TestNG", category: "QA & Testing", aliases: ["junit", "testng", "java testing"] },
    { name: "JMeter & Load Testing", category: "QA & Testing", aliases: ["jmeter", "k6", "loadrunner", "stress testing"] },
    { name: "Appium (Mobile Automation)", category: "QA & Testing", aliases: ["appium", "mobile automation", "ios testing"] },
    { name: "Cucumber & BDD", category: "QA & Testing", aliases: ["cucumber", "bdd", "gherkin"] },
    { name: "Test-Driven Development (TDD)", category: "QA & Testing", aliases: ["tdd", "unit tests first", "clean test architecture"] },

    // --- Mobile Development ---
    { name: "React Native", category: "Mobile", aliases: ["react native", "rn", "expo"] },
    { name: "Flutter", category: "Mobile", aliases: ["flutter", "dart", "flutter framework"] },
    { name: "Swift & SwiftUI", category: "Mobile", aliases: ["swift", "swiftui", "ios development", "xcode"] },
    { name: "Kotlin & Android SDK", category: "Mobile", aliases: ["kotlin", "android studio", "jetpack compose", "android app"] },
    { name: "App Store & Play Store Deployment", category: "Mobile", aliases: ["app store", "google play", "mobile release", "fastlane"] },

    // --- Data Science, AI & Machine Learning ---
    { name: "Machine Learning (Scikit-Learn)", category: "Data & AI", aliases: ["scikit-learn", "sklearn", "ml algorithms", "regression", "classification"] },
    { name: "Deep Learning (PyTorch)", category: "Data & AI", aliases: ["pytorch", "torch", "deep learning", "neural networks"] },
    { name: "TensorFlow & Keras", category: "Data & AI", aliases: ["tensorflow", "keras", "neural nets"] },
    { name: "Pandas & NumPy", category: "Data & AI", aliases: ["pandas", "numpy", "data manipulation", "dataframe"] },
    { name: "Computer Vision (OpenCV)", category: "Data & AI", aliases: ["opencv", "computer vision", "image processing", "yolo"] },
    { name: "Natural Language Processing (NLP)", category: "Data & AI", aliases: ["nlp", "spacy", "nltk", "transformers", "bert"] },
    { name: "Large Language Models (LLMs) & LangChain", category: "Data & AI", aliases: ["llm", "langchain", "llamaindex", "openai api", "rag", "vector databases"] },
    { name: "Hugging Face Transformers", category: "Data & AI", aliases: ["huggingface", "transformers", "pretrained models"] },
    { name: "Vector Databases (Pinecone / Chroma / Qdrant)", category: "Data & AI", aliases: ["vector db", "pinecone", "chromadb", "qdrant", "embeddings"] },
    { name: "Apache Spark & PySpark", category: "Data & AI", aliases: ["spark", "pyspark", "big data", "distributed computing"] },
    { name: "Apache Airflow (Data Pipelines)", category: "Data & AI", aliases: ["airflow", "etl pipelines", "data workflows"] },
    { name: "Snowflake & Databricks", category: "Data & AI", aliases: ["snowflake", "databricks", "data warehouse"] },
    { name: "Power BI & Tableau", category: "Data & AI", aliases: ["power bi", "tableau", "dashboards", "data viz"] },

    // --- Cybersecurity, Security & Authentication ---
    { name: "OAuth 2.0, OpenID & JWT", category: "Cybersecurity", aliases: ["oauth", "jwt", "tokens", "authentication", "auth0"] },
    { name: "Web Security & OWASP Top 10", category: "Cybersecurity", aliases: ["owasp", "xss", "csrf", "sql injection", "web security"] },
    { name: "SSL / TLS & PKI", category: "Cybersecurity", aliases: ["ssl", "tls", "certificates", "https"] },
    { name: "Vulnerability Assessment & Pentesting (VAPT)", category: "Cybersecurity", aliases: ["vapt", "burp suite", "nmap", "wireshark", "metasploit"] },
    { name: "SOC Analysis & Incident Response", category: "Cybersecurity", aliases: ["soc", "siem", "splunk", "incident response"] },

    // --- Embedded, IoT & Hardware ---
    { name: "Embedded C / C++", category: "Systems & Embedded", aliases: ["embedded c", "microcontroller", "firmware"] },
    { name: "FreeRTOS & RTOS", category: "Systems & Embedded", aliases: ["freertos", "rtos", "real time operating system"] },
    { name: "Arduino & ESP32 / STM32", category: "Systems & Embedded", aliases: ["arduino", "esp32", "stm32", "arm cortex"] },
    { name: "IoT Protocols (MQTT, CoAP, BLE)", category: "Systems & Embedded", aliases: ["mqtt", "ble", "bluetooth", "iot protocols"] },
    { name: "Raspberry Pi & Single Board Computers", category: "Systems & Embedded", aliases: ["raspberry pi", "sbc", "linux embedded"] },

    // --- Collaboration, Project Tools & Workflow ---
    { name: "Git & GitHub Version Control", category: "Tools", aliases: ["git", "github", "gitlab", "branching", "pull requests"] },
    { name: "Figma & UI Prototyping", category: "Tools", aliases: ["figma", "wireframing", "ui design", "prototyping"] },
    { name: "Jira & Agile Sprint Planning", category: "Tools", aliases: ["jira", "agile", "scrum", "sprints", "kanban"] },
    { name: "Postman API Workspace", category: "Tools", aliases: ["postman", "api testing", "mock server"] },
    { name: "Clean Architecture & Design Patterns", category: "Tools", aliases: ["clean architecture", "solid principles", "design patterns"] }
  ];

  // Helper APIs
  const JobLibrary = {
    titles: JOB_TITLES_LIBRARY,
    skills: SKILLS_LIBRARY,

    // Search Job Titles
    searchJobTitles(query) {
      if (!query || !query.trim()) return JOB_TITLES_LIBRARY.slice(0, 15);
      const q = query.trim().toLowerCase();
      return JOB_TITLES_LIBRARY.filter(item => {
        return item.title.toLowerCase().includes(q) ||
               (item.category && item.category.toLowerCase().includes(q)) ||
               (item.aliases && item.aliases.some(a => a.toLowerCase().includes(q)));
      });
    },

    // Search Skills
    searchSkills(query, excludeSkills = []) {
      const q = (query || '').trim().toLowerCase();
      const excludeSet = new Set(excludeSkills.map(s => s.toLowerCase()));
      const available = SKILLS_LIBRARY.filter(s => !excludeSet.has(s.name.toLowerCase()));
      if (!q) return available.slice(0, 20);

      const exact = [];
      const starts = [];
      const alias = [];
      const contains = [];

      available.forEach(s => {
        const sLower = s.name.toLowerCase();
        const aliases = (s.aliases || []).map(a => a.toLowerCase());
        if (sLower === q || aliases.includes(q)) {
          exact.push(s);
        } else if (sLower.startsWith(q)) {
          starts.push(s);
        } else if (aliases.some(a => a.startsWith(q) || a.includes(q))) {
          alias.push(s);
        } else if (sLower.includes(q) || (s.category && s.category.toLowerCase().includes(q))) {
          contains.push(s);
        }
      });

      return [...exact, ...starts, ...alias, ...contains].slice(0, 18);
    },

    // Get list of distinct categories
    getCategories() {
      const set = new Set();
      JOB_TITLES_LIBRARY.forEach(j => set.add(j.category));
      return Array.from(set);
    },

    // Predict category from a given job title string
    getCategoryForTitle(title) {
      if (!title) return "Software Engineering";
      const q = title.trim().toLowerCase();
      const match = JOB_TITLES_LIBRARY.find(j => {
        return j.title.toLowerCase() === q ||
               (j.aliases && j.aliases.some(a => a.toLowerCase() === q || q.includes(a.toLowerCase())));
      });
      return match ? match.category : "Software Engineering";
    }
  };

  // Expose to window
  window.JOB_TITLES_LIBRARY = JOB_TITLES_LIBRARY;
  window.SKILLS_LIBRARY = SKILLS_LIBRARY;
  window.JobLibrary = JobLibrary;

})(typeof window !== 'undefined' ? window : this);
