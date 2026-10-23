# Auxilia.io: project brief for Claude Code

## What this is
Josh's design studio site, focused on non profits. It was converted from a Claude Design handover into Astro and is now edited directly. Two sites share one domain and one repo:
- **Auxilia** at `/`: a Homepage and 13 case studies (10 record studies, 3 tabbed appendix studies).
- **Acquisti** at `/acquisti`: the marketing site for Josh's iOS shopping-list app, plus `/acquisti/privacy`. It is separate: its own nav, footer, metadata and theme key. It shares only fonts, colour tokens, the theme mechanism and the brand marks.

This is a complete replacement of the old auxilia.io. Never reuse code, copy or assets from the old site.

## Working rules
- The copy and design are Josh's. Change only what he asks for. If a request is ambiguous, ask rather than guess. Where he gives only a topic, draft the wording from his words, never invent facts, numbers or claims, and flag the draft for his review.
- Case studies must show Josh's thought process, not just screenshots. Keep the structure: mandate, found, decisions, screens, build, results, next.
- Work on `dev`. `/cm` commits in sensible commits and merges `dev` into `main`. `/md` runs the open tasks in the **Modifica** section of the Todoist project **Sito**. The **Conversione** section holds the remaining conversion tasks. Tick tasks off only once verified.

## Repository
- The private GitHub repo `primusjm/Auxilia-v2` is `origin`. Push only there.
- Do not touch `Auxilia-old` or the live site. Do not rename, archive, publish or change DNS or Pages settings without Josh's explicit instruction.
- GitHub Pages from a private repo needs a paid plan. Build and test locally until the cut-over, and flag it to Josh if Pages is needed earlier.

## Stack
- Astro 6, static output only, Tailwind without preflight, deployed to GitHub Pages by a GitHub Actions workflow.
- Content Collections with Zod schemas in `src/content.config.ts`, the single source of truth for content structure. Copy lives in `src/content` (`work/*.md`, `pages/home.yaml`, `acquisti/*.yaml`, `settings`).
- Styles are plain CSS in `src/styles/auxilia` and `src/styles/acquisti`, driven by CSS variables. Shared chrome behaviour is in `src/scripts`. The Acquisti pages are Preact islands.
- Fonts (Bricolage Grotesque and Outfit) are self-hosted in `public/fonts`.
- Theme: `data-theme` on the root, saved under `auxilia-theme-v2` (Auxilia) or `acquisti-theme-v1` (Acquisti), falling back to `prefers-color-scheme`.
- Background and decisions: `docs/CONVERSION-NOTES.md`.

## CMS
- **Lumen CMS** (macOS app) is the main editor. It opens this folder and reads the Zod schemas.
- **Sveltia CMS** at `public/admin/` is for quick fixes from a phone. `npm run check:cms` fails if its config drifts from the Zod schemas.
- After any Sveltia edit, pull in Lumen before the next session. Setup and the pending OAuth proxy are in `docs/CMS-SETUP.md`.

## Quality bar
- Run `npm run build` before committing, and `npm run check:cms` when a schema or `public/admin/` changes.
- Check changes at 1440 and 375 wide (Josh tests on an iPhone 13 mini), in light and dark. axe must stay clean, and text must meet WCAG AA contrast, including over images.
- Respect `prefers-reduced-motion`.

## Style rules for all output
- UK English, concise and direct, no em dashes.
- Client-facing copy must not read as AI-generated.
