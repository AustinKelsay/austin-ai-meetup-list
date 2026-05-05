# Wiki Schema

## Domain

This wiki covers Austin AI Club meetups, topic boards, source links, recurring AI concepts, organizations, products, models, and questions worth preserving across meetups.

The wiki is an organizational layer over the Markdown Archive. It is not the frontend rendering model.

## Conventions

- Filenames use lowercase-hyphen style.
- Dated Meetup pages stay at `YYYY-MM-DD.md` so existing static links keep working.
- Normal wiki pages include YAML frontmatter.
- Internal links use `[[wikilinks]]`; aliases may use `[[target|label]]`.
- The Markdown Archive remains the source of record for authored Meetup notes.
- `src/data.js` remains the explicit Meetup Data contract for frontend rendering.
- Update `index.md` and `log.md` when adding or materially changing wiki pages.

## Required Frontmatter

```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | summary | meetup
tags: [tag-a, tag-b]
sources: [raw/articles/example.md]
---
```

## Page Types

- `meetup`: dated Austin AI Club Meetup notes and Topic Boards.
- `entity`: people, organizations, projects, products, models, and platforms.
- `concept`: recurring themes, lenses, technical ideas, and discussion patterns.
- `comparison`: side-by-side analysis that should persist beyond one Meetup.
- `query`: durable answers to recurring questions.
- `summary`: index, source-record, or synthesis pages.

## Source Policy

This repo is public. Do not copy full third-party articles, papers, transcripts, or social posts into `raw/`.

Use public link records instead:

- title
- URL
- source type
- date accessed
- short note about why the source supports a Topic

Short quotations are allowed only when needed and should be kept minimal.

## Tag Taxonomy

- `meetup`
- `topic-board`
- `track`
- `entity`
- `concept`
- `company`
- `model`
- `product`
- `agent-infrastructure`
- `models-research`
- `security`
- `big-tech-moves`
- `privacy`
- `open-source`
- `source-record`

## Page Thresholds

- Create a page when an entity or concept is central to a Meetup or likely to recur.
- Update an existing page when the topic already exists.
- Do not create pages for passing mentions.
- Prefer a source link record over a raw copied source.
