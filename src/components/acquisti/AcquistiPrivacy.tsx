/** @jsxImportSource preact */
// @ts-nocheck
// Logic ported from the Claude Design prototype (React class) to Preact. The template is generated: see ./privacy.template.tsx.
import { Component, createRef, h } from 'preact';
import countries from '../../data/countries.json';
import template from './privacy.template';

export default class AcquistiPrivacy extends Component<any, any> {
  state = { mOpen: false, mC: false, theme: null, cur: null, cc: 'KE', ccQ: '', ccA: 0, ct: false, ctState: 'idle', ccOpen: false, fb: 0, fbOpen: false };
  _fb = [
    ['The shopping list', 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01'],
    ['Add and edit items', 'M4 4h16v16H4zM12 8v8M8 12h8'],
    ['Shops and prices', 'M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2'],
    ['Slips, receipts and backups', 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 7h4l2 2v8H9z'],
    ['An icon request', 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
    ['Leave a review', 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z'],
    ['Something else', 'M5 12h.01M12 12h.01M19 12h.01'],
  ];
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
  _onKey = (e) => { if (e.key !== 'Escape') return; if (this.state.ccOpen) this.setState({ ccOpen: false }); else if (this.state.fbOpen) this.setState({ fbOpen: false }); else if (this.state.ct) this.setState({ ct: false }); };
  componentDidMount() {
    { const th = document.documentElement.getAttribute('data-theme'); if ((th === 'light' || th === 'dark') && th !== this.state.theme) this.setState({ theme: th }); }
    window.addEventListener('scroll', this._onScrollM, { passive: true }); this._onScrollM(); document.addEventListener('keydown', this._mKey);
    const css = document.createElement('style');
    css.textContent = '@media (max-width:860px){[data-split]{grid-template-columns:minmax(0,1fr)!important;}[data-split] > aside{position:static!important;display:none!important;}[data-row]{grid-template-columns:minmax(0,1fr)!important;}}@media (max-width:860px){main[data-split] > aside{display:block!important;position:sticky!important;top:0;z-index:20;margin:0 calc(-1 * clamp(20px,4vw,44px));padding:0 clamp(20px,4vw,44px);background:var(--paper);border-bottom:1px solid var(--rule);}main[data-split] > aside [data-toc-btn]{display:flex!important;}main[data-split] > aside nav{display:none!important;position:absolute;left:clamp(20px,4vw,44px);right:clamp(20px,4vw,44px);top:100%;max-height:60vh;overflow-y:auto;box-shadow:0 24px 48px -20px rgba(10,9,32,.45);}main[data-split] > aside nav[data-toc-open="true"]{display:flex!important;}main[data-split] > aside nav > span{display:none!important;}}@media (max-width:640px){[data-bk-rest]{display:none;}[data-pmeta]{grid-template-columns:1fr 1fr!important;}[data-pmeta] > div{padding:16px 0 16px 16px!important;border-left:1px solid var(--rule)!important;}[data-pmeta] > div:nth-child(odd){padding-left:0!important;border-left:0!important;}[data-pmeta] > div:nth-child(n+3){border-top:1px solid var(--rule);}[data-psec]{grid-template-columns:auto minmax(0,1fr)!important;gap:0 12px!important;}[data-psec] > div{display:contents!important;}[data-psec] > div > *:not(h2){grid-column:1 / -1;}[data-ft-bar],[data-ft-a]{flex-direction:column;justify-content:center!important;align-items:center!important;text-align:center;}[data-ft-nav]{justify-content:center;flex-wrap:wrap;}[data-ft-b]{width:auto!important;justify-content:center;flex-wrap:wrap;}[data-ft-b] > [data-ft-theme]{margin-left:0!important;}}';
    document.head.appendChild(css); this._css = css;
    this._spy = () => { const els = [...document.querySelectorAll('[data-scroll-target]')]; let cur = els.length ? els[0].id : null; els.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight * 0.35) cur = el.id; }); if (cur !== this.state.cur) this.setState({ cur }); };
    window.addEventListener('scroll', this._spy, { passive: true }); this._spy();
    document.addEventListener('mousedown', this._ccDoc); document.addEventListener('mousedown', this._fbDoc); document.addEventListener('keydown', this._onKey);
  }
  componentWillUnmount() { if (this._css) this._css.remove(); window.removeEventListener('scroll', this._spy); document.removeEventListener('mousedown', this._ccDoc); document.removeEventListener('mousedown', this._fbDoc); document.removeEventListener('keydown', this._onKey); }
  _onScrollM = () => { const k = (window.scrollY || 0) > 40; if (k !== this.state.mC) this.setState({ mC: k }); };
  _mKey = (e) => { if (e.key === 'Escape' && this.state.mOpen) this.setState({ mOpen: false }); };
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
      mNav: [['Features', 'What it does', '/acquisti#features', ['M9 6h11M9 12h11M9 18h11', 'M4.5 6h.01M4.5 12h.01', 'M4.5 18h.01']], ['The trip', 'See the app', '/acquisti#how', ['M7 3h10v18H7Z', 'M11 18h2', '']], ['Privacy', 'Stays on your phone', '/acquisti#privacy', ['M12 3 4.5 6v6c0 4.6 3.2 8 7.5 9 4.3-1 7.5-4.4 7.5-9V6L12 3Z', 'm9 12 2 2 4-4', '']], ['Support', 'Answers and help', '/acquisti#support', ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', 'M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3', 'M12 16.8h.01']], ['Reviews', 'What people say', '/acquisti#reviews', ['M4 5h16v11H9l-5 4Z', 'M8 9.5h8', 'M8 12.5h5']], ['Contact', 'Send feedback', '#contact', ['M3 5h18v14H3Z', 'm3 7 9 6 9-6', '']]].map((n, i) => ({ no: '0' + (i + 1), label: n[0], sub: n[1], href: n[2], d1: n[3][0], d2: n[3][1], d3: n[3][2] })),
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
  render() {
    return template(this.renderVals());
  }
  renderVals() {
    const theme = this.state.theme || this.props.theme || 'light';
    return {
      ...this._menuVals(),
      theme,
      logoTheme: (e) => { e.preventDefault(); this._theme(theme === 'dark' ? 'light' : 'dark'); },
      toggleTheme: () => this._theme(theme === 'dark' ? 'light' : 'dark'),
      setLight: () => this._theme('light'), setDark: () => this._theme('dark'),
      isLight: theme === 'light', isDark: theme === 'dark',
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
      ctWrap: { position: 'fixed', right: 'clamp(12px,2vw,24px)', bottom: 'clamp(12px,2vw,24px)', zIndex: 150, width: 'min(460px, calc(100vw - 24px))', maxHeight: 'calc(100vh - 24px)', overflowY: this.state.ccOpen ? 'visible' : 'auto', background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--rule)', boxShadow: '0 40px 80px -30px rgba(10,9,32,.55)', fontFamily: "'Outfit',sans-serif", transformOrigin: '100% 100%', clipPath: this.state.ct ? 'circle(150% at 100% 100%)' : 'circle(0% at 100% 100%)', transform: this.state.ct ? 'none' : 'translate(12px,12px) scale(.86)', opacity: this.state.ct ? 1 : 0, visibility: this.state.ct ? 'visible' : 'hidden', transition: this.state.ct ? 'clip-path .75s cubic-bezier(.7,0,.2,1), transform .75s cubic-bezier(.2,.7,.2,1), opacity .3s ease, visibility 0s' : 'clip-path .75s cubic-bezier(.7,0,.2,1), transform .75s cubic-bezier(.2,.7,.2,1), opacity .3s ease .45s, visibility 0s .75s' },
      ...(() => { const T = [["What we collect","#collect"],["Where your information is kept","#device"],["Sharing a list","#sharing"],["Tracking, analytics and advertising","#tracking"],["Scanning a till slip","#scan"],["When you choose to share","#share"],["Children","#children"],["Your rights","#rights"],["Reviews you send us","#reviews"],["Ratings","#ratings"],["Changes to this policy","#changes"],["Contact","#contact"]]; let ci = T.findIndex(t => t[1] === '#' + this.state.cur); if (ci < 0) ci = 0; const o = !!this.state.tocOpen; return { tocOpen: o, tocRot: o ? 'rotate(180deg)' : 'none', tocCurNo: (ci < 9 ? '0' : '') + (ci + 1), tocCurLabel: T[ci][0], tocToggle: () => this.setState(s => ({ tocOpen: !s.tocOpen })), tocClose: () => this.setState({ tocOpen: false }) }; })(),
      toc: [["What we collect","#collect"],["Where your information is kept","#device"],["Sharing a list","#sharing"],["Tracking, analytics and advertising","#tracking"],["Scanning a till slip","#scan"],["When you choose to share","#share"],["Children","#children"],["Your rights","#rights"],["Reviews you send us","#reviews"],["Ratings","#ratings"],["Changes to this policy","#changes"],["Contact","#contact"]].map((t, i) => ({ label: t[0], href: t[1], no: (i < 9 ? '0' : '') + (i + 1), cur: this.state.cur === t[1].slice(1) ? 'true' : null, bg: 'transparent', ink: this.state.cur === t[1].slice(1) ? 'var(--brand-text)' : 'var(--ink)', bar: this.state.cur === t[1].slice(1) ? 1 : 0 })),
    };
  }
}
