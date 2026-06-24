import { describe, expect, it } from "vitest";
import { getPresentationItemMedia, parseLinkMeta } from "./content.jsx";

const xArticleHref = "https://x.com/i/article/2068794888406376448";

describe("presentation X article links", () => {
  it("classifies X longform URLs separately from posts", () => {
    expect(parseLinkMeta(xArticleHref)).toMatchObject({
      kind: "x-article",
      host: "x.com",
      articleId: "2068794888406376448",
    });
  });

  it("keeps raw X longform URLs as article links instead of tweet embeds", () => {
    const media = getPresentationItemMedia({ href: xArticleHref });

    expect(media.embeds).toEqual([]);
    expect(media.showPrimaryLink).toBe(true);
  });

  it("still auto-embeds regular X status URLs", () => {
    const media = getPresentationItemMedia({
      href: "https://x.com/benthecarman/status/2069442971070566874",
    });

    expect(media.embeds).toHaveLength(1);
    expect(media.showPrimaryLink).toBe(false);
  });
});
