# Handoff

Updated 23 October 2026, for starting a fresh Claude Code session. Read `CLAUDE.md` first for the working rules. `docs/CONVERSION-NOTES.md` has the history and decisions, `docs/CMS-SETUP.md` the CMS setup, and `docs/HANDOFF-screenshots.md` the live-site screenshots task, which Josh runs in a separate session. Do not touch that task's files (`public/assets/site/`, the `screens` plates in `src/content/case-study/*.md`, `docs/screenshots/`) unless Josh asks.

## Where things stand
- Local folder: `/Users/primus/Archivio/Codice/Auxilia`. This is the Auxilia-v2 repo (remote `origin` is `primusjm/Auxilia-v2`, private), with the folder renamed. The old site is in `Auxilia-old` and must not be touched.
- Do all work on `dev`. `/cm` pushes `dev` and fast-forwards `main`. Check `git log main..dev` to see what is waiting to be merged.
- The conversion to Astro is complete: the Homepage, 13 case studies (10 records, 3 appendix pages), Acquisti landing and privacy, Sveltia config and drift check, and the accessibility and performance pass.
- Since the first handoff: the Modifica tasks were all done (accessibility menu on both sites, prefetching, pinned support topics and appendix tabs, the case study menu and appendix intros, the Acquisti privacy additions and phone frame), the case study hero was redesigned, and the `design/` handover folder was deleted.

## Tools in the repo
- `/cm`: commits the work on `dev` in sensible commits, then merges into `main`. It stops if the build fails or `main` has diverged.
- `/md`: runs the open tasks in the **Modifica** section of the Todoist project **Sito**. It asks rather than guesses when a task is unclear.
- Both live in `.claude/commands/`. `.claude/launch.json` is local and not committed.

## Todoist is the source of truth for tasks
Project **Sito**, sections **Conversione** (conversion work and things Josh has to supply), **Modifica** (edits, run with `/md`) and **Futuro** (later). Modifica was empty when this note was written. The **Record** section holds one placeholder task per record study for the live-site screenshots work (a separate session). Connectors are authorised per account, so authorise Todoist on a new account with `/mcp`.

Open items worth knowing about:
- **4k, fidelity check:** `design/` is gone, so this cannot be finished as planned. Josh should close it. Earlier findings are in `docs/CONVERSION-NOTES.md`. To compare against the prototypes again, restore `design/` from git history (commit `77cd44c`) into a scratch folder.
- **5b, OAuth proxy for Sveltia:** needs Josh's GitHub and Cloudflare accounts (steps in `docs/CMS-SETUP.md`).
- **6, accessibility, performance and SEO pass:** largely done; Josh to confirm it can be closed.
- **Futuro:** "Redesign image section below tabs in appendix case studies" looks done (the appendix project intros), and Josh can close it. The Acquisti icon no longer toggles the theme (it was moved into Modifica and done).

## Things only Josh can supply
Open Graph image (1200x630 at `/assets/og.png`), the three missing RLC logo images, a larger source for `britam/hero.webp`, and the decision on the GitHub Pages plan (a private repo needs a paid plan, and Pages is not enabled).

## Known limits
- The small hero eyebrow is below 4.5:1 over busy parts of many photos, as in the original design.
- Page meta descriptions are built from the hero subtitle, so they are one short sentence. A separate description field would be better for search.
- The footer testimonial dots meet WCAG 2.2 (24px) but not Apple's 44pt.
- The `menu` field in the case study content is no longer read, and can be removed with its schema later.
- Several appendix intro photos are 1000 to 1200px wide and look a little soft when shown large. The Kenya Power and Britam hero photos too.

## Practical notes
- `astro dev` often runs on port 4321. Previews for checks used 4322, so the two do not clash.
- Browser checks used Playwright with its own Chromium (installed under `~/Library/Caches/ms-playwright`).
- Before committing, run `npm run build`, and `npm run check:cms` if a schema or `public/admin/` changed.
- Stage files by name, never with `git add -A` or a whole folder: another session may have uncommitted work in the same working tree.
