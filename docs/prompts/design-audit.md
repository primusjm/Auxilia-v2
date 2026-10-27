# Design audit prompt

Paste everything below the line into a new Claude Code session opened on this repo.

---

Run a design audit of the new auxilia.io: the Auxilia site at `/` (Homepage and all 13 case studies) and the Acquisti site at `/acquisti` (landing and `/acquisti/privacy`).

**This is a read-only audit.** Do not edit code, copy or content. The copy and design are mine. Report what you find and wait for me to choose what to fix.

## Setup
1. Read `CLAUDE.md` and `docs/CONVERSION-NOTES.md` for context and past decisions. Do not flag anything those documents record as deliberate unless it causes a real problem, and say so if you do.
2. Run `npm run build`, then start the `astro-preview` server from `.claude/launch.json` (port 4321) in the built-in browser.
3. Check every page at 1440 and 375 wide (375 × 812 is my iPhone 13 mini), in light and dark. Use the theme toggle and also `prefers-color-scheme` with no saved theme (clear `auxilia-theme-v2` and `acquisti-theme-v1` from localStorage).

## What to check

**Visual consistency**
- Colour, type, spacing and radii come from the tokens in `src/styles/auxilia/tokens.css` and the Acquisti base styles. Flag hard-coded values that should be tokens, and near-duplicate values (e.g. two greys a shade apart).
- Type scale: sizes, weights, line heights and letter spacing for Bricolage Grotesque and Outfit are applied consistently across equivalent elements.
- Vertical rhythm and section spacing are consistent between case studies of the same type (record vs appendix).
- Components that should match do match: cards, buttons, links, tags, nav, footer, image frames.

**Layout and responsiveness**
- No horizontal scroll, clipped text, overlaps or orphaned single words in headings at 375.
- Check widths between the two breakpoints too (e.g. 768, 1024) for awkward reflows.
- Images keep sensible crops and aspect ratios at every width.

**Case study structure**
- Every case study follows mandate, found, decisions, screens, build, results, next, and reads as a thought process rather than a gallery. Flag sections that are thin or out of order. Do not rewrite them.

**Accessibility**
- Run axe on every page in both themes. It must be clean.
- Text contrast meets WCAG AA, including text over images and in both themes. Give the measured ratio for each failure.
- Tap targets are at least 44 × 44 pt at 375.
- Visible focus states, logical tab order, working skip link, correct heading hierarchy, meaningful alt text, accessible names on icon-only controls, tabs on the appendix studies use the correct ARIA pattern and keyboard behaviour.
- `prefers-reduced-motion` disables or softens every animation, including the icon animations.

**Interaction and states**
- Hover, focus, active and visited states on all interactive elements; pointer cursor on everything clickable.
- Theme toggle: no flash of the wrong theme on load, and the choice persists per site.
- Acquisti Preact islands render correctly with JavaScript disabled or still loading.

**Copy hygiene** (report only)
- UK spelling, no em dashes, broken or placeholder text, inconsistent capitalisation, and anything that reads as AI-generated.

**Metadata**
- Titles, descriptions, Open Graph images and favicons are present and distinct for Auxilia and Acquisti.

## Report
Write the report to `docs/audits/design-audit-YYYY-MM-DD.md`. For each finding give:
- Severity: **High** (broken, inaccessible or fails AA), **Medium** (visibly inconsistent), **Low** (polish).
- Page, breakpoint and theme.
- What is wrong, with a screenshot reference where it helps.
- File and line where the cause lives, and a suggested fix in one or two sentences.

Start with a short summary: the three to five issues that matter most. Group the rest by page. End with a list of anything you could not check and why.
