/**
 * JobWay Public Landing Page Controller
 * Editorial Swiss Architecture • Staggered CSS Animations • Cloudflare Edge
 */

document.addEventListener('DOMContentLoaded', async () => {
  // =========================================================================
  // 1. Session State Check
  // =========================================================================
  const authLoggedOut = document.getElementById('auth-logged-out');
  const authLoggedIn = document.getElementById('auth-logged-in');
  const navProfileLink = document.getElementById('nav-profile-link');
  const navUserDisplayName = document.getElementById('nav-user-display-name');
  const navAvatarInitials = document.getElementById('nav-user-avatar-initials');
  const navAvatarImg = document.getElementById('nav-user-avatar-img');
  const homeLogoutBtn = document.getElementById('home-logout-btn');
  const btnHeaderPostVacancyUser = document.getElementById('btn-header-post-vacancy-user');

  function sanitizeName(str) {
    return (str || '').replace(/\s*\([^)]*\)/g, '').replace(/[^a-zA-Z0-9\s.&'-]/g, '').trim();
  }

  function getInitials(name) {
    const clean = sanitizeName(name);
    if (!clean) return 'RK';
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase() || 'RK';
  }

  function renderMobileRoleHeroCard(user) {
    const container = document.getElementById('mobile-role-hero-container');
    if (!container) return;

    if (user && (user.role === 'employer' || user.role === 'admin')) {
      const cleanName = sanitizeName(user.name) || 'Employer';
      const localJobs = JSON.parse(localStorage.getItem('jc_jobs') || '[]');
      const localApps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
      const vacanciesCount = localJobs.length || 2;
      const appsCount = localApps.length || 2;
      const credits = localStorage.getItem('jc_credits') || '3';

      container.innerHTML = `
        <div class="ios-role-card">
          <div class="ios-role-card-header">
            <div>
              <div class="ios-role-title">Welcome back, ${cleanName}</div>
              <div style="font-size: 11.5px; color: #8E8E93; margin-top: 1px;">Employer Workspace</div>
            </div>
            <span class="ios-role-badge">Active Employer</span>
          </div>

          <div class="ios-stats-row">
            <div class="ios-stat-col">
              <div class="ios-stat-val">${vacanciesCount}</div>
              <div class="ios-stat-lbl">Vacancies</div>
            </div>
            <div style="width: 1px; height: 20px; background: #E5E5EA;"></div>
            <div class="ios-stat-col">
              <div class="ios-stat-val">${appsCount}</div>
              <div class="ios-stat-lbl">Applicants</div>
            </div>
            <div style="width: 1px; height: 20px; background: #E5E5EA;"></div>
            <div class="ios-stat-col">
              <div class="ios-stat-val" style="color: #059669;">${credits}</div>
              <div class="ios-stat-lbl">Credits</div>
            </div>
          </div>

          <div class="ios-actions-row">
            <a href="/employer.html#applicants-section" class="ios-btn-action" style="background: #000000; color: #FFFFFF;">
              <span>+ Post Vacancy</span>
            </a>
            <a href="/employer.html" class="ios-btn-action" style="background: #059669; color: #FFFFFF;">
              <span>View Applicants (${appsCount}) →</span>
            </a>
          </div>
        </div>
      `;
    } else if (user && user.role === 'worker') {
      const cleanName = sanitizeName(user.name) || 'Specialist';
      const localApps = JSON.parse(localStorage.getItem('jc_apps') || '[]');
      const appsCount = localApps.length || 2;

      container.innerHTML = `
        <div class="ios-role-card">
          <div class="ios-role-card-header">
            <div>
              <div class="ios-role-title">Hello, ${cleanName}</div>
              <div style="font-size: 11.5px; color: #059669; font-weight: 600; margin-top: 1px; display: inline-flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Trade Pass Active</span></div>
            </div>
            <span class="ios-role-badge">Visakhapatnam</span>
          </div>

          <div class="ios-stats-row">
            <div class="ios-stat-col">
              <div class="ios-stat-val">${appsCount}</div>
              <div class="ios-stat-lbl">Applications</div>
            </div>
            <div style="width: 1px; height: 20px; background: #E5E5EA;"></div>
            <div class="ios-stat-col">
              <div class="ios-stat-val" style="color: #059669;">100%</div>
              <div class="ios-stat-lbl">Verified</div>
            </div>
            <div style="width: 1px; height: 20px; background: #E5E5EA;"></div>
            <div class="ios-stat-col">
              <div class="ios-stat-val" style="color: #007AFF;">Direct</div>
              <div class="ios-stat-lbl">Payroll</div>
            </div>
          </div>

          <div class="ios-actions-row">
            <a href="/jobs.html" class="ios-btn-action" style="background: #059669; color: #FFFFFF;">
              <span>Explore Vacancies</span>
            </a>
            <a href="/worker.html" class="ios-btn-action" style="background: #000000; color: #FFFFFF;">
              <span>My Desk (${appsCount}) →</span>
            </a>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="ios-role-card" style="background: #FAFAFC;">
          <div style="font-size: 13px; font-weight: 650; color: #1C1C1E; margin-bottom: 8px;">Direct hiring & authentic trade pass network</div>
          <div class="ios-actions-row">
            <a href="/jobs.html" class="ios-btn-action" style="background: #059669; color: #FFFFFF;">
              <span>Find Jobs</span>
            </a>
            <a href="/candidates.html" class="ios-btn-action" style="background: #000000; color: #FFFFFF;">
              <span>Hire Talent →</span>
            </a>
          </div>
        </div>
      `;
    }
  }

  function initMobileSearchAndChips() {
    const searchBtn = document.getElementById('hero-mobile-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        window.location.href = '/jobs.html?focus=search';
      });
    }

    // iOS Segmented Control Switch
    const tabJobs = document.getElementById('ios-tab-jobs');
    const tabCandidates = document.getElementById('ios-tab-candidates');

    if (tabJobs && tabCandidates) {
      tabJobs.addEventListener('click', () => {
        tabJobs.classList.add('active');
        tabJobs.setAttribute('aria-selected', 'true');
        tabCandidates.classList.remove('active');
        tabCandidates.setAttribute('aria-selected', 'false');
        window.location.href = '/jobs.html';
      });

      tabCandidates.addEventListener('click', () => {
        tabCandidates.classList.add('active');
        tabCandidates.setAttribute('aria-selected', 'true');
        tabJobs.classList.remove('active');
        tabJobs.setAttribute('aria-selected', 'false');
        window.location.href = '/candidates.html';
      });
    }

    const chips = document.querySelectorAll('#mobile-hero-chips-container .ios-chip, #mobile-hero-chips-container .mobile-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.category;
        if (cat === 'all') {
          window.location.href = '/jobs.html';
        } else {
          window.location.href = `/jobs.html?category=${encodeURIComponent(cat)}`;
        }
      });
    });
  }

  function checkSession() {
    const user = window.jobApi?.getCurrentUser();
    const doc = document.documentElement;

    if (user) {
      doc.classList.remove('is-logged-out', 'role-guest', 'role-worker', 'role-employer', 'role-admin');
      doc.classList.add('is-logged-in', 'role-' + user.role);

      if (authLoggedOut) authLoggedOut.style.display = 'none';
      if (authLoggedIn) authLoggedIn.style.display = 'flex';

      const cleanName = sanitizeName(user.name) || (user.role === 'employer' ? 'Employer' : 'Worker');
      const initials = getInitials(cleanName);

      if (navUserDisplayName) navUserDisplayName.textContent = cleanName;
      if (navAvatarInitials) navAvatarInitials.textContent = initials;

      const photo = user.avatar || user.photo_key || localStorage.getItem('jc_worker_photo') || '';
      if (navAvatarImg) {
        if (photo) {
          navAvatarImg.src = photo;
          navAvatarImg.onload = () => {
            navAvatarImg.style.display = 'block';
            if (navAvatarInitials) navAvatarInitials.style.display = 'none';
          };
          navAvatarImg.onerror = () => {
            navAvatarImg.style.display = 'none';
            if (navAvatarInitials) navAvatarInitials.style.display = 'block';
          };
        } else {
          navAvatarImg.style.display = 'none';
          if (navAvatarInitials) navAvatarInitials.style.display = 'block';
        }
      }

      const targetUrl = user.role === 'employer' ? '/employer.html' : (user.role === 'admin' ? '/admin.html' : '/worker.html');
      if (navProfileLink) {
        navProfileLink.href = targetUrl;
        navProfileLink.title = user.role === 'employer' ? 'Employer Workspace' : (user.role === 'admin' ? 'Admin Ledger' : 'Worker Desk');
      }

      if (btnHeaderPostVacancyUser) {
        if (user.role === 'employer' && window.innerWidth > 768) {
          btnHeaderPostVacancyUser.style.setProperty('display', 'inline-flex', 'important');
          btnHeaderPostVacancyUser.onclick = () => { window.location.href = '/employer.html#applicants-section'; };
        } else {
          btnHeaderPostVacancyUser.style.setProperty('display', 'none', 'important');
        }
      }

      renderMobileRoleHeroCard(user);
    } else {
      renderMobileRoleHeroCard(null);
      doc.classList.remove('is-logged-in', 'role-worker', 'role-employer', 'role-admin');
      doc.classList.add('is-logged-out', 'role-guest');

      if (authLoggedOut) authLoggedOut.style.display = 'flex';
      if (authLoggedIn) authLoggedIn.style.display = 'none';
      if (btnHeaderPostVacancyUser) {
        btnHeaderPostVacancyUser.style.setProperty('display', 'none', 'important');
      }
    }
  }
  checkSession();

    if (homeLogoutBtn) {
    homeLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.jobApi?.logout) {
        window.jobApi.logout('/');
      } else {
        localStorage.removeItem('jc_auth_user');
        localStorage.removeItem('jobconnect_token');
        window.location.reload();
      }
    });
  }

      // =========================================================================
  // 2. Kinetic Magnetic Collision: Emblem Blooms -> Wings Snap Inward
  // =========================================================================
  function initHeroAnimations() {
    const wrapper = document.querySelector('.home-title-wrapper');
    const box1 = document.querySelector('.home-title-box-1');
    const box2 = document.querySelector('.home-title-box-2');
    const imageBox = document.querySelector('.home-title-image-box');

    // Left letters: J (index 0), O (index 1), B (index 2)
    // Closest to center (B) is pulled in FIRST, then O, then J
    const letters1 = box1 ? Array.from(box1.querySelectorAll('.home-title-letter')) : [];
    // Right letters: W (index 0), A (index 1), Y (index 2)
    // Closest to center (W) is pulled in FIRST, then A, then Y
    const letters2 = box2 ? Array.from(box2.querySelectorAll('.home-title-letter')) : [];

    letters1.forEach((letter, index) => {
      const distanceFromCenter = letters1.length - 1 - index;
      letter.style.setProperty('--letter-delay', (0.12 + distanceFromCenter * 0.08).toFixed(2) + 's');
      letter.style.setProperty('--letter-offset', (distanceFromCenter + 1).toString());
    });

    letters2.forEach((letter, index) => {
      const distanceFromCenter = index;
      letter.style.setProperty('--letter-delay', (0.12 + distanceFromCenter * 0.08).toFixed(2) + 's');
      letter.style.setProperty('--letter-offset', (distanceFromCenter + 1).toString());
    });

    // Subtitle lines glide up right after magnetic lockup completes
    const textInElements = document.querySelectorAll('.text-in');
    textInElements.forEach((el, index) => {
      el.style.setProperty('--stagger-delay', (0.50 + index * 0.12).toFixed(2) + 's');
    });

    if (wrapper) {
      setTimeout(() => {
        wrapper.classList.add('is-animated');
        if (box1) box1.classList.add('is-animated');
        if (box2) box2.classList.add('is-animated');
        if (imageBox) imageBox.classList.add('is-animated');
      }, 60);
    }
  }
  initHeroAnimations();
  initMobileSearchAndChips();

  // =========================================================================
  // 3. Scroll-In Intersection Observer (Hairlines, Numbers & Text)
  // =========================================================================
  function initScrollObserver() {
    const groups = document.querySelectorAll('.scroll-in-group');
    const borders = document.querySelectorAll('.border');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        if (entry.target.classList.contains('scroll-in-group')) {
          const scrollEls = entry.target.querySelectorAll('.scroll-in');
          scrollEls.forEach((el, idx) => {
            el.style.setProperty('--stagger-delay', `${idx * 0.07}s`);
            el.classList.add('is-visible');
          });
        }

        if (entry.target.classList.contains('border')) {
          entry.target.classList.add('is-visible');
        }

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    groups.forEach(g => observer.observe(g));
    borders.forEach(b => observer.observe(b));
  }
  initScrollObserver();

  // =========================================================================
  // 4. Dynamic Showcase Vacancies Feed
  // =========================================================================
  const homeJobsGrid = document.getElementById('home-jobs-grid');
  const headerVacanciesCount = document.getElementById('header-vacancies-count');
  const tradeFiltersContainer = document.getElementById('trade-filters-container');

  let allJobs = [];
  let allApplications = [];
  let activeCategory = 'all';

  const TRADE_IMAGES = {
    software: 'assets/trades/software.jpg',
    qa: 'assets/trades/qa.jpg',
    teamlead: 'assets/trades/teamlead.jpg',
    hr: 'assets/trades/hr.jpg',
    devops: 'assets/trades/devops.jpg',
    mobile: 'assets/trades/mobile.jpg'
  };

  function getJobImage(category = '') {
    const cat = (category || '').toLowerCase();
    if (cat.includes('soft') || cat.includes('eng') || cat.includes('dev') || cat.includes('full') || cat.includes('web')) return TRADE_IMAGES.software;
    if (cat.includes('qa') || cat.includes('test') || cat.includes('sdet') || cat.includes('quality')) return TRADE_IMAGES.qa;
    if (cat.includes('team') || cat.includes('lead') || cat.includes('manage') || cat.includes('director')) return TRADE_IMAGES.teamlead;
    if (cat.includes('hr') || cat.includes('recruit') || cat.includes('talent') || cat.includes('people')) return TRADE_IMAGES.hr;
    if (cat.includes('cloud') || cat.includes('devops') || cat.includes('infra') || cat.includes('sre')) return TRADE_IMAGES.devops;
    if (cat.includes('mobile') || cat.includes('app') || cat.includes('ios') || cat.includes('android') || cat.includes('flutter')) return TRADE_IMAGES.mobile;
    return TRADE_IMAGES.software;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderDynamicCategoryFilters() {
    if (!tradeFiltersContainer) return;

    // 1. Map job IDs to categories and calculate job count per category
    const jobCountByCategory = {};
    const jobIdToCategory = {};
    allJobs.forEach(job => {
      const cat = job.category || 'Software Engineering';
      jobIdToCategory[job.id] = cat;
      jobCountByCategory[cat] = (jobCountByCategory[cat] || 0) + 1;
    });

    // 2. Calculate applications count per category (demand)
    const appCountByCategory = {};
    allApplications.forEach(app => {
      let cat = app.worker_category;
      if (app.job_id && jobIdToCategory[app.job_id]) {
        cat = jobIdToCategory[app.job_id];
      }
      if (cat) {
        appCountByCategory[cat] = (appCountByCategory[cat] || 0) + 1;
      }
    });

    // 3. Extract unique categories present in jobs
    const categories = Object.keys(jobCountByCategory);

    // 4. Sort dynamically: highest applied jobs category first!
    categories.sort((a, b) => {
      const appsA = appCountByCategory[a] || 0;
      const appsB = appCountByCategory[b] || 0;
      if (appsB !== appsA) {
        return appsB - appsA; // Top applied first!
      }
      return (jobCountByCategory[b] || 0) - (jobCountByCategory[a] || 0);
    });

    // 5. Build filter buttons HTML
    const allCount = String(allJobs.length).padStart(2, '0');
    let buttonsHtml = `
      <button type="button" class="editorial-filter ${activeCategory === 'all' ? 'active' : ''}" data-category="all">
        <span>${window.t ? window.t("filter_all", "All") : "All"} (${allCount})</span>
      </button>
    `;

    categories.forEach(cat => {
      const count = String(jobCountByCategory[cat] || 0).padStart(2, '0');
      const apps = appCountByCategory[cat] || 0;
      const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
      buttonsHtml += `
        <button type="button" class="editorial-filter ${isActive ? 'active' : ''}" data-category="${escapeHtml(cat)}" title="${apps} candidate application${apps === 1 ? '' : 's'} submitted">
          <span>${escapeHtml(window.translateCategory ? window.translateCategory(cat) : cat)} (${count})</span>
        </button>
      `;
    });

    tradeFiltersContainer.innerHTML = buttonsHtml;

    // 6. Bind filter clicks
    tradeFiltersContainer.querySelectorAll('.editorial-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        tradeFiltersContainer.querySelectorAll('.editorial-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category || 'all';
        renderFilteredJobs();
      });
    });
  }

  async function fetchAndRenderJobs() {
    if (!homeJobsGrid) return;
    try {
      allJobs = await window.jobApi.getJobs();
      allApplications = window.jobApi.getApplications();

      if (headerVacanciesCount) {
        headerVacanciesCount.textContent = `(${String(allJobs.length).padStart(2, '0')})`;
      }

      renderDynamicCategoryFilters();
      renderFilteredJobs();
    } catch (err) {
      console.error('Error fetching vacancies:', err);
    }
  }

  function renderFilteredJobs() {
    if (!homeJobsGrid) return;

    const filtered = allJobs.filter(job => {
      if (activeCategory !== 'all') {
        const catMatch = (job.category || '').toLowerCase().includes(activeCategory.toLowerCase()) ||
                         (job.title || '').toLowerCase().includes(activeCategory.toLowerCase());
        if (!catMatch) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      homeJobsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4vw; text-align: center; border: 1px dashed var(--color-border); border-radius: var(--radius-s);">
          <p style="font-size: var(--font-size-m); font-weight: 500; margin-bottom: 0.5vw;">No vacancies found in this specialization</p>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 1.5vw;">Try selecting "All" to browse all active technical positions.</p>
          <button type="button" class="nav-btn-solid" id="btn-reset-editorial-filter">Show All Vacancies</button>
        </div>
      `;
      document.getElementById('btn-reset-editorial-filter')?.addEventListener('click', () => {
        activeCategory = 'all';
        if (tradeFiltersContainer) {
          tradeFiltersContainer.querySelectorAll('.editorial-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
          });
        }
        renderFilteredJobs();
      });
      return;
    }

    homeJobsGrid.innerHTML = filtered.map((job, index) => {
      const coverImg = getJobImage(job.category);
      const minSal = (job.salary_min || 60000).toLocaleString('en-IN');
      const maxSal = (job.salary_max || 120000).toLocaleString('en-IN');

      return `
        <a class="project-card" href="/jobs.html?id=${encodeURIComponent(job.id)}">
          <div class="project-card-box">
            <img class="project-card-image" src="${coverImg}" alt="${escapeHtml(job.title)}" loading="lazy">
            <div class="project-card-badges">
              <span class="project-card-badge">₹${minSal} – ₹${maxSal} ${window.t ? window.t("per_month_short", "/ mo") : "/ mo"}</span>
              <span class="project-card-badge project-card-badge-verified">${window.t ? window.t("verified_employer", "Verified Employer") : "Verified Employer"}</span>
            </div>
          </div>

          <div class="project-card-title-box">
            <div class="project-card-title-left">
              <span class="project-card-title-number">${String(index + 1).padStart(2, '0')}</span>
              <span class="project-card-title">${escapeHtml(window.translateRole ? window.translateRole(job.title) : job.title)}</span>
            </div>
            <svg class="project-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <div class="project-card-meta">
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>
              <span>${escapeHtml(job.business_name || 'Verified Tech Enterprise')}</span>
            </span>
            <span style="color: #CBD5E1;">•</span>
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${escapeHtml(job.location_area ? `${job.location_area}, ` : '')}${escapeHtml(job.location_city || 'Visakhapatnam')}</span>
            </span>
          </div>
        </a>
      `;
    }).join('');
  }

  // Re-render showcase grid on language toggle
  window.addEventListener("jobway:language-change", () => {
    renderDynamicCategoryFilters();
    renderFilteredJobs();
  });

  // Fetch jobs immediately
  await fetchAndRenderJobs();
});
