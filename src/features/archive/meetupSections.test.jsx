import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StaticTrackSection } from "./meetupSections.jsx";
import { getMeetupTopicLookupKey } from "../wiki/wikiTopicEntryPoints.js";

describe("StaticTrackSection", () => {
  it("renders wiki chips and a filtered related Topics link when manifest metadata exists", () => {
    const topic = {
      id: "topic-1",
      title: "SpaceX options Cursor for $60B",
      meetupSlug: "2026-05-27",
      wikiIds: ["cursor", "spacex"],
    };
    const topicLookup = new Map([
      [getMeetupTopicLookupKey("2026-05-27", "SpaceX options Cursor for $60B"), topic],
    ]);

    const html = renderToStaticMarkup(
      <StaticTrackSection
        track={{
          id: "may27-big-tech",
          title: "Big Tech Moves",
          items: [
            {
              title: "SpaceX options Cursor for $60B",
              description: "The partnership gives Cursor access to Colossus.",
              chip: "acquisition",
            },
          ],
        }}
        index={0}
        meetupSlug="2026-05-27"
        wikiTopicLookup={topicLookup}
        wikiPagesById={{
          cursor: { id: "cursor", title: "Cursor", type: "entity" },
          spacex: { id: "spacex", title: "SpaceX", type: "entity" },
        }}
        onOpenRoute={() => {}}
        onOpenTopic={() => {}}
      />,
    );

    expect(html).toContain("Cursor");
    expect(html).toContain("SpaceX");
    expect(html).toContain("href=\"/wiki/cursor\"");
    expect(html).toContain("href=\"/wiki?entities=cursor%2Cspacex\"");
    expect(html).toContain("related Topics");
    expect(html).not.toMatch(/<li[^>]*role="button"/);
    expect(html).toMatch(/<div class="topic-main topic-main--interactive" role="button" tabindex="0">/);
  });
});
