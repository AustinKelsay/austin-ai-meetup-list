# austin-ai-meetup-list

A small Vite + React frontend for the Austin AI Club topic board.

This repo is optimized for clarity over abstraction. The goal is to make it easy for a human or agent to:

- understand the rendering model quickly
- add or update club stories without guessing
- keep the archive durable in Markdown
- support both archive browsing and presentation/slideshow mode

Right now the repo only contains the real March 18, 2026 club session. The earlier fake February seed content has been removed.

## What the app does

The frontend has two views over the same content:

- Archive view: a browsable terminal-style page of tracks and stories
- Presentation view: a slide-by-slide walkthrough of each story, including richer embeds, link cards, and optional presenter notes

The slideshow is not a separate data source. It is built from the same session data that powers the archive page.

The site also supports one global meetup reminder signup. Events stay hardcoded in source control, while a tiny Google Apps Script can collect emails and send day-of reminders.

The slideshow also uses hash-based slide URLs such as `#/slides/2026-03-18/models-and-research/qwen-3-5-series`, so refresh and direct links return to the same item without needing server-side routing.

## Quick Start

```bash
npm install
npm run dev
```

Then open the local Vite URL, usually `http://127.0.0.1:5173/`.

If you want the inline reminder form to submit locally, copy [.env.example](/Users/plebdev/Desktop/code/austin-ai-meetup-list/.env.example) to `.env.local` and set `VITE_REMINDER_SIGNUP_URL`.

## Build

```bash
npm run build
```

Vite emits the production site to `dist/`.

## Deploy

Vercel deploy is intentionally simple:

1. Import the repo into Vercel
2. Use the `Vite` framework preset
3. Build command: `npm run build`
4. Output directory: `dist`
5. Attach the `austinai.club` domain

This repo also includes [vercel.json](/Users/plebdev/Desktop/code/austin-ai-meetup-list/vercel.json) so those settings are explicit in source control.

The slideshow uses hash routes like `#/slides/...`, so static hosting works without custom rewrites.

## Repo Map

- [index.html](/Users/plebdev/Desktop/code/austin-ai-meetup-list/index.html)
  Vite entry HTML
- [src/main.jsx](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/main.jsx)
  React bootstrap
- [src/App.jsx](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/App.jsx)
  Main renderer for archive mode, presentation mode, embeds, link cards, notes, and footer
- [src/data.js](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/data.js)
  Explicit content contract for the frontend
- [src/styles.css](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/styles.css)
  Full visual system for both archive and presentation views
- [scripts/sync-events.mjs](/Users/plebdev/Desktop/code/austin-ai-meetup-list/scripts/sync-events.mjs)
  Generates `public/meetups.json` plus per-event ICS files from `src/data.js`
- [public/topics/](/Users/plebdev/Desktop/code/austin-ai-meetup-list/public/topics)
  Durable Markdown archive served as static files
- [public/topics/README.md](/Users/plebdev/Desktop/code/austin-ai-meetup-list/public/topics/README.md)
  Archive-side workflow notes
- [apps-script/](/Users/plebdev/Desktop/code/austin-ai-meetup-list/apps-script)
  Tiny Google Apps Script reminder backend

## Rendering Model

The render pipeline is:

1. Durable club notes live in `public/topics/*.md`
2. UI data in [src/data.js](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/data.js) mirrors or curates that content for the frontend
3. [src/App.jsx](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/App.jsx) renders archive mode and presentation mode from the same session data
4. [src/styles.css](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/styles.css) styles both modes

This split is intentional:

- Markdown stays durable and easy to diff
- `data.js` stays explicit and patch-friendly
- React stays mostly presentational, with only a little view state for slideshow mode

## Data Shape

Each session in [src/data.js](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/data.js) contains:

- `id`
- `slug`
- `date`
- `open`
- `markdownHref`
- `event`
- `tracks[]`

`event` is optional meetup metadata for reminder emails and add-to-calendar links:

- `title`
- `summary`
- `startAt`
- `endAt`
- `timezone`
- `locationName`
- `locationAddress`
- `reminderSendHour`

Each track contains:

- `id`
- `title`
- `items[]`

Each topic item can use any of these fields:

- `title`
- `description`
- `chip`
- `href`
- `embed`
- `video`
- `mediaPair`
- `notes`

Supported patterns right now:

- Plain link item
- X/Twitter embed via `embed`
- YouTube embed via `video`
- Paired story via `mediaPair`, usually `video + reaction post`
- Presenter note via `notes`

## Standard Categories

Meetups should use the same five high-level buckets by default:

1. `Local Builds & Projects`
2. `Agent Infrastructure`
3. `Models & Research`
4. `Security`
5. `Big Tech Moves`

These names are intentionally broad enough to survive week-to-week topic drift while still being specific enough to keep the board organized.

Use them this way:

- `Local Builds & Projects`
  New repos, demos, local stacks, prototypes, and things people can run or inspect directly.
- `Agent Infrastructure`
  CLIs, runtimes, orchestration frameworks, protocols, interfaces, tool-calling layers, and deployment plumbing.
- `Models & Research`
  Model releases, benchmark shifts, papers, frontier comparisons, architecture updates, and capability discussions.
- `Security`
  Attacks, red-team findings, prompt injection, abuse patterns, defensive ideas, and security-relevant failures.
- `Big Tech Moves`
  Major company moves, hardware launches, ecosystem shifts, OS/platform bets, acquisitions, and product strategy.

If a story could fit multiple buckets, sort it by the angle you want the club discussion to focus on, not by every possible interpretation.

## Monthly Workflow

1. Copy [public/topics/TEMPLATE.md](/Users/plebdev/Desktop/code/austin-ai-meetup-list/public/topics/TEMPLATE.md) to `public/topics/YYYY-MM-DD.md`
2. Use the standard five categories unless there is a strong reason to diverge
3. Add the club stories and source links in Markdown first
4. Mirror that content into [src/data.js](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/data.js)
5. Add `notes` only when they help in presentation mode
6. Add or update the session `event` metadata if this meetup should appear in reminders/calendar links
7. Sessions load collapsed by default, so no extra open-state flag is needed
8. Run `npm run build`

Do not skip the Markdown step. Markdown is the archive of record.

## Reminders

The reminder flow is intentionally small:

1. Meetup metadata lives in [src/data.js](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/data.js)
2. [scripts/sync-events.mjs](/Users/plebdev/Desktop/code/austin-ai-meetup-list/scripts/sync-events.mjs) generates:
   `public/meetups.json` and `public/calendar/*.ics`
3. The frontend posts one global email signup to `VITE_REMINDER_SIGNUP_URL`
4. The Apps Script in [apps-script/README.md](/Users/plebdev/Desktop/code/austin-ai-meetup-list/apps-script/README.md) stores subscribers in a Google Sheet and sends reminders on meetup days

## Embed Notes

- The site should be served over HTTP, not opened with `file://`
- X embeds are loaded client-side through Twitter widgets in [src/App.jsx](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/App.jsx)
- YouTube embeds use `referrerPolicy="strict-origin-when-cross-origin"` to reduce embed failures
- If an embed is flaky, keep the direct link in the data model so the story still degrades gracefully

## Editing Guidance

- Prefer editing [src/data.js](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/data.js) over adding new component abstractions
- Prefer adding a new data shape only if an existing one cannot express the story cleanly
- Keep comments short and structural
- Keep CSS centralized in [src/styles.css](/Users/plebdev/Desktop/code/austin-ai-meetup-list/src/styles.css) unless a split becomes obviously necessary
- Optimize for coherence across both archive mode and presentation mode
