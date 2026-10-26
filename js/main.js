import { initMobileMenu, initAccordions, renderReviews } from './ui.js';
import { initCookieBanner, initTracking } from './analytics.js';

function init() {
  renderReviews();
  initAccordions();
  initMobileMenu();
  initCookieBanner();
  initTracking();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
