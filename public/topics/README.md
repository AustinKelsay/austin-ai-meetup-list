# Austin AI Club Meetup Notes

This folder is the durable Markdown archive for each Austin AI Club meetup.

The frontend reads curated session data from `src/data.js`, but the source-of-record notes for every meetup should also live here as standalone Markdown.

## Meetups

- [2026-03-18](./2026-03-18.md) - Austin AI Club meetup notes

## Adding a new meetup

1. Copy `TEMPLATE.md` to `YYYY-MM-DD.md`.
2. Add the meetup tracks, stories, and source links in Markdown.
3. Update `src/data.js` so the frontend matches the Markdown notes.
4. Add presenter `notes` only if they help in slideshow mode.
5. Keep the Markdown archive and frontend data in sync.

## Standard categories

Use the same five categories each meetup unless there is a strong reason not to:

1. `Local Builds & Projects`
2. `Agent Infrastructure`
3. `Models & Research`
4. `Security`
5. `Big Tech Moves`

These categories are meant to stay stable across meetups so new stories always have an obvious home.
