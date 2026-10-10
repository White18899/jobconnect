/**
 * JobWay Public Landing Page Controller
 * Pure Vanilla JavaScript • No React • Cloudflare Edge Integration
 */

document.addEventListener('DOMContentLoaded', () => {
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
});
