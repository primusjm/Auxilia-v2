# Auxilia.io redesign: project brief for Claude Code

## Goal
Build a new auxilia.io (Josh's design studio site) focused primarily on non profits.

**This is a complete replacement, not a migration.** Do not reuse, scrape or port any code, layout, copy or assets from the current auxilia.io.

**The Claude Design output is the finished site and its content is final.** The task is a faithful conversion to Astro, not a redesign or rewrite. Do not invent placeholder content, change copy, or alter the design. Use the Claude Design handover zip (in `/design`) as the source of truth for layout, tokens, copy, assets and behaviour. If something in the handover is ambiguous or missing, ask Josh rather than guessing.

## Decisions made
- **Design:** done in Claude Design. Code it faithfully from the design files.
- **Framework:** Astro, using Content Collections with Zod schemas in `src/content.config.ts` (single source of truth for content structure).
- **Styling:** Tailwind.
- **Hosting:** GitHub Pages, static output only. Deploy with a GitHub Actions workflow.
- **Theme:** dark and light mode toggle, via CSS variables plus a toggle. Respect `prefers-color-scheme`, persist the choice, and meet WCAG AA contrast.
- **Content format:** Markdown (MDX only if needed). Simple to read, shows domain authority.

## CMS plan
- **Primary editor: Lumen CMS** (lumencms.com, macOS app, Free tier, 1 site). It opens the local Astro folder and edits files, so it needs no server. It reads the Zod schemas in `src/content.config.ts`.
- **Emergency and mobile editor: Sveltia CMS** at `public/admin/` with a short hand-written `config.yml` covering only what Josh would fix from a phone (page copy, case study text, basic fields).
  - GitHub auth: Cloudflare Worker OAuth proxy (`sveltia-cms-auth`), with a personal access token as a backup.
  - Test the mobile login once at launch.
- **Keep Lumen and Sveltia in sync:** same content paths and media folder. Add a CI check that fails if the Sveltia config drifts from the Zod schemas. No generator script needed.
- **Workflow rule:** after any Sveltia edit, pull in Lumen before the next session.
- Keystatic was rejected because its admin route needs a Node server, which GitHub Pages cannot run.

## Case studies (key requirement)
Case studies must show Josh's thought process, not just screenshots. The case study content comes from the Claude Design handover, so map it into the schema rather than rewriting it. Suggested schema fields: client, sector, summary, role, problem, research, decisions (with reasoning), iterations, outcome, screenshots (with captions), related work, live URL.

## Repository
- Create a **private** GitHub repo called **Auxilia-v2** to hold the project during conversion (for example `gh repo create Auxilia-v2 --private --source=. --remote=origin`, or ask Josh to create it if `gh` is not authenticated). Push only to this repo.
- Do not touch the current Auxilia repo or the live site.
- Josh reviews everything offline. Only once he confirms the site is fully ready will he archive the current site and make Auxilia-v2 the main Auxilia repo. Do not rename, archive, publish or change DNS or Pages settings without his explicit instruction.
- GitHub Pages from a private repo needs a paid GitHub plan. Build and test locally until the cut-over, and flag this to Josh if Pages is needed earlier.

## Project management
- **Todoist:** at the start, create a project called **Sito** for this work (check first that it does not already exist). Add one task per conversion step and per page or component, and tick them off as they are completed. Josh and Claude will use this project to go through the conversion together.
- Longer term, tasks are also tracked in **Linear.app**, with sprints added to the **Things** app.

## Style rules for all output
- UK English.
- Concise, direct prose.
- No em dashes.
- Markdown content that is simple to understand.

## Suggested first steps
0. Create the private Auxilia-v2 repo and the Sito project in Todoist (with tasks for the steps below).
1. Scaffold Astro with Tailwind and the GitHub Pages deploy workflow.
2. Define Zod collections (case studies, pages, services, endorsements).
3. Build the layout, tokens and dark/light toggle from the Claude Design files.
4. Convert each page and component from the handover into Astro, moving the final copy into content collections (Markdown and JSON) so Lumen and Sveltia can edit it. Check each page against the design for fidelity.
5. Add Sveltia config, the OAuth proxy and the CI drift check.
6. Accessibility, performance and SEO pass.
