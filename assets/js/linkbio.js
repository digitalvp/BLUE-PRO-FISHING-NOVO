(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const continuation = document.querySelector('.linkbio-continuation');

  const reveal = () => root.classList.add('is-linkbio-ready');
  if (reducedMotion.matches) reveal();
  else requestAnimationFrame(reveal);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    if (!link.closest('.linkbio-page, .linkbio-continuation')) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'start',
    });
    history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
  });

  if (!continuation) return;

  let scheduled = false;
  const syncContinuationState = () => {
    scheduled = false;
    const threshold = Math.min(110, window.innerHeight * 0.18);
    root.classList.toggle('is-linkbio-continuation-active', continuation.getBoundingClientRect().top <= threshold);
  };

  const scheduleSync = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(syncContinuationState);
  };

  syncContinuationState();
  window.addEventListener('scroll', scheduleSync, { passive: true });
  window.addEventListener('resize', scheduleSync, { passive: true });
})();
