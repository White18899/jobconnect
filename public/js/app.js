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
  const homeDashboardLink = document.getElementById('home-dashboard-link');
  const homeUserName = document.getElementById('home-user-name');
  const homeLogoutBtn = document.getElementById('home-logout-btn');

  function checkSession() {
    const user = window.jobApi?.getCurrentUser();
    if (user) {
      if (authLoggedOut) authLoggedOut.style.display = 'none';
      if (authLoggedIn) authLoggedIn.style.display = 'flex';
      if (homeUserName) homeUserName.textContent = `${user.name} (${user.role.toUpperCase()})`;

      if (user.role === 'employer') {
        if (homeDashboardLink) homeDashboardLink.href = '/employer.html';
      } else if (user.role === 'admin') {
        if (homeDashboardLink) homeDashboardLink.href = '/admin.html';
      } else {
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
      window.jobApi?.logout();
      checkSession();
    });
  }

  // =========================================================================
  // 2. Signature Hero Title & 3D Interactive Card Animation
  // =========================================================================
  function initHeroAnimations() {
    const box1 = document.querySelector('.home-title-box-1');
    const box2 = document.querySelector('.home-title-box-2');
    const imageBox = document.querySelector('.home-title-image-box');

    // Stagger letter reveals
    const letters = document.querySelectorAll('.home-title-letter');
    letters.forEach((letter, index) => {
      letter.style.setProperty('--stagger-delay', `${0.1 + index * 0.08}s`);
    });

    const textInElements = document.querySelectorAll('.text-in');
    textInElements.forEach((el, index) => {
      el.style.setProperty('--stagger-delay', `${0.3 + index * 0.12}s`);
    });

    if (box1 && box2 && imageBox) {
      box1.classList.remove('is-animated');
      box2.classList.remove('is-animated');
      imageBox.classList.remove('is-animated');

      // Trigger box inward slide
      setTimeout(() => {
        box1.classList.add('is-animated');
        box2.classList.add('is-animated');
      }, 550);

      // Trigger 3D image rotation & reveal
      setTimeout(() => {
        imageBox.classList.add('is-animated');
      }, 950);

      // Start 4-image infinite carousel
      setTimeout(() => {
        const carouselImages = document.querySelectorAll(
          '.home-title-image-1, .home-title-image-2, .home-title-image-3, .home-title-image-4'
        );
        carouselImages.forEach(img => img.classList.add('is-animated'));
      }, 1000);
    }
  }
  initHeroAnimations();

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
  const filterButtons = document.querySelectorAll('.editorial-filter[data-category]');

  let allJobs = [];
  let activeCategory = 'all';

  const TRADE_IMAGES = {
    automation: 'assets/trades/automation.jpg',
    cnc: 'assets/trades/cnc.jpg',
    ev: 'assets/trades/ev.jpg',
    solar: 'assets/trades/solar.jpg',
    welding: 'assets/trades/welding.jpg',
    hvac: 'assets/trades/hvac.jpg'
  };

  function getJobImage(category = '') {
    const cat = (category || '').toLowerCase();
    if (cat.includes('auto') || cat.includes('robot') || cat.includes('plc') || cat.includes('vision')) return TRADE_IMAGES.automation;
    if (cat.includes('cnc') || cat.includes('machin') || cat.includes('turn') || cat.includes('mill') || cat.includes('tool')) return TRADE_IMAGES.cnc;
    if (cat.includes('ev') || cat.includes('battery') || cat.includes('powertrain') || cat.includes('electric vehicle')) return TRADE_IMAGES.ev;
    if (cat.includes('solar') || cat.includes('grid') || cat.includes('renewable') || cat.includes('pv')) return TRADE_IMAGES.solar;
    if (cat.includes('weld') || cat.includes('pipe') || cat.includes('fabricat') || cat.includes('vessel')) return TRADE_IMAGES.welding;
    if (cat.includes('hvac') || cat.includes('chiller') || cat.includes('cleanroom') || cat.includes('refriger') || cat.includes('ac')) return TRADE_IMAGES.hvac;
    return TRADE_IMAGES.automation;
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

  async function fetchAndRenderJobs() {
    if (!homeJobsGrid) return;
    try {
      allJobs = await window.jobApi.getJobs();
      if (headerVacanciesCount) {
        headerVacanciesCount.textContent = `(${String(allJobs.length).padStart(2, '0')})`;
      }
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
          <p style="font-size: var(--font-size-m); font-weight: 500; margin-bottom: 0.5vw;">No vacancies found in this trade</p>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 1.5vw;">Try selecting "All" to browse all active trade vacancies.</p>
          <button type="button" class="nav-btn-solid" id="btn-reset-editorial-filter">Show All Vacancies</button>
        </div>
      `;
      document.getElementById('btn-reset-editorial-filter')?.addEventListener('click', () => {
        activeCategory = 'all';
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.category === 'all'));
        renderFilteredJobs();
      });
      return;
    }

    homeJobsGrid.innerHTML = filtered.map((job, index) => {
      const coverImg = getJobImage(job.category);
      const minSal = (job.salary_min || 16000).toLocaleString('en-IN');
      const maxSal = (job.salary_max || 25000).toLocaleString('en-IN');
      const vacanciesCount = job.vacancies || 1;

      return `
        <a class="project-card" href="/login.html?mode=signup&role=worker&job=${encodeURIComponent(job.id)}">
          <div class="project-card-box">
            <img class="project-card-image" src="${coverImg}" alt="${escapeHtml(job.title)}" loading="lazy">
            <div class="project-card-badges">
              <span class="project-card-badge">₹${minSal} – ₹${maxSal} / mo</span>
              <span class="project-card-badge project-card-badge-verified">Verified Employer</span>
              <span class="project-card-badge" style="background: rgba(0,0,0,0.8); color: #fff;">${vacanciesCount} Open</span>
            </div>
          </div>

          <div class="project-card-title-box">
            <div class="project-card-title-left">
              <span class="project-card-title-number">${String(index + 1).padStart(2, '0')}</span>
              <span class="project-card-title">${escapeHtml(job.title)}</span>
            </div>
            <svg class="project-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <div class="project-card-meta">
            🏢 ${escapeHtml(job.business_name || 'Verified Workshop')} • 📍 ${escapeHtml(job.location_area ? `${job.location_area}, ` : '')}${escapeHtml(job.location_city || 'Hyderabad')}
          </div>
        </a>
      `;
    }).join('');
  }

  // Filter click handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'all';
      renderFilteredJobs();
    });
  });

  // Fetch jobs immediately
  await fetchAndRenderJobs();
});
