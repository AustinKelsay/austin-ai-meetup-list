import { describe, expect, it } from "vitest";
import { getGroupOrder, groupPagesByType } from "./wikiCatalogGroups.js";

function page(type, id) {
  return { id, type, title: `${id}` };
}

describe("wikiCatalogGroups", () => {
  it("groups pages by type and keeps a stable default order", () => {
    const pages = [
      page("entity", "anthropic"),
      page("meetup", "june-10"),
      page("concept", "agent-infra"),
      page("entity", "openai"),
    ];

    const groups = groupPagesByType(pages, ["meetup", "entity", "concept"]);

    expect(groups.map((group) => group.type)).toEqual(["meetup", "entity", "concept"]);
    expect(groups[0].pages.map((p) => p.id)).toEqual(["june-10"]);
    expect(groups[1].pages.map((p) => p.id)).toEqual(["anthropic", "openai"]);
    expect(groups[2].pages.map((p) => p.id)).toEqual(["agent-infra"]);
  });

  it("drops empty groups", () => {
    const groups = groupPagesByType([page("entity", "openai")], ["entity", "concept"]);

    expect(groups.map((g) => g.type)).toEqual(["entity"]);
  });

  it("appends unknown types at the end of the order", () => {
    const order = getGroupOrder(["concept", "experimental"]);

    expect(order).toContain("concept");
    expect(order.indexOf("concept")).toBeLessThan(order.indexOf("experimental"));
  });

  it("handles pages whose type is not in the provided known set", () => {
    const groups = groupPagesByType([page("experimental", "x")], ["entity"]);

    expect(groups).toHaveLength(1);
    expect(groups[0].type).toBe("experimental");
  });

  it("can order groups by the first ranked page match during search", () => {
    const pages = [
      page("entity", "cursor"),
      page("query", "cursor-spacex"),
      page("meetup", "may-27"),
      page("entity", "spacex"),
    ];

    const groups = groupPagesByType(pages, ["meetup", "entity", "query"], {
      preserveFirstMatchOrder: true,
    });

    expect(groups.map((group) => group.type)).toEqual(["entity", "query", "meetup"]);
    expect(groups[0].pages.map((p) => p.id)).toEqual(["cursor", "spacex"]);
  });
});
