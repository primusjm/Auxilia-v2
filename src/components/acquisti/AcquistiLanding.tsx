/** @jsxImportSource preact */
// @ts-nocheck
// Logic ported from the Claude Design prototype (React class) to Preact. The template is generated: see ./landing.template.tsx.
import { Component, createRef, h } from 'preact';
import './style-px';
import countries from '../../data/countries.json';
import template from './landing.template';

export default class AcquistiLanding extends Component<any, any> {
  state = { cc: 'KE', ccQ: '', ccA: 0, theme: null, active: 0, faq: 0, paused: false, qi: 0, ct: false, ctState: 'idle', ccOpen: false, fb: 0, fbOpen: false, sup: 0, mOpen: false, mC: false };
  _sup = this.props.data.support.map((c) => [c.label, c.items.map((i) => [i.q, i.a]), c.blurb, c.shot]);
  _menuVals() {
    const { mOpen: o, mC } = this.state; const k = mC && !o; const ez = 'cubic-bezier(.2,.7,.2,1)';
    return {
      mLogoSt: { display: 'inline-flex', alignItems: 'center', textDecoration: 'none', opacity: k ? 0 : 1, transform: k ? 'translateY(-8px)' : 'none', pointerEvents: k ? 'none' : 'auto', transition: 'opacity .35s ease, transform .5s cubic-bezier(.2,.7,.2,1)' },
      mOpen: o, mLabel: o ? 'Close' : 'Menu', mAria: o ? 'Close menu' : 'Open menu',
      mToggle: () => this.setState(s => ({ mOpen: !s.mOpen })),
      mBtnBg: this.state.mInv && !this.state.mOpen ? '#FFFFFF' : '#3B28FF',
      mBtnInk: this.state.mInv && !this.state.mOpen ? '#3B28FF' : '#FFFFFF',
      mClose: () => { if (this.state.mOpen) this.setState({ mOpen: false }); },
      mReview: (e) => { this.setState({ mOpen: false }); if (this.openReview) this.openReview(e); },
      mMail: (e) => { this.setState({ mOpen: false }); if (this.openContact) this.openContact(e); },
      mNav: this.props.shared.menu.map((n, i) => ({ no: '0' + (i + 1), label: n.label, sub: n.sub, href: n.href, d1: n.icon[0], d2: n.icon[1], d3: n.icon[2] })),
      mL1: { position: 'absolute', left: 0, right: 0, top: o ? 4 : 0, height: 1.8, background: 'currentColor', transform: o ? 'rotate(45deg)' : 'none', transition: 'all .35s ' + ez },
      mL2: { position: 'absolute', left: 0, right: o ? 0 : 5, top: o ? 4 : 8, height: 1.8, background: 'currentColor', transform: o ? 'rotate(-45deg)' : 'none', transition: 'all .35s ' + ez },
      mLabelSt: { display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: k ? 0 : 60, marginLeft: k ? -12 : 0, opacity: k ? 0 : 1, transition: 'max-width .5s ' + ez + ', margin .5s ' + ez + ', opacity .3s ease' },
      mBar: k
        ? { pointerEvents: 'none', position: 'absolute', top: 14, left: 'calc(100% - 14px - 72px)', width: 72, height: 62, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderRadius: 0, background: 'transparent', border: 0, borderBottom: 0, boxShadow: '0 0 0 0 rgba(10,9,32,0)', transition: 'all .6s cubic-bezier(.2,.7,.2,1)' }
        : { pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: 96, padding: '0 clamp(20px,4vw,44px)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderRadius: 0, background: 'transparent', border: '1px solid transparent', borderBottomColor: 'transparent', boxShadow: '0 0 0 0 rgba(10,9,32,0)', transition: 'all .6s ' + ez },
      mPanel: { position: 'absolute', top: 84, right: k ? 14 : 'clamp(20px,4vw,44px)', width: 'max-content', maxWidth: 'calc(100vw - 24px)', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', background: 'var(--mpanel-bg)', border: '1px solid color-mix(in oklab, var(--brand) 22%, transparent)', boxShadow: '0 40px 80px -30px rgba(10,9,32,.7)', transformOrigin: '100% 0', clipPath: o ? 'circle(150% at 100% 0)' : 'circle(0% at 100% 0)', transform: o ? 'none' : 'translateY(-10px) scale(.86)', opacity: o ? 1 : 0, visibility: o ? 'visible' : 'hidden', transition: 'clip-path .75s cubic-bezier(.7,0,.2,1), transform .75s cubic-bezier(.2,.7,.2,1), right .6s cubic-bezier(.2,.7,.2,1), opacity .3s ease' + (o ? '' : ' .45s') + ', visibility 0s ' + (o ? '0s' : '.75s'), pointerEvents: o ? 'auto' : 'none' },
      mScrim: { position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(9,8,28,.35)', opacity: o ? 1 : 0, transition: 'opacity .4s ease', pointerEvents: o ? 'auto' : 'none' },
    };
  }
  _onScrollM = () => { const k = (window.scrollY || 0) > 40; if (k !== this.state.mC) this.setState({ mC: k });
    const pv = document.getElementById('privacy'); if (pv) { const r = pv.getBoundingClientRect(); const inv = r.top < 76 && r.bottom > 40; if (inv !== !!this.state.mInv) this.setState({ mInv: inv }); } this._markFx(); };
  _markFx() { const vh = window.innerHeight;
    const ma = document.querySelector('[data-mark-app]'); if (ma) ma.style.transform = 'rotate(' + (12 * Math.min(1, (window.scrollY || 0) / 480)) + 'deg)';
    [['[data-mark-bot]', -12], ['[data-mark-pv]', 14]].forEach(([sel, deg]) => { const el = document.querySelector(sel); if (!el) return; const s = el.parentNode.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (vh - s.top) / Math.min(s.height, vh))); el.style.transform = 'rotate(' + (deg * (1 - p)) + 'deg)'; });
  }
  _tms = this.props.data.reviews;
  _hcL = this.props.data.heroChips.left.map((c) => [c.label, c.value, c.left, c.top]);
  _hcR = this.props.data.heroChips.right.map((c) => [c.label, c.value, c.left, c.top]);
  _fb = this.props.shared.feedbackTopics.map((t) => [t.label, t.icon]);
  openReview = (e) => { this.setState({ fb: this._fb.findIndex(o => o[0] === 'Leave a review'), fbOpen: false }); this.openContact(e); };
  _cc: any[] = countries;
  _ccSearchRef = createRef(); _ccListRef = createRef();
  _ccFiltered() { const q = this.state.ccQ.trim().toLowerCase().replace(/^\+/, ''); if (!q) return this._cc; return this._cc.filter(c => c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q || c.dial.slice(1).startsWith(q)); }
  _ccOpen = () => { const i = Math.max(0, this._cc.findIndex(c => c.iso === this.state.cc)); this.setState({ ccOpen: true, ccQ: '', ccA: i }, () => { const s = this._ccSearchRef.current; if (s) s.focus(); this._ccScroll(true); }); };
  _ccClose = (refocus) => { this.setState({ ccOpen: false }); if (refocus) { const b = document.querySelector('[data-cc] > button'); if (b) b.focus(); } };
  _ccPick = (c) => { this.setState({ cc: c.iso, ccOpen: false }); const t = document.querySelector('[data-cc] input[name="phone"]'); if (t) t.focus(); };
  _ccScroll(center) { const l = this._ccListRef.current; if (!l) return; const el = l.children[this.state.ccA]; if (!el) return; const t = el.offsetTop, b = t + el.offsetHeight; if (center) l.scrollTop = t - l.clientHeight / 2 + el.offsetHeight / 2; else if (t < l.scrollTop) l.scrollTop = t; else if (b > l.scrollTop + l.clientHeight) l.scrollTop = b - l.clientHeight; }
  _ccKey = (e) => { const list = this._ccFiltered(), n = list.length; const mv = (k) => { e.preventDefault(); this.setState({ ccA: k }, () => this._ccScroll(false)); };
    if (e.key === 'ArrowDown') mv(n ? (this.state.ccA + 1) % n : 0); else if (e.key === 'ArrowUp') mv(n ? (this.state.ccA - 1 + n) % n : 0); else if (e.key === 'Home') mv(0); else if (e.key === 'End') mv(Math.max(0, n - 1));
    else if (e.key === 'Enter') { e.preventDefault(); if (list[this.state.ccA]) this._ccPick(list[this.state.ccA]); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this._ccClose(true); } else if (e.key === 'Tab') this._ccClose(false); };
  _ccDoc = (e) => { if (this.state.ccOpen && !(e.target.closest && e.target.closest('[data-cc]'))) this.setState({ ccOpen: false }); };
  _ccVals() { const s = this.state, cur = this._cc.find(c => c.iso === s.cc) || this._cc[0], list = this._ccFiltered();
    return { ccValue: cur.iso + ' ' + cur.dial, ccIso: cur.iso, ccDial: cur.dial, ccOpen: s.ccOpen, ccQ: s.ccQ, ccAria: 'Country code: ' + cur.name + ' ' + cur.dial,
      ccChevSt: { color: 'var(--brand)', transition: 'transform .35s cubic-bezier(.2,.7,.2,1)', transform: s.ccOpen ? 'rotate(180deg)' : 'none' },
      ccToggle: () => s.ccOpen ? this._ccClose(false) : this._ccOpen(),
      ccBtnKey: (e) => { if (!s.ccOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); this._ccOpen(); } },
      ccSearch: (e) => this.setState({ ccQ: e.target.value, ccA: 0 }, () => { const l = this._ccListRef.current; if (l) l.scrollTop = 0; }),
      ccKey: this._ccKey, ccSearchRef: this._ccSearchRef, ccListRef: this._ccListRef,
      ccCount: list.length + (list.length === 1 ? ' match' : ' matches'), ccEmpty: list.length === 0, ccActiveId: list[s.ccA] ? 'cc-' + list[s.ccA].iso : undefined,
      ccList: list.map((c, i) => { const act = i === s.ccA, sel = c.iso === s.cc; return { ...c, id: 'cc-' + c.iso, sel, pick: (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } this._ccPick(c); }, hover: () => { if (s.ccA !== i) this.setState({ ccA: i }); },
        st: { display: 'grid', gridTemplateColumns: '30px minmax(0,1fr) auto 16px', alignItems: 'center', gap: 10, padding: '10px 14px', fontSize: 14.5, lineHeight: 1.3, cursor: 'pointer', color: 'var(--ink)', background: act ? 'var(--brand-wash)' : 'transparent', boxShadow: act ? 'inset 3px 0 0 var(--brand)' : 'inset 0 0 0 transparent', transition: 'background-color .15s ease, box-shadow .2s ease' },
        tickSt: { display: 'inline-flex', color: 'var(--brand)', opacity: sel ? 1 : 0 } }; }) }; }
  _theme = (t) => { document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('acquisti-theme-v1', t); } catch (e) {} this.setState({ theme: t }); };
  _fbDoc = (e) => { if (this.state.fbOpen && !(e.target.closest && e.target.closest('[data-fb]'))) this.setState({ fbOpen: false }); };
  _quotes = this.props.data.quotes;
  _startQuotes() { clearInterval(this._qt); this._qt = setInterval(() => this.setState(s => ({ qi: (s.qi + 1) % this._quotes.length })), 5000); }
  pauseQuotes = () => clearInterval(this._qt);
  resumeQuotes = () => this._startQuotes();
  openContact = (e) => { if (e) e.preventDefault(); this.setState(s => ({ ct: true, ctState: s.ctState === 'sent' ? 'idle' : s.ctState })); };
  closeContact = () => this.setState({ ct: false });
  submitContact = async (e) => {
    e.preventDefault(); const f = e.currentTarget; const fd = new FormData(f);
    this.setState({ ctState: 'sending' });
    try {
      { const r = await fetch('https://formspree.io/f/' + (this.props.formspreeId || 'mgvnzlny'), { method: 'POST', body: fd, headers: { Accept: 'application/json' } }); if (!r.ok) throw new Error('send'); }
      f.reset(); this.setState({ ctState: 'sent' });
    } catch (err) { this.setState({ ctState: 'error' }); }
  };
  _onKey = (e) => { if (e.key !== 'Escape') return; if (this.state.ccOpen) this.setState({ ccOpen: false }); else if (this.state.mOpen) this.setState({ mOpen: false }); else if (this.state.fbOpen) this.setState({ fbOpen: false }); else if (this.state.ct) this.setState({ ct: false }); };
  amp = 1;
  componentDidMount() {
    { const th = document.documentElement.getAttribute('data-theme'); if ((th === 'light' || th === 'dark') && th !== this.state.theme) this.setState({ theme: th }); }
    this._nw = () => { const n = window.innerWidth <= 640; if (n !== this.state.narrow) this.setState({ narrow: n }); }; this._nw(); window.addEventListener('resize', this._nw);
    this._tripT = new Map();
    this._tripClick = (ev) => { if (window.innerWidth > 640) return; const c = ev.target.closest && ev.target.closest('#how [data-grid3] > div'); if (!c) return; clearTimeout(this._tripT.get(c)); c.toggleAttribute('data-on'); c._manual = true; };
    document.addEventListener('click', this._tripClick);
    if ('IntersectionObserver' in window) {
      this._tripIO = new IntersectionObserver((es) => es.forEach(en => { const c = en.target; if (window.innerWidth > 640) return; clearTimeout(this._tripT.get(c)); if (en.isIntersecting) { if (!c._manual) this._tripT.set(c, setTimeout(() => c.setAttribute('data-on', ''), 1800)); } else { c.removeAttribute('data-on'); c._manual = false; } }), { threshold: 0.6 });
      const obs = () => document.querySelectorAll('#how [data-grid3] > div').forEach(c => { if (!c._tripObs) { c._tripObs = true; this._tripIO.observe(c); } }); [400, 1200, 2500, 5000].forEach(ms => setTimeout(obs, ms));
    }
    const fSec = document.getElementById('features');
    if (fSec && 'IntersectionObserver' in window) {
      this._fIO = new IntersectionObserver((es) => { es.forEach(e => { const vis = e.isIntersecting; if (vis && !this.state.fSeen) this.setState({ fSeen: true, fIn: true, active: 0 }); else if (vis !== !!this.state.fIn) this.setState({ fIn: vis }); }); }, { threshold: 0.35 });
      this._fIO.observe(fSec);
    } else this.setState({ fSeen: true, fIn: true });
    this._fMeasure = () => { const el = document.querySelector('[data-flist]'); if (!el) return; if (window.innerWidth <= 640) { el.style.height = ''; el.style.removeProperty('--fbw'); return; } const cards = [...el.children].filter(c => c.querySelector('[data-fbody]')); if (!cards.length) return; const openW = Math.min(560, el.clientWidth) - 36 - 50; const probe = document.createElement('div'); probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;width:' + openW + 'px;'; document.body.appendChild(probe); let base = 0, max = 0; cards.forEach(c => { const b = c.querySelector('[data-fbody]'); base += c.offsetHeight - b.clientHeight; const q = b.firstElementChild.cloneNode(true); q.style.marginLeft = '0'; probe.innerHTML = ''; probe.appendChild(q); probe.appendChild(b.lastElementChild.cloneNode(true)); max = Math.max(max, probe.offsetHeight); }); probe.remove(); const gap = parseFloat(getComputedStyle(el).rowGap) || 0; el.style.setProperty('--fbw', openW + 'px'); el.style.height = Math.ceil(base + max + gap * (cards.length - 1) + 4) + 'px'; };
    this._fMeasureT = () => { clearTimeout(this._fmT); this._fmT = setTimeout(this._fMeasure, 150); };
    window.addEventListener('resize', this._fMeasureT); setTimeout(this._fMeasure, 50); if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this._fMeasure());
    this._sHov = (e) => { const c = e.target.closest && e.target.closest('[data-grid3] > div'); if (!c || c.contains(e.relatedTarget) || !c.querySelector('[data-sico]')) return; if ((window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-motion'))) return; c.querySelectorAll('[data-sico] svg *').forEach((p, k) => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1000, delay: k * 90, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'backwards' })); };
    document.addEventListener('mouseover', this._sHov);
    this._tmStart();
    if (!(window.matchMedia && (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-motion')))) {
      const cyc = (side, delay) => setTimeout(() => { const run = () => { this.setState(s => ({ ['hcV' + side]: false })); this._hcT[side + 'b'] = setTimeout(() => this.setState(s => ({ ['hc' + side]: ((s['hc' + side] || 0) + 1) % 4, ['hcV' + side]: true })), 500); };
        run(); this._hcT[side] = setInterval(run, 4200); }, delay);
      this._hcT = {}; this._hcT.l0 = cyc('L', 3000); this._hcT.r0 = cyc('R', 5100);
    } document.addEventListener('mousedown', this._ccDoc);
    if (location.hash === '#feedback') setTimeout(() => { const el = document.getElementById('contact'); if (el) window.scrollTo({ top: el.offsetTop, behavior: 'auto' }); this.openContact(); }, 300);
    this._startQuotes(); window.addEventListener('scroll', this._onScrollM, { passive: true }); this._onScrollM(); document.addEventListener('keydown', this._onKey); document.addEventListener('mousedown', this._fbDoc);
    const reduce = window.matchMedia && (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-motion'));
    this.reveal = () => {
      const root = this.rootEl; if (!root) return;
      const lim = window.innerHeight - 40;
      root.querySelectorAll('[data-reveal]:not(.acq-in)').forEach(el => { if (el.getBoundingClientRect().top < lim) el.classList.add('acq-in'); });
    };
    this.onScroll = () => { cancelAnimationFrame(this.rv); this.rv = requestAnimationFrame(this.reveal); };
    window.addEventListener('scroll', this.onScroll, { passive: true, capture: true });
    window.addEventListener('resize', this.onScroll);
    // Content is visible until now. Keep what is on screen as it is and hide only what is below the fold.
    { const r0 = this.rootEl; if (r0) r0.querySelectorAll('[data-reveal]').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('acq-in'); }); }
    if (!reduce) document.documentElement.classList.add('acq-armed');
    this.reveal();
    this.fb = setTimeout(() => { const r = this.rootEl; if (r) r.querySelectorAll('[data-reveal]').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight * 3) el.classList.add('acq-in'); }); }, 1500);
    if (reduce) return;
    const t0 = performance.now();
    const tick = (t) => {
      const el = this.phoneEl;
      if (el && document.documentElement.classList.contains('a11y-motion')) { el.style.transform = ''; if (this.chipWrapEl) this.chipWrapEl.style.transform = ''; }
      else if (el) {
        const small = window.innerWidth < 900 ? 0.45 : 1;
        this.amp += (small - this.amp) * 0.05;
        const s = (t - t0) / 1000;
        const ry = Math.sin(s * 0.45) * 18 * this.amp;
        const rx = Math.sin(s * 0.3 + 1) * 4 * this.amp;
        el.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg)';
        const cw = this.chipWrapEl; if (cw) cw.style.transform = 'translate3d(' + (ry * 1.6).toFixed(1) + 'px,' + (-rx * 3).toFixed(1) + 'px,0) rotate(' + (ry * 0.12).toFixed(2) + 'deg)';
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
  _faqRef = (el) => { this._fw = el; };
  componentDidUpdate() { if (this.reveal) this.reveal();
    const w = this._fw; if (!this._fPend || !w || !w.firstElementChild) return; this._fPend = false;
    const from = this._fh, to = w.firstElementChild.offsetHeight; if (!from || from === to) { this._fh = to; return; }
    this._fAnim = true; clearTimeout(this._fT); w.style.transition = 'none'; w.style.height = from + 'px'; void w.offsetHeight;
    w.style.transition = 'height .55s cubic-bezier(.2,.7,.2,1)'; w.style.height = to + 'px';
    this._fT = setTimeout(() => { w.style.transition = ''; w.style.height = ''; this._fAnim = false; this._fh = w.firstElementChild ? w.firstElementChild.offsetHeight : to; }, 600);
  }
  _tmStart() {
    if (window.matchMedia && (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-motion'))) return;
    let x = 0, v = 38, hx = 0, hv = 38, last = performance.now();
    const step = (t) => { if (document.documentElement.classList.contains('a11y-motion')) { last = t; this._tmRaf = requestAnimationFrame(step); return; }
      const dt = Math.min(0.05, (t - last) / 1000); last = t; const el = this._tmEl;
      if (el) { const target = this._tmHover ? 12 : 38; v += (target - v) * Math.min(1, dt * (this._tmHover ? 1.1 : 1.6)); const half = el.scrollWidth / 2; x += v * dt; if (half > 0 && x >= half) x -= half; el.style.transform = 'translateX(' + (x - half) + 'px)'; }
      const hl = this._hlEl; if (hl) { const tg = this._hlHover ? 12 : 38; hv += (tg - hv) * Math.min(1, dt * (this._hlHover ? 1.1 : 1.6)); const hh = hl.scrollWidth / 2; hx += hv * dt; if (hh > 0 && hx >= hh) hx -= hh; hl.style.transform = 'translateX(' + (-hx) + 'px)'; }
      this._tmRaf = requestAnimationFrame(step); };
    this._tmRaf = requestAnimationFrame(step);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this._tripClick); if (this._tripIO) this._tripIO.disconnect();
    if (this._fIO) this._fIO.disconnect(); window.removeEventListener('resize', this._fMeasureT); clearTimeout(this._fmT); cancelAnimationFrame(this._tmRaf); if (this._hcT) Object.values(this._hcT).forEach(t => { clearTimeout(t); clearInterval(t); }); document.removeEventListener('mousedown', this._ccDoc); window.removeEventListener('scroll', this._onScrollM); clearInterval(this._qt); document.removeEventListener('keydown', this._onKey); document.removeEventListener('mousedown', this._fbDoc); cancelAnimationFrame(this.raf); cancelAnimationFrame(this.rv); clearTimeout(this.fb); window.removeEventListener('scroll', this.onScroll, { capture: true }); window.removeEventListener('resize', this.onScroll); }
  render() {
    return template(this.renderVals());
  }
  renderVals() {
    const theme = this.state.theme || this.props.theme || 'light';
    const a = this.state.active;
    const sfx = theme === 'dark' ? 'dark' : 'light';
    const p = (n) => `/acquisti/assets/acquisti/${n}-${sfx}.png`;
    const dur = (this.props.advanceSeconds ?? 6);
    const feats = this.props.data.features.items.map((f) => [f.title, f.body, f.image, f.chipLabel, f.chipValue, f.caption]);
    const cur = feats[a][2];
    const next = () => this.setState(s => ({ active: (s.active + 1) % feats.length }));
    const bar = h('div', { key: 'bar' + a, 'data-fbar': '', onAnimationEnd: next, style: { height: '100%', background: '#3B28FF', transformOrigin: '0 50%', animation: `acqProg ${dur}s linear forwards`, animationPlayState: (this.state.paused || this.state.fStop || this.state.fClosed || !this.state.fSeen || !this.state.fIn) ? 'paused' : 'running' } });
    const fc = !!this.state.fClosed;
    const features = feats.map((f, i) => { const open = i === a && !fc; return {
      l: `/acquisti/assets/acquisti/${f[2]}-light.webp`, d: `/acquisti/assets/acquisti/${f[2]}-dark.webp`, title: f[0], body: f[1], rows: open ? '1fr' : '0fr', op: open ? 1 : 0,
      bg: 'var(--surface)', pbd: 'var(--rule)', w: open ? '100%' : 'fit-content',
      rot: open ? 'rotate(45deg)' : 'none',
      bd: open ? '#3B28FF' : 'var(--ink)',
      dot: open ? '#3B28FF' : 'transparent',
      dotInk: open ? '#FFFFFF' : 'var(--ink)',
      bar: i === a ? bar : null,
      select: () => { if (i === this.state.active && window.innerWidth <= 640) this.setState(s => ({ fClosed: !s.fClosed })); else this.setState({ active: i, fClosed: false }); },
      enter: () => { if (i === this.state.active) this.setState({ paused: true }); },
    }; });
    const chips = feats.map((f, i) => ({ label: f[3], value: f[4], cap: f[5], op: i === a ? 1 : 0, tf: i === a ? 'none' : 'translateY(16px)' }));
    const t = ['Planned total', 'In cart', 'Next Time', 'Lists', 'Scan a till slip', 'Trip receipts', 'Prices by shop', 'Any currency', 'iCloud sync', 'Zero data collected', 'Home Screen widgets'];
    const sup = this._sup; const st = this.state.sup || 0; const qa = sup[st][1];
    const fa = this.state.faq;
    const dark = theme === 'dark';
    return {
      ...this._menuVals(),
      hero: this.props.data.hero, highlights: this.props.data.highlights, featuresHead: this.props.data.features, trip: this.props.data.trip, privacyTiles: this.props.data.privacy.tiles,
      theme, features, chips,
      quotes: this._quotes.map((q, i) => { const on = i === this.state.qi, n = this._quotes.length; return { ...q, hidden: !on, style: on ? { gridArea: '1/1', margin: 0, opacity: 1, transform: 'translateY(0)', transition: 'opacity .6s ease .15s, transform .7s cubic-bezier(.2,.7,.2,1) .15s' } : { gridArea: '1/1', margin: 0, opacity: 0, transform: i === (this.state.qi + n - 1) % n ? 'translateY(-10px)' : 'translateY(10px)', transition: 'opacity .4s ease, transform .5s ease', pointerEvents: 'none' } }; }),
      quoteDots: this._quotes.map((q, i) => ({ label: 'Show testimonial ' + (i + 1), go: () => { this.setState({ qi: i }); this._startQuotes(); }, bar: i === this.state.qi
        ? h('span', { style: { position: 'relative', display: 'block', width: 28, height: 3, background: 'var(--ft-track)', overflow: 'hidden' } }, h('span', { key: 'p' + this.state.qi, style: { position: 'absolute', inset: 0, background: 'var(--ft-accent)', transformOrigin: 'left', animation: 'ftProg 5s linear forwards' } }))
        : h('span', { style: { display: 'block', width: 8, height: 3, background: 'var(--ft-dot)' } }) })),
      isLight: theme === 'light', isDark: theme === 'dark',
      pauseQuotes: this.pauseQuotes, resumeQuotes: this.resumeQuotes,
      ...this._ccVals(),
      openReview: this.openReview,
      fbReview: this._fb[this.state.fb][0] === 'Leave a review',
      fbPh: this._fb[this.state.fb][0] === 'Leave a review' ? 'How has Acquisti helped your shopping? Tell us which feature you use most.' : "What's working, what isn't, or what you'd like to see",
      openContact: this.openContact, closeContact: this.closeContact, submitContact: this.submitContact,
      ctHidden: !this.state.ct, ctForm: this.state.ctState !== 'sent', ctSent: this.state.ctState === 'sent',
      ctError: this.state.ctState === 'error', ctSending: this.state.ctState === 'sending',
      ctBtnLabel: this.state.ctState === 'sending' ? 'Sending…' : 'Send feedback',
      fbOpen: this.state.fbOpen, fbLabel: this._fb[this.state.fb][0],
      fbToggle: () => this.setState(s => ({ fbOpen: !s.fbOpen })),
      fbOpts: this._fb.map((o, i) => ({ label: o[0], d: o[1], on: i === this.state.fb, chk: i === this.state.fb ? 1 : 0, bg: i === this.state.fb ? 'var(--brand-wash)' : 'transparent', pick: () => this.setState({ fb: i, fbOpen: false }) })),
      ctBtnIco: this.state.ctState === 'sending'
        ? h('span', { 'data-ct-anim': '', style: { width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#FFFFFF', display: 'block', animation: 'ctSpin .8s linear infinite' } })
        : h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', width: 16, height: 16 }, h('path', { d: 'M22 2 11 13' }), h('path', { d: 'M22 2 15 22l-4-9-9-4Z' })),
      ctScrim: { position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(9,8,28,.35)', opacity: this.state.ct ? 1 : 0, pointerEvents: this.state.ct ? 'auto' : 'none', transition: 'opacity .45s ease' },
      ctWrap: { position: 'fixed', right: 'clamp(12px,2vw,24px)', bottom: 'clamp(12px,2vw,24px)', zIndex: 150, width: 'min(460px, calc(100vw - 24px))', maxHeight: 'calc(100vh - 24px)', overflowY: (this.state.ccOpen || this.state.fbOpen) ? 'visible' : 'auto', background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--rule)', boxShadow: '0 40px 80px -30px rgba(10,9,32,.55)', fontFamily: "'Outfit',sans-serif", transformOrigin: '100% 100%', clipPath: this.state.ct ? 'circle(150% at 100% 100%)' : 'circle(0% at 100% 100%)', transform: this.state.ct ? 'none' : 'translate(12px,12px) scale(.86)', opacity: this.state.ct ? 1 : 0, visibility: this.state.ct ? 'visible' : 'hidden', transition: this.state.ct ? 'clip-path .75s cubic-bezier(.7,0,.2,1), transform .75s cubic-bezier(.2,.7,.2,1), opacity .3s ease, visibility 0s' : 'clip-path .75s cubic-bezier(.7,0,.2,1), transform .75s cubic-bezier(.2,.7,.2,1), opacity .3s ease .45s, visibility 0s .75s' },
      supTabs: sup.map((t, i) => ({ label: t[0], count: t[1].length, no: '0' + (i + 1), on: i === st, bg: 'transparent', ink: i === st ? 'var(--brand-text)' : 'var(--ink)', bar: i === st ? 1 : 0, org: (this.state.supDir || 1) > 0 ? '50% 0' : '50% 100%', pick: () => { const w = this._fw; if (w && w.firstElementChild) this._fh = w.style.height ? w.offsetHeight : w.firstElementChild.offsetHeight; this._fPend = true; this.setState({ sup: i, faq: 0, supDir: i >= st ? 1 : -1 }); } })),
      supShots: ["quick-questions","getting-started","your-lists","make-it-yours","shops-and-prices","scanning-receipts","moving-items","your-data","troubleshooting"].map((n, i) => ({ l: '/acquisti/assets/acquisti/sup-' + n + '-light.webp', d: '/acquisti/assets/acquisti/sup-' + n + '-dark.webp', op: i === st ? 1 : 0 })),
      supImg: Object.fromEntries(['settings','detail','icon','receipt'].map(k => [k, sup[st][3] === k ? 1 : 0])),
      supCur: (() => { const t = sup[st]; const m = { settings: 'trip-12-themes', detail: '01-planned-total', icon: '04-categories-icons', receipt: '09-trip-receipt' }[t[3]]; return { label: t[0], blurb: t[2], count: t[1].length, no: '0' + (st + 1), imgL: '/acquisti/assets/acquisti/' + m + '-light.webp', imgD: '/acquisti/assets/acquisti/' + m + '-dark.webp' }; })(),
      ...(() => { const raw = this.state.supQ || ''; const qq = raw.trim().toLowerCase(); const on = qq.length > 0; const so = this.state.supOpen ?? -1; const res = []; if (on) sup.forEach((t, ti) => t[1].forEach(x => { if ((x[0] + ' ' + x[1]).toLowerCase().includes(qq)) res.push({ topic: t[0], tno: '0' + (ti + 1), q: x[0], a: x[1] }); }));
        const esc = qq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const seg = (s) => on ? s.split(new RegExp('(' + esc + ')', 'ig')).filter(Boolean).map(p => { const hl = p.toLowerCase() === qq; return { t: p, bg: hl ? 'color-mix(in oklab,var(--brand-text) 20%,transparent)' : 'transparent', c: hl ? 'var(--ink)' : 'inherit' }; }) : [{ t: s, bg: 'transparent', c: 'inherit' }];
        return { supQ: raw, supSearching: on, supGridDisp: on ? 'none' : 'grid', supNone: on && !res.length, supResLabel: res.length === 1 ? '1 answer' : res.length + ' answers',
          supSearch: (e) => this.setState({ supQ: e.target.value, supOpen: -1 }), supClear: () => this.setState({ supQ: '', supOpen: -1 }), supKey: (e) => { if (e.key === 'Escape') this.setState({ supQ: '', supOpen: -1 }); },
          supRes: res.map((x, i) => { const o = i === so; return { ...x, seg: seg(x.q), open: o, rows: o ? '1fr' : '0fr', op: o ? 1 : 0, rowBg: o ? 'var(--surface)' : 'transparent', rot: o ? 'rotate(45deg)' : 'none', bd: o ? '#3B28FF' : 'var(--ink)', dot: o ? '#3B28FF' : 'transparent', dotInk: o ? '#FFFFFF' : 'var(--ink)', select: () => this.setState({ supOpen: o ? -1 : i }) }; }) }; })(),
      faqs: qa.map((x, i) => ({ q: x[0], a: x[1], n: (i < 9 ? '0' : '') + (i + 1), open: i === fa, rowBg: i === fa ? 'var(--surface)' : 'transparent', side: i === fa ? 'var(--rule)' : 'transparent', cta: x[0] === 'How do I rate Acquisti?', review: (e) => { if (e) e.stopPropagation(); this.openReview(e); }, rows: i === fa ? '1fr' : '0fr', op: i === fa ? 1 : 0, rot: i === fa ? 'rotate(45deg)' : 'none', bd: i === fa ? '#3B28FF' : 'var(--ink)', dot: i === fa ? '#3B28FF' : 'transparent', dotInk: i === fa ? '#FFFFFF' : 'var(--ink)', select: () => this.setState({ faq: fa === i ? -1 : i }) })),
      ticker: t.concat(t),
      shots: feats.map((f, i) => ({ l: `/acquisti/assets/acquisti/${f[2]}-light.webp`, d: `/acquisti/assets/acquisti/${f[2]}-dark.webp`, alt: f[5], op: i === a ? 1 : 0, tf: i === a ? 'none' : 'scale(1.06)' })),
      phoneRef: (el) => { this.phoneEl = el; },
      tmRef: (el) => { this._tmEl = el; },
      chipWrapRef: (el) => { this.chipWrapEl = el; },
      faqWrapRef: this._faqRef,
      hc: (() => { const mk = (arr, i, vis) => { const c = arr[i || 0]; const v = vis !== false; return { label: c[0], value: c[1], left: c[2], top: c[3], op: v ? 1 : 0, tf: v ? 'translateY(0)' : 'translateY(14px) scale(.96)', delay: v ? '0s' : '.45s' }; }; return { l: mk(this._hcL, this.state.hcL, this.state.hcVL), r: mk(this._hcR, this.state.hcR, this.state.hcVR) }; })(),
      tmSlow: () => { this._tmHover = true; },
      hlRef: (el) => { this._hlEl = el; },
      hlSlow: () => { this._hlHover = true; },
      hlFast: () => { this._hlHover = false; },
      tmFast: () => { this._tmHover = false; },
      tms: (() => { const out = []; this._tms.forEach((t, i) => { out.push({ ...t, quote: true }); if (i % 4 === 3) out.push({ cta: true }); }); return out.concat(out); })(),
      rootRef: (el) => { this.rootEl = el; }, supPh: this.state.narrow ? 'Search all answers' : 'Search all answers, e.g. iCloud, receipt, prices',
      pause: () => this.setState({ paused: true }),
      resume: () => this.setState({ paused: false }),
      fStopped: !!this.state.fStop, fToggle: () => this.setState(s => ({ fStop: !s.fStop })), fToggleCard: (e) => { e.stopPropagation(); this.setState(s => ({ fStop: !s.fStop })); }, fBtnText: this.state.fStop ? 'Play' : 'Pause', fBtnLabel: this.state.fStop ? 'Play feature tour' : 'Pause feature tour', fIco: this.state.fStop ? 'M8 5.5v13l11-6.5z' : 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z',
      toggleTheme: () => this._theme(dark ? 'light' : 'dark'),
      setLight: () => this._theme('light'),
      setDark: () => this._theme('dark'),
      lightBg: dark ? 'transparent' : '#3B28FF', lightInk: dark ? 'var(--soft)' : '#FFFFFF',
      darkBg: dark ? '#3B28FF' : 'transparent', darkInk: dark ? '#FFFFFF' : 'var(--soft)',
    };
  }
}
