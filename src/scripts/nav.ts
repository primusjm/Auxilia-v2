// Page-leave transition: a circular wipe from the click point, then a normal navigation.
// Ported from the prototype's inline nav script. Reset on pageshow so bfcache pages are not left covered.
const de = document.documentElement;
const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;

function setPoint(x: number, y: number) {
  de.style.setProperty('--mx', x + 'px');
  de.style.setProperty('--my', y + 'px');
}
function menuPoint() {
  const b = document.querySelector('button.ax-fx[aria-expanded]');
  if (!b) return false;
  const r = b.getBoundingClientRect();
  if (!r.width) return false;
  setPoint(r.left + r.width / 2, r.top + r.height / 2);
  return true;
}

let saved: string | null = null;
try {
  saved = sessionStorage.getItem('ax-ld-pt');
  sessionStorage.removeItem('ax-ld-pt');
} catch {}
if (saved) {
  const q = saved.split(',');
  setPoint(+q[0] * innerWidth, +q[1] * innerHeight);
} else {
  let n = 0;
  (function wait() {
    if (!menuPoint() && n++ < 60) requestAnimationFrame(wait);
  })();
}

document.addEventListener('click', (e) => {
  if (rm || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || u.pathname.startsWith('/admin')) return;
  if (u.pathname === location.pathname && u.search === location.search) return;
  e.preventDefault();
  let X = e.clientX;
  let Y = e.clientY;
  if (e.detail === 0 || (!X && !Y)) {
    const r = a.getBoundingClientRect();
    X = r.left + r.width / 2;
    Y = r.top + r.height / 2;
  }
  setPoint(X, Y);
  try {
    sessionStorage.setItem('ax-ld-pt', (X / innerWidth).toFixed(4) + ',' + (Y / innerHeight).toFixed(4));
  } catch {}
  de.classList.add('ax-leaving');
  setTimeout(() => {
    location.href = u.href;
  }, 750);
});
window.addEventListener('pageshow', (ev) => {
  if (ev.persisted) de.classList.remove('ax-leaving');
});
