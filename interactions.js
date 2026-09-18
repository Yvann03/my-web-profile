(() => {
  document.querySelectorAll('.email-card').forEach((card) => {
    const button = card.querySelector('.copy-email');
    const address = card.querySelector('.email-address');
    const status = card.querySelector('.copy-status');
    let timer;
    button.hidden = false;
    button.addEventListener('click', async () => {
      clearTimeout(timer);
      button.disabled = true;
      status.textContent = '';
      const email = address.textContent.trim();
      let copied = false;
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        // Support local file previews and browsers without Clipboard API access.
        const field = document.createElement('textarea');
        field.value = email;
        field.className = 'clipboard-helper';
        field.setAttribute('readonly', '');
        document.body.appendChild(field);
        field.select();
        try { copied = document.execCommand('copy'); } catch { copied = false; }
        field.remove();
      }
      button.disabled = false;
      button.focus({ preventScroll: true });
      status.textContent = copied ? 'Copied!' : 'Could not copy. Select the address and copy it manually.';
      if (copied) timer = setTimeout(() => { status.textContent = ''; }, 2500);
    });
  });

  const header = document.querySelector('.header');
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href')));
  let frame = 0;
  function updateNavigation() {
    frame = 0;
    const headerHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-offset', `${headerHeight + 24}px`);
    const readingLine = Math.min(headerHeight + 48, window.innerHeight * .5);
    let current = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= readingLine) current = index;
    });
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = sections.length - 1;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(header);
  updateNavigation();
})();
