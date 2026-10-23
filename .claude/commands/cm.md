---
description: Commit the work on dev in sensible commits, then merge dev into main
argument-hint: [optional note on what the work was]
allowed-tools: Bash(git *), Bash(npm run build), Bash(npm run check:cms)
---

Commit the current work on `dev` and merge it into `main`. Optional note from Josh: $ARGUMENTS

Work through these steps in order and stop at the first one that fails.

1. **Branch.** Run `git branch --show-current`. All work happens on `dev`. If another branch is checked out, stop and tell Josh rather than switching with uncommitted changes.
2. **Inspect.** Run `git status --short` and `git diff --stat`. If there is nothing to commit, say so and stop. Never stage `.env*`, `node_modules`, `dist`, scratch or test output, or `.claude/launch.json`. Stage files by name, not with `git add -A`.
3. **Gate.** Run `npm run build`, and `npm run check:cms` if `src/content.config.ts` or `public/admin/` changed. If either fails, report the output and stop. Do not commit a broken build.
4. **Commit.** Group the changes into sensible commits, one concern each (for example fonts, a page, an accessibility fix, docs). Write a short imperative subject line, and a body only when the why is not obvious. UK English, no em dashes. Add the standing co-author attribution line. Do not skip hooks.
5. **Notes.** If the work changes status, decisions or open items, update `docs/CONVERSION-NOTES.md` in its own commit. Tick finished tasks in the Todoist project **Sito**.
6. **Merge.** Push `dev` (`git push origin dev`), then:
   - `git checkout main`
   - `git merge --ff-only dev`
   - `git push origin main`
   - `git checkout dev`

   If the fast-forward fails because `main` has diverged, stop and tell Josh. Do not force-push, rebase `main` or resolve it silently.
7. **Report.** List the commits made, confirm `main` and `dev` point at the same commit, and flag anything left uncommitted.

Rules:
- Push only to `origin` (the private Auxilia-v2 repo). Never touch the old Auxilia repo, GitHub Pages settings or DNS.
- Never use `--force`, `git reset --hard` or delete branches.
- End on `dev` so the next piece of work starts there.
