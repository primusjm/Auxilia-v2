// Appendix case studies: project tabs, timeline progress and number count-ups.
import './chrome';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tabs ---------- */
const tabs = $$('[role="tab"]');
const panels = $$('[role="tabpanel"]');
let cur = 0;
function goTab(i: number, focus = false, force = false) {
  const n = tabs.length;
  const k = ((i % n) + n) % n;
  cur = k;
  tabs.forEach((t, j) => {
    const on = j === k;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    t.parentElement?.classList.toggle('is-on', on);
  });
  panels.forEach((p, j) => (p.hidden = j !== k));
  // On narrow screens the tab row scrolls sideways; keep the active tab in view.
  const list = $('[role="tablist"]');
  const cell = tabs[k].parentElement;
  if (list && cell && list.scrollWidth > list.clientWidth) {
    const left = list.scrollLeft + cell.getBoundingClientRect().left - list.getBoundingClientRect().left - 16;
    list.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }
  const sec = document.getElementById('projects');
  const bar = document.getElementById('projects-top');
  if (sec && bar) {
    const top = sec.getBoundingClientRect().top + window.scrollY - bar.offsetHeight;
    if (force || window.scrollY > top + 1) window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
  if (focus) tabs[k].focus();
  requestAnimationFrame(tlTick);
}
tabs.forEach((t, i) => t.addEventListener('click', () => goTab(i)));
$('[role="tablist"]')?.addEventListener('keydown', (e) => {
  const ev = e as KeyboardEvent;
  if (ev.key === 'ArrowRight') {
    ev.preventDefault();
    goTab(cur + 1, true);
  } else if (ev.key === 'ArrowLeft') {
    ev.preventDefault();
    goTab(cur - 1, true);
  } else if (ev.key === 'Home') {
    ev.preventDefault();
    goTab(0, true);
  } else if (ev.key === 'End') {
    ev.preventDefault();
    goTab(tabs.length - 1, true);
  }
});
// Menu entries that point at a project switch the tab as well as scrolling.
$$('[data-tab]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const n = a.getAttribute('data-tab');
    if (n == null || n === '') return;
    e.preventDefault();
    goTab(+n, false, true);
  }),
);

/* ---------- Timeline progress ---------- */
function tlTick() {
  if (reduce) return;
  const vh = innerHeight;
  const vert = matchMedia('(max-width:860px)').matches;
  $$('[data-tl]').forEach((tl) => {
    if (!tl.getClientRects().length) return;
    const r = tl.getBoundingClientRect();
    const steps = Array.from(tl.children) as HTMLElement[];
    const n = steps.length;
    let p: number;
    if (vert) p = Math.max(0, Math.min(1, (vh * 0.6 - (r.top + 20)) / Math.max(1, r.height - 40)));
    else {
      const a = vh * 0.85;
      const b = vh * 0.4;
      p = Math.max(0, Math.min(1, (a - r.top) / (a - b)));
    }
    tl.style.setProperty('--tl-p', p.toFixed(4));
    steps.forEach((s, i) => {
      let on: boolean;
      if (vert) {
        const q = s.firstElementChild!.getBoundingClientRect();
        on = q.top + q.height / 2 < vh * 0.6;
      } else on = i === 0 ? p > 0 : p >= i / (n - 1) - 0.001;
      if (s.classList.contains('tl-on') !== on) {
        s.classList.toggle('tl-on', on);
        s.classList.remove('tl-pop');
        void s.offsetWidth;
        if (on) s.classList.add('tl-pop');
      }
    });
  });
}
if (!reduce) $$('[data-tl]').forEach((el) => el.classList.add('tl-armed'));
addEventListener('scroll', tlTick, { passive: true });
addEventListener('resize', tlTick);
tlTick();

/* ---------- Number count-ups: every number in the text counts up from zero ---------- */
if (!reduce && 'IntersectionObserver' in window) {
  const run = (el: HTMLElement) => {
    const src = el.dataset.orig || el.textContent || '';
    const t0 = performance.now();
    const dur = 1400;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = src.replace(/\d+(?:\.\d+)?/g, (n) => {
        const d = (n.split('.')[1] || '').length;
        return (parseFloat(n) * e).toFixed(d);
      });
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = src;
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((en) => {
        if (en.isIntersecting) {
          io.unobserve(en.target);
          run(en.target as HTMLElement);
        }
      }),
    { threshold: 0.5 },
  );
  $$('[data-count]').forEach((el) => {
    el.dataset.orig = el.textContent || '';
    el.textContent = el.dataset.orig.replace(/\d+(?:\.\d+)?/g, '0');
    io.observe(el);
  });
}
export {};
