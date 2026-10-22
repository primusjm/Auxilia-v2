// Footer fit: the "Acquisti" name hides only when the copyright gets within 16px of the last nav link.
// Measured live with a ResizeObserver, not set at a breakpoint.
let ob: Element | null = null;
let ro: ResizeObserver | null = null;

function fit() {
  const bar = document.querySelector('[data-ft-bar]');
  if (!bar) return;
  if (ro && bar !== ob) {
    ro.disconnect();
    ro.observe(bar);
    ob = bar;
  }
  bar.removeAttribute('data-ft-tight');
  if (innerWidth < 861) return;
  const nav = bar.querySelector('[data-ft-nav]');
  const cp = bar.querySelector('[data-ft-b] > span');
  if (!nav || !cp || !nav.lastElementChild) return;
  const r = nav.lastElementChild.getBoundingClientRect();
  const c = cp.getBoundingClientRect();
  if (r.top < c.bottom && r.bottom > c.top && c.left - r.right < 16) bar.setAttribute('data-ft-tight', '');
}

(function wait() {
  const bar = document.querySelector('[data-ft-bar]');
  if (!bar) return void requestAnimationFrame(wait);
  ro = new ResizeObserver(fit);
  ro.observe(bar);
  ob = bar;
  addEventListener('resize', fit);
  // The footer is hydrated, so it can be replaced; refit when the tree changes.
  new MutationObserver(() => {
    if (document.querySelector('[data-ft-bar]') !== ob) fit();
  }).observe(document.body, { childList: true, subtree: true });
  setTimeout(fit, 500);
  if (document.fonts) document.fonts.ready.then(fit);
  fit();
})();
