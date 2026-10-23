# Handoff

Snapshot taken on 23 October 2026, for starting a fresh Claude Code session on another account. Read `CLAUDE.md` first for the working rules, then this note. `docs/CONVERSION-NOTES.md` has the longer history and `docs/CMS-SETUP.md` the CMS setup.

## Where things stand
- Local folder: `/Users/primus/Archivio/Codice/Auxilia`. This is the Auxilia-v2 repo (remote `origin` is `primusjm/Auxilia-v2`, private), with the folder renamed. The old site is in `Auxilia-old` and must not be touched.
- Branches: do all work on `dev`. `/cm` pushes `dev` and fast-forwards `main`. Check `git log main..dev` to see whether `dev` is ahead.
- The conversion to Astro is complete: Homepage, 13 case studies (10 records, 3 appendix pages), Acquisti landing and privacy, Sveltia config and the drift check, and the accessibility and performance pass.
- Recent changes: self-hosted fonts, a new case study hero, a new Homepage constraints section, and a batch of accessibility and layout fixes. `docs/CONVERSION-NOTES.md` lists the decisions and deviations.

## Tools in the repo
- `/cm`: commits the work on `dev` in sensible commits, then merges into `main`. It stops if the build fails or `main` has diverged.
- `/md`: runs the open tasks in the **Modifica** section of the Todoist project **Sito**. Several of those tasks are questions or need Josh's answer first (the privacy policy and terms checks, and the speed task that says to ask before doing anything). `/md` is meant to ask, not guess.
- These commands live in `.claude/commands/`. `.claude/launch.json` is local and not committed.

## Todoist is the source of truth for tasks
Project **Sito**, with three sections: **Conversione** (remaining conversion work), **Modifica** (edits, run with `/md`) and **Futuro** (later). Connectors are authorised per account, so authorise Todoist again on the new account with `/mcp`.

## Unfinished: the fidelity check (task 4k)
- The check compares each built page with its original prototype in `design/`, using full-page screenshots at 390, 700, 1000 and 1440 wide in both themes. Josh wants `design/` deleted once the check is done with it. It has not been deleted.
- Method: serve `design/` with `python3 -m http.server 8801`, serve the built site with `npm run preview -- --port 4322`, screenshot both with Playwright (reduced motion, theme set through `localStorage`), and pixel-diff. The prototypes load React and Babel from unpkg, so it needs a network connection. The harness itself was a scratch script and is not in the repo. `scripts/migrate/` has older versions of the same idea, with paths from the cloud session.
- Findings so far, before the hero redesign: record pages matched the originals to within about 1.5% at 390, 700 and 1000. Two real differences were found and fixed (the found image shape on tablets, and the footer testimonial dots making the quote wrap). The full pass was not completed after those fixes.
- Differences that are intentional: the scrolling tab row on appendix pages at 680px and below, the removed Content card on Promises, the new Homepage constraints section, the hero redesign, the light mode loader helmet, the self-hosted fonts and the footer dots.

## Things only Josh can supply (also in Todoist)
Open Graph image (1200x630 at `/assets/og.png`), the three missing RLC logo images, a larger source for `britam/hero.webp`, the OAuth proxy accounts for Sveltia, and the decision on the GitHub Pages plan (a private repo needs a paid plan, and Pages is not enabled).

## Known limits
- The small hero eyebrow is below 4.5:1 over busy parts of many photos, as in the original design.
- Page meta descriptions are built from the hero subtitle, so they are one short sentence. A separate description field would be better for search.
- The footer testimonial dots meet WCAG 2.2 (24px) but not Apple's 44pt.
- Britam's and Kenya Power's hero photos are low resolution when shown full width.

## Practical notes
- `astro dev` often runs on port 4321. Previews for checks used 4322, so the two do not clash.
- Browser checks used Playwright with its own Chromium (installed under `~/Library/Caches/ms-playwright`).
- Before committing, run `npm run build`, and `npm run check:cms` if a schema or `public/admin/` changed.
