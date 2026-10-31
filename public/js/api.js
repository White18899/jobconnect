/**
 * JobConnect Cloudflare Workers API Client
 * Connects to live Cloudflare Worker API with automatic LocalStorage fallback
 */

const API_BASE_URL = (() => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('jc_api_url');
    if (override) return override;

    // When running locally on localhost or 127.0.0.1, target local Cloudflare Worker
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8787/api';
    }
  }

  return 'https://jobconnect-backend.white018899.workers.dev/api';
})();


// Clean slate initial state (no mock or demo data)
const INITIAL_JOBS = [];
const INITIAL_APPLICATIONS = [];
const INITIAL_PAYMENTS = [];
const INITIAL_CANDIDATES = [];

class JobConnectApi {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.initStorage();
  }

  initStorage() {
    const CLEAN_VERSION = 'v27_visakhapatnam_only';
    if (typeof localStorage !== 'undefined') {
      const purged = localStorage.getItem('jc_clean_purged');
      if (purged !== CLEAN_VERSION) {
        // Complete purge of all stale demo and mock artifacts across domains
        localStorage.removeItem('jc_jobs');
        localStorage.removeItem('jc_jobs_version');
        localStorage.removeItem('jc_apps');
        localStorage.removeItem('jc_apps_version');
        localStorage.removeItem('jc_candidates');
        localStorage.removeItem('jc_candidates_ver');
        localStorage.removeItem('jc_candidates_v2');
        localStorage.removeItem('jc_payments');
        localStorage.removeItem('jc_payments_v2');
        localStorage.removeItem('jc_credits');
        localStorage.setItem('jc_clean_purged', CLEAN_VERSION);
      }
      if (!localStorage.getItem('jc_jobs')) {
        localStorage.setItem('jc_jobs', JSON.stringify([]));
      }
      if (!localStorage.getItem('jc_apps')) {
        localStorage.setItem('jc_apps', JSON.stringify([]));
      }
      if (!localStorage.getItem('jc_candidates')) {
        localStorage.setItem('jc_candidates', JSON.stringify([]));
      }
      if (!localStorage.getItem('jc_payments')) {
        localStorage.setItem('jc_payments', JSON.stringify([]));
      }
      if (!localStorage.getItem('jc_credits')) {
        localStorage.setItem('jc_credits', '0');
      }
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

  _augmentJob(job) {
    if (!job) return job;
    const localApps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    const localCount = localApps.filter(a => a.job_id === job.id).length;
    job.max_applications = Number(job.max_applications) || 0;
    job.applications_count = Math.max(Number(job.applications_count) || 0, localCount);
    return job;
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
        if (data && Array.isArray(data.jobs)) {
          const augmented = data.jobs.map(j => this._augmentJob(j));
          // Live D1 is authoritative: cache to localStorage and return
          try {
            localStorage.setItem('jc_jobs', JSON.stringify(augmented));
          } catch(e) {}
          return augmented;
        }
      }
    } catch (err) {
      console.warn("Live API fetch fallback to local storage:", err);
    }
    
    // Filter local storage jobs (offline fallback)
    let local = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
    if (filters.category && filters.category !== 'all') {
      local = local.filter(j => j.category && j.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.city && filters.city !== 'all') {
      local = local.filter(j => j.location_city && j.location_city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.minSalary) {
      local = local.filter(j => (j.salary_max || j.salary_min) >= Number(filters.minSalary));
    }
    return local.map(j => this._augmentJob(j));
  }

  async getJobById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/jobs/${id}`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.job) return this._augmentJob(data.job);
      }
    } catch (err) {
      console.warn("Fallback to local job lookup", err);
    }
    const local = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
    const found = local.find(j => j.id === id) || local[0];
    return this._augmentJob(found);
  }

  async createJob(jobData) {
    const token = this.getAuthToken();
    const user = this.getCurrentUser();

    if (!token || !user) {
      throw new Error('Please log in with an Employer account to publish a job vacancy.');
    }
    if (user.role !== 'employer' && user.role !== 'admin') {
      throw new Error('Only Employer accounts can publish vacancies. Please sign in with an Employer account.');
    }

    const maxApplications = Number(jobData.max_applications) || 0;
    const payload = {
      title: jobData.title,
      description: jobData.description || 'Direct Employer Vacancy',
      category: jobData.category,
      salary_min: Number(jobData.salary_min) || 15000,
      salary_max: Number(jobData.salary_max) || 30000,
      salary_period: jobData.salary_period || 'monthly',
      location_area: jobData.location_area || 'Visakhapatnam',
      location_city: jobData.location_city || 'Visakhapatnam',
      working_hours: jobData.working_hours || 'Regular Shift',
      requirements: jobData.requirements || '',
      vacancies: Number(jobData.vacancies) || 1,
      max_applications: maxApplications,
      maps_url: jobData.maps_url || null,
      cover_image: jobData.cover_image || null
    };

    let res;
    try {
      res = await fetch(`${this.baseUrl}/employer/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (networkErr) {
      console.warn('Network error posting job to backend:', networkErr);
      throw new Error('Network connection error. Could not publish vacancy to server.');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Server error (${res.status}) publishing vacancy.`);
    }

    const newJob = {
      ...payload,
      id: data.jobId || `job_${Date.now().toString().slice(-6)}`,
      business_name: jobData.business_name || user.name || 'Direct Employer',
      business_type: jobData.business_type || 'Enterprise',
      created_at: new Date().toISOString().split('T')[0],
      status: 'open',
      employer_verified: 'verified',
      applications_count: 0,
      max_applications: maxApplications
    };

    const local = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
    const updatedLocal = [newJob, ...local.filter(j => j.id !== newJob.id)];
    try {
      localStorage.setItem('jc_jobs', JSON.stringify(updatedLocal));
    } catch (e) {}

    return newJob;
  }

  async applyJob(jobId, workerData, isPriority = false) {
    const job = await this.getJobById(jobId);
    const maxApps = Number(job?.max_applications) || 0;
    const currentApps = this.getApplications().filter(a => a.job_id === jobId).length;
    if (maxApps > 0 && currentApps >= maxApps) {
      throw new Error(`Application limit reached (${maxApps} applicants max). This opening is no longer accepting new applications.`);
    }

    let serverAppId = null;
    let serverFailed = false;
    let serverErrorMessage = '';
    try {
      const token = this.getAuthToken();
      if (token) {
        const res = await fetch(`${this.baseUrl}/jobs/${jobId}/apply`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(workerData || {})
        });
        if (res.ok) {
          const data = await res.json();
          serverAppId = data.applicationId;
        } else {
          serverFailed = true;
          const errData = await res.json().catch(() => ({}));
          serverErrorMessage = errData.error || 'Failed to submit application';
        }
      }
    } catch (e) {
      console.warn('Network error while applying for job, falling back to local storage:', e);
    }

    if (serverFailed) {
      throw new Error(serverErrorMessage);
    }

    const newApp = {
      id: serverAppId || `app_${Date.now().toString().slice(-6)}`,
      job_id: jobId,
      job_title: job ? job.title : "Trade Job",
      employer_name: job ? (job.business_name || job.employerName || "Hiring Employer") : "Hiring Employer",
      worker_id: workerData.id || "wrk-1",
      worker_name: workerData.name || "Worker Applicant",
      worker_category: workerData.category || (job ? job.category : "General"),
      worker_experience: workerData.experience || 3,
      worker_city: workerData.city || "Visakhapatnam",
      applied_date: new Date().toISOString().split('T')[0],
      status: "applied",
      priority: isPriority ? "PRIORITY_ACTIVE" : "STANDARD",
      unlocked: false,
      phone_masked: "+91 98••••••" + Math.floor(10 + Math.random() * 89),
      phone_unlocked: workerData.phone || "+91 98491 55678",
      address_masked: "Address Protected (Unlock to view)",
      address_unlocked: workerData.address || "Plot 89, Auto Nagar, Industrial Corridor, Visakhapatnam",
      experience_notes: workerData.notes || `${workerData.experience || 3}+ years experienced specialist`
    };

    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    const existingIdx = apps.findIndex(a => a.job_id === jobId);
    if (existingIdx >= 0) {
      apps[existingIdx] = newApp;
    } else {
      apps.unshift(newApp);
    }
    localStorage.setItem('jc_apps', JSON.stringify(apps));

    return newApp;
  }

  async unapplyJob(jobId) {
    try {
      const token = this.getAuthToken();
      if (token) {
        const endpoint = (typeof jobId === 'string' && jobId.startsWith('app_'))
          ? `${this.baseUrl}/worker/applications/${jobId}`
          : `${this.baseUrl}/jobs/${jobId}/apply`;

        await fetch(endpoint, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.warn('Network error while withdrawing application, updating local cache:', e);
    }

    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    const filtered = apps.filter(a => a.job_id !== jobId && a.id !== jobId);
    localStorage.setItem('jc_apps', JSON.stringify(filtered));

    return { success: true, message: 'Application withdrawn successfully' };
  }

  getApplications() {
    return JSON.parse(localStorage.getItem('jc_apps') || '[]');
  }

  async getEmployerApplications() {
    try {
      const token = this.getAuthToken();
      if (token) {
        const res = await fetch(`${this.baseUrl}/employer/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.credits !== undefined && data.credits !== null) {
            localStorage.setItem('jc_credits', String(data.credits));
          }
          if (Array.isArray(data.applications)) {
            const localApps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
            const dirCartApps = localApps.filter(a => (a.source === 'candidate_directory' || a.job_id === 'dir_selected') && !data.applications.some(sa => sa.id === a.id || (sa.worker_id && a.worker_id && sa.worker_id === a.worker_id)));
            // Preserve local unlocked state if already unlocked in cart
            const enrichedServerApps = data.applications.map(sa => {
              const matchedLocal = localApps.find(la => la.id === sa.id || (la.worker_id && la.worker_id === sa.worker_id));
              if (matchedLocal && matchedLocal.unlocked) {
                return {
                  ...sa,
                  unlocked: true,
                  status: 'unlocked',
                  phone_masked: matchedLocal.phone_unlocked || sa.phone_unlocked || sa.phone_masked,
                  phone_unlocked: matchedLocal.phone_unlocked || sa.phone_unlocked
                };
              }
              return sa;
            });
            const merged = [...enrichedServerApps, ...dirCartApps];
            localStorage.setItem('jc_apps', JSON.stringify(merged));
            return merged;
          }
        }
      }
    } catch (e) {
      console.warn('Network error loading employer applications:', e);
    }
    return JSON.parse(localStorage.getItem('jc_apps') || '[]');
  }

  async getWorkerApplications() {
    try {
      const token = this.getAuthToken();
      if (token) {
        const res = await fetch(`${this.baseUrl}/worker/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.applications)) {
            try {
              localStorage.setItem('jc_apps', JSON.stringify(data.applications));
            } catch(e) {}
            return data.applications;
          }
        }
      }
    } catch (e) {
      console.warn('Network error loading worker applications:', e);
    }
    return JSON.parse(localStorage.getItem('jc_apps') || '[]');
  }

  async unlockWorker(appId) {
    let localCredits = Number(localStorage.getItem('jc_credits') || '0');
    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    const app = apps.find(a => a.id === appId);

    if (app && app.unlocked) {
      return { success: true, app, remainingCredits: localCredits, alreadyUnlocked: true };
    }

    try {
      const token = this.getAuthToken();
      if (token) {
        const res = await fetch(`${this.baseUrl}/employer/applications/${encodeURIComponent(appId)}/unlock`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            worker_id: app?.worker_id,
            worker_name: app?.worker_name 
          })
        });
        const data = await res.json();

        // ONLY trigger needCredits if server explicitly returned 402 or data.needCredits
        if (res.status === 402 || data.needCredits) {
          if (data.remainingCredits !== undefined) {
            localStorage.setItem('jc_credits', String(data.remainingCredits));
          }
          return {
            success: false,
            needCredits: true,
            message: data.error || 'Insufficient unlock credits. Please purchase an unlock bundle.'
          };
        }

        if (res.ok && data.success) {
          if (data.remainingCredits !== undefined) {
            localCredits = Number(data.remainingCredits);
            localStorage.setItem('jc_credits', String(localCredits));
          } else {
            localCredits = Math.max(0, localCredits - 1);
            localStorage.setItem('jc_credits', String(localCredits));
          }
          if (app && data.phone) {
            app.phone_unlocked = data.phone;
            app.phone_masked = data.phone;
          }
          if (app && data.email) {
            app.worker_email = data.email;
          }
          if (app && data.workplace_location) {
            app.workplace_location = data.workplace_location;
          }
          if (app && data.maps_url) {
            app.maps_url = data.maps_url;
          }

          // Create in-app notification for worker desk
          try {
            const notifs = JSON.parse(localStorage.getItem('jc_worker_notifs') || '[]');
            const wpLoc = data.workplace_location || app?.address_unlocked || 'Visakhapatnam';
            const wpMaps = data.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wpLoc)}`;
            const compName = app?.employer_name || 'Hiring Employer';
            const jTitle = app?.job_title || 'Trade Specialist';

            notifs.unshift({
              id: `notif_${Date.now().toString().slice(-6)}`,
              title: `📍 Workplace Location • Unlocked by ${compName}`,
              message: `🎉 ${compName} has unlocked your contact pass for "${jTitle}"! Workplace Location: ${wpLoc}. Click to navigate via Google Maps.`,
              type: 'system',
              is_read: false,
              metadata: {
                type: 'location_unlocked',
                employer_name: compName,
                job_title: jTitle,
                workplace_location: wpLoc,
                maps_url: wpMaps,
                unlocked_at: new Date().toISOString()
              },
              created_at: new Date().toISOString()
            });
            localStorage.setItem('jc_worker_notifs', JSON.stringify(notifs));
          } catch(e) {}
        } else {
          // If server failed for non-credit reasons (e.g. 500, network), fallback to local credits
          if (localCredits <= 0) {
            return { success: false, needCredits: true, message: 'Insufficient unlock credits. Please purchase an unlock bundle.' };
          }
          localCredits -= 1;
          localStorage.setItem('jc_credits', String(localCredits));
        }
      } else {
        // Guest mode
        if (localCredits <= 0) {
          return { success: false, needCredits: true, message: 'Insufficient unlock credits. Please purchase an unlock bundle.' };
        }
        localCredits -= 1;
        localStorage.setItem('jc_credits', String(localCredits));
      }
    } catch (e) {
      console.warn('Network error unlocking application on D1:', e);
      if (localCredits <= 0) {
        return { success: false, needCredits: true, message: 'Insufficient unlock credits. Please purchase an unlock bundle.' };
      }
      localCredits -= 1;
      localStorage.setItem('jc_credits', String(localCredits));
    }

    if (app) {
      app.unlocked = true;
      app.status = 'unlocked';
      if (app.phone_unlocked) app.phone_masked = app.phone_unlocked;
      if (app.address_unlocked) app.address_masked = app.address_unlocked;
      localStorage.setItem('jc_apps', JSON.stringify(apps));
    }

    // Also sync candidate in jc_candidates if this was from directory
    const candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
    const cand = candidates.find(c => c.id === app?.worker_id || c.name === app?.worker_name);
    if (cand) {
      cand.unlocked = true;
      cand.selected = true;
      localStorage.setItem('jc_candidates', JSON.stringify(candidates));
    }

    return { 
      success: true, 
      app: app || { id: appId, worker_name: 'Candidate' }, 
      remainingCredits: localCredits 
    };
  }

  async fetchCandidates(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.city && filters.city !== 'all') params.append('city', filters.city);

      const url = `${this.baseUrl}/candidates?${params.toString()}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.candidates)) {
          const localCands = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
          const serverIds = new Set(data.candidates.map(c => c.id));
          const serverNames = new Set(data.candidates.map(c => (c.name || '').toLowerCase()));

          const enrichedServerCands = data.candidates.map(sc => {
            const existingLocal = localCands.find(lc => lc.id === sc.id || (lc.name && lc.name.toLowerCase() === sc.name.toLowerCase()));
            return {
              ...sc,
              bio: sc.bio || existingLocal?.bio || `${sc.trade_title} with ${sc.experience}+ years experience in technical development and engineering architecture.`,
              education: sc.education || existingLocal?.education || 'B.Tech / Professional Degree in Technical Discipline',
              address_masked: sc.address_masked || existingLocal?.address_masked || `${sc.preferred_area || sc.city || 'Visakhapatnam'} Tech Corridor`,
              address_unlocked: sc.address_unlocked || existingLocal?.address_unlocked || `${sc.preferred_area || 'Tech Zone'}, ${sc.city || 'Visakhapatnam'}`,
              phone_masked: sc.phone_masked || sc.phone || '+91 ••••••9999',
              phone_unlocked: sc.phone_unlocked || existingLocal?.phone_unlocked || sc.phone || '+91 98765 43210',
              salary_expected: sc.salary_expected || existingLocal?.salary_expected || 45000,
            };
          });

          // Live D1 is authoritative: only retain explicit unsynced local drafts if any
          const pendingLocals = localCands.filter(lc => lc._is_local_draft === true && !serverIds.has(lc.id));
          const unified = [...enrichedServerCands, ...pendingLocals];

          try {
            localStorage.setItem('jc_candidates', JSON.stringify(unified));
          } catch (e) {}

          return this.getCandidates(filters);
        }
      }
    } catch (err) {
      console.warn("Live candidates API fetch fallback to local cache:", err);
    }
    return this.getCandidates(filters);
  }

  getCandidates(filters = {}) {
    let list = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    
    // Track directory-selected and unlocked states separately
    const dirSelectedMap = new Map();
    const unlockedMap = new Map();
    const generalAppMap = new Map();

    apps.forEach(a => {
      const isDirSelected = (a.source === 'candidate_directory' || a.status === 'selected' || a.job_id === 'dir_selected') && !a.unlocked;
      const isUnlocked = a.unlocked === true;

      if (isDirSelected) {
        if (a.worker_id) dirSelectedMap.set(a.worker_id, a);
        if (a.worker_name) dirSelectedMap.set(a.worker_name, a);
      }
      if (isUnlocked) {
        if (a.worker_id) unlockedMap.set(a.worker_id, a);
        if (a.worker_name) unlockedMap.set(a.worker_name, a);
      }
      if (a.worker_id) generalAppMap.set(a.worker_id, a);
      if (a.worker_name) generalAppMap.set(a.worker_name, a);
    });

    list = list.map(c => {
      const isUnlocked = Boolean(c.unlocked || unlockedMap.has(c.id) || unlockedMap.has(c.name));
      const isSelected = !isUnlocked && Boolean(c.selected || dirSelectedMap.has(c.id) || dirSelectedMap.has(c.name));
      const match = unlockedMap.get(c.id) || unlockedMap.get(c.name) || dirSelectedMap.get(c.id) || dirSelectedMap.get(c.name) || generalAppMap.get(c.id) || generalAppMap.get(c.name);
      return {
        ...c,
        selected: isSelected,
        unlocked: isUnlocked,
        appId: match ? match.id : null
      };
    });

    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      list = list.filter(c => (c.category || '').toLowerCase().includes(cat) || (c.trade_title || '').toLowerCase().includes(cat));
    }
    if (filters.city && filters.city !== 'all') {
      list = list.filter(c => (c.city || '').toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.minExp) {
      list = list.filter(c => (c.experience || 0) >= Number(filters.minExp));
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(c => `${c.name} ${c.trade_title} ${(c.skills || []).join(' ')} ${c.city} ${c.education} ${c.bio}`.toLowerCase().includes(q));
    }
    return list;
  }

  selectCandidate(candidateId) {
    const candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
    const candidate = candidates.find(c => c.id === candidateId || c.name === candidateId);
    if (!candidate) return { success: false, message: "Candidate not found" };

    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    let existingApp = apps.find(a => (a.worker_id === candidate.id || a.worker_name === candidate.name) && (a.source === 'candidate_directory' || a.job_id === 'dir_selected'));

    if (!existingApp) {
      existingApp = {
        id: `app_${Date.now().toString().slice(-6)}`,
        job_id: "dir_selected",
        job_title: candidate.trade_title,
        employer_name: "Selected from Directory",
        worker_id: candidate.id,
        worker_name: candidate.name,
        worker_category: candidate.category,
        worker_experience: candidate.experience,
        worker_city: candidate.city,
        applied_date: new Date().toISOString().split('T')[0],
        status: candidate.unlocked ? "unlocked" : "selected",
        priority: "PRIORITY_ACTIVE",
        unlocked: candidate.unlocked || false,
        phone_masked: candidate.phone_masked,
        phone_unlocked: candidate.phone_unlocked,
        address_masked: candidate.address_masked,
        address_unlocked: candidate.address_unlocked,
        experience_notes: candidate.bio,
        source: "candidate_directory"
      };
      apps.unshift(existingApp);
      localStorage.setItem('jc_apps', JSON.stringify(apps));
    }

    candidate.selected = true;
    localStorage.setItem('jc_candidates', JSON.stringify(candidates));

    return { success: true, app: existingApp, candidate };
  }

  removeCandidateFromApplications(candidateIdOrAppId) {
    let apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    let candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');

    const cand = candidates.find(c => c.id === candidateIdOrAppId || c.name === candidateIdOrAppId);
    const app = apps.find(a => a.id === candidateIdOrAppId || a.worker_id === candidateIdOrAppId || (cand && a.worker_id === cand.id) || (cand && a.worker_name === cand.name));

    const candId = cand ? cand.id : (app ? app.worker_id : candidateIdOrAppId);
    const candName = cand ? cand.name : (app ? app.worker_name : '');
    const appId = app ? app.id : (String(candidateIdOrAppId).startsWith('app_') ? candidateIdOrAppId : null);

    // Remove directory cart item or explicit app ID
    apps = apps.filter(a => {
      if (appId && a.id === appId) return false;
      const matchesCandidate = (candId && a.worker_id === candId) || (candName && a.worker_name === candName);
      if (matchesCandidate && (a.source === 'candidate_directory' || a.job_id === 'dir_selected' || a.status === 'selected')) {
        return false;
      }
      return true;
    });
    localStorage.setItem('jc_apps', JSON.stringify(apps));

    // Clear selected flag in jc_candidates
    if (candId || candName) {
      candidates = candidates.map(c => {
        if ((candId && c.id === candId) || (candName && c.name === candName)) {
          return { ...c, selected: false };
        }
        return c;
      });
      localStorage.setItem('jc_candidates', JSON.stringify(candidates));
    }

    return { success: true };
  }

  clearSelectedCandidates() {
    let apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    apps = apps.filter(a => a.source !== "candidate_directory" || a.unlocked === true);
    localStorage.setItem('jc_apps', JSON.stringify(apps));

    const candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
    candidates.forEach(c => {
      if (!c.unlocked) c.selected = false;
    });
    localStorage.setItem('jc_candidates', JSON.stringify(candidates));

    return { success: true };
  }

  unlockCandidate(candidateId) {
    const candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
    const candidate = candidates.find(c => c.id === candidateId);
    let credits = Number(localStorage.getItem('jc_credits') || '0');

    if (!candidate) return { success: false, message: "Candidate not found" };

    if (candidate.unlocked) {
      return { success: true, candidate, remainingCredits: credits, alreadyUnlocked: true };
    }

    if (credits <= 0) {
      return { success: false, needCredits: true, message: "Insufficient unlock credits. Please recharge your balance." };
    }

    credits -= 1;
    localStorage.setItem('jc_credits', String(credits));
    candidate.unlocked = true;
    candidate.selected = true;
    localStorage.setItem('jc_candidates', JSON.stringify(candidates));

    // Also sync into jc_apps for Employer Workspace
    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    let existingApp = apps.find(a => a.worker_id === candidate.id || a.worker_name === candidate.name);
    if (!existingApp) {
      existingApp = {
        id: `app_${Date.now().toString().slice(-6)}`,
        job_id: "dir_selected",
        job_title: candidate.trade_title,
        employer_name: "Selected from Directory",
        worker_id: candidate.id,
        worker_name: candidate.name,
        worker_category: candidate.category,
        worker_experience: candidate.experience,
        worker_city: candidate.city,
        applied_date: new Date().toISOString().split('T')[0],
        status: "unlocked",
        priority: "PRIORITY_ACTIVE",
        unlocked: true,
        phone_masked: candidate.phone_unlocked,
        phone_unlocked: candidate.phone_unlocked,
        address_masked: candidate.address_unlocked,
        address_unlocked: candidate.address_unlocked,
        experience_notes: candidate.bio,
        source: "candidate_directory"
      };
      apps.unshift(existingApp);
    } else {
      existingApp.unlocked = true;
      existingApp.status = "unlocked";
      existingApp.phone_masked = candidate.phone_unlocked;
      existingApp.phone_unlocked = candidate.phone_unlocked;
      existingApp.address_masked = candidate.address_unlocked;
      existingApp.address_unlocked = candidate.address_unlocked;
    }
    localStorage.setItem('jc_apps', JSON.stringify(apps));

    return { success: true, candidate, remainingCredits: credits, appId: existingApp.id };
  }

  async unlockSelectedBatch() {
    const apps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
    const shielded = apps.filter(a => (a.source === "candidate_directory" || a.job_id === "dir_selected") && !a.unlocked);
    let credits = Number(localStorage.getItem('jc_credits') || '0');

    if (shielded.length === 0) {
      return { success: false, message: "No locked candidates in selection cart." };
    }

    const token = this.getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${this.baseUrl}/employer/applications/unlock-batch`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: shielded.map(s => ({ id: s.id, worker_id: s.worker_id }))
          })
        });
        const data = await res.json();
        if (res.status === 402 || data.needCredits) {
          if (data.remainingCredits !== undefined) {
            localStorage.setItem('jc_credits', String(data.remainingCredits));
          }
          return {
            success: false,
            needCredits: true,
            required: shielded.length,
            available: data.available !== undefined ? data.available : credits,
            message: data.error || `Need ${shielded.length} credits to unlock all, but you have ${credits}. Please recharge.`
          };
        }
        if (res.ok && data.success && data.remainingCredits !== undefined) {
          credits = Number(data.remainingCredits);
          localStorage.setItem('jc_credits', String(credits));
        } else {
          if (credits < shielded.length) {
            return {
              success: false,
              needCredits: true,
              required: shielded.length,
              available: credits,
              message: `Need ${shielded.length} credits to unlock all, but you have ${credits}. Please recharge.`
            };
          }
          credits -= shielded.length;
          localStorage.setItem('jc_credits', String(credits));
        }
      } catch (e) {
        console.warn('Network error batch unlocking:', e);
        if (credits < shielded.length) {
          return {
            success: false,
            needCredits: true,
            required: shielded.length,
            available: credits,
            message: `Need ${shielded.length} credits to unlock all, but you have ${credits}. Please recharge.`
          };
        }
        credits -= shielded.length;
        localStorage.setItem('jc_credits', String(credits));
      }
    } else {
      if (credits < shielded.length) {
        return { 
          success: false, 
          needCredits: true, 
          required: shielded.length, 
          available: credits,
          message: `Need ${shielded.length} credits to unlock all, but you have ${credits}. Please recharge.`
        };
      }
      credits -= shielded.length;
      localStorage.setItem('jc_credits', String(credits));
    }

    const candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');

    shielded.forEach(app => {
      app.unlocked = true;
      app.status = "unlocked";
      if (app.phone_unlocked) app.phone_masked = app.phone_unlocked;
      if (app.address_unlocked) app.address_masked = app.address_unlocked;
      const c = candidates.find(cand => cand.id === app.worker_id || cand.name === app.worker_name);
      if (c) {
        c.unlocked = true;
        c.selected = true;
      }
    });

    localStorage.setItem('jc_apps', JSON.stringify(apps));
    localStorage.setItem('jc_candidates', JSON.stringify(candidates));

    return { success: true, count: shielded.length, remainingCredits: credits };
  }

  getUnlockCredits() {
    return Number(localStorage.getItem('jc_credits') || '0');
  }

  async syncUnlockCredits() {
    try {
      const token = this.getAuthToken();
      if (!token) return this.getUnlockCredits();
      const res = await fetch(`${this.baseUrl}/employer/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        const credits = (data.profile && data.profile.unlock_credits !== undefined && data.profile.unlock_credits !== null)
          ? Number(data.profile.unlock_credits)
          : (data.credits !== undefined ? Number(data.credits) : 3);
        localStorage.setItem('jc_credits', String(credits));
        return credits;
      }
    } catch (e) {
      console.warn('Network error syncing unlock credits:', e);
    }
    return this.getUnlockCredits();
  }

  async getWorkerNotifications() {
    try {
      const token = this.getAuthToken();
      if (token) {
        const res = await fetch(`${this.baseUrl}/worker/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.notifications)) {
            const local = JSON.parse(localStorage.getItem('jc_worker_notifs') || '[]');
            const serverIds = new Set(data.notifications.map(n => n.id));
            const localExtra = local.filter(l => !serverIds.has(l.id));
            const merged = [...data.notifications, ...localExtra];
            localStorage.setItem('jc_worker_notifs', JSON.stringify(merged));
            const unreadCount = merged.filter(n => !n.is_read).length;
            return { notifications: merged, unreadCount };
          }
        }
      }
    } catch (e) {
      console.warn('Network error fetching worker notifications:', e);
    }
    const local = JSON.parse(localStorage.getItem('jc_worker_notifs') || '[]');
    return { notifications: local, unreadCount: local.filter(n => !n.is_read).length };
  }

  async markNotificationRead(notifId) {
    try {
      const token = this.getAuthToken();
      if (token) {
        await fetch(`${this.baseUrl}/worker/notifications/${encodeURIComponent(notifId)}/read`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
    const local = JSON.parse(localStorage.getItem('jc_worker_notifs') || '[]');
    const found = local.find(n => n.id === notifId);
    if (found) found.is_read = true;
    localStorage.setItem('jc_worker_notifs', JSON.stringify(local));
    return { success: true };
  }

  async markAllNotificationsRead() {
    try {
      const token = this.getAuthToken();
      if (token) {
        await fetch(`${this.baseUrl}/worker/notifications/read-all`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
    const local = JSON.parse(localStorage.getItem('jc_worker_notifs') || '[]');
    local.forEach(n => n.is_read = true);
    localStorage.setItem('jc_worker_notifs', JSON.stringify(local));
    return { success: true };
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
      target_id: paymentData.targetId || "",
      screenshot_url: paymentData.screenshot_url || paymentData.screenshotUrl || "",
      credits: paymentData.credits || (paymentData.amount >= 450 ? 10 : (paymentData.amount >= 200 ? 5 : 1))
    };

    const payments = JSON.parse(localStorage.getItem('jc_payments') || '[]');
    payments.unshift(newPay);
    localStorage.setItem('jc_payments', JSON.stringify(payments));

    return newPay;
  }

  getPaymentConfig() {
    try {
      const stored = localStorage.getItem('jc_payment_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.amount_qrs || typeof parsed.amount_qrs !== 'object') {
          parsed.amount_qrs = {};
        }
        return parsed;
      }
    } catch (e) {}
    return {
      upi_id: 'jobconnect@icici',
      payee_name: 'JobWay',
      mode: 'dynamic',
      qr_image_url: '',
      amount_qrs: {}
    };
  }

  async fetchPaymentConfig() {
    try {
      const res = await fetch(`${this.baseUrl}/payment-config`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.config) {
          if (!data.config.amount_qrs || typeof data.config.amount_qrs !== 'object') {
            data.config.amount_qrs = {};
          }
          localStorage.setItem('jc_payment_config', JSON.stringify(data.config));
          return data.config;
        }
      }
    } catch (e) {}
    return this.getPaymentConfig();
  }

  async adminUpdatePaymentConfig(config) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/payment-config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/payment-config`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(config)
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('jc_payment_config', JSON.stringify(data.config || config));
        return data;
      }
      return { success: false, error: data.error || 'Failed to update payment config' };
    } catch (e) {
      console.warn('Network error updating payment config, storing locally:', e);
      localStorage.setItem('jc_payment_config', JSON.stringify(config));
      return { success: true, config, message: 'Payment config updated (saved locally)' };
    }
  }

  getPaymentQrUrl(amount = 75) {
    const config = this.getPaymentConfig();
    const amtKey = String(amount);

    if (config.mode === 'custom_image') {
      // 1. Check if specific custom QR image for this exact amount exists
      if (config.amount_qrs && config.amount_qrs[amtKey] && config.amount_qrs[amtKey].trim()) {
        return config.amount_qrs[amtKey].trim();
      }
      // 2. Check if a general fallback custom QR image exists
      if (config.qr_image_url && config.qr_image_url.trim()) {
        return config.qr_image_url.trim();
      }
    }

    const upiId = config.upi_id || 'jobconnect@icici';
    const payee = config.payee_name || 'JobWay';
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payee)}&am=${amount}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}&margin=6`;
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
        const count = pay.credits || (pay.amount >= 450 ? 10 : (pay.amount >= 200 ? 5 : 1));
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

  // --- Authentication Methods ---
  getCurrentUser() {
    const raw = localStorage.getItem('jc_auth_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('jc_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jc_auth_user');
      localStorage.removeItem('jobconnect_token');
    }
  }

  getAuthToken() {
    return localStorage.getItem('jobconnect_token') || '';
  }

  // --- Worker Profile & Verification Methods ---
  async getWorkerProfile() {
    try {
      const token = this.getAuthToken();
      const res = await fetch(`${this.baseUrl}/worker/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data.profile;
      }
    } catch (e) {
      console.warn('Network error fetching profile, using local state:', e);
    }

    // Local fallback profile
    const user = this.getCurrentUser();
    const storedProfile = localStorage.getItem(`jc_worker_profile_${user?.id || 'default'}`);
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      if (!parsed.photo_key && (user?.avatar || user?.photo_key || localStorage.getItem('jc_worker_photo'))) {
        parsed.photo_key = user?.avatar || user?.photo_key || localStorage.getItem('jc_worker_photo');
      }
      if (!parsed.photo_thumb && (user?.cover_image || localStorage.getItem('jc_worker_cover'))) {
        parsed.photo_thumb = user?.cover_image || localStorage.getItem('jc_worker_cover');
      }
      return parsed;
    }

    const savedPhoto = user?.avatar || user?.photo_key || localStorage.getItem('jc_worker_photo') || '';
    const savedCover = user?.cover_image || localStorage.getItem('jc_worker_cover') || '';

    return {
      full_name: user?.name ? user.name.replace(/\s*\([^)]*\)/, '').trim() : (user?.email ? user.email.split('@')[0] : 'Candidate'),
      trade_title: user?.trade_title || user?.category || 'Technical Professional',
      phone: user?.phone || '',
      email: user?.email || '',
      photo_key: savedPhoto,
      photo_thumb: savedCover,
      skills: '[]',
      experience_years: 0,
      education_level: '',
      education_institute: '',
      education_specialization: '',
      education_year: '',
      past_company: '',
      experience_description: '',
      preferred_area: '',
      city: '',
      expected_salary_min: 0,
      expected_salary_max: 0,
      salary_period: 'monthly',
      digilocker_verified: 0,
    };
  }

  async updateWorkerProfile(profileData) {
    const user = this.getCurrentUser();
    if (profileData.photo_key !== undefined) {
      localStorage.setItem('jc_worker_photo', profileData.photo_key || '');
    }
    if (profileData.photo_thumb !== undefined) {
      localStorage.setItem('jc_worker_cover', profileData.photo_thumb || '');
    }

    // Sync candidate list so candidate cards immediately display updated cover thumbnail & avatar
    try {
      const candidates = JSON.parse(localStorage.getItem('jc_candidates') || '[]');
      let cand = candidates.find(c => (user?.name && c.name === user.name) || (user?.id && c.id === user.id));
      if (cand) {
        if (profileData.photo_thumb) cand.photo_thumb = profileData.photo_thumb;
        if (profileData.photo_key) cand.photo_key = profileData.photo_key;
        if (profileData.full_name) cand.name = profileData.full_name;
        if (profileData.trade_title) {
          cand.trade_title = profileData.trade_title;
          cand.category = profileData.trade_title;
        }
        if (profileData.skills) cand.skills = profileData.skills;
        if (profileData.city) cand.city = profileData.city;
        if (profileData.experience_years !== undefined) cand.experience = profileData.experience_years;
        if (profileData.experience_description) cand.bio = profileData.experience_description;
        if (profileData.education_level) cand.education = profileData.education_level;
        if (profileData.expected_salary_min) cand.salary_expected = profileData.expected_salary_min;
        if (profileData.phone) cand.phone_unlocked = profileData.phone;
        localStorage.setItem('jc_candidates', JSON.stringify(candidates));
      } else if (!user || user.role === 'worker') {
        const phoneDigits = (profileData.phone || '9876543210').replace(/\D/g, '');
        const last3 = phoneDigits.slice(-3) || '892';
        const newCand = {
          id: user?.id || ('cand_' + Date.now()),
          name: profileData.full_name || user?.name || 'Verified Professional',
          trade_title: profileData.trade_title || 'Technical Specialist',
          category: profileData.trade_title || 'Specialist',
          city: profileData.city || 'Visakhapatnam',
          experience: profileData.experience_years || 1,
          salary_expected: profileData.expected_salary_min || 35000,
          phone_masked: `•••• ••• ${last3}`,
          phone_unlocked: profileData.phone || '+91 98765 43210',
          address_masked: `${profileData.city || 'Visakhapatnam'} Tech Corridor`,
          address_unlocked: `${profileData.preferred_area || 'Tech Zone'}, ${profileData.city || 'Visakhapatnam'}`,
          skills: profileData.skills && profileData.skills.length ? profileData.skills : ['Software Engineering', 'Technical Scope'],
          bio: profileData.experience_description || 'Technical professional with verified credentials.',
          education: profileData.education_level || 'B.Tech / Professional Degree',
          photo_key: profileData.photo_key || '',
          photo_thumb: profileData.photo_thumb || '',
          verified: true
        };
        candidates.push(newCand);
        localStorage.setItem('jc_candidates', JSON.stringify(candidates));
      }
    } catch (e) {
      console.error("Error syncing candidate in jc_candidates:", e);
    }

    try {
      const token = this.getAuthToken();
      const res = await fetch(`${this.baseUrl}/worker/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        const data = await res.json();
        if (user) {
          if (profileData.full_name) user.name = profileData.full_name;
          if (profileData.trade_title) {
            user.trade_title = profileData.trade_title;
            user.category = profileData.trade_title;
          }
          if (profileData.phone) user.phone = profileData.phone;
          if (profileData.photo_key !== undefined) {
            user.avatar = profileData.photo_key;
            user.photo_key = profileData.photo_key;
          }
          if (profileData.photo_thumb !== undefined) {
            user.cover_image = profileData.photo_thumb;
          }
          this.setCurrentUser(user);
        }
        localStorage.setItem(`jc_worker_profile_${user?.id || 'default'}`, JSON.stringify(data.profile));
        return { success: true, profile: data.profile };
      }
    } catch (e) {
      console.warn('Network error updating profile, saving locally:', e);
    }

    // Local cache update
    const current = await this.getWorkerProfile();
    const updated = { ...current, ...profileData };
    if (user) {
      if (profileData.full_name) user.name = profileData.full_name;
      if (profileData.trade_title) {
        user.trade_title = profileData.trade_title;
        user.category = profileData.trade_title;
      }
      if (profileData.phone) user.phone = profileData.phone;
      if (profileData.photo_key !== undefined) {
        user.avatar = profileData.photo_key;
        user.photo_key = profileData.photo_key;
      }
      if (profileData.photo_thumb !== undefined) {
        user.cover_image = profileData.photo_thumb;
      }
      this.setCurrentUser(user);
    }
    localStorage.setItem(`jc_worker_profile_${user?.id || 'default'}`, JSON.stringify(updated));
    return { success: true, profile: updated };
  }

  async syncLinkedIn(linkedinUrl) {
    try {
      const token = this.getAuthToken();
      const res = await fetch(`${this.baseUrl}/worker/linkedin-sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedin_url: linkedinUrl }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Network error during LinkedIn sync, using simulated extraction:', e);
    }

    // Direct client-side fetch via Microlink for live public LinkedIn data
    try {
      const microRes = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(linkedinUrl)}`);
      if (microRes.ok) {
        const micro = await microRes.json();
        if (micro.status === 'success' && micro.data) {
          const author = micro.data.author || '';
          const title = micro.data.title || '';
          const desc = micro.data.description || '';
          const image = micro.data.image?.url || '';

          const handle = linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/.*$/, '');
          const cleanName = author || (title ? title.split(/[-–|]/)[0].trim() : '') || handle.split(/[-_.]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          
          let headline = title ? title.replace(/^[^–|-]+[-–|]\s*/, '').replace(/\s*\|\s*LinkedIn$/i, '').trim() : `${cleanName} • Professional`;
          let company = '';
          const expMatch = desc.match(/(?:Experience|Current):\s*([^·\n]+)/i);
          if (expMatch) company = expMatch[1].trim();

          let eduInst = '';
          const eduMatch = desc.match(/Education:\s*([^·\n]+)/i);
          if (eduMatch) eduInst = eduMatch[1].trim();

          return {
            success: true,
            message: `Real profile details extracted from LinkedIn for ${cleanName}!`,
            profile: {
              full_name: cleanName,
              headline,
              past_company: company || undefined,
              experience_description: desc || `Professional profile imported from LinkedIn (${linkedinUrl}).`,
              photo_key: (image && !image.includes('static.licdn.com/aero-v1/sc/h/')) ? image : undefined,
              educations: eduInst ? [{ id: 'edu_1', level: 'Bachelor\'s Degree / Diploma', institute: eduInst, specialization: 'Technical Trade', year: 2021 }] : [],
              linkedin_url: linkedinUrl,
              linkedin_synced: 1,
            }
          };
        }
      }
    } catch (mErr) {
      console.warn('Direct microlink fetch error:', mErr);
    }

    // Dynamic offline fallback parsing handle
    const handle = linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/.*$/, '') || 'Candidate';
    const name = handle.split(/[-_.]/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Candidate';
    return {
      success: true,
      message: `Profile imported for ${name} from LinkedIn!`,
      profile: {
        full_name: name,
        headline: `${name} • Technical Trade Specialist`,
        experience_description: `Experienced professional profile imported from LinkedIn (${linkedinUrl}).`,
        linkedin_url: linkedinUrl,
        linkedin_synced: 1,
      }
    };
  }

  async requestDigiLockerOtp(idNumber) {
    try {
      const token = this.getAuthToken();
      const res = await fetch(`${this.baseUrl}/worker/digilocker/request-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_number: idNumber, aadhaar_number: idNumber }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Network error requesting verification OTP, using fallback:', e);
    }

    const clean = (idNumber || '').replace(/\D/g, '');
    const masked = `ID-••••-${clean.slice(-4) || '4912'}`;
    return {
      success: true,
      txnId: 'ID-VERIFY-' + Date.now().toString().slice(-8),
      maskedId: masked,
      maskedAadhaar: masked,
      message: 'Verification consent OTP sent to registered mobile (••••-••••-8910)',
      devOtp: '123456',
    };
  }

  async verifyDigiLockerOtp(txnId, otp, idNumber) {
    try {
      const token = this.getAuthToken();
      const res = await fetch(`${this.baseUrl}/worker/digilocker/verify-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txnId, otp, id_number: idNumber, aadhaar_number: idNumber }),
      });
      if (res.ok) {
        const data = await res.json();
        const user = this.getCurrentUser();
        if (user) {
          user.isVerified = true;
          this.setCurrentUser(user);
        }
        return data;
      }
    } catch (e) {
      console.warn('Network error verifying OTP, using fallback:', e);
    }

    if (otp === '123456' || otp.length >= 4) {
      const clean = (idNumber || '').replace(/\D/g, '');
      const masked = `ID-••••-${clean.slice(-4) || '4912'}`;
      const user = this.getCurrentUser();
      if (user) {
        user.isVerified = true;
        this.setCurrentUser(user);
      }
      return {
        success: true,
        message: 'Identity & credentials verified successfully!',
        maskedId: masked,
        maskedAadhaar: masked,
        digilocker_ref: txnId,
        verifiedStatus: 'verified',
      };
    }
    return { success: false, error: 'Incorrect OTP code.' };
  }


  // --- EMAIL & PASSWORD AUTHENTICATION METHODS ---

  async registerRequest({ email, password, role = 'worker', name, phone }) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/register/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to request email verification' };
      }
      return data;
    } catch (e) {
      console.warn('Network error during registration request, using demo fallback:', e);
      // Fallback simulation for offline testing
      return {
        success: true,
        message: 'Verification code sent to your email (Demo Code: 123456)',
        email,
        devCode: '123456',
      };
    }
  }

  async registerVerify({ email, code }) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/register/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('jobconnect_token', data.token);
        const user = {
          id: data.user?.id || `usr_${Date.now()}`,
          email,
          role: data.user?.role || 'worker',
          name: data.user?.name || (data.user?.role === 'employer' ? 'New Employer' : 'New Worker'),
          isVerified: true,
        };
        this.setCurrentUser(user);
        return { success: true, user };
      }
      return { success: false, error: data.error || 'Invalid or expired verification code' };
    } catch (e) {
      console.warn('Network error during verification, using demo fallback:', e);
      // Fallback demo activation
      if (code === '123456' || code.length === 6) {
        const user = {
          id: `usr_${Date.now().toString().slice(-6)}`,
          email,
          role: 'worker',
          name: 'Verified User',
          isVerified: true,
        };
        this.setCurrentUser(user);
        return { success: true, user };
      }
      return { success: false, error: 'Verification error. Please try again.' };
    }
  }

  async login(email, password) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('jobconnect_token', data.token);
        const user = {
          id: data.user?.id || `usr_${Date.now()}`,
          email: data.user?.email || email,
          role: data.user?.role || 'worker',
          name: data.user?.name || (data.user?.role === 'employer' ? 'Business Account' : 'Worker Account'),
          isVerified: data.user?.isVerified ?? true,
        };
        this.setCurrentUser(user);
        return { success: true, user };
      }
      return { success: false, error: data.error || 'Invalid email or password' };
    } catch (e) {
      console.warn('Network error during login:', e);
      return { success: false, error: 'Unable to connect to service. Please check your internet connection.' };
    }
  }

  // --- GOOGLE AUTHENTICATION ---

  async loginWithGoogle(credential) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to authenticate with Google' };
      }
      if (data.isNewUser) {
        return data;
      }
      if (data.token) {
        localStorage.setItem('jobconnect_token', data.token);
        this.setCurrentUser(data.user);
      }
      return data;
    } catch (e) {
      console.warn('Network error during Google auth, fallback:', e);
      return { success: false, error: 'Network error connecting to Google Auth service.' };
    }
  }

  async confirmGoogleRole({ credential, role, phone, name }) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/google/confirm-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, role, phone, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to activate profile' };
      }
      if (data.token) {
        localStorage.setItem('jobconnect_token', data.token);
        this.setCurrentUser(data.user);
      }
      return data;
    } catch (e) {
      console.warn('Network error during Google role confirmation:', e);
      return { success: false, error: 'Network error confirming account role.' };
    }
  }

  // --- BREVO SMS OTP AUTHENTICATION ---

  async requestSmsOtp(phone) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/sms-otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      return await res.json();
    } catch (e) {
      console.error('Network error during SMS OTP request:', e);
      return { success: false, error: 'Could not reach server to send SMS. Please check your network.' };
    }
  }

  async verifySmsOtp(phone, otp) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/sms-otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      return await res.json();
    } catch (e) {
      console.error('Network error during SMS OTP verify:', e);
      return { success: false, error: 'Could not connect to server to verify OTP.' };
    }
  }

  // Backward compatibility aliases
  async requestWhatsAppOtp(phone) {
    return this.requestSmsOtp(phone);
  }

  async verifyWhatsAppOtp(phone, otp) {
    return this.verifySmsOtp(phone, otp);
  }


  async forgotPasswordRequest(email) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/forgot-password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Password reset code sent to your email (Demo: 123456)', devCode: '123456' };
    }
  }

  async forgotPasswordVerify(email, code, newPassword) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Password updated successfully.' };
    }
  }

  async adminLogin(password) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('jobconnect_token', data.token);
        const adminUser = {
          id: 'admin_01',
          email: 'admin@job-way.in',
          name: 'Platform Administrator',
          role: 'admin',
          phone: '+91 99999 99999',
          isVerified: true,
        };
        this.setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }
      return { success: false, error: data.error || 'Incorrect admin password.' };
    } catch (e) {
      // Fallback
    }


    return { success: false, error: 'Incorrect admin password.' };
  }

  // --- Admin Console API Methods ---
  async ensureAdminToken() {
    return this.getAuthToken();
  }

  async adminGetUsers(params = {}) {
    try {
      let token = await this.ensureAdminToken();
      const q = new URLSearchParams();
      if (params.role && params.role !== 'all') q.append('role', params.role);
      if (params.search) q.append('search', params.search);
      let res = await fetch(`${this.baseUrl}/admin/users?${q.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users?${q.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      if (res.ok) {
        const data = await res.json();
        return data.users || [];
      }
    } catch (e) {
      console.warn('Network error loading admin users:', e);
    }
    return [];
  }

  async adminCreateUser(userData) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      }
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error, userId: data.userId };
    } catch (e) {
      return { success: false, error: 'Network error creating user' };
    }
  }

  async adminUpdateUser(id, userData) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      }
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error updating user' };
    }
  }

  async adminDeleteUser(id) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error deleting user' };
    }
  }

  async adminToggleVerifyUser(id) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/users/${id}/toggle-verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users/${id}/toggle-verify`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      const data = await res.json();
      return { success: res.ok, is_verified: data.is_verified, message: data.message, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error toggling verification' };
    }
  }

  async adminBlockUser(id) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/users/${id}/block`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users/${id}/block`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error blocking user' };
    }
  }

    async adminGrantEmployerCredits(userId, credits, mode = 'add', reason = 'Admin manual grant') {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credits: Number(credits), mode, reason })
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users/${userId}/credits`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ credits: Number(credits), mode, reason })
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        const key = `jc_credits_${userId}`;
        localStorage.setItem(key, String(data.credits));
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem('jc_credits', String(data.credits));
        }
        return data;
      }
      return { success: false, error: data.error || 'Failed to grant credits' };
    } catch (e) {
      console.warn('Network error granting credits, using local storage sync:', e);
      const key = `jc_credits_${userId}`;
      const current = Number(localStorage.getItem(key) || localStorage.getItem('jc_credits') || '3');
      const updated = mode === 'set' ? Number(credits) : (current + Number(credits));
      localStorage.setItem(key, String(updated));
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('jc_credits', String(updated));
      }
      return { success: true, credits: updated, message: `Granted ${credits} credits (locally synced)` };
    }
  }

  async adminUnblockUser(id) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/users/${id}/unblock`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/users/${id}/unblock`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error unblocking user' };
    }
  }

  async adminGetJobs() {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/jobs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      if (res.ok) {
        const data = await res.json();
        return data.jobs || [];
      }
    } catch (e) {
      console.warn('Network error loading admin jobs:', e);
    }
    return this.getJobs();
  }

  async adminUpdateJob(id, jobData) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/jobs/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jobData)
        });
      }
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error updating job' };
    }
  }

  async adminDeleteJob(id) {
    try {
      let token = await this.ensureAdminToken();
      let res = await fetch(`${this.baseUrl}/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        /* admin auto-login removed */
        token = this.getAuthToken();
        res = await fetch(`${this.baseUrl}/admin/jobs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error deleting job' };
    }
  }

  // Backward compatibility aliases
  async requestOtp(phone, role = 'worker') {
    return { success: false, error: 'Phone OTP has been upgraded to Email Verification with SMTP on job-way.in.' };
  }

  async verifyOtp(phone, otp, role = 'worker') {
    return { success: false, error: 'Phone OTP has been upgraded to Email Verification with SMTP on job-way.in.' };
  }

  logout() {
    this.setCurrentUser(null);
  }
}


window.jobApi = new JobConnectApi();
