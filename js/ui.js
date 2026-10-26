import { reviews } from '../data/reviews.js';

export function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const overlay = document.querySelector('[data-nav-overlay]');
  if (!toggle || !nav) return;

  const firstLink = nav.querySelector('a');

  function setOpen(open, { returnFocus = false } = {}) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    nav.classList.toggle('nav--open', open);
    document.body.classList.toggle('nav-open', open);
    if (overlay) overlay.hidden = !open;

    if (open) {
      firstLink?.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen, { returnFocus: isOpen });
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      setOpen(false, { returnFocus: true });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, { returnFocus: true });
    }
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setOpen(false, { returnFocus: false });
    });
  });

  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      setOpen(false, { returnFocus: false });
    }
  });
}

export function initAccordions() {
  const groups = document.querySelectorAll('.faq__accordion, .doubts__list');
  groups.forEach((group) => {
    const items = [...group.querySelectorAll('details')];
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) {
            other.open = false;
          }
        });
      });
    });
  });
}

export function renderReviews() {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  container.innerHTML = '';

  reviews.forEach((review) => {
    const card = document.createElement('article');
    card.className = 'review-card';

    const nameEl = document.createElement('h3');
    nameEl.className = 'review-card__name';
    nameEl.textContent = review.name;
    card.appendChild(nameEl);

    const chars = Array.from(review.text);
    const isLong = chars.length > 220;

    let displayText = review.text;
    if (isLong) {
      const sliced = chars.slice(0, 220).join('');
      const matches = [...sliced.matchAll(/[.!?](?=\s|$)/g)];
      const last = matches.at(-1);
      let cut = last && last.index > 80 ? last.index + 1 : sliced.lastIndexOf(' ');
      if (cut < 80) cut = 220;
      displayText = sliced.slice(0, cut).trimEnd() + '…';
    }

    const textEl = document.createElement('p');
    textEl.className = 'review-card__text';
    textEl.textContent = isLong ? displayText : review.text;
    card.appendChild(textEl);

    if (isLong) {
      const details = document.createElement('details');
      details.className = 'review-card__details';

      const summary = document.createElement('summary');
      summary.className = 'review-card__toggle';
      summary.textContent = 'Читати повністю';
      details.appendChild(summary);

      const fullP = document.createElement('p');
      fullP.className = 'review-card__full';
      fullP.textContent = review.text;
      details.appendChild(fullP);

      card.appendChild(details);
    }

    container.appendChild(card);
  });
}
