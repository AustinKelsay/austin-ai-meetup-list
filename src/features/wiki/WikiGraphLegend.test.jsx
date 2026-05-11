import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WikiGraphLegend } from "./WikiGraphLegend.jsx";

describe("WikiGraphLegend", () => {
  it("labels the graph node colors by wiki page type", () => {
    const markup = renderToStaticMarkup(<WikiGraphLegend />);

    expect(markup).toContain("Meetup");
    expect(markup).toContain("Entity");
    expect(markup).toContain("Concept");
    expect(markup).toContain("background-color:#47f3aa");
    expect(markup).toContain("background-color:#47d4f3");
    expect(markup).toContain("background-color:#c47df3");
  });
});
