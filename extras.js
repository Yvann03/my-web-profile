(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.scroll-progress-fill');
  const topButton = document.querySelector('.back-to-top');
  let frame = 0;
  function updateScroll() {
    frame = 0;
    const pending = root.classList.contains('welcome-pending');
    const distance = root.scrollHeight - window.innerHeight;
    const fraction = !pending && distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    topButton.hidden = pending || window.scrollY < window.innerHeight * .75;
  }
  function scheduleScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  window.addEventListener('load', scheduleScroll);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleScroll).observe(document.body);
  topButton.addEventListener('click', () => {
    document.querySelector('.brand').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  updateScroll();

  const opener = document.querySelector('.photo-open');
  const dialog = document.querySelector('.photo-dialog');
  if (!opener || !dialog || typeof dialog.showModal !== 'function') return;
  opener.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
    root.classList.add('photo-viewing');
  });
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    root.classList.remove('photo-viewing');
    opener.focus({ preventScroll: true });
  });
})();
