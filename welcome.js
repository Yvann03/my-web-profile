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
    button.addEventListener('click', async () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const welcome = document.querySelector('.welcome-content');
      button.disabled = true;
      if (!reducedMotion.matches && welcome && typeof welcome.animate === 'function') {
        let fallback;
        let animation;
        const finishEarly = () => { if (reducedMotion.matches) animation?.finish(); };
        try {
          animation = welcome.animate([
            { opacity: 1, transform: 'translateY(0) scale(1)' },
            { opacity: 0, transform: 'translateY(-18px) scale(.98)' }
          ], { duration: 350, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
          reducedMotion.addEventListener('change', finishEarly);
          // Always reveal the page, even if an animation event is interrupted.
          await Promise.race([
            animation.finished,
            new Promise((resolve) => { fallback = setTimeout(resolve, 550); })
          ]);
        } catch { /* Continue directly if animations are unsupported or cancelled. */ }
        finally {
          clearTimeout(fallback);
          reducedMotion.removeEventListener('change', finishEarly);
        }
      }
      if (!reducedMotion.matches) root.classList.add('portfolio-entering');
      root.classList.remove('welcome-pending');
      document.getElementById('main').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Recalculate the sticky header and active navigation after revealing the page.
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => root.classList.remove('portfolio-entering'), 800);
    }, { once: true });
  });
})();
