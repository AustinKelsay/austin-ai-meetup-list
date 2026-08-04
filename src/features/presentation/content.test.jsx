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

describe("presentation-specific media curation", () => {
  it("uses the presentation link subset without changing the archive links", () => {
    const archiveLinks = ["https://example.com/one", "https://example.com/two"];
    const presentationLinks = ["https://example.com/two"];
    const media = getPresentationItemMedia({
      linkPair: archiveLinks,
      presentationLinkPair: presentationLinks,
    });

    expect(media.links).toEqual(presentationLinks);
    expect(archiveLinks).toEqual(["https://example.com/one", "https://example.com/two"]);
  });

  it("allows presentation embeds to be reduced independently", () => {
    const media = getPresentationItemMedia({
      embeds: [
        { type: "tweet", href: "https://x.com/example/status/1" },
        { type: "tweet", href: "https://x.com/example/status/2" },
      ],
      presentationEmbeds: [{ type: "tweet", href: "https://x.com/example/status/2" }],
    });

    expect(media.embeds.map((embed) => embed.href)).toEqual([
      "https://x.com/example/status/2",
    ]);
  });

  it("keeps the full release-roundup feed even when presentation subsets exist", () => {
    const media = getPresentationItemMedia({
      releaseRoundup: true,
      href: "https://example.com/primary",
      embeds: [
        { type: "tweet", href: "https://x.com/example/status/1" },
        { type: "tweet", href: "https://x.com/example/status/2" },
      ],
      presentationEmbeds: [{ type: "tweet", href: "https://x.com/example/status/2" }],
      linkPair: ["https://example.com/one", "https://example.com/two"],
      presentationLinkPair: ["https://example.com/two"],
    });

    expect(media.embeds.map((embed) => embed.href)).toEqual([
      "https://x.com/example/status/1",
      "https://x.com/example/status/2",
    ]);
    expect(media.links).toEqual([
      "https://example.com/primary",
      "https://example.com/one",
      "https://example.com/two",
    ]);
    expect(media.showPrimaryLink).toBe(false);
  });
});
