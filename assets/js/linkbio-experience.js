(() => {
  document.documentElement.classList.add('bp-js');

  const menu = document.querySelector('[data-bp-menu]');
  const menuToggle = document.querySelector('[data-bp-menu-toggle]');

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menu && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const willOpen = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', willOpen);
      menuToggle.setAttribute('aria-expanded', String(willOpen));
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const marquee = document.querySelector('[data-bp-brand-marquee]');
  const track = document.querySelector('[data-bp-brand-track]');

  const syncBrandLoop = () => {
    if (!marquee || !track || !track.firstElementChild) return;

    track.querySelectorAll('[data-bp-brand-clone]').forEach((clone) => clone.remove());

    const firstSet = track.firstElementChild;
    const setWidth = firstSet.getBoundingClientRect().width;
    if (!setWidth) return;

    track.style.setProperty('--bp-brand-loop-distance', `-${setWidth}px`);

    while (track.scrollWidth < marquee.clientWidth + setWidth * 1.2) {
      const duplicate = firstSet.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.setAttribute('data-bp-brand-clone', '');
      duplicate.querySelectorAll('img').forEach((image) => image.setAttribute('alt', ''));
      track.appendChild(duplicate);
    }
  };

  syncBrandLoop();
  window.addEventListener('load', syncBrandLoop, { once: true });

  if (marquee && 'ResizeObserver' in window) {
    const brandResizeObserver = new ResizeObserver(() => syncBrandLoop());
    brandResizeObserver.observe(marquee);
  } else {
    window.addEventListener('resize', syncBrandLoop, { passive: true });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const syncMotion = () => {
    document.documentElement.classList.toggle('bp-reduced-motion', reducedMotion.matches);
  };
  syncMotion();
  reducedMotion.addEventListener?.('change', syncMotion);

  document.querySelectorAll('.bp-experience a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      closeMenu();
    });
  });
})();
