(() => {
  const root = document.documentElement;
  let theme = 'light';
  try {
    const saved = localStorage.getItem('portfolio-theme-v2');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch { /* The toggle still works when browser storage is unavailable. */ }

  const applyTheme = () => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content =
      theme === 'dark' ? '#101a2b' : '#f5f5f0';
  };
  applyTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    const updateButton = () => {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀' : '☾';
    };
    updateButton();
    button.hidden = false;
    button.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      updateButton();
      try { localStorage.setItem('portfolio-theme-v2', theme); } catch { /* Optional persistence. */ }
    });
  });
})();
