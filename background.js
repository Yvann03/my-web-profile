(() => {
  const background = document.querySelector('.ambient-background');
  const button = document.querySelector('.background-toggle');
  if (!background || !button) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 681px)');
  let paused = false;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  function clearPointer() {
    cancelAnimationFrame(frame);
    frame = 0;
    background.classList.remove('pointer-active');
  }
  function syncMotion() {
    background.classList.toggle('motion-paused', paused || reducedMotion.matches || document.hidden);
    button.hidden = reducedMotion.matches;
    button.textContent = paused ? 'Resume background' : 'Pause background';
    clearPointer();
  }
  button.addEventListener('click', () => {
    paused = !paused;
    syncMotion();
  });
  window.addEventListener('pointermove', (event) => {
    if (paused || reducedMotion.matches || !desktopPointer.matches || document.hidden || event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      background.style.setProperty('--pointer-x', `${pointerX}px`);
      background.style.setProperty('--pointer-y', `${pointerY}px`);
      background.classList.add('pointer-active');
      frame = 0;
    });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', clearPointer);
  window.addEventListener('blur', clearPointer);
  window.addEventListener('resize', clearPointer);
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  desktopPointer.addEventListener('change', clearPointer);
  syncMotion();
})();
