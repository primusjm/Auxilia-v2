# Handoff: auxilia.io (portfolio) + auxilia.io/acquisti (app site)

## Overview
Two sites, one domain, to be built in **Astro**:

1. **Auxilia** (`auxilia.io`): a studio portfolio for an Africa-focused digital agency. A Homepage plus 13 case studies.
2. **Acquisti** (`auxilia.io/acquisti`): the marketing site for Acquisti, an iOS shopping-list app Auxilia makes. A landing page plus a privacy policy.

**Acquisti is a separate site.** It lives in a subfolder of the same domain and reuses the same type, colour tokens and some brand marks. But it has its own nav, footer, content, metadata and interactions. Do not put it in the Auxilia nav, record or sitemap groupings, and do not share page-level layouts between the two. Share only the low-level pieces listed under "Shared vs separate".

## About the design files
The `.dc.html` files in this bundle are **design references built in HTML**. They're working prototypes that show the intended look and behaviour, not production code to copy. Each one opens directly in a browser; `support.js` is a small runtime that renders them. The task is to **recreate them in Astro** using idiomatic components, layouts and content collections. The markup uses inline styles throughout, which was a constraint of the prototyping tool. Move styling into Astro component styles or a shared stylesheet with CSS custom properties.

`<image-slot>` (from `image-slot.js`) is a prototyping placeholder. In production, every `<image-slot src="…">` is just an `<img>` (or Astro `<Image>`) with `object-fit: cover`, filling its container.

## Fidelity
**High fidelity.** Final colours, type, spacing, copy, imagery and interactions. Recreate it pixel-faithfully in both light and dark themes, at every breakpoint.

---

## Site map

### Auxilia
| Route | File | Notes |
|---|---|---|
| `/` | `auxilia/Homepage.dc.html` | Main page |
| `/work/<slug>` | `auxilia/CS - *.dc.html` | 13 case studies, 2 templates (below) |

**Record case studies:** 10, numbered in this order. The order drives the Homepage record list, the case-study numbers (01–10) and the related cards.
1. GRiC Africa: `CS - GRiC`
2. Promises Treatment Centre: `CS - Promises`
3. Rising Leaders Center: `CS - RLC`
4. AHFIA: `CS - AHFIA`
5. Imara Fund: `CS - Imara`
6. Inuka Angaza Fund: `CS - Inuka`
7. Kenya Power Foundation: `CS - KPFoundation`
8. Science for Africa Foundation: `CS - SFA`
9. Co-op Bank Foundation: `CS - CoopFoundation`
10. RSIF · PASET: `CS - RSIF`

**Appendix case studies:** 3, tabbed, one page holding several projects for the same client:
- Britam (Trust · Connect · Awards): `CS - Britam`
- Co-op Bank (Bancassurance · Vehicles · Asset Finance · Co-op Trust): `CS - CoopBank`
- Kenya Power (Corporate · Pika · News · Sustainability): `CS - KenyaPower`

Recommended: a `caseStudies` content collection with `{ slug, client, sector, year, title, stat, statLabel, heroImage, order, kind: 'record' | 'appendix' }`. The Homepage record list, the hero slideshow, the mission count ("Ten missions delivered…", worked out from the record count), the related cards and prev/next all come from this one collection.

### Acquisti (separate site)
| Route | File |
|---|---|
| `/acquisti` | `acquisti/Acquisti.dc.html` |
| `/acquisti/privacy` | `acquisti/Acquisti Privacy.dc.html` |

---

## Shared vs separate

**Share (low-level only):**
- Fonts: Bricolage Grotesque (display) and Outfit (UI/body), both from Google Fonts.
- Colour tokens (identical values in both sites; see Design tokens).
- Theme mechanism: `data-theme="light|dark"` on the root, plus a theme toggle.
- Brand marks: `mark-helmet.png`, `mark-plume.png` (loader and logo masks), `favicon.png`.

**Keep separate:**
- Layouts, nav, footer, contact.
- Auxilia's theme key in localStorage is `auxilia-theme-v2`. Acquisti does not read or write it.
- Metadata, OG images, favicon set, analytics.
- Interactions (see each site below).
- In Acquisti's footer, tapping the logo **switches theme**. It does not link to the Auxilia home.

---

## Auxilia: screens

### Homepage
Sections, top to bottom:
1. **Loader.** Full-screen paper colour, with the helmet mark (ink) and plume mark (#3B28FF) drawn as CSS masks over a 104×2px progress bar. A circular reveal (`--ld-c` 0 → 150vmax) uncovers the page.
2. **Hero.** Headline plus the "proof" slideshow: 4 slides drawn from the collection in the order **RLC, GRiC, Inuka, Kenya Power Foundation**. Each slide shows 4.5s with a segmented progress bar (done = ink, current = #3B28FF filling left to right, linear). There's a pause button, and clicking a segment jumps to that slide. Image cross-fade: opacity .6s ease plus scale 1.04 → 1 over 1s `cubic-bezier(.2,.7,.2,1)`. Supporting line: "{N} missions delivered, every one **built around the people it serves.**"
3. **Stat band** (4 columns, counting up when scrolled into view). Each column has an icon, a number, an uppercase label and a client link. One of the 4 is "1M+ Trees planted · Kenya Power Foundation".
4. **The record** (`#record`). A numbered list of the 10 records on the left and a large image stage on the right. Each record shows for 6s, with a 3px brand bar on the left draining top to bottom. Clicking a row selects it. Cross-fade: opacity .6s plus scale 1.03 → 1 over .9s.
5. **Appendix marquee.** Britam, Co-op Bank and Kenya Power tiles in a horizontal loop.
6. `#constraints`, `#capability`, `#method`: content sections.
7. **Contact** (`#contact`). Opens as a modal from every "Book a call" link. Form fields include a country-code picker with search (KE is the default). It submits to Formspree (form id `mgvnzlny`), with idle, sending, sent and error states.
8. **Footer.**

### Record case study (template A)
Sections: `mandate` → `found` ("What we found": a large image with text on the right; **no caption**) → `decisions` → `screens` (3 screenshots; clicking opens a lightbox) → `build` → `results` → `next` (related cards) → `contact`.
- **Hero:** full-bleed photo at low opacity behind a paper-colour gradient, with an eyebrow, an H1 and a meta row (Client, Sector, Year…).
- **Related cards:** use prev/next in the record order. Each card is a photo with a navy gradient, a large outlined number (`-webkit-text-stroke: 1.5px #fff`), the client name in uppercase in #C9C5F7, and the title.
- **Hero image = record card image.** Whatever image represents a case study on the Homepage is the same image in its hero and on its related cards.

### Appendix case study (template B)
Sections: `projects` (tabs, one panel per project) → `thread` → `next` → `contact`.
- **Tab panels:** a project intro image, then lead/a/b screenshots. Panels animate in with `tabIn` .5s.
- **Mandate cards:** white background `#FFFFFF` (`data-mandate-card`). Dark mode falls back to `var(--paper)`.
- **Related cards:** link to the *other* appendix case studies, not the record.

---

## Acquisti: screens (separate site)

### Landing (`/acquisti`)
Sections: Hero → `#features` → `#how` → `#privacy` → `#support` → `#reviews` → `#contact` → footer.
- **Features tour:** a list on the left and phone screenshots on the right, with light and dark image pairs per theme. It auto-advances every 6s once the section enters the viewport, with a progress bar under the phone. Pause/Play sits under the list, and a × on the card closes the tour.
- **How / trip cards:** cards auto-play their hover state about 2s after entering view. On touch, a tap toggles the state.
- **Support:** sticky category tabs (pinned on mobile), plus a search box ("Search all answers" placeholder on mobile) and an FAQ accordion.
- **Privacy summary:** the Apple disclaimer sits at the bottom of this section (landing page only).
- **Contact:** the "Tap to send us a message" icon bobs and tilts (`ctEnvBob`, 3.6s loop) with three typing dots. The envelope variant flaps open.
- **Footer by breakpoint:**
  - ≤640px: copyright, theme and scroll-to-top buttons centred, copyright below.
  - 641–860px: logo and name on the left (links hidden); buttons and copyright on the right.
  - ≥861px: one row. The "Acquisti" name hides only when the copyright gets within 16px of the last nav link. This is measured live (ResizeObserver), not set at a breakpoint.
- **Logo tap switches theme.**

### Privacy (`/acquisti/privacy`)
Long-form policy with anchors: collect, device, sharing, tracking, scan, share, children, rights, reviews, ratings, changes, contact. Sticky Menu, no back button. Export/Share stack below the titles on mobile, and the contact card is centred.

---

## Interactions and behaviour (both sites)
- **Theme:** light/dark via `data-theme` on the root. Auxilia saves the choice in `localStorage['auxilia-theme-v2']`. Respect `prefers-color-scheme` on first visit.
- **Reveals:** `[data-reveal]` elements fade and rise in on scroll (IntersectionObserver).
- **Count-ups:** `data-count`, `data-pre`, `data-suf` attributes.
- **Reduced motion:** every loop and auto-advance stops under `prefers-reduced-motion: reduce`.
- **Auxilia breakpoints in use:** 1080, 900, 860, 760, 680 and 560px (max-width), plus 861px (min-width).
- **Page transitions:** a short leave fade (`ax-leaving` class). It's reset on `pageshow` for bfcache, so pages don't come back from the back/forward cache still faded. Astro View Transitions are a good fit.

## Design tokens
**Light**
```
--paper #F4F4FA   --surface #FFFFFF   --ink #14130F   --ink-soft #57534E   --ink-faint #6E685E
--rule #E2E1EE    --rule-strong #14130F
--brand #3B28FF   --brand-ink #F7F5F0  --brand-wash #E4E1FF  --brand-text #3B28FF
```
**Dark**
```
--paper #0A0E24   --surface #121838   --ink #EEF0FF   --ink-soft #A9B0D6   --ink-faint #949BC4
--rule #222A52    --rule-strong rgba(238,240,255,.7)
--brand #7A6EFF   --brand-ink #0A0E24  --brand-wash #1A1F4A  --brand-text #B2ACFF
```
**Contact block** (`--ct-*`) and **footer** (`--ft-*`) have their own scoped sets. Copy them from the `<helmet><style>` block at the top of any page; they're identical across pages.

**Type**
- Display: Bricolage Grotesque, weights 300–700, optical size 12–96. Large numbers use weight 300 with tabular-nums. H1s use −0.024em tracking.
- UI/body: Outfit, weights 300–600. Eyebrows are 11–11.5px, weight 500, uppercase, tracking .11–.18em.
- Body copy is 15–17px with 1.55–1.65 line-height; `text-wrap: pretty` on paragraphs and `balance` on headlines.

**Shape:** square corners throughout, with 1px rules (`--rule`) as structure. No shadows except the dark-mode card glow.

**Motion:** the standard easing is `cubic-bezier(.2,.7,.2,1)`. Springy hovers use `cubic-bezier(.3,1.6,.5,1)`.

## Assets
- `auxilia/assets/<client>/…webp`: case-study photography. Shutterstock originals were optimised to WebP at about 2000px. File names with a short suffix (e.g. `found-fadh.webp`) carry it to bust the cache; rename freely.
- `auxilia/assets/site/…`: RLC screenshots.
- `auxilia/assets/*.svg|png`: logos, wordmarks, marks, App Store badge and favicon.
- `acquisti/assets/acquisti/…`: app screenshots in `-light`/`-dark` pairs, plus app icon and marks. The prototype builds these paths dynamically (e.g. `'sup-' + slug + '-light.webp'`), so the names matter.

**To fix during the build:**
- Some image spots still load **Unsplash URLs** (mostly Co-op Bank and Kenya Power screen placeholders, plus a few elsewhere). Replace them with licensed images or download them locally.
- Heavy images: `kpfoundation/main.webp` (~380KB) and `imara/hero.webp` (~360KB). Use Astro `<Image>` with responsive `widths` and AVIF.
- `britam/hero.webp` is only 1000px wide; a larger source is needed for full-bleed use.
- `auxilia/reference/Design System*.dc.html` are visual references only. Their asset paths assume the root folder.

## Files
```
auxilia/
  Homepage.dc.html
  CS - GRiC | Promises | RLC | AHFIA | Imara | Inuka | KPFoundation | SFA | CoopFoundation | RSIF .dc.html   (record, template A)
  CS - Britam | CoopBank | KenyaPower .dc.html   (appendix, template B)
  reference/Design System.dc.html, Design System Dark.dc.html
  assets/
  support.js, image-slot.js   (prototype runtime only; do not port)
acquisti/
  Acquisti.dc.html, Acquisti Privacy.dc.html
  assets/
  support.js, image-slot.js   (prototype runtime only)
```
`screenshots/` holds reference captures of the Homepage, one record case study (GRiC), one appendix case study (Co-op Bank), the Acquisti landing page and the Acquisti privacy page. They're DOM re-renders, so a few masked logos or icons may show blank. Trust the live `.dc.html` files over the screenshots.

Open any `.dc.html` in a browser to see it running. Use DevTools to read exact values.
