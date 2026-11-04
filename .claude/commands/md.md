---
description: Run the open tasks in the Modifica section of the Disegno Todoist project
argument-hint: [optional: part of a task name to run only that task]
allowed-tools: Bash(git *), Bash(npm run build), Bash(npm run check:cms), Read, Edit, Write
---

Do the open tasks in the **Modifica** section of the Todoist project **Disegno**. Optional filter from Josh: $ARGUMENTS

## 1. Read the list
- Find the project **Disegno** and its section **Modifica** by name (use `find-projects`, `find-sections`, then `find-tasks` for that section). Do not rely on stored ids.
- Skip completed tasks. If `$ARGUMENTS` is set, run only the tasks whose title contains it.
- Read each task's title, description and comments. The title and description are Josh's instruction. Comments may hold answers to questions raised earlier.
- If the section is empty, say so and stop.

## 2. Check you are on `dev`
Run `git branch --show-current`. All work happens on `dev`. If something else is checked out, stop and tell Josh.

## 3. Plan before touching anything
For each task, work out which files it touches (`src/content/**` for copy and structure, `src/pages`, `src/components`, `src/styles` for layout and colour). The content schemas in `src/content.config.ts` are the single source of truth, so keep content changes valid against them.

Decide whether the task is clear enough to do. A task is **not** clear enough when:
- it does not say which page or section it means and the code does not settle it,
- it needs new copy that Josh has not written (beyond a short wording he gave),
- it needs an image he has not named or supplied.

For an unclear task, ask Josh a short, specific question with `AskUserQuestion` (offer the likeliest options). If he has not answered, leave the task open and add a Todoist comment with the question. Never guess and never tick it.

## 4. Do each clear task
- Match the existing design: reuse the neighbouring components and the tokens in `src/styles/auxilia/tokens.css` and `src/styles/acquisti/`. Change only what the task asks for. Colours come from the existing variables in both light and dark.
- Copy rules: UK English, no em dashes, concise, must not read as AI-generated. Where Josh gave only a topic, draft the wording from his words alone and flag it in the report as drafted for review. Do not invent facts, numbers or claims.
- Images: use files already in `public/assets` or `public/assets/stock` unless Josh supplies one. Optimise anything new to WebP. Always give meaningful alt text.
- Removing an item: also remove or update anything that counts or refers to it (counts in notes and labels, menu entries, related lists).
- Keep the Sveltia config and the Zod schema in step if a field changes (`npm run check:cms`).

## 5. Verify each task before ticking it
- `npm run build` passes (and `npm run check:cms` if schemas or `public/admin/` changed).
- Look at the result in the browser at 1440 and 375 wide, in light and dark, and compare with what the task describes. Do not rely on the diff alone.
- Run axe on the touched page in both themes. Nothing new may fail.

## 6. Close out
- Commit on `dev`, one commit per task, short imperative subject, UK English, with the standing co-author line. Do not merge or push: Josh runs `/cm` for that.
- Tick the finished tasks in Todoist (`complete-tasks`) and add a one-line comment saying what changed and the commit.
- Report: for each task, done / needs an answer / blocked, the files changed, anything drafted for review, and the commit hashes.

## Rules
- Never touch the old Auxilia repo, GitHub Pages settings or DNS. No force pushes, no hard resets, no deleting branches or files without asking.
- Do not mark a task done that you could not verify.
- Tasks outside Modifica (for example **Conversione**) are not yours to run.
