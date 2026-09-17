(() => {
  // Content stays visible if JavaScript or observation is unavailable.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reducedMotion.matches) entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    document.querySelectorAll('.section-heading, .about-copy, .project, .contact')
      .forEach((element) => observer.observe(element));

    document.querySelectorAll('.toolkit-list').forEach((list) => {
      [...list.children].forEach((tag, index) => {
        tag.style.setProperty('--tag-delay', `${index * 110}ms`);
      });
      observer.observe(list);
    });
  }

  const card = document.querySelector('.profile-card');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!card) return;
  let bounds;
  let frame = 0;
  const resetTilt = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    bounds = null;
    card.classList.remove('is-tilting');
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  };
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches || !finePointer.matches) return;
    if (!bounds) bounds = card.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      card.style.setProperty('--tilt-x', `${-y * 9}deg`);
      card.style.setProperty('--tilt-y', `${x * 9}deg`);
      card.classList.add('is-tilting');
      frame = 0;
    });
  });
  card.addEventListener('pointerleave', resetTilt);
  card.addEventListener('pointercancel', resetTilt);
  window.addEventListener('blur', resetTilt);
  window.addEventListener('scroll', resetTilt, { passive: true });
  window.addEventListener('resize', resetTilt);
  reducedMotion.addEventListener('change', resetTilt);
  finePointer.addEventListener('change', resetTilt);
})();
