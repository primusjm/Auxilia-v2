// Shared Auxilia chrome: menu, contact modal, country picker, footer quotes, scroll effects, reveals, lightbox.
// Ported from the React prototype state into plain DOM code. State lives on <html> as classes.
import countries from '../data/countries.json';
import { initThemeButtons } from './theme';
import './nav';

const de = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

initThemeButtons('auxilia-theme-v2');

/* ---------------- Menu ---------------- */
let menuOpen = false;
let scrolled = false;
const menuBtn = $('[data-menu-toggle]');
const menuLabel = $('[data-menu-label]');
function syncMenu() {
  de.classList.toggle('menu-open', menuOpen);
  de.classList.toggle('menu-compact', scrolled && !menuOpen);
  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', String(menuOpen));
    menuBtn.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Open menu');
  }
  if (menuLabel) menuLabel.textContent = menuOpen ? 'Close' : 'Menu';
}
function setMenu(open: boolean) {
  if (menuOpen === open) return;
  menuOpen = open;
  syncMenu();
}
menuBtn?.addEventListener('click', () => setMenu(!menuOpen));
$$('[data-menu-close]').forEach((el) => el.addEventListener('click', () => setMenu(false)));
function onScrollMenu() {
  const k = (window.scrollY || 0) > 40;
  if (k !== scrolled) {
    scrolled = k;
    syncMenu();
  }
}
addEventListener('scroll', onScrollMenu, { passive: true });
onScrollMenu();

/* ---------------- Contact modal ---------------- */
type CT = 'idle' | 'sending' | 'sent' | 'error';
let ctOpen = false;
let ctState: CT = 'idle';
const dlg = $('[data-ct-dialog]');
const form = $<HTMLFormElement>('[data-ct-form]');
const sent = $('[data-ct-sent]');
const errEl = $('[data-ct-error]');
const submit = $<HTMLButtonElement>('[data-ct-submit]');
const ctLabel = $('[data-ct-label]');
const ctIco = $('[data-ct-ico]');
const sendIcoHTML = ctIco?.innerHTML ?? '';
const FORM_ID = 'mgvnzlny';

function syncCt() {
  de.classList.toggle('ct-open', ctOpen);
  dlg?.setAttribute('aria-hidden', String(!ctOpen));
  if (form) form.hidden = ctState === 'sent';
  if (sent) sent.hidden = ctState !== 'sent';
  if (errEl) errEl.hidden = ctState !== 'error';
  if (submit) submit.disabled = ctState === 'sending';
  if (ctLabel) ctLabel.textContent = ctState === 'sending' ? 'Sending…' : 'Send message';
  if (ctIco) ctIco.innerHTML = ctState === 'sending' ? '<span class="ax-ct-spin" data-ct-anim=""></span>' : sendIcoHTML;
}
function openContact(e?: Event) {
  e?.preventDefault();
  setMenu(false);
  ctOpen = true;
  if (ctState === 'sent') ctState = 'idle';
  syncCt();
}
function closeContact() {
  ctOpen = false;
  closePicker(false);
  syncCt();
}
$$('[data-ct-close]').forEach((el) => el.addEventListener('click', closeContact));
document.addEventListener(
  'click',
  (e) => {
    const t = e.target as Element;
    const a = t.closest?.('a[href^="mailto:"], [data-book], [data-ft-book]') as HTMLElement | null;
    if (!a || a.closest('[role="dialog"]')) return;
    openContact(e);
  },
  true,
);
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  ctState = 'sending';
  syncCt();
  try {
    const r = await fetch('https://formspree.io/f/' + FORM_ID, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error('send');
    form.reset();
    resetPicker();
    ctState = 'sent';
  } catch {
    ctState = 'error';
  }
  syncCt();
});

/* ---------------- Country picker ---------------- */
type Country = { iso: string; dial: string; name: string };
const all = countries as Country[];
const cc = $('[data-cc]');
const ccBtn = $<HTMLButtonElement>('[data-cc-btn]');
const ccPop = $('[data-cc-pop]');
const ccSearch = $<HTMLInputElement>('[data-cc-search]');
const ccList = $('[data-cc-list]');
const ccCount = $('[data-cc-count]');
const ccEmpty = $('[data-cc-empty]');
const ccValue = $<HTMLInputElement>('[data-cc-value]');
let ccIso = 'KE';
let ccActive = 0;
let ccQ = '';
let ccIsOpen = false;
const filtered = () => {
  const q = ccQ.trim().toLowerCase().replace(/^\+/, '');
  if (!q) return all;
  return all.filter((c) => c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q || c.dial.slice(1).startsWith(q));
};
function renderCc() {
  if (!ccList || !ccCount || !ccEmpty || !ccSearch) return;
  const list = filtered();
  ccList.innerHTML = '';
  list.forEach((c, i) => {
    const el = document.createElement('span');
    el.id = 'cc-' + c.iso;
    el.setAttribute('role', 'option');
    el.setAttribute('aria-selected', String(c.iso === ccIso));
    el.className = 'ax-cc-opt' + (i === ccActive ? ' is-active' : '');
    el.innerHTML =
      `<span style="font-weight:600;font-size:10.5px;letter-spacing:.12em;color:var(--brand-text);"></span>` +
      `<span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>` +
      `<span style="font-variant-numeric:tabular-nums;color:var(--ink-soft);"></span>` +
      `<span class="ax-cc-tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="m5 12 5 5 9-10"></path></svg></span>`;
    const kids = el.children;
    kids[0].textContent = c.iso;
    kids[1].textContent = c.name;
    kids[2].textContent = c.dial;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      pick(c);
    });
    el.addEventListener('mousemove', () => {
      if (ccActive !== i) {
        ccActive = i;
        markActive(false);
      }
    });
    ccList.appendChild(el);
  });
  ccCount.textContent = list.length + (list.length === 1 ? ' match' : ' matches');
  ccEmpty.hidden = list.length !== 0;
  const act = list[ccActive];
  if (act) ccSearch.setAttribute('aria-activedescendant', 'cc-' + act.iso);
  else ccSearch.removeAttribute('aria-activedescendant');
}
function markActive(scroll: boolean) {
  if (!ccList || !ccSearch) return;
  Array.from(ccList.children).forEach((el, i) => el.classList.toggle('is-active', i === ccActive));
  const list = filtered();
  const act = list[ccActive];
  if (act) ccSearch.setAttribute('aria-activedescendant', 'cc-' + act.iso);
  scrollToActive(scroll);
}
function scrollToActive(center: boolean) {
  if (!ccList) return;
  const el = ccList.children[ccActive] as HTMLElement | undefined;
  if (!el) return;
  const t = el.offsetTop;
  const b = t + el.offsetHeight;
  if (center) ccList.scrollTop = t - ccList.clientHeight / 2 + el.offsetHeight / 2;
  else if (t < ccList.scrollTop) ccList.scrollTop = t;
  else if (b > ccList.scrollTop + ccList.clientHeight) ccList.scrollTop = b - ccList.clientHeight;
}
function syncBtn() {
  const cur = all.find((c) => c.iso === ccIso) || all[0];
  if (ccValue) ccValue.value = cur.iso + ' ' + cur.dial;
  $('[data-cc-iso]')!.textContent = cur.iso;
  $('[data-cc-dial]')!.textContent = cur.dial;
  ccBtn?.setAttribute('aria-label', 'Country code: ' + cur.name + ' ' + cur.dial);
}
function resetPicker() {
  ccIso = 'KE';
  syncBtn();
}
function openPicker() {
  if (!ccPop || !ccBtn || !ccSearch) return;
  ccIsOpen = true;
  ccQ = '';
  ccSearch.value = '';
  ccActive = Math.max(0, all.findIndex((c) => c.iso === ccIso));
  ccPop.hidden = false;
  ccBtn.setAttribute('aria-expanded', 'true');
  dlg?.classList.add('cc-open');
  renderCc();
  ccSearch.focus();
  scrollToActive(true);
}
function closePicker(refocus: boolean) {
  if (!ccIsOpen) return;
  ccIsOpen = false;
  if (ccPop) ccPop.hidden = true;
  ccBtn?.setAttribute('aria-expanded', 'false');
  dlg?.classList.remove('cc-open');
  if (refocus) ccBtn?.focus();
}
function pick(c: Country) {
  ccIso = c.iso;
  syncBtn();
  closePicker(false);
  $<HTMLInputElement>('[data-cc] input[name="phone"]')?.focus();
}
ccBtn?.addEventListener('click', () => (ccIsOpen ? closePicker(false) : openPicker()));
ccBtn?.addEventListener('keydown', (e) => {
  if (!ccIsOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    openPicker();
  }
});
ccSearch?.addEventListener('input', () => {
  ccQ = ccSearch.value;
  ccActive = 0;
  renderCc();
  if (ccList) ccList.scrollTop = 0;
});
ccSearch?.addEventListener('keydown', (e) => {
  const list = filtered();
  const n = list.length;
  const mv = (k: number) => {
    e.preventDefault();
    ccActive = k;
    markActive(false);
  };
  if (e.key === 'ArrowDown') mv(n ? (ccActive + 1) % n : 0);
  else if (e.key === 'ArrowUp') mv(n ? (ccActive - 1 + n) % n : 0);
  else if (e.key === 'Home') mv(0);
  else if (e.key === 'End') mv(Math.max(0, n - 1));
  else if (e.key === 'Enter') {
    e.preventDefault();
    if (list[ccActive]) pick(list[ccActive]);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    closePicker(true);
  } else if (e.key === 'Tab') closePicker(false);
});
document.addEventListener('mousedown', (e) => {
  if (ccIsOpen && !(e.target as Element).closest?.('[data-cc]')) closePicker(false);
});

/* ---------------- Lightbox ---------------- */
const lb = $('[data-lb-root]');
const plates = $$('[data-lb]');
let lbIdx = -1;
/** Plates are stepped within their own group (a record study has one group, an appendix has one per project). */
function lbPool(i: number) {
  const g = plates[i]?.getAttribute('data-lb-plate');
  return plates.map((_, j) => j).filter((j) => plates[j].getAttribute('data-lb-plate') === g);
}
function lbStep(d: number) {
  const pool = lbPool(lbIdx);
  const pos = pool.indexOf(lbIdx);
  if (pos < 0) return;
  lbShow(pool[(pos + d + pool.length) % pool.length]);
}
function lbShow(k: number) {
  if (!lb || !plates.length || k < 0 || k >= plates.length) return;
  lbIdx = k;
  const pool = lbPool(k);
  const p = plates[k];
  const img = p.querySelector('img');
  const src = (img && (img.currentSrc || img.getAttribute('src'))) || '';
  const plate = p.getAttribute('data-lb-plate') || 'The screens';
  const cap = p.getAttribute('data-lb-cap') || '';
  lb.hidden = false;
  $('[data-lb-count]', lb)!.textContent = String(pool.indexOf(k) + 1).padStart(2, '0') + ' / ' + String(pool.length).padStart(2, '0');
  $('[data-lb-plate]', lb)!.textContent = plate;
  $('[data-lb-cap]', lb)!.textContent = cap;
  const media = $('[data-lb-media]', lb)!;
  media.innerHTML = '';
  if (src) {
    const im = document.createElement('img');
    im.className = 'ax-lb-img';
    im.src = src;
    im.alt = cap;
    im.addEventListener('click', (e) => e.stopPropagation());
    media.appendChild(im);
  } else {
    const ph = document.createElement('div');
    ph.style.cssText =
      'width:min(880px,100%);aspect-ratio:16/10;border:1px dashed rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;color:#C9C5F7;font-size:13px;letter-spacing:.12em;text-transform:uppercase;animation:lbImg .5s cubic-bezier(.2,.7,.2,1)';
    ph.textContent = 'Image to come';
    media.appendChild(ph);
  }
}
function lbClose() {
  lbIdx = -1;
  if (lb) lb.hidden = true;
}
if (lb) {
  document.addEventListener(
    'click',
    (e) => {
      if (e.button !== 0) return;
      const p = (e.target as Element).closest?.('[data-lb]') as HTMLElement | null;
      if (!p || lb.contains(p)) return;
      e.preventDefault();
      e.stopPropagation();
      lbShow(plates.indexOf(p));
    },
    true,
  );
  lb.addEventListener('click', lbClose);
  $('[data-lb-close]', lb)?.addEventListener('click', (e) => {
    e.stopPropagation();
    lbClose();
  });
  $('[data-lb-bar]', lb)?.addEventListener('click', (e) => e.stopPropagation());
  $('[data-lb-prev]', lb)?.addEventListener('click', () => lbStep(-1));
  $('[data-lb-next]', lb)?.addEventListener('click', () => lbStep(1));
}

/* ---------------- Keyboard ---------------- */
document.addEventListener('keydown', (e) => {
  if (lbIdx >= 0) {
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
    return;
  }
  if (e.key !== 'Escape') return;
  if (ccIsOpen) closePicker(false);
  else if (ctOpen) closeContact();
  else if (menuOpen) setMenu(false);
});

/* ---------------- Footer quotes ---------------- */
const qEls = $$('.ax-q');
const dots = $$('[data-q-dot]');
let qi = 0;
let qTimer: number | undefined;
function showQuote(i: number) {
  qi = i;
  const n = qEls.length;
  qEls.forEach((el, k) => {
    el.classList.toggle('is-on', k === qi);
    el.classList.toggle('is-prev', k === (qi + n - 1) % n);
    el.setAttribute('aria-hidden', String(k !== qi));
  });
  dots.forEach((d, k) => {
    const on = k === qi;
    d.innerHTML = on ? '<span class="ax-qd-on"><span></span></span>' : '<span class="ax-qd-off"></span>';
  });
}
function startQuotes() {
  clearInterval(qTimer);
  if (qEls.length < 2) return;
  qTimer = window.setInterval(() => showQuote((qi + 1) % qEls.length), 5000);
}
if (qEls.length) {
  showQuote(0);
  startQuotes();
  const strip = $('[data-ft-quotes]');
  strip?.addEventListener('mouseenter', () => clearInterval(qTimer));
  strip?.addEventListener('mouseleave', startQuotes);
  dots.forEach((d, i) =>
    d.addEventListener('click', () => {
      showQuote(i);
      startQuotes();
    }),
  );
}

/* ---------------- Scroll effects ---------------- */
function scrollFx() {
  const vh = innerHeight;
  const y = scrollY || 0;
  const mt = $('[data-mark-top]');
  if (mt) mt.style.transform = 'rotate(' + -12 * Math.min(1, y / 480) + 'deg)';
  const mb = $('[data-mark-bot]');
  if (mb?.parentElement) {
    const s = mb.parentElement.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (vh - s.top) / Math.min(s.height, vh)));
    mb.style.transform = 'rotate(' + -12 * (1 - p) + 'deg)';
  }
}
addEventListener('scroll', scrollFx, { passive: true });
addEventListener('resize', scrollFx);
requestAnimationFrame(scrollFx);

/* ---------------- Icon draw, section heads, rules ---------------- */
const shIcos = $$('[data-sh-split] > div > span[aria-hidden], [data-draw-ico]');
shIcos.forEach((el) => $$('path,circle,rect', el).forEach((p) => p.setAttribute('pathLength', '1')));
const icoPlay = (el: Element) => {
  el.classList.remove('ico-draw');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('ico-draw');
};
const icoTimers = new Map<Element, number>();
if ('IntersectionObserver' in window) {
  const icoIO = new IntersectionObserver(
    (es) =>
      es.forEach((en) => {
        const el = en.target;
        if (en.isIntersecting) {
          if (!icoTimers.has(el)) {
            icoPlay(el);
            icoTimers.set(el, window.setInterval(() => icoPlay(el), 30000));
          }
        } else if (icoTimers.has(el)) {
          clearInterval(icoTimers.get(el));
          icoTimers.delete(el);
        }
      }),
    { threshold: 0.6 },
  );
  shIcos.forEach((el) => icoIO.observe(el));
  const shIO = new IntersectionObserver((es) => es.forEach((en) => en.target.classList.toggle('sh-in', en.isIntersecting)), { threshold: 0.5 });
  $$('[data-sh-split]').forEach((el) => shIO.observe(el));
}

if (!reduce && 'IntersectionObserver' in window) {
  de.classList.add('ln-armed');
  const lio = new IntersectionObserver(
    (es) => {
      let k = 0;
      es.forEach((en) => {
        if (en.isIntersecting) {
          const t = en.target as HTMLElement;
          t.style.setProperty('--ln-d', k++ * 90 + 'ms');
          t.classList.add('ln-in');
          lio.unobserve(t);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
  );
  $$('[data-grid],[data-draw],.ldr-row').forEach((el) => lio.observe(el));
}

/* ---------------- Reveals ---------------- */
if (!reduce && 'IntersectionObserver' in window) {
  const t0 = (document.timeline && (document.timeline.currentTime as number)) || 0;
  requestAnimationFrame(() => {
    const t1 = (document.timeline && (document.timeline.currentTime as number)) || 0;
    if (!(t1 > t0)) return;
    de.classList.add('reveal-armed');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );
    $$('[data-reveal]').forEach((n) => io.observe(n));
    setTimeout(() => de.classList.remove('reveal-armed'), 1600);
  });
}

export { openContact, closeContact, setMenu, $, $$, reduce };
