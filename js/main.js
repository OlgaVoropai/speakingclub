import { reviews } from '../data/reviews.js';
import { CONFIG } from './config.js';

function loadGA4() {
  if (CONFIG.GA_MEASUREMENT_ID && CONFIG.GA_MEASUREMENT_ID !== 'TODO') {
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
}

document.addEventListener('DOMContentLoaded', () => {
  // Render reviews
  const reviewsContainer = document.getElementById('reviews-container');
  if (reviewsContainer) {
    reviewsContainer.innerHTML = reviews
      .map((review) => {
        const isLong = review.text.length > 220;
        let shortText = review.text;
        let fullText = review.text;

        if (isLong) {
          // truncate at sentence or word boundary near 220 chars
          const sliced = review.text.slice(0, 220);
          const lastPeriod = sliced.lastIndexOf('.');
          const cutIndex = lastPeriod > 100 ? lastPeriod + 1 : 220;
          shortText = review.text.slice(0, cutIndex) + '…';
        }

        return `
        <div class="review-card">
          <h3 class="review-card__name">${review.name}</h3>
          <p class="review-card__text">${isLong ? shortText : fullText}</p>
          ${
            isLong
              ? `
            <details class="review-card__details">
              <summary class="review-card__toggle">Читати повністю</summary>
              <p class="review-card__full">${fullText}</p>
            </details>
          `
              : ''
          }
        </div>
      `;
      })
      .join('');
  }

  // Cookie banner logic
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  const cookieConsent = localStorage.getItem('cookie_consent');
  if (!cookieConsent && cookieBanner) {
    cookieBanner.hidden = false;
  } else if (cookieConsent === 'accepted') {
    loadGA4();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      if (cookieBanner) cookieBanner.hidden = true;
      loadGA4();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'rejected');
      if (cookieBanner) cookieBanner.hidden = true;
    });
  }

  // CTA click tracking stubs
  document.querySelectorAll('.cta-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const location = btn.getAttribute('data-location') || 'unknown';
      console.log(`GA4 event: cta_click, location: ${location}`);
    });
  });

  // FAQ open tracking
  document.querySelectorAll('.faq-item').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        const index = details.getAttribute('data-faq-index');
        console.log(`GA4 event: faq_open, index: ${index}`);
      }
    });
  });
});
