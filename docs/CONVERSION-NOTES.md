# Conversion notes

Working notes for the Claude Design to Astro conversion. Update as work proceeds.

## Approach
- The handover `.dc.html` files are React prototypes. Case study bodies are static markup; only the shared chrome (menu, contact modal, footer, lightbox, quotes, theme) is stateful.
- CSS from the prototypes is kept as plain CSS, split by overlap into `src/styles/auxilia/` (`tokens`, `base`, `cs`, `home`, `record`, `appendix`). Inline styles are kept in the markup for fidelity.
- `style-hover` / `style-focus` prototype attributes become generated classes in `src/styles/auxilia/states.css`.
- Chrome state is vanilla JS in `src/scripts/`, driven by classes and data attributes.
- Copy for case studies lives in `src/content/work/*.md` frontmatter. Rich text uses `**bold**` and `==highlight==` (the brand-coloured spans).
- Assets: `public/assets` (Auxilia) and `public/acquisti/assets` (Acquisti).

## Decisions
- Astro 6, not 7: Astro 7 needs Node 22.23.4 or later.
- Tailwind is loaded without preflight so it cannot disturb the design CSS.
- Theme: `data-theme` on `<html>`, key `auxilia-theme-v2`, falls back to `prefers-color-scheme`.
- Schema reconciliation: CLAUDE.md fields map to the design sections as mandate (problem, brief, proof), found (research), decisions, screens (screenshots), build, results (outcome), next (related). The design has no "iterations" section, so none is invented.

## Open items for Josh
- Unsplash placeholder images (screens on several case studies) need real screenshots or licensed images.
- `britam/hero.webp` is 1000px wide; a larger source is needed for full-bleed use.
- GitHub Pages needs a paid plan for a private repo. Not enabled.


## Progress log

Done and verified (DOM diff against the handover markup, plus screenshot diff in reduced motion; see "Verification"):
- Scaffold, layout, tokens, theme, shared chrome (menu, contact modal, country picker, lightbox, quotes, reveals).
- Homepage (`src/pages/index.astro`, copy in `src/content/pages/home.yaml`).
- 10 record case studies (`src/content/work/*.md`, `kind: record`) on `RecordStudy.astro`.
- 3 appendix case studies (`kind: appendix`) on `AppendixStudy.astro`. Panels are an ordered list of typed blocks.
- Local copies of all Unsplash placeholder images in `public/assets/stock/` (WebP).

Remaining:
- Acquisti landing and privacy (separate site under `/acquisti`).
- Sveltia config at `public/admin/`, OAuth proxy, CI drift check.
- Accessibility, performance and SEO pass; image optimisation (4j).
- Fidelity pass on mobile breakpoints for every page (4k).

## Verification
Tooling used during conversion lives outside the repo (scratchpad). Method:
1. DOM diff: normalise the handover markup and the built page (sorted attributes, whitespace, style declarations) and diff `main`.
2. Screenshot diff: Playwright with `reducedMotion: reduce` at 1440 and 390 wide, original served from `design/` with React from unpkg.
3. Smoke test of interactions (menu, contact form with mocked Formspree, country picker, theme, quotes, lightbox, hero and spotlight).

Known intentional differences from the prototype:
- `<strong>` replaces the prototype's `<span style="font-weight:500;color:var(--ink)">` for inline emphasis (identical look).
- RLC: section heading styles normalised to the shared style (the prototype had tiny drift: line-height 1.06 vs 1.08, `text-wrap`).
- RLC: the three logo images have no source in the handover. The plates render empty.
- Kenya Power panels: a single live link is not wrapped in the flex wrapper the prototype used (no visual change).
- Appendix tab labels: the prototype's runtime wrapped each value in its own flex item, so labels overflow on narrow screens. Replicated as is. Worth a design look.
- Page titles and meta descriptions are not in the handover. Titles are "client: title | Auxilia" and descriptions are the hero lead text, both derived from existing copy.

## Status update: Acquisti, CMS and open items

- Acquisti runs as Preact islands (SSR, `client:load`). Copy lives in `src/content/acquisti/*.yaml`, validated by Zod.
- Sveltia config and drift check are in place (`npm run check:cms`, run in CI). See `docs/CMS-SETUP.md`.
- Unsplash stock images are localised under `public/assets/stock`.

### Needs Josh
1. **OAuth proxy (5b):** create the GitHub OAuth App and deploy `sveltia-cms-auth` on Cloudflare, then set `base_url` in `public/admin/config.yml`. Test phone login once.
2. **Open Graph image:** `/assets/og.png` is referenced but the handover has no such file. Please supply one (1200x630).
3. **RLC logos:** three logo images are missing from the handover and render as empty plates.
4. **GitHub Pages:** the repo is private, so Pages needs a paid plan. Not enabled.
5. **Still to do (no input needed, next session):** image optimisation (4j), wider fidelity checks (4k), accessibility and Lighthouse pass (6).

## Image and accessibility pass

- Images: Britam awards PNGs converted to WebP (2.1 MB down to 0.2 MB), Acquisti icon PNG quantised (1.4 MB to 0.14 MB). Everything else was already WebP, `loading="lazy"` and `decoding="async"`. Responsive widths and AVIF were not added: they would change the markup, and the heaviest remaining file is under 800 KB.
- axe-core (WCAG 2.1 AA and best practice) on home, 6 case studies, Acquisti landing and privacy, dark and light, 1440 and 390: no alt text, label or colour contrast failures, apart from one node on RLC dark (looks like a mid-animation reading, to confirm).
- Fixed without visual change: landmarks (Contact labelled, Acquisti `<main>`, privacy duplicate banner), marquee `role="list"` to `group`, scrollable trip grid keyboard access.
- Left as designed, for Josh to decide:
  - Heading order on the appendix studies (an h3 under the tab panel with no h2).
  - Acquisti FAQ rows: question 5 has a link inside a `role="button"` row (nested interactive). Fixing means restructuring the accordion.
- Not run: Lighthouse, and a keyboard-only walkthrough. Both are best done locally.
