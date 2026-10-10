/**
 * JobWay Public Homepage Controller
 * Pure Vanilla JavaScript • No React • Cloudflare Edge Integration
 */

document.addEventListener('DOMContentLoaded', async () => {
  let currentJobs = [];
  let selectedJob = null;

  // DOM Elements
  const authLoggedOut = document.getElementById('auth-logged-out');
  const authLoggedIn = document.getElementById('auth-logged-in');
  const homeDashboardLink = document.getElementById('home-dashboard-link');
  const homeUserName = document.getElementById('home-user-name');
  const homeUserIcon = document.getElementById('home-user-icon');
  const homeLogoutBtn = document.getElementById('home-logout-btn');

  const jobsGrid = document.getElementById('jobs-grid');
  const jobsCountBadge = document.getElementById('jobs-count-badge');
  const tradeChips = document.querySelectorAll('.trade-chip');
  const searchCategory = document.getElementById('search-category');
  const searchCity = document.getElementById('search-city');
  const searchSalary = document.getElementById('search-salary');
  const searchBtn = document.getElementById('search-btn');

  const jobDetailModal = document.getElementById('job-detail-modal');

  // Toast System
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span style="font-size: 16px;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 1. Check Session State
  function checkSession() {
    const user = window.jobApi.getCurrentUser();
    if (user) {
      if (authLoggedOut) authLoggedOut.style.display = 'none';
      if (authLoggedIn) authLoggedIn.style.display = 'flex';
      if (homeUserName) homeUserName.textContent = `${user.name} (${user.role.toUpperCase()})`;

      if (user.role === 'employer') {
        if (homeUserIcon) homeUserIcon.textContent = '🏢';
        if (homeDashboardLink) homeDashboardLink.href = '/employer.html';
      } else if (user.role === 'admin') {
        if (homeUserIcon) homeUserIcon.textContent = '🛡️';
        if (homeDashboardLink) homeDashboardLink.href = '/admin.html';
      } else {
        if (homeUserIcon) homeUserIcon.textContent = '👷';
        if (homeDashboardLink) homeDashboardLink.href = '/worker.html';
      }
    } else {
      if (authLoggedOut) authLoggedOut.style.display = 'flex';
      if (authLoggedIn) authLoggedIn.style.display = 'none';
    }
  }
  checkSession();

  if (homeLogoutBtn) {
    homeLogoutBtn.addEventListener('click', () => {
      window.jobApi.logout();
      checkSession();
      showToast('You have been signed out.');
    });
  }

  // 2. Load and Render Jobs
  async function loadJobs(filters = {}) {
    if (!jobsGrid) return;
    jobsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: #64748b;">
        <div style="display: inline-block; width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="margin-top: 12px; font-weight: 700;">Loading verified vacancies from Cloudflare...</p>
      </div>
    `;

    currentJobs = await window.jobApi.getJobs(filters);
    renderJobsList(currentJobs);
  }

  function renderJobsList(jobs) {
    if (!jobsCountBadge || !jobsGrid) return;
    jobsCountBadge.textContent = `${jobs.length} Verified Vacancies`;

    if (jobs.length === 0) {
      jobsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: white; border-radius: 20px; border: 1px dashed #cbd5e1;">
          <h3 style="font-size: 18px; font-weight: 800;">No vacancies found matching criteria</h3>
          <p style="color: #64748b; font-size: 13px; margin: 8px 0 16px;">Try clearing filters or selecting another trade</p>
          <button id="reset-filters-btn" class="btn-apply-free" style="display: inline-block;">Reset Search Filters</button>
        </div>
      `;
      document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
        if (searchCategory) searchCategory.value = 'all';
        if (searchCity) searchCity.value = 'all';
        if (searchSalary) searchSalary.value = 'all';
        tradeChips.forEach(c => c.classList.remove('active'));
        if (tradeChips[0]) tradeChips[0].classList.add('active');
        loadJobs();
      });
      return;
    }

    jobsGrid.innerHTML = jobs.map(job => `
      <div class="job-card" data-job-id="${job.id}">
        <div>
          <div class="job-card-top">
            <span class="category-tag">${job.category}</span>
            <div class="salary-badge">
              <div class="salary-num">₹${(job.salary_max || job.salary_min).toLocaleString()}</div>
              <div class="salary-period">Per ${job.salary_period || 'month'}</div>
            </div>
          </div>
          <h3 class="job-card-title">${job.title}</h3>
          <div class="job-employer-line">
            <span>${job.business_name || 'Verified Workshop'}</span>
            <span class="verified-icon" title="KYC & Trade Verified">✓ Verified</span>
          </div>
          <div class="job-meta-row">
            <div class="job-meta-item">📍 ${job.location_area}, ${job.location_city}</div>
            <div class="job-meta-item">👥 ${job.vacancies || 1} Openings</div>
          </div>
          <p class="job-desc-preview">${job.description}</p>
        </div>
        <div class="job-card-actions">
          <button class="btn-apply-free view-job-btn" data-id="${job.id}">View Details & Apply</button>
          <a href="/login.html?role=worker" class="btn-apply-priority" style="text-decoration: none; justify-content: center;">⚡ Boost ₹299</a>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.view-job-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openJobModal(id);
      });
    });
  }

  // 3. Search and Filtering Triggers
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      loadJobs({
        category: (searchCategory && searchCategory.value !== 'all') ? searchCategory.value : undefined,
        city: (searchCity && searchCity.value !== 'all') ? searchCity.value : undefined,
        minSalary: (searchSalary && searchSalary.value !== 'all') ? searchSalary.value : undefined
      });
    });
  }

  tradeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      tradeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.dataset.trade;
      if (searchCategory) searchCategory.value = category;
      loadJobs({
        category: category !== 'all' ? category : undefined,
        city: (searchCity && searchCity.value !== 'all') ? searchCity.value : undefined
      });
    });
  });

  // 4. Job Details Modal
  async function openJobModal(jobId) {
    selectedJob = await window.jobApi.getJobById(jobId);
    if (!selectedJob || !jobDetailModal) return;

    document.getElementById('modal-job-title').textContent = selectedJob.title;
    document.getElementById('modal-job-category').textContent = selectedJob.category;
    document.getElementById('modal-job-employer').textContent = selectedJob.business_name || "Verified Employer";
    document.getElementById('modal-job-location').textContent = `${selectedJob.location_area}, ${selectedJob.location_city}`;
    document.getElementById('modal-job-salary').textContent = `₹${(selectedJob.salary_min || 15000).toLocaleString()} – ₹${(selectedJob.salary_max || 25000).toLocaleString()} / ${selectedJob.salary_period || 'month'}`;
    document.getElementById('modal-job-hours').textContent = selectedJob.working_hours || "9:00 AM - 6:00 PM";
    document.getElementById('modal-job-desc').textContent = selectedJob.description;
    document.getElementById('modal-job-reqs').textContent = selectedJob.requirements || "Hands-on trade skills, punctual, honest";

    jobDetailModal.classList.add('active');
  }

  document.getElementById('modal-apply-free-btn')?.addEventListener('click', async () => {
    if (!selectedJob) return;
    const user = window.jobApi.getCurrentUser();
    const workerInfo = user ? {
      id: user.id || "wrk-1",
      name: user.name || "Ramesh Kumar Rao",
      category: selectedJob.category,
      experience: 4,
      city: selectedJob.location_city,
      phone: user.phone || "+91 98491 23434"
    } : {
      id: "wrk-1",
      name: "Ramesh Kumar Rao",
      category: selectedJob.category,
      experience: 4,
      city: selectedJob.location_city,
      phone: "+91 98491 23434"
    };

    await window.jobApi.applyJob(selectedJob.id, workerInfo, false);
    if (jobDetailModal) jobDetailModal.classList.remove('active');
    showToast(`Application submitted for "${selectedJob.title}"! Employer notified.`);
  });

  // Close modals
  document.querySelectorAll('.modal-close-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  // Initial load
  loadJobs();
});
