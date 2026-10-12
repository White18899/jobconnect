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

  function getTradeIcon(category = '') {
    const cat = (category || '').toLowerCase();
    if (cat.includes('mechanic')) {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
    } else if (cat.includes('electrician')) {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    } else if (cat.includes('driver')) {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>`;
    } else if (cat.includes('plumber')) {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    } else if (cat.includes('cook')) {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>`;
    } else if (cat.includes('ac')) {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"/></svg>`;
    }
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
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
      jobsCountBadge.innerHTML = `<span>${filtered.length} Active Vacanc${filtered.length === 1 ? 'y' : 'ies'}</span>`;
    }

    if (filtered.length === 0) {
      homeJobsGrid.innerHTML = `
        <div class="precision-row-empty">
          <div style="font-size: 26px; margin-bottom: 8px;">🔍</div>
          <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">No matching trade vacancies found</h4>
          <p style="font-size: 12.5px; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">Try clearing filters or selecting "All Trades" to see all verified direct job openings across India.</p>
          <button type="button" class="btn-signin-header" id="btn-reset-filters" style="margin: 0 auto; padding: 6px 16px; font-size: 12px;">Reset All Filters</button>
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
      <div class="precision-row-item">
        <div class="p-row-left">
          <div class="p-row-icon" title="${escapeHtml(job.category || 'Trade')}">
            ${getTradeIcon(job.category)}
          </div>
          <div class="p-row-content">
            <div class="p-row-header">
              <h3 class="p-row-title">${escapeHtml(job.title)}</h3>
              <span class="p-row-cat-badge">${escapeHtml(job.category || 'Trade')}</span>
              <span class="p-row-verified-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Vetted Employer</span>
              </span>
            </div>
            <div class="p-row-details">
              <span class="p-detail-company">🏢 ${escapeHtml(job.business_name || 'Vetted Business')}</span>
              <span class="p-detail-sep">•</span>
              <span class="p-detail-location">📍 ${escapeHtml(job.location_area ? `${job.location_area}, ` : '')}${escapeHtml(job.location_city || 'India')}</span>
              <span class="p-detail-sep">•</span>
              <span class="p-detail-vacancies">${escapeHtml(job.vacancies || 1)} Open Position${(job.vacancies || 1) > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div class="p-row-right">
          <div class="p-row-wage">
            <span class="p-wage-amt">₹${(job.salary_min || 15000).toLocaleString('en-IN')} – ₹${(job.salary_max || 25000).toLocaleString('en-IN')}</span>
            <span class="p-wage-period">/ month</span>
          </div>
          <a href="/login.html?mode=signup&role=worker&job=${job.id}" class="p-row-apply-btn" title="Direct WhatsApp & Interview Connect">
            <span>Apply Direct</span>
            <span class="p-arrow">→</span>
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
  // 2. Scroll Reveal Observer
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
