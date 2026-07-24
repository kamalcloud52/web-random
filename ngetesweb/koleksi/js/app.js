/**
 * Main Application Orchestrator & Hash Router
 */
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { openProfileModal } from './components/modal.js';
import { renderHomePage } from './pages/home.js';
import { renderLoginPage } from './pages/login.js';
import { renderRegisterPage } from './pages/register.js';
import { renderProfilePage } from './pages/profil.js';

function initApp() {
  const appView = document.getElementById('app-view');

  // Refresh Header Shell
  function refreshHeader() {
    renderHeader(
      () => {
        // On Profile click
        openProfileModal(() => {
          refreshHeader();
          if (window.location.hash === '#/profil') {
            window.location.hash = '#/login';
          }
        });
      },
      () => {
        // On Login click
        window.location.hash = '#/login';
      }
    );
  }

  // Refresh Footer Shell
  renderFooter();

  // Hash Router
  function router() {
    refreshHeader();
    const hash = window.location.hash || '#/home';

    if (!appView) return;

    if (hash === '#/login') {
      renderLoginPage(appView, () => {
        refreshHeader();
      });
    } else if (hash === '#/register') {
      renderRegisterPage(appView);
    } else if (hash === '#/profil') {
      renderProfilePage(appView, () => {
        refreshHeader();
      });
    } else {
      // Default / Home Page
      renderHomePage(appView);
    }

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Listen to Hash Changes
  window.addEventListener('hashchange', router);

  // Initial Route Dispatch
  router();
}

// Boot app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
