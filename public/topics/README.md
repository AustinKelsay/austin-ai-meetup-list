# Austin AI Club Meetup Notes

This folder is the durable Markdown Archive for each Austin AI Club meetup.

The Markdown Archive is the source of record for authored meetup notes. The frontend reads curated Meetup Data from `src/data.js`, but that data should mirror or intentionally curate from these standalone Markdown files.

## Meetups

- [2026-04-15](./2026-04-15.md) - Austin AI Club meetup notes
- [2026-04-01](./2026-04-01.md) - Austin AI Club meetup notes
- [2026-03-18](./2026-03-18.md) - Austin AI Club meetup notes

## Adding a new meetup

1. Copy `TEMPLATE.md` to `YYYY-MM-DD.md`.
2. Add the meetup Topic Board: Tracks, Topics, Links, and any Showcases.
3. Omit empty standard Tracks.
4. Update `src/data.js` so the frontend matches or intentionally curates from the Markdown notes.
5. Add public presenter `notes` only if they help Presentation Mode.
6. Keep the Community Slot last, and show an empty slot only for the next upcoming meetup.

## Standard Tracks

Use the same five Tracks each meetup unless there is a strong reason not to:

1. `Local Builds & Projects`
2. `Agent Infrastructure`
3. `Models & Research`
4. `Security`
5. `Big Tech Moves`

These Tracks are meant to stay stable across meetups so new Topics have an obvious home. Open source and privacy are curation lenses, not Tracks. Security is both a Track and a curation lens.
