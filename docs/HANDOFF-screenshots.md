# Handoff: live-site screenshots for the screens sections

Updated 23 October 2026. This sits beside `docs/HANDOFF.md`; read `CLAUDE.md` first for the working rules.

## The task
Replace the three "The screens" plates on each record study with fresh captures of the client's live site. RLC is done and is the reference. The other nine still show placeholder stock photos. Keep each study's existing captions and alt text unless Josh changes them.

## What Josh decided (RLC)
- **Transparent background.** Frames float on the plate with a hairline and a soft neutral shadow, so one image works in light and dark. No gradient, no per-theme images.
- **Big windows cut off at the bottom.** The first plate (homepage) and the second (usually a key inner page) show a large browser window rising from the bottom edge, with its bottom corners square. Josh chose this over a small centred window and over no frame, perspective, or desktop plus phone (mockups compared on 23 October).
- **Four phones** for the "on mobile" plate, unchanged in layout.

## How the plates behave (already built, nothing to change per client)
- `RecordStudy.astro` crops the plates with `object-fit: cover`, anchored to the top (`object-position: 50% 0`). Where a plate is wider than its image, only the bottom is cropped, which suits a window that is cut off anyway.
- A plate can set an optional `srcSmall` (schema in `content.config.ts`). It is served below 560px wide through a `<picture>` source. Only the homepage plate needs one: on phones it is far squarer than the wide image. The lightbox shows whichever image is on screen.
- Plate shapes (width to height): homepage plate about 2.2 at 1440 and 1.4 at 375; the half-width plates about 1.7 in two columns and at 375, but up to 3.5 when they stack into one column (about 480 to 1000 wide). The canvases below are sized for these.

## Files per study
In `public/assets/site/`, named after the study slug:

| Plate | File | Canvas | Composition |
|---|---|---|---|
| Homepage | `<slug>-screen-home.webp` | 2400 x 976 | window 1840 wide, top 80, from `home-tall` |
| Homepage, phones | `<slug>-screen-home-sm.webp` (`srcSmall`) | 1200 x 750 | window 1000 wide, top 125, from `home-tall` |
| Second plate | `<slug>-screen-<page>.webp` | 1600 x 865 | window 1260 wide, top 70, from `<page>-tall` |
| On mobile | `<slug>-screen-mobile.webp` | 1600 x 865 | four phones 300 wide, gap 48, top 122 |

Then point the study's `screens.plates` in `src/content/work/<slug>.md` at them, adding `srcSmall` to the first plate only. See `rlc.md`.

## Steps for the next client
1. **Agree the pages with Josh.** The live URL is the study's `screens.link.href`. The second plate's caption names what to show, but several are not plain pages ("a lesson in progress" on GRIC, "birthday pledges" on Inuka, "the private self-check" on Promises, "the programmes menu" on SFA, "the impact map" on RSIF), and AHFIA's third plate is "meet the team", not mobile. Ask which URL or state to capture, and which four pages go on the phones. Co-op Bank and Kenya Power have several sites: ask which.
2. **Set up a scratch folder**, not the repo: copy in `docs/screenshots/*.mjs`, run `npm i playwright-core axe-core`, and make `raw/` and `out/`. The scripts launch the Chrome for Testing build in `~/Library/Caches/ms-playwright/chromium-1248`; change the path if that version has gone.
3. **Capture.** In `cap.mjs` set `base` and the page paths. It takes each page at 2x: 1440 by 900, a `-tall` version at 1440 by 1500 for the cut-off windows, and the phones at 375 by 812. Look at every raw shot: dismiss cookie banners, scroll to load lazy images, and retake anything half-loaded. These are other organisations' sites, so do not log in or submit anything.
4. **Compose.** In `compose.mjs` rename the second job and its `-tall` source to the client's page. Run `node compose.mjs`, then open the PNGs in `out/`.
5. **Encode** with alpha kept: `cwebp -q 82 -alpha_q 100 out/<name>.png -o public/assets/site/<slug>-screen-<name>.webp`.
6. **Update** `<slug>.md`.
7. **Check.** With the dev server running, `node check.mjs <slug>` screenshots every screens plate at 375, 560, 768, 1024 and 1440 in light and dark into `check/`, and runs axe at 375 and 1440. Look at all of them: the window bar and the site's nav must show at every width. Then `npm run build` (and `npm run check:cms` if the schema changed).
8. **Commit** the study's images and `.md` together, separate from anything else on `dev`.

## Gotchas
- **The preview pane goes blank at phone width.** Use `check.mjs` (headless) for 375, not the Browser pane.
- **Reduced motion matters in headless runs.** Without it the page loader (the helmet) and the reveal animations cover the plates.
- **Another session may share this folder.** Check `git status` and the running servers first. If another session's `astro preview` is serving `dist/`, build to a scratch folder with `npx astro build --outDir <scratch>` instead of overwriting it, and stage only your own files when committing.
- **Image viewers show transparency as black or white.** That is the viewer, not the file; `webpinfo` should report `Alpha: 1`.

## Still open
- The old `rlc-pages.webp`, `rlc-about.webp` and `rlc-mobile.webp` are still in `public/assets/site/` and unused. Josh has not asked for them to be deleted, so ask before removing.
- Nothing has been merged to `main` or pushed since the RLC work.
