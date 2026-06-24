import { describe, expect, it } from "vitest";
import { APP_ROUTE } from "./constants.js";
import {
  buildWikiExplorerSearch,
  buildWikiPath,
  getAppRoute,
  parseWikiExplorerSearch,
  WIKI_EXPLORER_SORT_DEFAULT,
  WIKI_EXPLORER_TYPE_ALL,
  WIKI_EXPLORER_SORT_KEYS,
} from "./routes.js";
import { WIKI_GRAPH_TYPE_LIST } from "../features/wiki/wikiGraphFilters.js";

describe("wiki routes", () => {
  it("resolves the wiki explorer route", () => {
    expect(getAppRoute("/wiki")).toEqual({ name: APP_ROUTE.WIKI, wikiId: null, search: "" });
  });

  it("resolves focused wiki page routes", () => {
    expect(getAppRoute("/wiki/openai")).toEqual({
      name: APP_ROUTE.WIKI,
      wikiId: "openai",
      search: "",
    });
  });

  it("captures the search string on the wiki route", () => {
    expect(getAppRoute("/wiki/openai?q=claude&type=entity")).toEqual({
      name: APP_ROUTE.WIKI,
      wikiId: "openai",
      search: "?q=claude&type=entity",
    });
  });

  it("falls back home for malformed focused wiki routes", () => {
    expect(getAppRoute("/wiki/%E0%A4%A")).toEqual({ name: APP_ROUTE.HOME });
  });

  it("builds focused wiki page paths", () => {
    expect(buildWikiPath("coding agents")).toBe("/wiki/coding%20agents");
  });

  it("appends a search string to a focused wiki path", () => {
    expect(buildWikiPath("openai", "?q=claude&type=entity")).toBe(
      "/wiki/openai?q=claude&type=entity",
    );
  });
});

describe("wiki explorer URL state", () => {
  it("returns an empty string for default state", () => {
    const search = buildWikiExplorerSearch({});

    expect(search).toBe("");
  });

  it("encodes non-default search query", () => {
    const search = buildWikiExplorerSearch({ query: "claude" });

    expect(search).toBe("?q=claude");
  });

  it("encodes type and tag filters when not the all-default", () => {
    const search = buildWikiExplorerSearch({
      typeFilter: "entity",
      tagFilter: "open-source",
    });

    expect(search).toBe("?tag=open-source&type=entity");
  });

  it("encodes entity and concept topic filters", () => {
    const search = buildWikiExplorerSearch({
      entityFilters: ["cursor", "spacex"],
      conceptFilters: ["coding-agents"],
    });

    expect(search).toBe("?concepts=coding-agents&entities=cursor%2Cspacex");
  });

  it("encodes a non-default sort key", () => {
    const search = buildWikiExplorerSearch({ sort: "updated" });

    expect(search).toBe("?sort=updated");
  });

  it("encodes hidden graph types as a leading-minus list", () => {
    const search = buildWikiExplorerSearch({
      visibleTypes: new Set(["meetup", "entity", "concept", "comparison"]),
    });

    expect(search).toBe("?types=-query");
  });

  it("omits the types param when every type is visible", () => {
    const search = buildWikiExplorerSearch({
      visibleTypes: new Set(WIKI_GRAPH_TYPE_LIST),
    });

    expect(search).not.toContain("types=");
  });

  it("parses a complete explorer state from a search string", () => {
    const parsed = parseWikiExplorerSearch(
      "?q=claude&type=entity&tag=open-source&sort=updated&types=-query&entities=cursor,spacex&concepts=coding-agents",
    );

    expect(parsed).toEqual({
      query: "claude",
      typeFilter: "entity",
      tagFilter: "open-source",
      entityFilters: ["cursor", "spacex"],
      conceptFilters: ["coding-agents"],
      sort: "updated",
      visibleTypes: new Set(["meetup", "entity", "concept", "comparison"]),
    });
  });

  it("falls back to defaults when params are missing or empty", () => {
    const parsed = parseWikiExplorerSearch("");

    expect(parsed).toEqual({
      query: "",
      typeFilter: WIKI_EXPLORER_TYPE_ALL,
      tagFilter: WIKI_EXPLORER_TYPE_ALL,
      entityFilters: [],
      conceptFilters: [],
      sort: WIKI_EXPLORER_SORT_DEFAULT,
      visibleTypes: new Set(WIKI_GRAPH_TYPE_LIST),
    });
  });

  it("ignores invalid sort values and unknown query params", () => {
    const parsed = parseWikiExplorerSearch("?q=&type=&sort=banana&unknown=yes");

    expect(parsed.sort).toBe(WIKI_EXPLORER_SORT_DEFAULT);
    expect(parsed.query).toBe("");
    expect(parsed.typeFilter).toBe(WIKI_EXPLORER_TYPE_ALL);
  });

  it("drops unknown graph type tokens from the negative list", () => {
    const parsed = parseWikiExplorerSearch("?types=-banana");

    expect([...parsed.visibleTypes].sort()).toEqual([...WIKI_GRAPH_TYPE_LIST].sort());
  });

  it("exposes the supported sort keys for downstream validation", () => {
    expect([...WIKI_EXPLORER_SORT_KEYS]).toEqual(
      expect.arrayContaining(["title", "updated", "connections", "sources"]),
    );
  });
});
