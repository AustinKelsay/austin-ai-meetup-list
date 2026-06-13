import { describe, expect, it } from "vitest";
import {
  BASE_NODE_VAL,
  buildNodeTooltip,
  DEGREE_VAL_MULTIPLIER,
  getLinkColor,
  getLinkParticleCount,
  getLinkWidth,
  getNodeColor,
  getNodeVal,
  SELECTED_NODE_VAL,
} from "./wikiGraphVisuals.js";

describe("wikiGraphVisuals", () => {
  it("scales node size by degree when not selected", () => {
    expect(getNodeVal({ id: "a", degree: 0 }, "x")).toBe(BASE_NODE_VAL);
    expect(getNodeVal({ id: "a", degree: 5 }, "x")).toBeCloseTo(
      BASE_NODE_VAL + 5 * DEGREE_VAL_MULTIPLIER,
    );
  });

  it("forces a flat selected size regardless of degree", () => {
    expect(getNodeVal({ id: "a", degree: 30 }, "a")).toBe(SELECTED_NODE_VAL);
  });

  it("uses the type color or falls back to neutral", () => {
    const colors = { entity: "#47d4f3" };
    expect(getNodeColor({ id: "a", type: "entity" }, "x", colors)).toBe("#47d4f3");
    expect(getNodeColor({ id: "a", type: "concept" }, "x", colors)).toBe("#9fb8b0");
  });

  it("overrides the node color when selected", () => {
    expect(getNodeColor({ id: "a", type: "entity" }, "a", { entity: "#47d4f3" })).toBe("#ffffff");
  });

  it("styles topic links brighter and wider than wiki links", () => {
    expect(getLinkColor({ kind: "topic" })).toContain("71, 212, 243");
    expect(getLinkColor({ kind: "wiki" })).toContain("159, 184, 176");
    expect(getLinkWidth({ kind: "topic" })).toBeGreaterThan(getLinkWidth({ kind: "wiki" }));
    expect(getLinkParticleCount({ kind: "topic" })).toBe(1);
    expect(getLinkParticleCount({ kind: "wiki" })).toBe(0);
  });

  it("builds a tooltip with title, type, and link count", () => {
    const tooltip = buildNodeTooltip({ label: "OpenAI", type: "entity", degree: 4 });

    expect(tooltip).toContain("OpenAI");
    expect(tooltip).toContain("entity");
    expect(tooltip).toContain("4 links");
    expect(tooltip).toContain("wiki-graph-tooltip");
  });

  it("uses singular link label for single-degree nodes", () => {
    const tooltip = buildNodeTooltip({ label: "Apple", type: "entity", degree: 1 });

    expect(tooltip).toContain("1 link<");
    expect(tooltip).not.toContain("1 links");
  });

  it("escapes HTML in tooltip labels", () => {
    const tooltip = buildNodeTooltip({ label: "<img src=x>", type: "entity", degree: 1 });

    expect(tooltip).toContain("&lt;img src=x&gt;");
    expect(tooltip).not.toContain("<img src=x>");
  });
});
