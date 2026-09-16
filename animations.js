(() => {
  // Content stays visible if JavaScript or observation is unavailable.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reducedMotion.matches) entry.target.classList.add('reveal-in');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.section-heading, .about-copy, .toolkit-card, .project, .contact')
    .forEach((element) => observer.observe(element));
})();
