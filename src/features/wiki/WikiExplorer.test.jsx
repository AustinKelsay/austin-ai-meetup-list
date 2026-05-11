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

    expect(html).toContain("Source Links");
    expect(html).toContain("href=\"https://openai.com/release\"");
    expect(html).toContain("openai.com/release");
    expect(html).toContain("class=\"wiki-link-label\"");
    expect(html).toContain("example.com/research/extremely-long-model-release-slug");
  });
});
