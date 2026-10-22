/** @jsxImportSource preact */
// @ts-nocheck
// Logic ported from the Claude Design prototype (React class) to Preact. The template is generated: see ./landing.template.tsx.
import { Component, createRef, h } from 'preact';
import countries from '../../data/countries.json';
import template from './landing.template';

export default class AcquistiLanding extends Component<any, any> {
  state = { cc: 'KE', ccQ: '', ccA: 0, theme: null, active: 0, faq: 0, paused: false, qi: 0, ct: false, ctState: 'idle', ccOpen: false, fb: 0, fbOpen: false, sup: 0, mOpen: false, mC: false };
  _sup = [["Quick questions",[["Do I need an account?","No. Just open the app and start a list. Lists back up and sync through your own iCloud, which we can't see."],["Which currency does it use?","Any you pick in Settings. Only the symbol changes; nothing is converted."],["Does Acquisti collect my data?","No. Your list stays on your phone and in your own iCloud. We have no access to either."],["What happens to a till slip photo?","Your phone reads it, you check the lines, and the prices go to that shop. The photo is never saved."],["How do I rate Acquisti?","iOS may ask now and then after a few trips. Or go to Settings, then Help, then Rate Acquisti. If something's wrong, Send feedback reaches us directly."]],"The short answers people look for first.","settings"],["Getting started",[["How do I add an item?","Tap + at the bottom right, type a name (or several, separated by commas), add a price and quantity if you like, and tap Add to list. If a pill appears under the name, tap it to update that item instead of adding a copy."],["What are the quick ways to add items?","Type several names separated by commas. In Next Time, each category's Add button lets you pick several at once. Press and hold the app icon for Add Item and Scan Receipt."],["How do I tick something off?","Tap the item's name or its circle, or swipe it right. Tap again to put it back."],["What are the cards at the top of the list?","Offers (split the trip, switch shop) and tips, stacked like notifications. Tap to spread them, swipe one away to dismiss it. To see tips again: Settings, then Help, then How to use Acquisti, then Show tips again."],["What is Next Time?","Where items wait when you're not buying them this trip. Tap one to add it. Frequently Bought sits at the top (turn it off in Settings, then List views), and each category the shop sells has an Add button."],["How do I finish a trip?","Tap the bottom card, check the receipt, add the shop's name if you like, and tap Finish shopping. The receipt is saved in Settings, then Past receipts."],["What is on the page when my list is empty?","Plan Your Next Trip: a few everyday items to tap and add, and Or buy these again with the things you buy most."],["Where can I read how the app works?","Settings, then Help, then How to use Acquisti. Short illustrated guides in four chapters."]],"Add items, tick them off and finish your first trip.","detail"],["Your lists",[["Can I keep more than one list?","Yes. Open ••• then Lists, and tap New list. Each list has its own To Buy, In Cart and Next Time; shops, prices and receipts are shared. Tap the list name at the top to switch, and use the three dots to share, rename or delete one."],["Can a list belong to one shop?","Yes. In Lists, tap the three dots on a list, then Shops, and pin it. A list has one shop and a shop has one list: choosing either opens the other. Free lists work at any shop. Tap the pinned shop again to unpin."],["Can I describe what a list is for?","Yes. In Lists, tap the three dots, then Edit, and fill in Description. It shows under the list's name."],["Can I share a list with someone?","Yes, through iCloud. In Lists, tap the three dots, then Share, and invite someone. Everyone can add, change and tick items, and lists stay private until you share them. We never see a shared list."],["How do I put a whole list on To Buy at once?","Settings, then List, then List templates. Open a saved list or a starter pack, untick what you don't need, and tap Add to To Buy. Save To Buy as a list keeps your current list for next time."],["How do I get back, or permanently delete, something I deleted?","Settings, then List, then Recently deleted keeps items for 30 days. Swipe right to restore, or left to delete for good."]],"Keep more than one list, tie one to a shop, or share it.","detail"],["Make it yours",[["How do I change the currency?","Settings, then Currency. Search by name or code. Only the symbol changes: 120 stays 120."],["What categories are there?","Fruits, Vegetables, Bakery, Meals, Meat, Dairy, Pantry, Grains, Spices, Snacks, Beverages, Alcohol, Health & Beauty, Childcare, Household and Other. The app picks one from the name; you can change it, and reorder them per shop under Shops, then Aisle order."],["How do I change the theme?","Settings, then Appearance: System, Daylight, Eclipse (deep indigo) or Midnight (pure black). Tapping the logo on the list also cycles through them."],["How do I change the app icon?","Settings, then Appearance, then App icon. Choose Indigo, Dusk, Eclipse or Onyx."],["Can I put Acquisti on my home screen or lock screen?","Yes. Long-press the home screen, tap +, and search for Acquisti. Widgets let you tick items without opening the app; the lock screen has a ring, rectangle or one-line summary."]],"Currency, categories, themes, icons and widgets.","icon"],["Shops and prices",[["How do shops work?","Each shop keeps its own prices, and the shop you're in decides which ones the list shows. Tap the shop name under the title to add or switch. Finishing a trip saves its prices for next time."],["What does “est.” next to a price mean?","You haven't paid for that item at this shop yet, so it shows your first shop's price as a guide until you enter a real one."],["How does the app suggest a cheaper shop?","If another shop is cheaper for your list by at least the amount set in Settings, then Shops, a card offers to switch. It only compares real prices, and a pinned list only uses its own shop."],["What does Split the trip do?","When two shops together save you enough, a card shows what to buy where. Use this plan sets it up; Undo split reverses it. Set the minimum saving in Settings, then Shops."],["Can each shop have its own aisle order?","Yes. In Shops, pick a shop, choose Aisle order and drag categories into the order you walk. Acquisti also learns it from how you tick items off."],["How do I stop a shop showing things it does not sell?","For a whole aisle: Settings, then Shops, pick the shop, then Categories, and switch off what it doesn't sell. Those items stay on your list but leave that shop's trip. For single items, use Remove from the shop."],["Can I always buy an item at one shop?","Yes. Choose a shop under Always buy at when adding or editing an item. Elsewhere it shows “Buy at” and stays out of the total, and the app won't suggest moving it."],["How do I take an item off one shop?","In •••, choose Select items, pick items and tap the bin. Remove from the shop drops them there; Delete from app removes them everywhere. Both can be undone."]],"How shops, estimates and cheaper suggestions work.","receipt"],["Scanning receipts",[["How do I scan a till slip?","In Settings, then Shops, pick a shop and tap Scan a receipt. You can also tap Scan on the trip receipt, or press and hold the app icon. Photograph the slip, check the lines and save. The photo is never kept."],["A scanned line matched the wrong item.","On the review screen, tap the name to correct it, or Match item to pick one you already have. Untick a line to skip it. The app remembers for that shop."],["A receipt line has no price. How do I add one?","Tap the plus where the price would be, enter it and save. Works on past receipts too."],["What is Item history?","A record of changes to an item's brand, size, note or price. Open Edit item, then Item history, and tap an entry to reuse it. Brands you've bought before also show under the Brand field."]],"Read a till slip and fix what it got wrong.","receipt"],["Moving items",[["What do the swipes do?","Swipe right to move an item forward (Next Time, To Buy, cart). Swipe left to send it back to Next Time, or delete it from there. Each swipe can be undone."],["What does pressing and holding an item do?","Opens a menu to edit, move or delete it."],["How do I change many items at once?","Tap More, then Select items. Pick them, then move or delete together."],["Can I move an item to another list?","Yes. Long-press it and choose Move to list, or use Select items. It keeps its status, quantity and prices, and you can undo. An item is the same in every list, so editing it in one changes it everywhere."],["How do I change how the list looks?","Tap the three dots at the top right. View as switches between List and Compact; Organise shows or hides the category buttons."],["How do I get rid of a suggestion card?","Swipe it sideways."],["An item has no icon, or the wrong one.","Tap the item's icon, scroll to the bottom and tap Request an icon. It opens a ready-made feedback email."]],"Swipes, long presses and changing many at once.","detail"],["Your data",[["Where is my list stored?","On your iPhone, and in your own iCloud when iCloud is on for Acquisti, so it's backed up and the same on all your devices. We can't access either."],["How do I back up or move my list?","Settings, then Export: PDF, Text, CSV or JSON. Bring JSON back with Settings, then Import."],["How do I back up everything?","Settings, then Export, then Everything. Backup saves one file with all your lists, shops, prices and receipts; Restore backup brings it back and replaces what's there. Back up before you change phone."],["How do I get a receipt as a PDF?","Settings, then Receipts. Open one and tap share at the top right."],["How do I start again?","Settings, then Clear all items. Receipts are kept."]],"Where your list lives, and how to back it up.","settings"],["Troubleshooting",[["An item or price looks wrong.","Tap the price, correct it and tap Save."],["The screen locks while I shop.","Turn on Settings, then Keep screen on."],["Text is too small or too large.","Acquisti follows your iPhone's text size: iPhone Settings, then Display and Brightness, then Text Size."],["How do I send feedback?","Settings, then Help, then Send feedback. Your mail app opens with the message ready; nothing is sent until you send it."]],"When something looks wrong, or to tell us about it.","settings"]];
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
      mNav: [['Features', 'What it does', '#features', ['M9 6h11M9 12h11M9 18h11', 'M4.5 6h.01M4.5 12h.01', 'M4.5 18h.01']], ['The trip', 'See the app', '#how', ['M7 3h10v18H7Z', 'M11 18h2', '']], ['Privacy', 'Stays on your phone', '#privacy', ['M12 3 4.5 6v6c0 4.6 3.2 8 7.5 9 4.3-1 7.5-4.4 7.5-9V6L12 3Z', 'm9 12 2 2 4-4', '']], ['Support', 'Answers and help', '#support', ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', 'M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3', 'M12 16.8h.01']], ['Reviews', 'What people say', '#reviews', ['M4 5h16v11H9l-5 4Z', 'M8 9.5h8', 'M8 12.5h5']], ['Contact', 'Send feedback', '#contact', ['M3 5h18v14H3Z', 'm3 7 9 6 9-6', '']]].map((n, i) => ({ no: '0' + (i + 1), label: n[0], sub: n[1], href: n[2], d1: n[3][0], d2: n[3][1], d3: n[3][2] })),
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
  _tms = [{"tag":"Running total","text":"I set a budget of Ksh 3,000 and watch the total climb as I tick things off. No more surprises at the till.","name":"Wanjiru K.","where":"Mum of two, weekly shop","init":"W"},{"tag":"Prices by shop","text":"It remembers what tomatoes cost at each shop, so I know where to buy before I leave the house.","name":"Brian O.","where":"Shops at three markets","init":"B"},{"tag":"Scan a till slip","text":"I snap the receipt and the prices fill in. Saves me typing them all out.","name":"Amina H.","where":"Family of five","init":"A"},{"tag":"Next time","text":"Anything I don't find goes to Next time. The list for the next trip writes itself.","name":"David M.","where":"Shops on the way home","init":"D"},{"tag":"Shared lists","text":"My husband and I share one list through iCloud. Whoever is at the shop sees what the other added.","name":"Grace N.","where":"Shares a list at home","init":"G"},{"tag":"Categories and icons","text":"The icons make the list easy to scan. I find dairy and veg at a glance.","name":"Kevin W.","where":"Nursing student","init":"K"},{"tag":"Widgets","text":"The lock-screen widget shows how many items are left. I barely open the app in the aisle.","name":"Faith A.","where":"Quick top-up shops","init":"F"},{"tag":"Privacy","text":"Nothing to sign up for and nothing sent to anyone. I just opened it and started my list.","name":"Joseph K.","where":"Careful with apps","init":"J"},{"tag":"Trip receipts","text":"I look back at last month's trips and see what I actually spent. It changed how I plan.","name":"Mercy L.","where":"Tracks the house budget","init":"M"},{"tag":"Aisle order","text":"I sort the list in the order of my shop's aisles, so I walk through once and I'm done.","name":"Peter G.","where":"Saturday market run","init":"P"}];
  _hcL = [['In cart', 'Ksh 1,947', 'calc(50% - 36vw)', 'clamp(200px,22vw,280px)'], ['Planned total', 'Ksh 3,240', 'calc(50% - 31vw)', 'clamp(110px,12vw,170px)'], ['Cheaper at', 'Harvest Grocers', 'calc(50% - 35vw)', 'clamp(240px,25vw,320px)'], ['Saved this month', 'Ksh 1,180', 'calc(50% - 30vw)', 'clamp(150px,16vw,220px)']];
  _hcR = [['This trip', '9 of 16 got', 'calc(50% + 36vw)', 'clamp(260px,26vw,340px)'], ['Next Time', '7 items · Ksh 2,215', 'calc(50% + 31vw)', 'clamp(150px,16vw,220px)'], ['Receipt scanned', '12 lines read', 'calc(50% + 35vw)', 'clamp(210px,22vw,290px)'], ['Split the trip', 'Save Ksh 260', 'calc(50% + 30vw)', 'clamp(120px,13vw,180px)']];
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
  _quotes = [
    { text: 'I finally know what I will spend before I reach the till. No more surprises at checkout.', who: 'Wanjiru K.', role: 'Parent of three' },
    { text: 'Swiping things into Next Time keeps my list short without forgetting anything.', who: 'Daniel M.', role: 'University student' },
    { text: 'Comparing two shops on the same list saved me more than I expected in the first month.', who: 'Amina H.', role: 'Small business owner' }
  ];
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
    this._sHov = (e) => { const c = e.target.closest && e.target.closest('[data-grid3] > div'); if (!c || c.contains(e.relatedTarget) || !c.querySelector('[data-sico]')) return; if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; c.querySelectorAll('[data-sico] svg *').forEach((p, k) => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1000, delay: k * 90, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'backwards' })); };
    document.addEventListener('mouseover', this._sHov);
    this._tmStart();
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      const cyc = (side, delay) => setTimeout(() => { const run = () => { this.setState(s => ({ ['hcV' + side]: false })); this._hcT[side + 'b'] = setTimeout(() => this.setState(s => ({ ['hc' + side]: ((s['hc' + side] || 0) + 1) % 4, ['hcV' + side]: true })), 500); };
        run(); this._hcT[side] = setInterval(run, 4200); }, delay);
      this._hcT = {}; this._hcT.l0 = cyc('L', 3000); this._hcT.r0 = cyc('R', 5100);
    } document.addEventListener('mousedown', this._ccDoc);
    if (location.hash === '#feedback') setTimeout(() => { const el = document.getElementById('contact'); if (el) window.scrollTo({ top: el.offsetTop, behavior: 'auto' }); this.openContact(); }, 300);
    this._startQuotes(); window.addEventListener('scroll', this._onScrollM, { passive: true }); this._onScrollM(); document.addEventListener('keydown', this._onKey); document.addEventListener('mousedown', this._fbDoc);
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.reveal = () => {
      const root = this.rootEl; if (!root) return;
      const lim = window.innerHeight - 40;
      root.querySelectorAll('[data-reveal]:not(.acq-in)').forEach(el => { if (el.getBoundingClientRect().top < lim) el.classList.add('acq-in'); });
    };
    this.onScroll = () => { cancelAnimationFrame(this.rv); this.rv = requestAnimationFrame(this.reveal); };
    window.addEventListener('scroll', this.onScroll, { passive: true, capture: true });
    window.addEventListener('resize', this.onScroll);
    this.reveal();
    this.fb = setTimeout(() => { const r = this.rootEl; if (r) r.querySelectorAll('[data-reveal]').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight * 3) el.classList.add('acq-in'); }); }, 1500);
    if (reduce) return;
    const t0 = performance.now();
    const tick = (t) => {
      const el = this.phoneEl;
      if (el) {
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
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0, v = 38, hx = 0, hv = 38, last = performance.now();
    const step = (t) => { const dt = Math.min(0.05, (t - last) / 1000); last = t; const el = this._tmEl;
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
    const feats = [
      ['Planned total', 'Add a price and quantity to each item and see your planned total before you leave the house.', '01-planned-total', 'Total', 'Ksh 299', 'Edit item'],
      ['In cart', 'Tick items off as they go into your cart and watch the total update with every tap. A ring around the + button fills as the cart does.', '02-in-cart', 'In cart', 'Ksh 1,947', 'In Cart'],
      ['Next Time', 'Not buying something this trip? Swipe it into Next Time. It stays on your list, and the things you buy most sit at the top as Frequently bought.', '03-next-time', 'Next trip', '49 items', 'Next Time'],
      ['Lists', 'Keep separate lists for home, the weekend or the office. Each has its own items and shop, and can be shared through iCloud.', '10-lists', 'Your lists', '3 lists', 'Your lists'],
      ['Scan a till slip', 'Photograph it or pick a photo. The phone reads it on the device, you check the lines, and the prices go to that shop. The photo is never saved.', '08-scan-till-slip', 'Till slip', 'Read on your phone', 'Scan receipt'],
      ['Trip receipts', 'Finish shopping and the trip is saved as a receipt, grouped by aisle with the total. Anything you did not find stays on for next time.', '09-trip-receipt', 'Spent', 'Ksh 1,947', 'Trip receipt'],
    ];
    const cur = feats[a][2];
    const next = () => this.setState(s => ({ active: (s.active + 1) % feats.length }));
    const bar = h('div', { key: 'bar' + a, onAnimationEnd: next, style: { height: '100%', background: '#3B28FF', transformOrigin: '0 50%', animation: `acqProg ${dur}s linear forwards`, animationPlayState: (this.state.paused || this.state.fStop || this.state.fClosed || !this.state.fSeen || !this.state.fIn) ? 'paused' : 'running' } });
    const fc = !!this.state.fClosed;
    const features = feats.map((f, i) => { const open = i === a && !fc; return {
      l: `/acquisti/assets/acquisti/${f[2]}-light.webp`, d: `/acquisti/assets/acquisti/${f[2]}-dark.webp`, title: f[0], body: f[1], rows: open ? '1fr' : '0fr', op: open ? 1 : 0,
      bg: open ? 'var(--surface)' : 'var(--feat-pill)', pbd: 'var(--rule)', w: open ? '100%' : 'fit-content',
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
      toggleTheme: () => this._theme(dark ? 'light' : 'dark'), logoTheme: (e) => { e.preventDefault(); this._theme(dark ? 'light' : 'dark'); },
      setLight: () => this._theme('light'),
      setDark: () => this._theme('dark'),
      lightBg: dark ? 'transparent' : '#3B28FF', lightInk: dark ? 'var(--soft)' : '#FFFFFF',
      darkBg: dark ? '#3B28FF' : 'transparent', darkInk: dark ? '#FFFFFF' : 'var(--soft)',
    };
  }
}
