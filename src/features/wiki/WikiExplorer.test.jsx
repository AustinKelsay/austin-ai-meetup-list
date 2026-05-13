import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WikiDetail } from "./WikiDetail.jsx";

describe("WikiDetail", () => {
  it("shows source links for the selected wiki page", () => {
    const longSourceLink =
      "https://example.com/research/extremely-long-model-release-slug-without-friendly-breakpoints";
    const selectedPage = {
      id: "openai",
      title: "OpenAI",
      type: "entity",
      tags: ["entity"],
      sourceCount: 1,
      sourceLinks: ["https://openai.com/release", longSourceLink],
      outgoingIds: [],
      backlinkIds: [],
      unresolvedLinks: [],
      excerpt: "OpenAI is a recurring Austin AI Club entity.",
      rawHref: "/topics/entities/openai.md",
    };
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toContain("Sources");
    expect(html).toContain("Direct");
    expect(html).toContain("href=\"https://openai.com/release\"");
    expect(html).toContain("openai.com/release");
    expect(html).toContain("class=\"wiki-link-label\"");
    expect(html).toContain("example.com/research/extremely-long-model-release-slug");
  });

  it("shows source link topic titles when source references include context", () => {
    const selectedPage = {
      id: "austin-ai-club-april-1-2026",
      title: "Austin AI Club - April 1, 2026",
      type: "meetup",
      tags: ["meetup"],
      sourceCount: 1,
      sourceLinks: ["https://github.com/ryanthegentry/402index-mcp-server"],
      sourceReferences: [
        {
          href: "https://github.com/ryanthegentry/402index-mcp-server",
          title: "402 Index paid API loop demo",
          section: "Agent Infrastructure",
        },
      ],
      outgoingIds: [],
      backlinkIds: [],
      unresolvedLinks: [],
      excerpt: "April 1 meetup.",
      rawHref: "/topics/2026-04-01.md",
    };
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="austin-ai-club-april-1-2026"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toContain("402 Index paid API loop demo");
    expect(html).toContain("Agent Infrastructure");
    expect(html).toContain("github.com/ryanthegentry/402index-mcp-server");
  });

  it("shows referenced topic sources in the unified sources list", () => {
    const selectedPage = {
      id: "agent-infrastructure",
      title: "Agent Infrastructure",
      type: "concept",
      tags: ["concept", "track"],
      sourceCount: 0,
      sourceLinks: [],
      sourceReferences: [],
      referencedTopicSources: [
        {
          href: "https://github.com/ryanthegentry/402index-mcp-server",
          title: "402 Index paid API loop demo",
          section: "Agent Infrastructure",
          sourcePageTitle: "Austin AI Club - April 1, 2026",
        },
      ],
      outgoingIds: [],
      backlinkIds: [],
      unresolvedLinks: [],
      excerpt: "Agent Infrastructure covers runtimes and protocols.",
      rawHref: "/topics/concepts/agent-infrastructure.md",
    };
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="agent-infrastructure"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toContain("Sources");
    expect(html).not.toContain("Referenced Topic Sources");
    expect(html).not.toContain("No source links captured yet.");
    expect(html).toContain("402 Index paid API loop demo");
    expect(html).toContain("From Austin AI Club - April 1, 2026");
    expect(html).toContain("github.com/ryanthegentry/402index-mcp-server");
  });
});
