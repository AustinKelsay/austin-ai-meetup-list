import { describe, expect, it, vi } from "vitest";
import {
  areAllTypesVisible,
  getDefaultVisibleTypes,
  getVisibleNodeIds,
  isLinkVisible,
  isNodeTypeVisible,
  resetVisibleTypes,
  resolveGraphFocusId,
  showOnlyType,
  toggleVisibleType,
  WIKI_GRAPH_TYPE_LIST,
} from "./wikiGraphFilters.js";
import { WIKI_GRAPH_TYPES } from "./wikiGraphTypes.js";

describe("wikiGraphFilters", () => {
  it("defaults to all graph types visible", () => {
    const visible = getDefaultVisibleTypes();

    expect(visible.size).toBe(WIKI_GRAPH_TYPES.length);
    WIKI_GRAPH_TYPE_LIST.forEach((type) => {
      expect(visible.has(type)).toBe(true);
    });
  });

  it("exposes the same type list as the legend config", () => {
    const legendTypes = WIKI_GRAPH_TYPES.map((entry) => entry.type);

    expect(WIKI_GRAPH_TYPE_LIST).toEqual(legendTypes);
  });

  it("toggles a visible type off and a hidden type on", () => {
    const start = new Set(["meetup", "entity"]);
    const removed = toggleVisibleType(start, "meetup");
    const added = toggleVisibleType(start, "concept");

    expect(removed.has("meetup")).toBe(false);
    expect(removed.has("entity")).toBe(true);
    expect(added.has("concept")).toBe(true);
    expect(added.has("entity")).toBe(true);
    expect(added.has("meetup")).toBe(true);
  });

  it("returns a new set instance so callers can rely on referential change", () => {
    const start = new Set(["meetup"]);
    const next = toggleVisibleType(start, "meetup");

    expect(next).not.toBe(start);
  });

  it("detects when every type is visible", () => {
    expect(areAllTypesVisible(getDefaultVisibleTypes())).toBe(true);
    expect(areAllTypesVisible(new Set(["meetup"]))).toBe(false);
    expect(areAllTypesVisible(new Set())).toBe(false);
  });

  it("can collapse to a single type or reset back to all", () => {
    const only = showOnlyType(getDefaultVisibleTypes(), "entity");
    expect([...only]).toEqual(["entity"]);

    const reset = resetVisibleTypes();
    expect(areAllTypesVisible(reset)).toBe(true);
  });

  it("does not mutate the input set when toggling", () => {
    const start = new Set(["meetup", "entity"]);
    const snapshot = [...start];
    toggleVisibleType(start, "concept");

    expect([...start]).toEqual(snapshot);
  });

  it("checks node type visibility individually", () => {
    const visible = new Set(["meetup", "entity"]);

    expect(isNodeTypeVisible(visible, "meetup")).toBe(true);
    expect(isNodeTypeVisible(visible, "concept")).toBe(false);
  });

  it("computes visible node ids from a node list and visible types", () => {
    const nodes = [
      { id: "a", type: "meetup" },
      { id: "b", type: "entity" },
      { id: "c", type: "concept" },
      { id: "d", type: "comparison" },
    ];

    const visible = getVisibleNodeIds(nodes, new Set(["meetup", "entity"]));

    expect([...visible]).toEqual(["a", "b"]);
  });

  it("hides links when either endpoint is hidden", () => {
    const visibleNodeIds = new Set(["a", "b"]);
    const visibleLink = { source: "a", target: "b" };
    const hiddenLink = { source: "a", target: "c" };
    const reverseHiddenLink = { source: "c", target: "a" };
    const objectLink = { source: { id: "a" }, target: { id: "b" } };

    expect(isLinkVisible(visibleLink, visibleNodeIds)).toBe(true);
    expect(isLinkVisible(hiddenLink, visibleNodeIds)).toBe(false);
    expect(isLinkVisible(reverseHiddenLink, visibleNodeIds)).toBe(false);
    expect(isLinkVisible(objectLink, visibleNodeIds)).toBe(true);
  });

  it("resolves graph focus to a visible neighbor for off-legend pages", () => {
    const pagesById = {
      summary: {
        id: "summary",
        type: "summary",
        outgoingIds: ["meetup"],
        backlinkIds: [],
      },
      meetup: { id: "meetup", type: "meetup", outgoingIds: [], backlinkIds: ["summary"] },
      hidden: { id: "hidden", type: "summary", outgoingIds: [], backlinkIds: [] },
    };
    const visible = new Set(["meetup", "entity"]);

    expect(resolveGraphFocusId(pagesById.summary, pagesById, visible)).toBe("meetup");
    expect(resolveGraphFocusId(pagesById.meetup, pagesById, visible)).toBe("meetup");
    expect(resolveGraphFocusId(pagesById.hidden, pagesById, visible)).toBeNull();
    expect(resolveGraphFocusId(null, pagesById, visible)).toBeNull();
  });
});
