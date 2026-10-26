import { CONFIG } from './config.js';

const STORAGE_KEY = 'cookie_consent';

function readConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
}

let gaLoaded = false;
export function loadGA4() {
  if (gaLoaded || !CONFIG.GA_MEASUREMENT_ID || CONFIG.GA_MEASUREMENT_ID === 'TODO') return;
  gaLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', CONFIG.GA_MEASUREMENT_ID);
}

export function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  const consent = readConsent();
  if (!consent && banner) {
    banner.hidden = false;
  } else if (consent === 'accepted') {
    loadGA4();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      writeConsent('accepted');
      if (banner) banner.hidden = true;
      loadGA4();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      writeConsent('rejected');
      if (banner) banner.hidden = true;
    });
  }
}

export function trackEvent(name, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

export function initTracking() {
  document.querySelectorAll('.cta-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const location = btn.getAttribute('data-location') || 'unknown';
      trackEvent('cta_click', { location });
    });
  });

  document.querySelectorAll('.faq-item').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        const index = details.getAttribute('data-faq-index');
        trackEvent('faq_open', { faq_index: Number(index) });
      }
    });
  });
}
