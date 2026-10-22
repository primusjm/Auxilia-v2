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
