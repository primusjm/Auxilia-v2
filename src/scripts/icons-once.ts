// Plays the idle icon animations once, as each icon enters the screen (see src/styles/interactive.css).
const SELECTOR = [
  '[data-fact-ico]',
  '[data-q-ico]',
  '[data-wig]',
  '[data-wig-wrap]',
  '[data-cta] svg',
  '[data-cta] [data-draw-ico]',
  '[data-cta-down] svg',
  '.ax-btn-back .ax-btn-ico svg',
].join(',');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && 'IntersectionObserver' in window) {
  const seen = new WeakSet<Element>();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        const el = en.target;
        if (en.isIntersecting) {
          if (!el.classList.contains('ico-once')) {
            void (el as HTMLElement).getBoundingClientRect();
            el.classList.add('ico-once');
          }
        } else {
          // Leaving the screen re-arms it, so it plays again on the next entry.
          el.classList.remove('ico-once');
        }
      }),
    { threshold: 0.6 },
  );
  const scan = () =>
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (!seen.has(el)) {
        seen.add(el);
        io.observe(el);
      }
    });
  scan();
  window.addEventListener('load', scan);
  // The Acquisti pages render after the script runs, so pick up icons added later.
  let timer = 0;
  new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(scan, 150);
  }).observe(document.body, { childList: true, subtree: true });
}
