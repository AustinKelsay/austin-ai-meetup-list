import { describe, expect, it } from "vitest";
import { APP_ROUTE } from "./constants.js";
import { buildWikiPath, getAppRoute } from "./routes.js";

describe("wiki routes", () => {
  it("resolves the wiki explorer route", () => {
    expect(getAppRoute("/wiki")).toEqual({ name: APP_ROUTE.WIKI, wikiId: null });
  });

  it("resolves focused wiki page routes", () => {
    expect(getAppRoute("/wiki/openai")).toEqual({
      name: APP_ROUTE.WIKI,
      wikiId: "openai",
    });
  });

  it("falls back home for malformed focused wiki routes", () => {
    expect(getAppRoute("/wiki/%E0%A4%A")).toEqual({ name: APP_ROUTE.HOME });
  });

  it("builds focused wiki page paths", () => {
    expect(buildWikiPath("coding agents")).toBe("/wiki/coding%20agents");
  });
});
