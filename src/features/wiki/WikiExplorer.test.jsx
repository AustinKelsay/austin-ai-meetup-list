import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WikiDetail } from "./WikiDetail.jsx";

function buildPage(overrides) {
  return {
    id: "openai",
    title: "OpenAI",
    type: "entity",
    tags: ["entity", "company"],
    sourceCount: 1,
    sourceLinks: ["https://openai.com/release"],
    sourceReferences: [],
    referencedTopicSources: [],
    outgoingIds: [],
    backlinkIds: [],
    unresolvedLinks: [],
    excerpt: "OpenAI is a recurring Austin AI Club entity.",
    rawHref: "/topics/entities/openai.md",
    ...overrides,
  };
}

describe("WikiDetail", () => {
  it("shows source links for the selected wiki page", () => {
    const longSourceLink =
      "https://example.com/research/extremely-long-model-release-slug-without-friendly-breakpoints";
    const selectedPage = buildPage({
      id: "openai",
      sourceLinks: ["https://openai.com/release", longSourceLink],
    });
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
    const selectedPage = buildPage({
      id: "austin-ai-club-april-1-2026",
      title: "Austin AI Club - April 1, 2026",
      type: "meetup",
      tags: ["meetup"],
      sourceLinks: ["https://github.com/ryanthegentry/402index-mcp-server"],
      sourceReferences: [
        {
          href: "https://github.com/ryanthegentry/402index-mcp-server",
          title: "402 Index paid API loop demo",
          section: "Agent Infrastructure",
        },
      ],
      excerpt: "April 1 meetup.",
      rawHref: "/topics/2026-04-01.md",
    });
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
    const selectedPage = buildPage({
      id: "agent-infrastructure",
      title: "Agent Infrastructure",
      type: "concept",
      tags: ["concept", "track"],
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
      excerpt: "Agent Infrastructure covers runtimes and protocols.",
      rawHref: "/topics/concepts/agent-infrastructure.md",
    });
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

  it("renders tags as clickable buttons when onTagClick is provided", () => {
    const selectedPage = buildPage();
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
        onTagClick={() => {}}
      />,
    );

    expect(html).toMatch(/<button[^>]*class="[^"]*wiki-tag--clickable[^"]*"[^>]*>entity<\/button>/);
    expect(html).toMatch(/<button[^>]*class="[^"]*wiki-tag--clickable[^"]*"[^>]*>company<\/button>/);
    expect(html).not.toMatch(/<span[^>]*class="[^"]*wiki-tag[^"]*"[^>]*>entity<\/span>/);
  });

  it("highlights the active tag filter", () => {
    const selectedPage = buildPage();
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
        onTagClick={() => {}}
        activeTag="company"
      />,
    );

    expect(html).toMatch(
      /<button[^>]*class="[^"]*wiki-tag--active[^"]*"[^>]*>company<\/button>/,
    );
    expect(html).not.toMatch(
      /<button[^>]*class="[^"]*wiki-tag--active[^"]*"[^>]*>entity<\/button>/,
    );
  });

  it("renders tags as plain spans when onTagClick is omitted", () => {
    const selectedPage = buildPage();
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toMatch(/<span[^>]*class="[^"]*wiki-tag[^"]*"[^>]*>entity<\/span>/);
    expect(html).not.toContain("wiki-tag--clickable");
  });

  it("shows a freshness line when the page has a recent updated date", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const selectedPage = buildPage({ updated: yesterday });
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toContain("wiki-detail-freshness");
    expect(html).toMatch(/Updated (yesterday|1 day ago)/);
  });

  it("omits the freshness line when no date is available", () => {
    const selectedPage = buildPage({ updated: "", created: "" });
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).not.toContain("wiki-detail-freshness");
  });

  it("renders a copy link button next to the markdown source link", () => {
    const selectedPage = buildPage();
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toMatch(/<button[^>]*class="[^"]*wiki-copy-link[^"]*"[^>]*>Copy link<\/button>/);
  });

  it("opens external source links in a new tab", () => {
    const selectedPage = buildPage({
      sourceLinks: ["https://openai.com/release"],
    });
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="openai"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("shows a Mentioned In section with meetup backlinks", () => {
    const selectedPage = buildPage({
      id: "anthropic",
      backlinkIds: ["austin-ai-club-june-10-2026", "agent-cost-controls"],
    });
    const manifest = {
      pagesById: {
        "austin-ai-club-june-10-2026": {
          id: "austin-ai-club-june-10-2026",
          title: "Austin AI Club - June 10, 2026",
          type: "meetup",
        },
        "agent-cost-controls": {
          id: "agent-cost-controls",
          title: "Agent Cost Controls",
          type: "concept",
        },
      },
    };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="anthropic"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toContain("Mentioned In");
    expect(html).toContain("Austin AI Club - June 10, 2026");
  });

  it("groups referenced topic sources by track section", () => {
    const selectedPage = buildPage({
      id: "agent-infrastructure",
      type: "concept",
      sourceLinks: ["https://direct.example.com"],
      sourceReferences: [],
      referencedTopicSources: [
        {
          href: "https://agent.example.com/one",
          title: "Agent topic one",
          section: "Agent Infrastructure",
          sourcePageTitle: "Austin AI Club - June 10, 2026",
        },
        {
          href: "https://agent.example.com/two",
          title: "Agent topic two",
          section: "Agent Infrastructure",
          sourcePageTitle: "Austin AI Club - May 27, 2026",
        },
        {
          href: "https://models.example.com/one",
          title: "Model topic one",
          section: "Models & Research",
          sourcePageTitle: "Austin AI Club - June 10, 2026",
        },
      ],
    });
    const manifest = { pagesById: {} };

    const html = renderToStaticMarkup(
      <WikiDetail
        manifest={manifest}
        selectedPage={selectedPage}
        focusedWikiId="agent-infrastructure"
        onOpenRoute={() => {}}
      />,
    );

    expect(html).toContain("Agent Infrastructure");
    expect(html).toContain("Models &amp; Research");
    expect(html).toContain("Agent topic one");
    expect(html).toContain("Agent topic two");
    expect(html).toContain("Model topic one");
  });
});

