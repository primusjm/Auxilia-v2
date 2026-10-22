# CMS setup

## Lumen (primary)
Open the repo folder in Lumen. It reads `src/content.config.ts`. Media folder: `public/assets`.

## Sveltia (phone and emergency)
Lives at `/admin/` (`public/admin/index.html`, `config.yml`). It covers page copy, case study text, site settings, endorsements and Acquisti landing copy and support topics. Anything else is edited in Lumen.

Rules:
- Same content paths and media folder as Lumen.
- After any Sveltia edit, pull in Lumen before the next session.
- `npm run check:cms` (also run in CI) fails if `config.yml` references a field the Zod schemas do not have, or a widget type that does not match.

## OAuth proxy (needs Josh's accounts)
1. Create a GitHub OAuth App (Settings, Developer settings). Homepage `https://auxilia.io`, callback `https://<worker>/callback`.
2. Deploy `sveltia-cms-auth` to Cloudflare Workers (github.com/sveltia/sveltia-cms-auth). Set secrets `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and var `ALLOWED_DOMAINS=auxilia.io`.
3. Put the Worker URL in `base_url` in `public/admin/config.yml`.
4. Test login once on a phone after launch.
5. Backup: in the login screen choose "Sign in with token" and use a fine-grained personal access token with Contents read/write on this repo only.

While the repo is private, `/admin/` only works on a deployed site, which needs GitHub Pages (paid plan for private repos) or the cut-over.
