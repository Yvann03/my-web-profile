(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Never hide content while waiting for JavaScript or an observer callback.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion.matches) entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.panel, .tool-strip').forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${(index % 2) * 80}ms`);
      observer.observe(element);
    });
    document.querySelectorAll('.toolkit-list').forEach((list) => {
      [...list.children].forEach((tag, index) => tag.style.setProperty('--tag-delay', `${index * 55}ms`));
      observer.observe(list);
    });
  }
  // Native details retains keyboard support and works without JavaScript.
  document.querySelectorAll('.project-details').forEach((details) => {
    let animation;
    details.addEventListener('toggle', () => {
      animation?.cancel();
      if (!details.open || reducedMotion.matches) return;
      const copy = details.querySelector('.project-copy');
      animation = copy.animate([
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
    });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) animation?.cancel(); });
  });
})();
