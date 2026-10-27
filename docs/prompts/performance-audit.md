# Performance audit prompt

Paste everything below the line into a new Claude Code session opened on this repo.

---

Run a performance audit of the new auxilia.io: the Auxilia site at `/` (Homepage and all 13 case studies) and the Acquisti site at `/acquisti` (landing and `/acquisti/privacy`).

**This is a read-only audit.** Do not edit code, content or config, and do not install dependencies into the project. Report what you find and wait for me to choose what to fix.

## Setup
1. Read `CLAUDE.md` and `docs/CONVERSION-NOTES.md` for the stack and past decisions.
2. Run `npm run build` and note the build time and any warnings.
3. Start the `astro-preview` server from `.claude/launch.json` (port 4321). Audit the production build, never `astro dev`.
4. If you need Lighthouse, run it with `npx` from the scratchpad, not as a project dependency. Test mobile (375 wide, simulated slow 4G, 4× CPU throttle) and desktop (1440). Run each page three times and report the median.

## What to measure

**Core Web Vitals and Lighthouse**
- Performance, Accessibility, Best Practices and SEO scores per page.
- LCP, CLS, INP (or TBT as the lab proxy), FCP and Speed Index. Name the LCP element on each page.
- Targets: LCP under 2.5 s on mobile, CLS under 0.1, TBT under 200 ms.

**Page weight** (from `dist/`)
- Total transferred size per page, split into HTML, CSS, JS, fonts and images.
- The five heaviest assets across the site.

**Images**
- Format (AVIF or WebP where it helps), dimensions against rendered size at 375 and 1440, responsive `srcset` and `sizes`, explicit width and height to prevent layout shift.
- `loading="lazy"` below the fold, never on the LCP image. `fetchpriority="high"` on the LCP image.
- Images in `public/` that bypass Astro's image pipeline.

**Fonts**
- Self-hosted Bricolage Grotesque and Outfit in `public/fonts`: format (WOFF2), file size, subsetting, number of weights actually used vs shipped.
- `font-display`, preloading of the fonts used above the fold, and any layout shift from font swap.

**CSS**
- Size of each stylesheet, unused rules per page, and whether Auxilia pages load Acquisti CSS or the reverse.
- Render-blocking stylesheets and whether critical CSS is inlined.

**JavaScript**
- Every script shipped per page, its size and why it is there. Auxilia pages should need very little.
- Preact islands on Acquisti: hydration directive used (`client:load`, `client:visible`, `client:idle`), bundle size, and whether any could be static.
- Long tasks on load and during interaction (theme toggle, appendix tabs, icon animations).

**Animation and rendering**
- Animations use `transform` and `opacity` only, no layout thrashing, and stop under `prefers-reduced-motion`.
- Theme script runs before first paint without blocking.

**Delivery** (GitHub Pages)
- Hashed asset filenames for long-term caching, compression, sensible `robots.txt` and sitemap.
- Third-party requests: there should be none. List any you find.
- Note what GitHub Pages cannot control (custom cache headers) rather than flagging it as a defect.

## Report
Write the report to `docs/audits/performance-audit-YYYY-MM-DD.md`. Include:
- A summary table: page, mobile and desktop scores, LCP, CLS, TBT, total weight.
- The three to five changes with the biggest expected gain, each with an estimate (e.g. "saves about 180 KB on every case study").
- Every other finding, with severity (**High**, **Medium**, **Low**), the page or asset affected, the file and line where the cause lives, and a suggested fix in one or two sentences.
- Anything you could not measure and why.
