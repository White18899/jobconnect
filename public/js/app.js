/**
 * JobConnect Main Frontend Controller
 * Pure Vanilla JavaScript • No React • Cloudflare Edge Integration
 */

document.addEventListener('DOMContentLoaded', async () => {
  // App State
  let currentJobs = [];
  let selectedJob = null;
  let targetPaymentAppId = null;
  let targetUnlockAppId = null;
  let selectedAuthRole = 'worker';

  // Navigation & Header Elements
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const viewSections = document.querySelectorAll('.view-section');
  const creditPill = document.getElementById('credit-pill');
  const creditCount = document.getElementById('credit-count');
  const authLoggedOut = document.getElementById('auth-logged-out');
  const authLoggedIn = document.getElementById('auth-logged-in');
  const headerSigninBtn = document.getElementById('header-signin-btn');
  const headerPostJobCta = document.getElementById('header-post-job-cta');
  const headerLogoutBtn = document.getElementById('header-logout-btn');
  const headerUserName = document.getElementById('header-user-name');
  const headerUserIcon = document.getElementById('header-user-icon');
  const brandLogoLink = document.getElementById('brand-logo-link');

  // Search & Filter Elements
  const jobsGrid = document.getElementById('jobs-grid');
  const jobsCountBadge = document.getElementById('jobs-count-badge');
  const tradeChips = document.querySelectorAll('.trade-chip');
  const searchCategory = document.getElementById('search-category');
  const searchCity = document.getElementById('search-city');
  const searchSalary = document.getElementById('search-salary');
  const searchBtn = document.getElementById('search-btn');

  // Modals
  const authModal = document.getElementById('auth-modal');
  const jobDetailModal = document.getElementById('job-detail-modal');
  const priorityModal = document.getElementById('priority-modal');
  const postJobModal = document.getElementById('post-job-modal');
  const unlockModal = document.getElementById('unlock-modal');
  const buyCreditsModal = document.getElementById('buy-credits-modal');

  // Auth Modal Elements
  const authTabOtp = document.getElementById('auth-tab-otp');
  const authTabAdmin = document.getElementById('auth-tab-admin');
  const authOtpSection = document.getElementById('auth-otp-section');
  const authAdminSection = document.getElementById('auth-admin-section');
  const roleChoiceWorker = document.getElementById('role-choice-worker');
  const roleChoiceEmployer = document.getElementById('role-choice-employer');
  const authPhoneInput = document.getElementById('auth-phone-input');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const otpStep1 = document.getElementById('otp-step-1');
  const otpStep2 = document.getElementById('otp-step-2');
  const otpTargetPhone = document.getElementById('otp-target-phone');
  const otpDevHint = document.getElementById('otp-dev-hint');
  const authOtpInput = document.getElementById('auth-otp-input');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const backToPhoneBtn = document.getElementById('back-to-phone-btn');
  const demoLoginWorker = document.getElementById('demo-login-worker');
  const demoLoginEmployer = document.getElementById('demo-login-employer');
  const demoLoginAdmin = document.getElementById('demo-login-admin');
  const adminPassInput = document.getElementById('admin-pass-input');
  const adminLoginSubmitBtn = document.getElementById('admin-login-submit-btn');

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

  // 1. Session & Auth State Management
  function refreshAuthState() {
    const user = window.jobApi.getCurrentUser();
    if (user) {
      if (authLoggedOut) authLoggedOut.style.display = 'none';
      if (authLoggedIn) authLoggedIn.style.display = 'flex';
      if (headerUserName) headerUserName.textContent = user.name || user.role;

      if (user.role === 'worker') {
        if (headerUserIcon) headerUserIcon.textContent = '👷';
        if (creditPill) creditPill.style.display = 'none';
      } else if (user.role === 'employer') {
        if (headerUserIcon) headerUserIcon.textContent = '🏢';
        if (creditPill) creditPill.style.display = 'inline-flex';
        updateCreditDisplay();
      } else if (user.role === 'admin') {
        if (headerUserIcon) headerUserIcon.textContent = '🛡️';
        if (creditPill) creditPill.style.display = 'none';
      }
    } else {
      if (authLoggedOut) authLoggedOut.style.display = 'flex';
      if (authLoggedIn) authLoggedIn.style.display = 'none';
      if (creditPill) creditPill.style.display = 'none';
    }
  }

  function updateCreditDisplay() {
    if (!creditCount) return;
    const credits = window.jobApi.getUnlockCredits();
    creditCount.textContent = credits;
  }

  // Open Auth Modal helper
  function openAuthModal(preferredRole = 'worker') {
    if (!authModal) return;
    if (preferredRole === 'admin') {
      if (authTabAdmin) authTabAdmin.click();
    } else {
      if (authTabOtp) authTabOtp.click();
      if (preferredRole === 'employer') {
        if (roleChoiceEmployer) roleChoiceEmployer.click();
      } else {
        if (roleChoiceWorker) roleChoiceWorker.click();
      }
    }
    if (otpStep1) otpStep1.style.display = 'block';
    if (otpStep2) otpStep2.style.display = 'none';
    authModal.classList.add('active');
  }

  // 2. Navigation Tab Switching with Role Gating
  function switchTab(viewId) {
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
    viewSections.forEach(s => s.classList.toggle('active', s.id === viewId));

    if (viewId === 'view-jobs') {
      loadJobs();
    } else if (viewId === 'view-employer') {
      updateCreditDisplay();
      renderEmployerHub();
    } else if (viewId === 'view-worker-portal') {
      renderWorkerPortal();
    } else if (viewId === 'view-admin') {
      renderAdminDesk();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      const user = window.jobApi.getCurrentUser();

      if (targetView === 'view-employer') {
        if (!user || user.role !== 'employer') {
          openAuthModal('employer');
          showToast('Please sign in as Employer to access Employer Desk.', 'info');
          return;
        }
      } else if (targetView === 'view-worker-portal') {
        if (!user || user.role !== 'worker') {
          openAuthModal('worker');
          showToast('Please sign in with your mobile number to view Worker Portal.', 'info');
          return;
        }
      } else if (targetView === 'view-admin') {
        if (!user || user.role !== 'admin') {
          openAuthModal('admin');
          showToast('Please enter administrator password to access Admin Ledger.', 'info');
          return;
        }
      }

      switchTab(targetView);
    });
  });

  if (brandLogoLink) {
    brandLogoLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('view-jobs');
    });
  }

  // 3. Header Action Buttons
  if (headerSigninBtn) {
    headerSigninBtn.addEventListener('click', () => {
      openAuthModal('worker');
    });
  }

  if (headerPostJobCta) {
    headerPostJobCta.addEventListener('click', () => {
      const user = window.jobApi.getCurrentUser();
      if (user && user.role === 'employer') {
        if (postJobModal) postJobModal.classList.add('active');
      } else {
        openAuthModal('employer');
        showToast('Please sign in as Employer to post a job vacancy.', 'info');
      }
    });
  }

  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener('click', () => {
      window.jobApi.logout();
      refreshAuthState();
      switchTab('view-jobs');
      showToast('You have been signed out successfully.');
    });
  }

  // 4. Auth Modal Interaction Handlers
  if (authTabOtp) {
    authTabOtp.addEventListener('click', () => {
      authTabOtp.classList.add('active');
      if (authTabAdmin) authTabAdmin.classList.remove('active');
      if (authOtpSection) authOtpSection.style.display = 'block';
      if (authAdminSection) authAdminSection.style.display = 'none';
    });
  }

  if (authTabAdmin) {
    authTabAdmin.addEventListener('click', () => {
      authTabAdmin.classList.add('active');
      if (authTabOtp) authTabOtp.classList.remove('active');
      if (authAdminSection) authAdminSection.style.display = 'block';
      if (authOtpSection) authOtpSection.style.display = 'none';
    });
  }

  if (roleChoiceWorker) {
    roleChoiceWorker.addEventListener('click', () => {
      selectedAuthRole = 'worker';
      roleChoiceWorker.classList.add('active');
      if (roleChoiceEmployer) roleChoiceEmployer.classList.remove('active');
    });
  }

  if (roleChoiceEmployer) {
    roleChoiceEmployer.addEventListener('click', () => {
      selectedAuthRole = 'employer';
      roleChoiceEmployer.classList.add('active');
      if (roleChoiceWorker) roleChoiceWorker.classList.remove('active');
    });
  }

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
      const rawPhone = authPhoneInput.value.trim().replace(/\D/g, '');
      if (rawPhone.length < 10) {
        alert('Please enter a valid 10-digit mobile phone number.');
        return;
      }
      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = 'Sending OTP...';
      const res = await window.jobApi.requestOtp(rawPhone);
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Send Verification OTP →';

      if (otpStep1) otpStep1.style.display = 'none';
      if (otpStep2) otpStep2.style.display = 'block';
      if (otpTargetPhone) otpTargetPhone.textContent = `+91 ${rawPhone}`;
      if (otpDevHint && res.devOtp) {
        otpDevHint.textContent = `Demo Code: ${res.devOtp}`;
        if (authOtpInput) authOtpInput.value = res.devOtp;
      }
      showToast(`Verification code sent to +91 ${rawPhone}!`);
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', async () => {
      const rawPhone = authPhoneInput.value.trim().replace(/\D/g, '');
      const otp = authOtpInput.value.trim();
      if (otp.length < 4) {
        alert('Please enter the 6-digit verification code.');
        return;
      }
      verifyOtpBtn.disabled = true;
      verifyOtpBtn.textContent = 'Verifying...';
      const res = await window.jobApi.verifyOtp(rawPhone, otp, selectedAuthRole);
      verifyOtpBtn.disabled = false;
      verifyOtpBtn.textContent = 'Verify Code & Sign In';

      if (res.success) {
        if (authModal) authModal.classList.remove('active');
        refreshAuthState();
        showToast(`Signed in successfully as ${selectedAuthRole === 'worker' ? 'Worker' : 'Employer'}!`);
        if (selectedAuthRole === 'employer') {
          switchTab('view-employer');
        } else {
          switchTab('view-worker-portal');
        }
      } else {
        alert(res.error || 'Invalid OTP entered. Please try again.');
      }
    });
  }

  if (backToPhoneBtn) {
    backToPhoneBtn.addEventListener('click', () => {
      if (otpStep2) otpStep2.style.display = 'none';
      if (otpStep1) otpStep1.style.display = 'block';
    });
  }

  // 1-Click Instant Demo Profiles
  if (demoLoginWorker) {
    demoLoginWorker.addEventListener('click', () => {
      window.jobApi.setCurrentUser({
        id: 'wrk-1',
        name: 'Ramesh Kumar (Worker)',
        role: 'worker',
        phone: '+91 98491 23434'
      });
      if (authModal) authModal.classList.remove('active');
      refreshAuthState();
      switchTab('view-worker-portal');
      showToast('Signed in with Worker Profile (Ramesh Kumar)!');
    });
  }

  if (demoLoginEmployer) {
    demoLoginEmployer.addEventListener('click', () => {
      window.jobApi.setCurrentUser({
        id: 'emp-1',
        name: 'Sri Balaji Auto (Employer)',
        role: 'employer',
        phone: '+91 98490 11223'
      });
      if (authModal) authModal.classList.remove('active');
      refreshAuthState();
      switchTab('view-employer');
      showToast('Signed in with Employer Profile (Sri Balaji Auto)!');
    });
  }

  if (demoLoginAdmin) {
    demoLoginAdmin.addEventListener('click', () => {
      window.jobApi.setCurrentUser({
        id: 'admin_01',
        name: 'Platform Administrator',
        role: 'admin',
        phone: '+91 99999 99999'
      });
      if (authModal) authModal.classList.remove('active');
      refreshAuthState();
      switchTab('view-admin');
      showToast('Signed in as Platform Administrator!');
    });
  }

  if (adminLoginSubmitBtn) {
    adminLoginSubmitBtn.addEventListener('click', async () => {
      const pass = adminPassInput.value.trim();
      if (!pass) {
        alert('Please enter administrator password.');
        return;
      }
      adminLoginSubmitBtn.disabled = true;
      adminLoginSubmitBtn.textContent = 'Authenticating...';
      const res = await window.jobApi.adminLogin(pass);
      adminLoginSubmitBtn.disabled = false;
      adminLoginSubmitBtn.textContent = 'Sign In to Admin Ledger →';

      if (res.success) {
        if (authModal) authModal.classList.remove('active');
        refreshAuthState();
        switchTab('view-admin');
        showToast('Administrator authenticated successfully!');
      } else {
        alert(res.error || 'Incorrect admin password.');
      }
    });
  }

  // 5. Jobs Rendering & Filtering
  async function loadJobs(filters = {}) {
    if (!jobsGrid) return;
    jobsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: #64748b;">
        <div style="display: inline-block; width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="margin-top: 12px; font-weight: 700;">Loading verified trades from Cloudflare...</p>
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
          <p style="color: #64748b; font-size: 13px; margin: 8px 0 16px;">Try clearing filters or changing city/category</p>
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
            <span>${job.business_name || job.employerName || 'Verified Employer'}</span>
            <span class="verified-icon" title="KYC & Trade Verified">✓ Verified</span>
          </div>
          <div class="job-meta-row">
            <div class="job-meta-item">📍 ${job.location_area}, ${job.location_city}</div>
            <div class="job-meta-item">👥 ${job.vacancies || 1} Openings</div>
          </div>
          <p class="job-desc-preview">${job.description}</p>
        </div>
        <div class="job-card-actions">
          <button class="btn-apply-free view-job-btn" data-id="${job.id}">View & Apply Free</button>
          <button class="btn-apply-priority trigger-priority-btn" data-id="${job.id}">⚡ Boost ₹299</button>
        </div>
      </div>
    `).join('');

    // Attach Click Handlers
    document.querySelectorAll('.view-job-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openJobModal(id);
      });
    });

    document.querySelectorAll('.trigger-priority-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openPriorityModal(id);
      });
    });
  }

  // Filter Search Triggers
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      loadJobs({
        category: searchCategory ? searchCategory.value : undefined,
        city: searchCity ? searchCity.value : undefined,
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
        city: searchCity ? searchCity.value : undefined
      });
    });
  });

  // 6. Job Details & Apply Modal
  async function openJobModal(jobId) {
    selectedJob = await window.jobApi.getJobById(jobId);
    if (!selectedJob || !jobDetailModal) return;

    document.getElementById('modal-job-title').textContent = selectedJob.title;
    document.getElementById('modal-job-category').textContent = selectedJob.category;
    document.getElementById('modal-job-employer').textContent = selectedJob.business_name || selectedJob.employerName || "Verified Employer";
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
    showToast(`Standard Application submitted for "${selectedJob.title}"! Employer notified.`);
  });

  document.getElementById('modal-apply-boost-btn')?.addEventListener('click', () => {
    if (jobDetailModal) jobDetailModal.classList.remove('active');
    if (selectedJob) openPriorityModal(selectedJob.id);
  });

  // 7. Priority Boost Modal Flow
  function openPriorityModal(jobId) {
    const job = currentJobs.find(j => j.id === jobId) || selectedJob;
    if (!job || !priorityModal) return;
    targetPaymentAppId = jobId;
    document.getElementById('priority-job-name').textContent = job.title;
    document.getElementById('priority-utr-input').value = '';
    priorityModal.classList.add('active');
  }

  document.getElementById('submit-priority-utr-btn')?.addEventListener('click', async () => {
    const utr = document.getElementById('priority-utr-input').value.trim();
    if (!utr || utr.length < 8) {
      alert('Please enter a valid 12-digit transaction UTR / Ref Number.');
      return;
    }

    const user = window.jobApi.getCurrentUser();
    const app = await window.jobApi.applyJob(targetPaymentAppId, {
      id: user?.id || "wrk-1",
      name: user?.name || "Ramesh Kumar Rao",
      experience: 4,
      city: "Hyderabad"
    }, true);

    window.jobApi.submitPayment({
      type: "worker_priority",
      userName: user?.name || "Ramesh Kumar Rao",
      userRole: "worker",
      plan: "Priority Boost (₹299)",
      amount: 299,
      utrNumber: utr,
      targetId: app.id
    });

    if (priorityModal) priorityModal.classList.remove('active');
    showToast('Priority Boost payment submitted! Admin is verifying your transaction.', 'success');
  });

  // 8. Post New Job (Employer)
  document.getElementById('open-post-job-btn')?.addEventListener('click', () => {
    if (postJobModal) postJobModal.classList.add('active');
  });

  document.getElementById('post-job-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const category = document.getElementById('post-category').value;
    const salaryMin = Number(document.getElementById('post-salary-min').value);
    const salaryMax = Number(document.getElementById('post-salary-max').value);
    const area = document.getElementById('post-area').value.trim();
    const city = document.getElementById('post-city').value;
    const vacancies = Number(document.getElementById('post-vacancies').value);
    const hours = document.getElementById('post-hours').value.trim();
    const desc = document.getElementById('post-desc').value.trim();
    const businessName = document.getElementById('post-business').value.trim();

    await window.jobApi.createJob({
      title,
      category,
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_period: "monthly",
      location_area: area,
      location_city: city,
      vacancies,
      working_hours: hours,
      description: desc,
      business_name: businessName,
      business_type: "Commercial",
      requirements: "Experienced trade worker needed"
    });

    if (postJobModal) postJobModal.classList.remove('active');
    showToast(`Vacancy "${title}" published on Cloudflare Edge!`);
    renderEmployerHub();
  });

  // 9. Employer Hub Rendering
  function renderEmployerHub() {
    const apps = window.jobApi.getApplications();
    const applicantsList = document.getElementById('applicants-list');
    const statTotal = document.getElementById('stat-total-apps');
    const statUnlocked = document.getElementById('stat-unlocked-apps');
    if (statTotal) statTotal.textContent = apps.length;
    if (statUnlocked) statUnlocked.textContent = apps.filter(a => a.unlocked).length;
    updateCreditDisplay();

    if (!applicantsList) return;
    if (apps.length === 0) {
      applicantsList.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748b;">No candidate applications received yet.</div>`;
      return;
    }

    applicantsList.innerHTML = apps.map(app => `
      <div class="applicant-card" data-app-id="${app.id}">
        <div class="applicant-info">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <h4>${app.worker_name}</h4>
            <span class="category-tag">${app.worker_category}</span>
            ${app.priority === 'PRIORITY_ACTIVE' ? '<span class="status-badge priority">⚡ PRIORITY APPLICANT</span>' : ''}
          </div>
          <div class="applicant-meta">
            ${app.worker_experience}+ Years Experience • Applied for: <strong>${app.job_title}</strong>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${app.experience_notes}</div>
        </div>

        <div>
          <div class="privacy-box ${app.unlocked ? 'unlocked' : ''}">
            <div style="font-weight: 800; font-size: 11px; text-transform: uppercase; margin-bottom: 2px;">
              ${app.unlocked ? '🔓 Verified Contact Unlocked' : '🔒 Contact Info Protected'}
            </div>
            <div>${app.unlocked ? app.phone_unlocked : app.phone_masked}</div>
            <div style="font-size: 11px; color: ${app.unlocked ? '#065f46' : '#64748b'};">${app.unlocked ? app.address_unlocked : app.address_masked}</div>
          </div>
        </div>

        <div>
          <span class="status-badge ${app.status === 'shortlisted' ? 'verified' : 'pending'}">${app.status.toUpperCase()}</span>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Applied: ${app.applied_date}</div>
        </div>

        <div>
          ${app.unlocked ? `
            <a href="tel:${app.phone_unlocked}" class="btn-unlock" style="background: #10b981; text-decoration: none;">
              📞 Call Candidate
            </a>
          ` : `
            <button class="btn-unlock trigger-unlock-btn" data-id="${app.id}">
              🔓 Unlock Contact (1 Credit)
            </button>
          `}
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.trigger-unlock-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openUnlockModal(id);
      });
    });
  }

  // 10. Unlock Contact Modal
  function openUnlockModal(appId) {
    targetUnlockAppId = appId;
    const apps = window.jobApi.getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app || !unlockModal) return;

    document.getElementById('unlock-worker-name').textContent = app.worker_name;
    document.getElementById('unlock-avail-credits').textContent = window.jobApi.getUnlockCredits();
    unlockModal.classList.add('active');
  }

  document.getElementById('confirm-unlock-btn')?.addEventListener('click', () => {
    const result = window.jobApi.unlockWorker(targetUnlockAppId);
    if (unlockModal) unlockModal.classList.remove('active');

    if (result.success) {
      showToast(`Contact info unlocked for ${result.app.worker_name}! (${result.remainingCredits} credits remaining)`);
      renderEmployerHub();
    } else if (result.needCredits) {
      if (buyCreditsModal) buyCreditsModal.classList.add('active');
    } else {
      showToast(result.message, 'error');
    }
  });

  document.getElementById('open-buy-credits-btn')?.addEventListener('click', () => {
    if (buyCreditsModal) buyCreditsModal.classList.add('active');
  });

  document.getElementById('submit-bundle-payment-btn')?.addEventListener('click', () => {
    const utr = document.getElementById('bundle-utr-input').value.trim();
    const plan = document.getElementById('bundle-plan-select').value;
    const amount = plan === '5_WORKERS' ? 499 : (plan === '10_WORKERS' ? 949 : 149);

    if (!utr || utr.length < 8) {
      alert('Please enter valid 12-digit UTR number.');
      return;
    }

    const user = window.jobApi.getCurrentUser();
    window.jobApi.submitPayment({
      type: "employer_unlock",
      userName: user?.name || "Employer Workspace",
      userRole: "employer",
      plan: `Unlock Plan (${amount === 499 ? '5 Unlocks' : (amount === 949 ? '10 Unlocks' : '1 Unlock')})`,
      amount,
      utrNumber: utr
    });

    if (buyCreditsModal) buyCreditsModal.classList.remove('active');
    showToast('Payment submitted for Admin verification! Credits will be credited once verified.');
  });

  // 11. Worker Portal Rendering
  function renderWorkerPortal() {
    const apps = window.jobApi.getApplications();
    const list = document.getElementById('worker-my-apps-list');
    if (!list) return;
    
    list.innerHTML = apps.map(a => `
      <div style="background: white; border: 1px solid #e2e8f0; padding: 18px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px;">
        <div>
          <h4 style="font-size: 15px; font-weight: 800;">${a.job_title}</h4>
          <p style="font-size: 12px; color: #64748b; font-weight: 600;">Employer: ${a.employer_name} • Applied: ${a.applied_date}</p>
        </div>
        <div style="text-align: right;">
          <span class="status-badge ${a.priority === 'PRIORITY_ACTIVE' ? 'priority' : 'verified'}">
            ${a.priority === 'PRIORITY_ACTIVE' ? '⚡ PRIORITY' : 'STANDARD'}
          </span>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 4px;">Status: ${a.status.toUpperCase()}</div>
        </div>
      </div>
    `).join('');
  }

  // 12. Admin Desk & Ledger
  function renderAdminDesk() {
    const payments = window.jobApi.getPayments();
    const apps = window.jobApi.getApplications();
    const tbody = document.getElementById('admin-ledger-tbody');

    const kpiJobs = document.getElementById('admin-kpi-jobs');
    const kpiApps = document.getElementById('admin-kpi-apps');
    const kpiPending = document.getElementById('admin-kpi-pending');
    if (kpiJobs) kpiJobs.textContent = currentJobs.length;
    if (kpiApps) kpiApps.textContent = apps.length;
    if (kpiPending) kpiPending.textContent = payments.filter(p => p.status === 'pending_verification').length;

    if (!tbody) return;
    tbody.innerHTML = payments.map(p => `
      <tr>
        <td><strong style="font-family: monospace;">${p.id}</strong></td>
        <td>
          <span class="status-badge ${p.type === 'worker_priority' ? 'priority' : 'pending'}">
            ${p.type === 'worker_priority' ? 'Worker Boost' : 'Employer Unlocks'}
          </span>
        </td>
        <td><strong>${p.user_name}</strong> (${p.user_role})</td>
        <td><strong>₹${p.amount}</strong></td>
        <td><span style="font-family: monospace; background: #f1f5f9; padding: 3px 8px; border-radius: 6px;">${p.utr_number}</span></td>
        <td><span class="status-badge ${p.status === 'verified' ? 'verified' : (p.status === 'rejected' ? 'danger' : 'pending')}">${p.status.toUpperCase()}</span></td>
        <td>
          ${p.status === 'pending_verification' ? `
            <div style="display: flex; gap: 6px;">
              <button class="admin-action-btn admin-approve-btn" data-id="${p.id}" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 11px; cursor: pointer;">Verify & Activate</button>
              <button class="admin-action-btn admin-reject-btn" data-id="${p.id}" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-weight: 800; font-size: 11px; cursor: pointer;">Reject</button>
            </div>
          ` : `<span style="font-size: 12px; color: #64748b; font-weight: 700;">Completed</span>`}
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.admin-approve-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        window.jobApi.verifyPayment(id, true);
        showToast(`Payment ${id} verified and credits/badge activated!`);
        renderAdminDesk();
      });
    });

    document.querySelectorAll('.admin-reject-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        window.jobApi.verifyPayment(id, false);
        showToast(`Payment ${id} marked rejected.`, 'error');
        renderAdminDesk();
      });
    });
  }

  // Close modals on click overlay or close button
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

  // Initial Boot
  refreshAuthState();
  loadJobs();
});
