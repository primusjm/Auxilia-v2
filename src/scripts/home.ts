// Homepage behaviour: hero proof slideshow, record spotlight, count-ups, marquee easing, scroll-linked rails.
const de = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduce = (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-motion'));

/* ---------- Hero proof slideshow (4.5s a slide) ---------- */
type Slide = { client: string; year: string; stat: string; statLabel: string; href: string };
const heroData: Slide[] = JSON.parse($('#hero-slides')?.textContent || '[]');
const heroStages = $$('[data-hslide]');
const heroSegs = $$('[data-hseg]');
const proof = $('[data-hero-proof]');
let hIdx = 0;
function heroRender() {
  heroStages.forEach((el, i) => el.classList.toggle('is-on', i === hIdx));
  const cur = heroData[hIdx];
  if (cur) {
    $('[data-h-label]')!.textContent = `${cur.client} · ${cur.year}`;
    $('[data-h-stat]')!.textContent = cur.stat;
    $('[data-h-stat-label]')!.textContent = cur.statLabel;
    $<HTMLAnchorElement>('[data-h-link]')!.href = cur.href;
    const hi = $<HTMLAnchorElement>('[data-h-img-link]');
    if (hi) hi.href = cur.href;
  }
  heroSegs.forEach((btn, i) => {
    const bar = btn.firstElementChild as HTMLElement;
    bar.innerHTML = '';
    if (i < hIdx) bar.innerHTML = '<span class="ax-hseg-done"></span>';
    else if (i === hIdx) {
      const s = document.createElement('span');
      s.className = 'ax-hseg-cur';
      s.addEventListener('animationend', () => {
        hIdx = (hIdx + 1) % heroData.length;
        heroRender();
      });
      bar.appendChild(s);
    }
  });
}
if (heroStages.length) {
  heroSegs.forEach((btn, i) =>
    btn.addEventListener('click', () => {
      hIdx = i;
      heroRender();
    }),
  );
  proof?.addEventListener('mouseenter', () => proof.classList.add('paused'));
  proof?.addEventListener('mouseleave', () => proof.classList.remove('paused'));
  heroRender();
}

/* ---------- Record spotlight (6s a record) ---------- */
type Spot = { no: string; client: string; year: string; sector: string; title: string; stat: string; statLabel: string; href: string };
const spot: Spot[] = JSON.parse($('#spot-data')?.textContent || '[]');
const rows = $$('[data-spot-row]');
const sstages = $$('[data-sslide]');
const mobile = $$('[data-spot-m]');
let sIdx = 0;
function spotRender() {
  rows.forEach((r, i) => {
    const on = i === sIdx;
    r.classList.toggle('is-on', on);
    r.setAttribute('aria-pressed', String(on));
    r.querySelector('[data-spot-drain]')?.remove();
    if (on) {
      const b = document.createElement('span');
      b.className = 'ax-spot-bar';
      b.setAttribute('data-spot-drain', '');
      b.setAttribute('aria-hidden', 'true');
      b.addEventListener('animationend', () => {
        sIdx = (sIdx + 1) % spot.length;
        spotRender();
      });
      r.appendChild(b);
    }
  });
  sstages.forEach((el, i) => el.classList.toggle('is-on', i === sIdx));
  mobile.forEach((el, i) => (i === sIdx ? el.setAttribute('data-on', '') : el.removeAttribute('data-on')));
  const c = spot[sIdx];
  $('[data-s-sector]')!.textContent = c.sector;
  $('[data-s-no]')!.textContent = c.no;
  $('[data-s-meta]')!.textContent = `${c.client} · ${c.year}`;
  $('[data-s-title]')!.textContent = c.title;
  $('[data-s-stat]')!.textContent = c.stat;
  $('[data-s-stat-label]')!.textContent = c.statLabel;
  const l = $<HTMLAnchorElement>('[data-s-link]')!;
  l.href = c.href;
  l.setAttribute('aria-label', `Open ${c.client}`);
  const si = $<HTMLAnchorElement>('[data-s-img-link]');
  if (si) si.href = c.href;
}
if (rows.length) {
  rows.forEach((r, i) =>
    r.addEventListener('click', () => {
      if (i !== sIdx) {
        sIdx = i;
        spotRender();
      }
    }),
  );
  spotRender();
}

/* ---------- Count-ups ---------- */
{
  const els = $$('[data-count]');
  if (els.length && 'IntersectionObserver' in window && !reduce) {
    const fmt = (el: HTMLElement, v: number) => {
      const d = +(el.dataset.dec || 0);
      const pad = +(el.dataset.pad || 0);
      let s = d ? v.toFixed(d) : Math.round(v).toLocaleString('en-US');
      if (pad) s = s.padStart(pad, '0');
      return (el.dataset.pre || '') + s + (el.dataset.suf || '');
    };
    const set = (el: HTMLElement, txt: string) => {
      const t = el.firstChild;
      if (t && t.nodeType === 3) t.nodeValue = txt;
      else el.textContent = txt;
    };
    const run = (el: HTMLElement) => {
      const end = parseFloat(el.dataset.count || '0') || 0;
      const t0 = performance.now();
      const dur = 1400;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        set(el, fmt(el, end * e));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            io.unobserve(en.target);
            const w = Math.max(0, 2000 - performance.now());
            const el = en.target as HTMLElement;
            w ? setTimeout(() => run(el), w) : run(el);
          }
        }),
      { threshold: 0.5 },
    );
    els.forEach((el) => {
      set(el, fmt(el, 0));
      io.observe(el);
    });
  }
}

/* ---------- Marquees ease down on hover ---------- */
const rate = (m: Element | null, r: number, first = false) => {
  if (!m || !(m as HTMLElement).getAnimations) return;
  const list = (m as HTMLElement).getAnimations();
  (first ? list.slice(0, 1) : list).forEach((a) => (a.updatePlaybackRate ? a.updatePlaybackRate(r) : (a.playbackRate = r)));
};
document.addEventListener('mouseover', (e) => {
  const t = e.target as Element;
  const m = t.closest?.('.ldr-marquee');
  if (m && !m.contains(e.relatedTarget as Node)) rate(m, 0.3);
  const a = t.closest?.('[data-apx-marq]');
  if (a) rate(a, 0.25, true);
});
document.addEventListener('mouseout', (e) => {
  const t = e.target as Element;
  const m = t.closest?.('.ldr-marquee');
  if (m && !m.contains(e.relatedTarget as Node)) rate(m, 1);
  const a = t.closest?.('[data-apx-marq]');
  if (a && !(e.relatedTarget && a.contains(e.relatedTarget as Node))) rate(a, 1, true);
});

/* ---------- Scroll-linked capability line and method rail ---------- */
$$('.lc-ico, .mt-node').forEach((el) => $$('path,circle,rect', el).forEach((p) => p.setAttribute('pathLength', '1')));
function tog(el: Element, on: boolean) {
  if (el.classList.contains('is-on') === on) return;
  el.classList.toggle('is-on', on);
  el.classList.remove('ico-draw');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('ico-draw');
}
function lcFx() {
  const vh = innerHeight;
  const lc = $('[data-lc]');
  if (!lc) return;
  const line = $('[data-lc-line]', lc);
  const fill = $<HTMLElement>('[data-lc-fill]', lc);
  const icos = $$('.lc-ico', lc);
  if (line && fill && getComputedStyle(line).display !== 'none') {
    const r = line.getBoundingClientRect();
    const a = vh * 0.85;
    const b = vh * 0.4;
    const p = Math.max(0, Math.min(1, (a - r.top) / (a - b)));
    const vert = r.height > r.width;
    const pp = vert ? Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height)) : p;
    fill.style.transform = vert ? 'scaleY(' + pp + ')' : 'scaleX(' + p + ')';
    if (vert) {
      const le = $('[data-lc-end]', lc);
      if (le) le.classList.toggle('is-on', pp >= 0.999);
      icos.forEach((ic) => {
        const q = ic.getBoundingClientRect();
        tog(ic, q.top + q.height / 2 < vh * 0.6);
      });
      return;
    }
    icos.forEach((ic, i) => tog(ic, i === 0 ? p > 0 : p >= i / 3 - 0.001));
  } else {
    icos.forEach((ic) => {
      const r = ic.getBoundingClientRect();
      tog(ic, r.top + r.height / 2 < vh * 0.6);
    });
  }
}
function mtTick() {
  lcFx();
  const rail = $('[data-method-rail]');
  if (!rail) return;
  const a = innerHeight * 0.6;
  $$('[data-mt-row]', rail).forEach((row) => {
    const node = $('.mt-node', row)!;
    const fill = $<HTMLElement>('[data-mt-fill]', row);
    const nr = node.getBoundingClientRect();
    tog(node, nr.top + nr.height / 2 < a);
    if (fill) {
      const fr = fill.parentElement!.getBoundingClientRect();
      const top = nr.bottom;
      const len = fr.bottom + 12 - top;
      const p = Math.max(0, Math.min(1, (a - top) / len));
      fill.style.transform = 'scaleY(' + p + ')';
    }
  });
  const end = $('.mt-end', rail);
  if (end) {
    const er = end.getBoundingClientRect();
    end.classList.toggle('is-on', er.top + er.height / 2 < a);
  }
}
addEventListener('scroll', mtTick, { passive: true });
addEventListener('resize', mtTick);
requestAnimationFrame(mtTick);
export {};
