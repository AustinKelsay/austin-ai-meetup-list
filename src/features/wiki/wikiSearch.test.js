import { describe, expect, it } from "vitest";
import { buildPageSearchHaystack, filterPagesByQuery, matchesPageSearch } from "./wikiSearch.js";

function page(overrides) {
  return {
    id: "p",
    title: "P",
    type: "entity",
    tags: [],
    excerpt: "",
    outgoingIds: [],
    backlinkIds: [],
    referencedTopicSources: [],
    ...overrides,
  };
}

describe("wikiSearch", () => {
  it("returns true for empty query", () => {
    expect(matchesPageSearch(page({ title: "OpenAI" }), "", {})).toBe(true);
  });

  it("matches against title", () => {
    const haystack = buildPageSearchHaystack(page({ title: "Anthropic" }), {});
    expect(haystack).toContain("anthropic");
  });

  it("matches against excerpt", () => {
    expect(
      matchesPageSearch(page({ excerpt: "Claude Mythos and Opus" }), "mythos", {}),
    ).toBe(true);
  });

  it("matches against tags", () => {
    expect(
      matchesPageSearch(page({ tags: ["agent-infrastructure", "track"] }), "agent-infra", {}),
    ).toBe(true);
    expect(
      matchesPageSearch(page({ tags: ["entity"] }), "track", {}),
    ).toBe(false);
  });

  it("matches against outgoing page titles", () => {
    const pagesById = {
      target: page({ id: "target", title: "Compute Strategy" }),
    };
    expect(
      matchesPageSearch(
        page({ id: "src", outgoingIds: ["target"] }),
        "compute",
        pagesById,
      ),
    ).toBe(true);
  });

  it("matches against backlink page titles", () => {
    const pagesById = {
      mentioner: page({ id: "mentioner", title: "World Models" }),
    };
    expect(
      matchesPageSearch(
        page({ id: "subject", backlinkIds: ["mentioner"] }),
        "world",
        pagesById,
      ),
    ).toBe(true);
  });

  it("matches multi-term queries across different haystack fields", () => {
    const pagesById = {
      spacex: page({ id: "spacex", title: "SpaceX" }),
    };

    expect(
      matchesPageSearch(
        page({ id: "cursor", title: "Cursor", backlinkIds: ["spacex"] }),
        "cursor spacex",
        pagesById,
      ),
    ).toBe(true);
    expect(
      matchesPageSearch(
        page({ id: "cursor", title: "Cursor", backlinkIds: ["spacex"] }),
        "cursor anthropic",
        pagesById,
      ),
    ).toBe(false);
  });

  it("matches against referenced topic source titles", () => {
    expect(
      matchesPageSearch(
        page({
          referencedTopicSources: [
            { href: "https://x", title: "Vector compression hits 10x", section: "Agent Infrastructure" },
          ],
        }),
        "compression",
        {},
      ),
    ).toBe(true);
  });

  it("matches against source link urls", () => {
    expect(
      matchesPageSearch(
        page({ sourceLinks: ["https://openai.com/research/gpt-5"] }),
        "openai.com/research",
        {},
      ),
    ).toBe(true);
  });

  it("matches against source reference titles and sections", () => {
    expect(
      matchesPageSearch(
        page({
          sourceReferences: [
            { href: "https://x", title: "Claude Code launch", section: "Agent Infrastructure" },
          ],
        }),
        "claude code",
        {},
      ),
    ).toBe(true);
    expect(
      matchesPageSearch(
        page({
          sourceReferences: [
            { href: "https://x", title: "Claude Code launch", section: "Agent Infrastructure" },
          ],
        }),
        "agent infrastructure",
        {},
      ),
    ).toBe(true);
  });

  it("returns false when no haystack token matches", () => {
    expect(matchesPageSearch(page({ title: "OpenAI" }), "anthropic", {})).toBe(false);
  });

  it("filterPagesByQuery keeps order and filters empty", () => {
    const pages = [
      page({ id: "a", title: "Anthropic" }),
      page({ id: "b", title: "OpenAI" }),
      page({ id: "c", title: "Cohere" }),
    ];

    expect(filterPagesByQuery(pages, "", {}).map((p) => p.id)).toEqual(["a", "b", "c"]);
    expect(filterPagesByQuery(pages, "open", {}).map((p) => p.id)).toEqual(["b"]);
  });
});
