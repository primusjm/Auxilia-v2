// Theme: data-theme on <html>. The inline script in the layout sets it before first paint.
export type Theme = 'light' | 'dark';

export function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function reflect(theme: Theme) {
  document.querySelectorAll('[data-ft-light]').forEach((b) => b.setAttribute('aria-pressed', String(theme === 'light')));
  document.querySelectorAll('[data-ft-dark]').forEach((b) => b.setAttribute('aria-pressed', String(theme === 'dark')));
}

export function setTheme(theme: Theme, key: string) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(key, theme);
  } catch {}
  reflect(theme);
}

export function initThemeButtons(key: string) {
  reflect(currentTheme());
  document.querySelectorAll('[data-ft-light]').forEach((b) => b.addEventListener('click', () => setTheme('light', key)));
  document.querySelectorAll('[data-ft-dark]').forEach((b) => b.addEventListener('click', () => setTheme('dark', key)));
}
