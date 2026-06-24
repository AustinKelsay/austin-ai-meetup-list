import { describe, expect, it } from "vitest";
import {
  buildMeetupTopicLookup,
  buildTopicExplorerSearch,
  getMeetupTopicLookupKey,
  getTopicWikiPages,
} from "./wikiTopicEntryPoints.js";

describe("wikiTopicEntryPoints", () => {
  it("matches Meetup Data Topics to manifest Topics by meetup slug and Topic Title", () => {
    const lookup = buildMeetupTopicLookup({
      topics: [
        {
          id: "topic-1",
          title: "SpaceX options Cursor for $60B",
          meetupSlug: "2026-05-27",
        },
      ],
    });

    expect(lookup.get(getMeetupTopicLookupKey("2026-05-27", "SpaceX options Cursor for $60B"))).toMatchObject({
      id: "topic-1",
    });
  });

  it("builds filtered Wiki Explorer search from Topic wiki pages", () => {
    const topic = {
      wikiIds: ["cursor", "spacex", "coding-agents"],
    };
    const pagesById = {
      cursor: { id: "cursor", title: "Cursor", type: "entity" },
      spacex: { id: "spacex", title: "SpaceX", type: "entity" },
      "coding-agents": { id: "coding-agents", title: "Coding Agents", type: "concept" },
    };

    expect(getTopicWikiPages(topic, pagesById).map((page) => page.id)).toEqual([
      "cursor",
      "spacex",
      "coding-agents",
    ]);
    expect(buildTopicExplorerSearch(topic, pagesById)).toBe(
      "?concepts=coding-agents&entities=cursor%2Cspacex",
    );
  });
});
