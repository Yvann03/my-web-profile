(() => {
  // Only gate the page when this script loads; the portfolio remains usable without JS.
  const root = document.documentElement;
  root.classList.add('welcome-pending');
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.enter-portfolio');
    if (!button) {
      root.classList.remove('welcome-pending');
      return;
    }
    button.addEventListener('click', () => {
      root.classList.remove('welcome-pending');
      document.getElementById('main').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Recalculate the sticky header and active navigation after revealing the page.
      window.dispatchEvent(new Event('resize'));
    }, { once: true });
  });
})();
