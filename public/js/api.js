/**
 * JobConnect Cloudflare Workers API Client
 * Connects to live Cloudflare Worker API with automatic LocalStorage fallback
 */

const API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname.includes('job-way.in'))
  ? 'https://api.job-way.in/api'
  : 'https://jobconnect-backend.white018899.workers.dev/api';

// Initial fallback mock data if network is offline
const INITIAL_JOBS = [
  {
    id: "job_01",
    title: "Experienced Two-Wheeler Mechanic Wanted",
    description: "Looking for a reliable mechanic for servicing Honda, Hero, and Bajaj motorcycles. General service, engine tuning, and brake repairs required.",
    category: "Mechanic",
    salary_min: 18000,
    salary_max: 24000,
    salary_period: "monthly",
    location_area: "KPHB Colony",
    location_city: "Hyderabad",
    working_hours: "9:30 AM - 7:30 PM (Weekly Off on Tuesday)",
    requirements: "2+ years experience in two-wheeler servicing, basic electrical troubleshooting",
    vacancies: 2,
    status: "open",
    created_at: "2026-10-02",
    business_name: "Sri Balaji Auto Care & Service",
    business_type: "Automobile Workshop",
    employer_verified: "verified"
  },
  {
    id: "job_02",
    title: "Sweet Maker & Counter Assistant",
    description: "Need sweet maker and packing helper for busy festival season. Fast preparation of laddu, mysore pak, and mixture snacks.",
    category: "Cook",
    salary_min: 15000,
    salary_max: 20000,
    salary_period: "monthly",
    location_area: "SR Nagar",
    location_city: "Hyderabad",
    working_hours: "8:00 AM - 5:00 PM",
    requirements: "Hygiene oriented, prior sweet stall experience preferred",
    vacancies: 1,
    status: "open",
    created_at: "2026-10-03",
    business_name: "Annapurna Traditional Sweets & Bakery",
    business_type: "Food & Confectionery",
    employer_verified: "verified"
  },
  {
    id: "job_03",
    title: "Licensed Commercial Electrician & Wireman",
    description: "Industrial wiring, panel board maintenance, three-phase cabling, and safety inspections for commercial complexes.",
    category: "Electrician",
    salary_min: 22000,
    salary_max: 28000,
    salary_period: "monthly",
    location_area: "Gajuwaka Industrial Zone",
    location_city: "Visakhapatnam",
    working_hours: "9:00 AM - 6:00 PM",
    requirements: "ITI Electrician certificate, 3+ years experience, wireman permit",
    vacancies: 3,
    status: "open",
    created_at: "2026-10-05",
    business_name: "Apex Electrical Infrastructure Ltd",
    business_type: "Commercial Contracting",
    employer_verified: "verified"
  },
  {
    id: "job_04",
    title: "Heavy Goods Vehicle / Delivery Driver",
    description: "Local deliveries within city limits. Requires valid commercial badge driving license and safe driving record.",
    category: "Driver",
    salary_min: 16000,
    salary_max: 21000,
    salary_period: "monthly",
    location_area: "Madhapur",
    location_city: "Hyderabad",
    working_hours: "8:00 AM - 6:00 PM",
    requirements: "Clean commercial driving license, smartphone navigation familiarity",
    vacancies: 2,
    status: "open",
    created_at: "2026-10-06",
    business_name: "FastMove Logistics & Cargo",
    business_type: "Logistics",
    employer_verified: "verified"
  },
  {
    id: "job_05",
    title: "Residential Plumbing & Pipe Fitter",
    description: "CPVC & PVC pipeline laying, sanitary fitting installations, motor pump repair, and leak fixing.",
    category: "Plumber",
    salary_min: 18000,
    salary_max: 23000,
    salary_period: "monthly",
    location_area: "Benz Circle",
    location_city: "Vijayawada",
    working_hours: "9:00 AM - 6:30 PM",
    requirements: "Hands-on experience in high-rise building plumbing",
    vacancies: 2,
    status: "open",
    created_at: "2026-10-07",
    business_name: "Krishna Plumbing Solutions",
    business_type: "Sanitary Services",
    employer_verified: "verified"
  },
  {
    id: "job_06",
    title: "Workshop Helper & Cleaning Boy",
    description: "Tool organization, machinery cleaning, loading unloading, and workshop general assistance. Freshers welcome.",
    category: "Helper",
    salary_min: 11000,
    salary_max: 14000,
    salary_period: "monthly",
    location_area: "Kukatpally",
    location_city: "Hyderabad",
    working_hours: "9:00 AM - 7:00 PM",
    requirements: "Hardworking, disciplined, willingness to learn technical trades",
    vacancies: 4,
    status: "open",
    created_at: "2026-10-08",
    business_name: "Sri Balaji Auto Care & Service",
    business_type: "Automobile Workshop",
    employer_verified: "verified"
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: "app_101",
    job_id: "job_01",
    job_title: "Experienced Two-Wheeler Mechanic Wanted",
    employer_name: "Sri Balaji Auto Care & Service",
    worker_id: "wrk-1",
    worker_name: "Ramesh Kumar Rao",
    worker_category: "Mechanic",
    worker_experience: 4,
    worker_city: "Hyderabad",
    applied_date: "2026-10-08",
    status: "applied",
    priority: "PRIORITY_ACTIVE",
    unlocked: false,
    phone_masked: "+91 98••••••34",
    phone_unlocked: "+91 98491 23434",
    address_masked: "Address Protected (KPHB Colony, Hyderabad)",
    address_unlocked: "Flat 204, Sai Residency, Road No. 3, KPHB Colony, Hyderabad - 500072",
    experience_notes: "4 Years at Honda Authorized Service Center"
  },
  {
    id: "app_102",
    job_id: "job_03",
    job_title: "Licensed Commercial Electrician & Wireman",
    employer_name: "Apex Electrical Infrastructure Ltd",
    worker_id: "wrk-2",
    worker_name: "Suresh Varma",
    worker_category: "Electrician",
    worker_experience: 5,
    worker_city: "Visakhapatnam",
    applied_date: "2026-10-09",
    status: "shortlisted",
    priority: "STANDARD",
    unlocked: false,
    phone_masked: "+91 94••••••89",
    phone_unlocked: "+91 94402 91889",
    address_masked: "Address Protected (Gajuwaka, Visakhapatnam)",
    address_unlocked: "D.No 14-22/1, New Colony, Gajuwaka, Visakhapatnam - 530026",
    experience_notes: "5 Years Substation & Industrial Wiring"
  }
];

const INITIAL_PAYMENTS = [
  {
    id: "pay_101",
    type: "employer_unlock",
    user_name: "Sri Balaji Auto Care & Service",
    user_role: "employer",
    plan: "Growth Bundle (5 Worker Unlocks)",
    amount: 499,
    utr_number: "UPI/428912304910/HDFC",
    submitted_at: "2026-10-10 10:15",
    status: "pending_verification",
    target_id: "emp-1"
  },
  {
    id: "pay_102",
    type: "worker_priority",
    user_name: "Ramesh Kumar Rao",
    user_role: "worker",
    plan: "Priority Application Boost (₹299)",
    amount: 299,
    utr_number: "UPI/391029481920/SBI",
    submitted_at: "2026-10-10 09:30",
    status: "verified",
    target_id: "app_101"
  }
];

class JobConnectApi {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem('jc_jobs')) {
      localStorage.setItem('jc_jobs', JSON.stringify(INITIAL_JOBS));
    }
    if (!localStorage.getItem('jc_apps')) {
      localStorage.setItem('jc_apps', JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem('jc_payments')) {
      localStorage.setItem('jc_payments', JSON.stringify(INITIAL_PAYMENTS));
    }
    if (!localStorage.getItem('jc_credits')) {
      localStorage.setItem('jc_credits', '3'); // Employer unlock credits
    }
  }

  async checkHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return { status: "local_cache", service: "JobConnect Client Engine", environment: "edge-hybrid" };
  }

  async getJobs(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.city && filters.city !== 'all') params.append('city', filters.city);
      if (filters.minSalary) params.append('min_salary', filters.minSalary);

      const url = `${this.baseUrl}/jobs?${params.toString()}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.jobs) && data.jobs.length > 0) {
          // Merge with local storage created jobs
          const localJobs = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
          const serverIds = new Set(data.jobs.map(j => j.id));
          const uniqueLocal = localJobs.filter(j => !serverIds.has(j.id));
          return [...uniqueLocal, ...data.jobs];
        }
      }
    } catch (err) {
      console.warn("Live API fetch fallback to local storage:", err);
    }
    
    // Filter local storage jobs
    let local = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
    if (filters.category && filters.category !== 'all') {
      local = local.filter(j => j.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.city && filters.city !== 'all') {
      local = local.filter(j => j.location_city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.minSalary) {
      local = local.filter(j => (j.salary_max || j.salary_min) >= Number(filters.minSalary));
    }
    return local;
  }

  async getJobById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/jobs/${id}`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.job) return data.job;
      }
    } catch (err) {
      console.warn("Fallback to local job lookup", err);
    }
    const local = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
    return local.find(j => j.id === id) || local[0];
  }

  async createJob(jobData) {
    const newJob = {
      ...jobData,
      id: `job_${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString().split('T')[0],
      status: 'open',
      employer_verified: 'verified'
    };

    const local = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
    local.unshift(newJob);
    localStorage.setItem('jc_jobs', JSON.stringify(local));

    // Also attempt post to backend if token exists
    try {
      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        await fetch(`${this.baseUrl}/employer/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(jobData)
        });
      }
    } catch (e) {
      // Gracefully silent on offline
    }

    return newJob;
  }

  async applyJob(jobId, workerData, isPriority = false) {
    const job = await this.getJobById(jobId);
    const newApp = {
      id: `app_${Date.now().toString().slice(-6)}`,
      job_id: jobId,
      job_title: job ? job.title : "Trade Job",
      employer_name: job ? (job.business_name || job.employerName || "Hiring Employer") : "Hiring Employer",
      worker_id: workerData.id || "wrk-1",
      worker_name: workerData.name || "Worker Applicant",
      worker_category: workerData.category || (job ? job.category : "General"),
      worker_experience: workerData.experience || 3,
      worker_city: workerData.city || "Hyderabad",
      applied_date: new Date().toISOString().split('T')[0],
      status: "applied",
      priority: isPriority ? "PRIORITY_ACTIVE" : "STANDARD",
      unlocked: false,
      phone_masked: "+91 98••••••" + Math.floor(10 + Math.random() * 89),
      phone_unlocked: workerData.phone || "+91 98491 55678",
      address_masked: "Address Protected (Unlock to view)",
      address_unlocked: workerData.address || "Plot 89, Trade Nagar, Industrial Area, Hyderabad",
      experience_notes: workerData.notes || "Skilled with 3+ years experience"
    };

    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    apps.unshift(newApp);
    localStorage.setItem('jc_apps', JSON.stringify(apps));

    return newApp;
  }

  getApplications() {
    return JSON.parse(localStorage.getItem('jc_apps') || '[]');
  }

  unlockWorker(appId) {
    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    const app = apps.find(a => a.id === appId);
    let credits = Number(localStorage.getItem('jc_credits') || '0');

    if (!app) return { success: false, message: "Application not found" };

    if (credits <= 0) {
      return { success: false, needCredits: true, message: "Insufficient unlock credits. Please purchase an unlock bundle." };
    }

    credits -= 1;
    localStorage.setItem('jc_credits', String(credits));
    app.unlocked = true;
    localStorage.setItem('jc_apps', JSON.stringify(apps));

    return { success: true, app, remainingCredits: credits };
  }

  getUnlockCredits() {
    return Number(localStorage.getItem('jc_credits') || '0');
  }

  addUnlockCredits(count) {
    const credits = Number(localStorage.getItem('jc_credits') || '0') + count;
    localStorage.setItem('jc_credits', String(credits));
    return credits;
  }

  submitPayment(paymentData) {
    const newPay = {
      id: `pay_${Date.now().toString().slice(-6)}`,
      type: paymentData.type,
      user_name: paymentData.userName,
      user_role: paymentData.userRole,
      plan: paymentData.plan,
      amount: paymentData.amount,
      utr_number: paymentData.utrNumber,
      submitted_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: "pending_verification",
      target_id: paymentData.targetId || ""
    };

    const payments = JSON.parse(localStorage.getItem('jc_payments') || '[]');
    payments.unshift(newPay);
    localStorage.setItem('jc_payments', JSON.stringify(payments));

    return newPay;
  }

  getPayments() {
    return JSON.parse(localStorage.getItem('jc_payments') || '[]');
  }

  verifyPayment(paymentId, approve = true) {
    const payments = JSON.parse(localStorage.getItem('jc_payments') || '[]');
    const pay = payments.find(p => p.id === paymentId);
    if (!pay) return null;

    pay.status = approve ? "verified" : "rejected";
    pay.verified_at = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (approve) {
      if (pay.type === "employer_unlock") {
        const count = pay.amount >= 949 ? 10 : (pay.amount >= 499 ? 5 : 1);
        this.addUnlockCredits(count);
      }
      if (pay.type === "worker_priority" && pay.target_id) {
        const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
        const app = apps.find(a => a.id === pay.target_id);
        if (app) {
          app.priority = "PRIORITY_ACTIVE";
          localStorage.setItem('jc_apps', JSON.stringify(apps));
        }
      }
    }

    localStorage.setItem('jc_payments', JSON.stringify(payments));
    return pay;
  }
}

window.jobApi = new JobConnectApi();
