# Migration tooling

One-off scripts used to convert the Claude Design handover (`design/`) into Astro content and to check fidelity. Kept for reference. They are not part of the site build. The `design/` folder was deleted on 23 October 2026; to re-run anything, restore it from git history (it was added in commit `77cd44c`) into a scratch folder.

Run from a copy of this folder with its own `npm install` (cheerio, postcss, js-yaml, playwright-core, pixelmatch, pngjs). They read from `/home/user/Auxilia-v2/design` and write into `src/`; adjust the paths at the top of `clean.mjs` if the repo lives elsewhere.

- `clean.mjs`: turns prototype markup into plain HTML (state classes, link and asset rewrites).
- `extract-*.mjs`, `build-content.mjs`: pull copy out of each case study and homepage into content files.
- `verify*.mjs`, `shot.mjs`, `cmp.mjs`, `compare-*.sh`: DOM and screenshot diffs against the originals.
- `smoke.mjs`: interaction smoke test against `astro preview`.
