/**
 * JobWay Public Landing Page Controller
 * Pure Vanilla JavaScript • No React • Cloudflare Edge Integration
 */

document.addEventListener('DOMContentLoaded', async () => {
  const authLoggedOut = document.getElementById('auth-logged-out');
  const authLoggedIn = document.getElementById('auth-logged-in');
  const homeDashboardLink = document.getElementById('home-dashboard-link');
  const homeUserName = document.getElementById('home-user-name');
  const homeUserIcon = document.getElementById('home-user-icon');
  const homeLogoutBtn = document.getElementById('home-logout-btn');

  // Check Session State
  function checkSession() {
    const user = window.jobApi?.getCurrentUser();
    if (user) {
      if (authLoggedOut) authLoggedOut.style.display = 'none';
      if (authLoggedIn) authLoggedIn.style.display = 'flex';
      if (homeUserName) homeUserName.textContent = `${user.name} (${user.role.toUpperCase()})`;

      if (user.role === 'employer') {
        if (homeUserIcon) homeUserIcon.textContent = '🏢';
        if (homeDashboardLink) homeDashboardLink.href = '/employer';
      } else if (user.role === 'admin') {
        if (homeUserIcon) homeUserIcon.textContent = '🛡️';
        if (homeDashboardLink) homeDashboardLink.href = '/admin';
      } else {
        if (homeUserIcon) homeUserIcon.textContent = '👷';
        if (homeDashboardLink) homeDashboardLink.href = '/worker';
      }
    } else {
      if (authLoggedOut) authLoggedOut.style.display = 'flex';
      if (authLoggedIn) authLoggedIn.style.display = 'none';
    }
  }
  checkSession();

  if (homeLogoutBtn) {
    homeLogoutBtn.addEventListener('click', () => {
      window.jobApi?.logout();
      checkSession();
    });
  }

  // =========================================================================
  // 1. Live Job Explorer & Real-Time Filtering
  // =========================================================================
  const homeJobsGrid = document.getElementById('home-jobs-grid');
  const jobsCountBadge = document.getElementById('jobs-count-badge');
  const homeSearchQuery = document.getElementById('home-search-query');
  const homeSearchCity = document.getElementById('home-search-city');
  const homeSearchSalary = document.getElementById('home-search-salary');
  const homeBtnSearch = document.getElementById('home-btn-search');
  const tradeChips = document.querySelectorAll('.trade-chip[data-category]');

  let allJobs = [];
  let activeCategory = 'all';

  async function fetchAndRenderJobs() {
    if (!homeJobsGrid) return;
    try {
      allJobs = await window.jobApi.getJobs();
      renderFilteredJobs();
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  }

  function renderFilteredJobs() {
    if (!homeJobsGrid) return;
    const query = (homeSearchQuery?.value || '').trim().toLowerCase();
    const city = homeSearchCity?.value || 'all';
    const minSalary = parseInt(homeSearchSalary?.value || '0', 10);

    const filtered = allJobs.filter(job => {
      // Category filter
      if (activeCategory !== 'all') {
        const catMatch = (job.category || '').toLowerCase().includes(activeCategory.toLowerCase()) ||
                         (job.title || '').toLowerCase().includes(activeCategory.toLowerCase());
        if (!catMatch) return false;
      }
      // City filter
      if (city !== 'all') {
        if ((job.location_city || '').toLowerCase() !== city.toLowerCase()) return false;
      }
      // Min salary filter
      if (minSalary > 0) {
        if ((job.salary_max || job.salary_min || 0) < minSalary) return false;
      }
      // Text query
      if (query) {
        const titleMatch = (job.title || '').toLowerCase().includes(query);
        const descMatch = (job.description || '').toLowerCase().includes(query);
        const reqMatch = (job.requirements || '').toLowerCase().includes(query);
        const bizMatch = (job.business_name || '').toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !reqMatch && !bizMatch) return false;
      }
      return true;
    });

    if (jobsCountBadge) {
      jobsCountBadge.innerHTML = `<span>Showing ${filtered.length} Verified Vacanc${filtered.length === 1 ? 'y' : 'ies'}</span>`;
    }

    if (filtered.length === 0) {
      homeJobsGrid.innerHTML = `
        <div class="craft-card" style="grid-column: 1 / -1; padding: 48px 24px; text-align: center;">
          <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
          <h4 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">No matching trade vacancies found</h4>
          <p style="font-size: 13px; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">Try clearing filters or selecting "All Trades" to see all verified direct job openings across India.</p>
          <button type="button" class="btn-signin-header" id="btn-reset-filters" style="margin: 0 auto;">Reset All Filters</button>
        </div>
      `;
      document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
        if (homeSearchQuery) homeSearchQuery.value = '';
        if (homeSearchCity) homeSearchCity.value = 'all';
        if (homeSearchSalary) homeSearchSalary.value = '0';
        activeCategory = 'all';
        tradeChips.forEach(c => c.classList.toggle('active', c.dataset.category === 'all'));
        renderFilteredJobs();
      });
      return;
    }

    homeJobsGrid.innerHTML = filtered.map(job => `
      <div class="job-card craft-card">
        <div>
          <div class="job-card-top">
            <span class="category-tag">${escapeHtml(job.category || 'Trade')}</span>
            <span class="craft-badge-verified" style="font-size: 10.5px; padding: 2px 7px;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Verified Employer</span>
            </span>
          </div>

          <h3 class="job-card-title" style="margin-bottom: 8px; font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.35;">
            ${escapeHtml(job.title)}
          </h3>

          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>🏢</span>
            <span>${escapeHtml(job.business_name || 'Vetted Business')}</span>
          </div>

          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px; display: flex; align-items: center; gap: 5px;">
            <span>📍</span>
            <span>${escapeHtml(job.location_area ? `${job.location_area}, ` : '')}${escapeHtml(job.location_city || 'India')}</span>
          </div>

          <div style="margin-bottom: 16px; display: flex; align-items: baseline; gap: 6px;">
            <span style="font-size: 20px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; font-family: var(--font-mono);">
              ₹${(job.salary_min || 15000).toLocaleString('en-IN')} - ₹${(job.salary_max || 25000).toLocaleString('en-IN')}
            </span>
            <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">/ month</span>
          </div>

          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 18px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${escapeHtml(job.description || job.requirements || 'Immediate opening with direct local employer interview.')}
          </p>
        </div>

        <div style="border-top: 1px solid var(--border-light); padding-top: 14px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <span class="craft-chip-etched" style="font-size: 11px;">
            ${escapeHtml(job.vacancies || 1)} Vacanc${job.vacancies === 1 ? 'y' : 'ies'}
          </span>
          <a href="/login.html?mode=signup&role=worker&job=${job.id}" class="craft-btn-primary" style="padding: 7px 14px; font-size: 12px; text-decoration: none;">
            <span>Apply Direct (Free)</span>
            <span style="font-weight: 700;">→</span>
          </a>
        </div>
      </div>
    `).join('');
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

  // Event Listeners for Filters
  homeSearchQuery?.addEventListener('input', () => renderFilteredJobs());
  homeSearchCity?.addEventListener('change', () => renderFilteredJobs());
  homeSearchSalary?.addEventListener('change', () => renderFilteredJobs());
  homeBtnSearch?.addEventListener('click', (e) => {
    e.preventDefault();
    renderFilteredJobs();
    document.getElementById('live-jobs-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  tradeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      tradeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category || 'all';
      renderFilteredJobs();
    });
  });

  // Initial load
  await fetchAndRenderJobs();

  // =========================================================================
  // 2. How It Works Tab Switcher
  // =========================================================================
  const tabWorker = document.getElementById('tab-how-worker');
  const tabEmployer = document.getElementById('tab-how-employer');
  const viewWorker = document.getElementById('steps-worker-view');
  const viewEmployer = document.getElementById('steps-employer-view');

  if (tabWorker && tabEmployer && viewWorker && viewEmployer) {
    tabWorker.addEventListener('click', () => {
      tabWorker.classList.add('active');
      tabWorker.style.background = 'var(--text-primary)';
      tabWorker.style.color = '#ffffff';

      tabEmployer.classList.remove('active');
      tabEmployer.style.background = 'transparent';
      tabEmployer.style.color = 'var(--text-secondary)';

      viewWorker.style.display = 'grid';
      viewEmployer.style.display = 'none';
    });

    tabEmployer.addEventListener('click', () => {
      tabEmployer.classList.add('active');
      tabEmployer.style.background = 'var(--text-primary)';
      tabEmployer.style.color = '#ffffff';

      tabWorker.classList.remove('active');
      tabWorker.style.background = 'transparent';
      tabWorker.style.color = 'var(--text-secondary)';

      viewWorker.style.display = 'none';
      viewEmployer.style.display = 'grid';
    });
  }

  // =========================================================================
  // 3. FAQ Accordion Toggle
  // =========================================================================
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.closest('.faq-item');
      const wasActive = parent.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!wasActive) {
        parent.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 4. Scroll Reveal Observer
  // =========================================================================
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
  }
});
