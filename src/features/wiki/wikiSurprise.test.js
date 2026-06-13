import { describe, expect, it } from "vitest";
import { pickRandomPage } from "./wikiSurprise.js";

function page(id, type = "entity") {
  return { id, type, title: id };
}

describe("pickRandomPage", () => {
  it("returns null when given an empty list", () => {
    expect(pickRandomPage([])).toBeNull();
    expect(pickRandomPage(null)).toBeNull();
  });

  it("skips meetup pages by default", () => {
    const pages = [page("a", "entity"), page("m", "meetup"), page("c", "concept")];
    const picks = new Set();

    for (let i = 0; i < 25; i += 1) {
      picks.add(pickRandomPage(pages).id);
    }

    expect(picks.has("m")).toBe(false);
    expect(picks.size).toBeGreaterThan(1);
  });

  it("respects an excludeId", () => {
    const pages = [page("a", "entity"), page("b", "concept")];
    const picks = new Set();

    for (let i = 0; i < 10; i += 1) {
      picks.add(pickRandomPage(pages, { excludeId: "a" }).id);
    }

    expect(picks.has("a")).toBe(false);
  });

  it("falls back to the full list if the filtered pool is empty", () => {
    const pages = [page("a", "meetup")];
    expect(pickRandomPage(pages, { excludeMeetups: true })).toEqual(pages[0]);
  });
});
