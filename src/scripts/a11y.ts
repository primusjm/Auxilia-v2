// Accessibility menu, shared by Auxilia and Acquisti. Opened from the footer button next to the theme switcher.
// Preferences are classes on <html> (styles in src/styles/a11y.css), saved under one key for the whole domain.
// The inline script in each layout applies them before first paint.
const KEY = 'auxilia-a11y-v1';
const de = document.documentElement;

type Prefs = { size: 0 | 1 | 2; font: 'site' | 'plain' | 'dyslexic'; contrast: boolean; links: boolean; nobold: boolean; spacing: boolean; motion: boolean };
const DEFAULTS: Prefs = { size: 0, font: 'site', contrast: false, links: false, nobold: false, spacing: false, motion: false };
const SWITCHES: [keyof Prefs, string, string][] = [
  ['contrast', 'High contrast', 'Stronger text and lines'],
  ['links', 'Underline links', 'Every link is underlined'],
  ['nobold', 'No bold text', 'All text at regular weight'],
  ['spacing', 'Wider spacing', 'More room between letters, words and lines'],
  ['motion', 'Reduce motion', 'Stops animation and moving text'],
];

function load(): Prefs {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}
let prefs = load();

function apply() {
  const c = de.classList;
  c.toggle('a11y-size-1', prefs.size === 1);
  c.toggle('a11y-size-2', prefs.size === 2);
  c.toggle('a11y-font-plain', prefs.font === 'plain');
  c.toggle('a11y-font-dyslexic', prefs.font === 'dyslexic');
  for (const [k] of SWITCHES) c.toggle('a11y-' + k, !!prefs[k]);
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {}
  reflect();
}

const ICON_X = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const seg = (name: string, label: string, opts: [string, string][]) =>
  `<div class="a11y-group" role="group" aria-labelledby="a11y-${name}"><span class="a11y-label" id="a11y-${name}">${label}</span><div class="a11y-seg">${opts
    .map(([v, t]) => `<button type="button" data-a11y-${name}="${v}" aria-pressed="false">${t}</button>`)
    .join('')}</div></div>`;

const scrim = document.createElement('div');
scrim.className = 'a11y-scrim';
scrim.setAttribute('aria-hidden', 'true');
const panel = document.createElement('div');
panel.className = 'a11y-panel';
panel.setAttribute('role', 'dialog');
panel.setAttribute('aria-modal', 'true');
panel.setAttribute('aria-labelledby', 'a11y-title');
panel.setAttribute('aria-hidden', 'true');
panel.innerHTML =
  `<div class="a11y-head"><h2 id="a11y-title">Accessibility</h2><button type="button" class="a11y-close" data-a11y-close aria-label="Close accessibility options">${ICON_X}</button></div>` +
  `<p class="a11y-intro">Change how the site looks and moves. Your choices are saved on this device.</p>` +
  `<div class="a11y-body">` +
  seg('theme', 'Theme', [['light', 'Light'], ['dark', 'Dark']]) +
  seg('size', 'Text size', [['0', 'Default'], ['1', 'Large'], ['2', 'Larger']]) +
  seg('font', 'Font', [['site', 'Site font'], ['plain', 'Plain'], ['dyslexic', 'Dyslexia-friendly']]) +
  `<div class="a11y-group" style="border-bottom:0;padding-bottom:0;">${SWITCHES.map(
    ([k, t, s]) => `<button type="button" class="a11y-row" role="switch" aria-checked="false" data-a11y-switch="${k}"><span>${t}<small>${s}</small></span><span class="a11y-switch" aria-hidden="true"></span></button>`,
  ).join('')}</div>` +
  `<button type="button" class="a11y-reset" data-a11y-reset>Reset all</button></div>`;
document.body.append(scrim, panel);

function reflect() {
  const theme = de.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  panel.querySelectorAll<HTMLElement>('[data-a11y-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.a11yTheme === theme)));
  panel.querySelectorAll<HTMLElement>('[data-a11y-size]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.a11ySize! === prefs.size)));
  panel.querySelectorAll<HTMLElement>('[data-a11y-font]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.a11yFont === prefs.font)));
  panel.querySelectorAll<HTMLElement>('[data-a11y-switch]').forEach((b) => b.setAttribute('aria-checked', String(!!prefs[b.dataset.a11ySwitch as keyof Prefs])));
}
new MutationObserver(reflect).observe(de, { attributes: true, attributeFilter: ['data-theme'] });

let opener: HTMLElement | null = null;
function open(from: HTMLElement) {
  opener = from;
  reflect();
  panel.classList.add('is-open');
  scrim.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  document.querySelectorAll('[data-ft-a11y]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  panel.querySelector<HTMLElement>('[data-a11y-close]')?.focus();
}
function close() {
  if (!panel.classList.contains('is-open')) return;
  panel.classList.remove('is-open');
  scrim.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('[data-ft-a11y]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  opener?.focus();
}

// The footer may be rendered by a Preact island, so listen at the document.
document.addEventListener('click', (e) => {
  const t = e.target as Element;
  const btn = t.closest?.('[data-ft-a11y]') as HTMLElement | null;
  if (btn) return void (panel.classList.contains('is-open') ? close() : open(btn));
  if (t === scrim) return void close();
  if (!panel.contains(t)) return;
  const el = t.closest('button') as HTMLElement | null;
  if (!el) return;
  const d = el.dataset;
  if ('a11yClose' in d) return void close();
  if (d.a11yTheme) (document.querySelector(d.a11yTheme === 'light' ? '[data-ft-light]' : '[data-ft-dark]') as HTMLElement | null)?.click();
  else if (d.a11ySize) prefs.size = +d.a11ySize as Prefs['size'];
  else if (d.a11yFont) prefs.font = d.a11yFont as Prefs['font'];
  else if (d.a11ySwitch) (prefs as any)[d.a11ySwitch] = !prefs[d.a11ySwitch as keyof Prefs];
  else if ('a11yReset' in d) prefs = { ...DEFAULTS };
  apply();
});
document.addEventListener('keydown', (e) => {
  if (!panel.classList.contains('is-open')) return;
  if (e.key === 'Escape') {
    e.stopPropagation();
    return void close();
  }
  if (e.key !== 'Tab') return;
  const f = [...panel.querySelectorAll<HTMLElement>('button')];
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
reflect();
export {};
