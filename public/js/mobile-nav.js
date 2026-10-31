/**
 * JobWay - Universal Mobile Bottom Navigation & Profile Sheet
 * Automatically mounts a persistent bottom navigation bar on mobile viewports (<= 768px)
 * and provides a touch-friendly profile/menu bottom sheet.
 */

(function () {
  'use strict';

  function initMobileNav() {
    // Avoid double injection
    if (document.getElementById('jobway-mobile-bottom-nav')) return;

    const user = window.jobApi?.getCurrentUser();
    const isEmployer = user && (user.role === 'employer' || user.role === 'admin');
    const isWorker = user && user.role === 'worker';
    const currentPath = window.location.pathname.toLowerCase();

    // Determine target URLs and labels based on role
    const workspaceUrl = isEmployer ? '/employer.html' : (isWorker ? '/worker.html' : '/login.html?mode=signup');
    const workspaceLabel = isEmployer ? 'Workspace' : (isWorker ? 'My Desk' : 'Get Started');
    const rosterUrl = isWorker ? '/worker.html#applications-section' : '/candidates.html';
    const rosterLabel = isWorker ? 'Applications' : 'Candidates';

    // Active state detection
    const isHomeActive = currentPath === '/' || currentPath === '/index.html' || currentPath === '';
    const isJobsActive = currentPath.includes('/jobs.html');
    const isRosterActive = isWorker ? (currentPath.includes('/worker.html') && window.location.hash.includes('applications')) : currentPath.includes('/candidates.html');
    const isWorkspaceActive = (isEmployer && currentPath.includes('/employer.html')) || (isWorker && currentPath.includes('/worker.html') && !window.location.hash.includes('applications'));

    // 1. Create Bottom Navigation HTML
    const navHtml = `
      <nav id="jobway-mobile-bottom-nav" class="jobway-mobile-nav" aria-label="Mobile Navigation">
        <a href="/" class="mobile-nav-item ${isHomeActive ? 'active' : ''}">
          <span class="mobile-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
          <span class="mobile-nav-label">Home</span>
        </a>

        <a href="/jobs.html" class="mobile-nav-item ${isJobsActive ? 'active' : ''}">
          <span class="mobile-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </span>
          <span class="mobile-nav-label">Vacancies</span>
        </a>

        <a href="${rosterUrl}" class="mobile-nav-item ${isRosterActive ? 'active' : ''}">
          <span class="mobile-nav-icon">
            ${isWorker ? `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" x2="8" y1="13" y2="13"/>
                <line x1="16" x2="8" y1="17" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            ` : `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            `}
          </span>
          <span class="mobile-nav-label">${rosterLabel}</span>
        </a>

        <a href="${workspaceUrl}" class="mobile-nav-item ${isWorkspaceActive ? 'active' : ''}">
          <span class="mobile-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="9"/>
              <rect x="14" y="3" width="7" height="5"/>
              <rect x="14" y="12" width="7" height="9"/>
              <rect x="3" y="16" width="7" height="5"/>
            </svg>
          </span>
          <span class="mobile-nav-label">${workspaceLabel}</span>
        </a>

        <button type="button" class="mobile-nav-item" id="btn-mobile-nav-menu">
          <span class="mobile-nav-icon">
            ${user ? `
              <span class="mobile-avatar-pill">${(user.name || 'U').slice(0, 2).toUpperCase()}</span>
            ` : `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            `}
          </span>
          <span class="mobile-nav-label">${user ? 'Account' : 'Sign In'}</span>
        </button>
      </nav>
    `;

    // 2. Create Profile / Menu Bottom Sheet HTML
    const sheetHtml = `
      <div id="jobway-profile-sheet-overlay" class="mobile-sheet-overlay" aria-hidden="true">
        <div class="mobile-sheet-panel" role="dialog" aria-modal="true" aria-label="Account Menu">
          <div class="mobile-sheet-drag-handle"></div>
          
          <div class="mobile-sheet-header">
            ${user ? `
              <div class="mobile-sheet-user-row">
                <div class="mobile-sheet-avatar">
                  ${(user.name || 'User').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div class="mobile-sheet-name">${user.name || 'Verified Member'}</div>
                  <div class="mobile-sheet-role">
                    <span class="sheet-role-dot"></span>
                    <span>${isEmployer ? 'Verified Employer' : (isWorker ? 'Trade Pass Worker' : 'Platform Member')}</span>
                    <span style="opacity: 0.6;">• Visakhapatnam</span>
                  </div>
                </div>
              </div>
            ` : `
              <div class="mobile-sheet-guest-row">
                <div style="font-size: 17px; font-weight: 750; color: #0F172A;">Welcome to JobWay</div>
                <div style="font-size: 13px; color: #64748B; margin-top: 2px;">Direct hiring & trade pass network</div>
              </div>
            `}
            <button type="button" class="mobile-sheet-close-btn" id="btn-close-profile-sheet" aria-label="Close sheet">✕</button>
          </div>

          <div class="mobile-sheet-body">
            ${user ? `
              ${isEmployer ? `
                <div class="mobile-sheet-credit-box">
                  <div>
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 750; color: #065F46; letter-spacing: 0.05em;">Unlock Balance</div>
                    <div style="font-size: 15px; font-weight: 700; color: #064E3B;">⚡ ${localStorage.getItem('jc_credits') || '3'} Credits Available</div>
                  </div>
                  <a href="/employer.html#applicants-section" class="sheet-action-link" style="background: #059669; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">
                    Roster
                  </a>
                </div>
              ` : ''}

              <div class="mobile-sheet-menu-list">
                <a href="${workspaceUrl}" class="mobile-sheet-menu-item">
                  <span class="sheet-item-icon">🏢</span>
                  <span class="sheet-item-text">${workspaceLabel}</span>
                  <span class="sheet-item-arrow">→</span>
                </a>

                <a href="/jobs.html" class="mobile-sheet-menu-item">
                  <span class="sheet-item-icon">💼</span>
                  <span class="sheet-item-text">Explore Verified Vacancies</span>
                  <span class="sheet-item-arrow">→</span>
                </a>

                <a href="${rosterUrl}" class="mobile-sheet-menu-item">
                  <span class="sheet-item-icon">👥</span>
                  <span class="sheet-item-text">${rosterLabel}</span>
                  <span class="sheet-item-arrow">→</span>
                </a>

                <a href="https://wa.me/919849123434?text=Hello%20JobWay%20Support" target="_blank" rel="noopener noreferrer" class="mobile-sheet-menu-item">
                  <span class="sheet-item-icon">💬</span>
                  <span class="sheet-item-text">Direct WhatsApp Helpdesk</span>
                  <span class="sheet-item-arrow">↗</span>
                </a>
              </div>

              <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #F1F5F9;">
                <button type="button" class="mobile-sheet-logout-btn" id="btn-sheet-logout">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  <span>Sign Out of JobWay</span>
                </button>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
                <a href="/login.html?mode=signup" class="sheet-btn-primary">
                  <span>Create Account / Get Started →</span>
                </a>
                <a href="/login.html?mode=login" class="sheet-btn-secondary">
                  <span>Sign In with Email / Google</span>
                </a>
                <a href="https://wa.me/919849123434?text=Hello%20JobWay" target="_blank" rel="noopener noreferrer" class="sheet-btn-outline" style="text-decoration: none; margin-top: 6px;">
                  <span>💬 Contact WhatsApp Support ↗</span>
                </a>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', navHtml + sheetHtml);

    // Event listeners
    const overlay = document.getElementById('jobway-profile-sheet-overlay');
    const closeBtn = document.getElementById('btn-close-profile-sheet');
    const openBtn = document.getElementById('btn-mobile-nav-menu');
    const headerChip = document.getElementById('nav-profile-link');
    const sheetLogoutBtn = document.getElementById('btn-sheet-logout');

    function openSheet() {
      if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeSheet() {
      if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSheet();
      });
    }

    // Connect top header avatar chip on mobile to open bottom sheet instead of navigate
    if (headerChip && window.innerWidth <= 768) {
      headerChip.addEventListener('click', (e) => {
        e.preventDefault();
        openSheet();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSheet();
      });
    }

    if (sheetLogoutBtn) {
      sheetLogoutBtn.addEventListener('click', () => {
        if (window.jobApi?.logout) {
          window.jobApi.logout();
        } else {
          localStorage.removeItem('jc_token');
          localStorage.removeItem('jc_user');
          window.location.href = '/';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();

