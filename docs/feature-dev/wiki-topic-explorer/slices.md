# Wiki Topic Explorer Slices

## Slice 1: Topic Index Manifest

- Type: AFK
- Blocked by: None
- User stories covered: 1, 2, 3, 5, 6, 9, 10

### What to build

Generate first-class Topic records in the Wiki Explorer manifest. Each record should include a stable ID, Topic Title, normalized title, Meetup page ID/title/slug/date, Track, source Links, resolved wiki page IDs, unresolved wiki links, and searchable text. Existing page manifest behavior must remain compatible.

### Acceptance criteria

- [ ] `buildWikiManifest` returns `topics`, `topicsById`, and topic stats.
- [ ] Cursor and SpaceX can resolve to a shared Topic in test data.
- [ ] Source Links are preserved on Topic records.
- [ ] Existing page, graph, backlink, and referenced source tests still pass.

## Slice 2: Wiki Explorer Filters

- Type: AFK
- Blocked by: Slice 1
- User stories covered: 2, 3, 4, 5, 6, 8, 9

### What to build

Extend Wiki Explorer URL state and UI to support entity/concept filters and render matching Topic Results. Filters should be stable in the URL and behave as AND filters across Topic wiki IDs. Free-text search should match tokenized multi-term queries across page and Topic haystacks.

### Acceptance criteria

- [ ] `buildWikiExplorerSearch` and `parseWikiExplorerSearch` handle `entities` and `concepts`.
- [ ] `/wiki?entities=cursor,spacex` can represent the Cursor plus SpaceX intersection.
- [ ] Topic Results show matching Topic Title, Meetup, Track, wiki chips, and Links.
- [ ] Existing page filters, graph controls, and focused wiki routes still work.

## Slice 3: Meetup Topic Entry Points

- Type: AFK
- Blocked by: Slices 1 and 2
- User stories covered: 1, 4, 7, 8

### What to build

Use the generated manifest to enrich Meetup detail Topics with wiki chips. A chip opens the relevant wiki page, and a compact "related topics" entry opens a filtered Wiki Explorer view for the Topic's resolved wiki IDs. Presentation Mode should remain unchanged.

### Acceptance criteria

- [ ] Meetup detail pages show wiki chips only when manifest metadata is available.
- [ ] Clicking an entity/concept chip opens the wiki page route.
- [ ] The related exploration link opens a filtered Wiki Explorer URL.
- [ ] Existing Meetup detail and Presentation Mode flows remain intact.
