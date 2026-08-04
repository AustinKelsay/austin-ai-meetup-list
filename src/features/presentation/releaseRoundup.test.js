/**
 * Convention checks for official Closed/Open model-release roundups.
 */
import { describe, expect, it } from "vitest";
import { meetups } from "../../data.js";
import { buildSlides } from "./slides.js";
import { getPresentationItemMedia } from "./content.jsx";

const ROUNDUP_TITLES = ["Closed model releases", "Open model releases"];

/**
 * Finds the Models & Research track on a meetup.
 * @param {object} meetup Meetup Data entry
 * @returns {object} Models & Research track
 */
function getModelsTrack(meetup) {
  const track = meetup.tracks.find((entry) => entry.title === "Models & Research");
  if (!track) throw new Error(`Missing Models & Research on ${meetup.id}`);
  return track;
}

describe("official model-release roundups", () => {
  for (const meetupId of ["meetup-2026-08-05", "meetup-2026-07-22"]) {
    it(`${meetupId} leads Models & Research with Closed then Open Release Roundups`, () => {
      const meetup = meetups.find((entry) => entry.id === meetupId);
      expect(meetup).toBeTruthy();

      const models = getModelsTrack(meetup);
      const [closed, open] = models.items;

      expect(closed.title).toBe("Closed model releases");
      expect(open.title).toBe("Open model releases");
      expect(closed.releaseRoundup).toBe(true);
      expect(open.releaseRoundup).toBe(true);
      expect(closed.presentationEmbeds).toBeUndefined();
      expect(open.presentationEmbeds).toBeUndefined();
      expect(closed.presentationLinkPair).toBeUndefined();
      expect(open.presentationLinkPair).toBeUndefined();
    });

    it(`${meetupId} Presentation Mode keeps the full Closed/Open catalogs`, () => {
      const meetup = meetups.find((entry) => entry.id === meetupId);
      const models = getModelsTrack(meetup);

      for (const title of ROUNDUP_TITLES) {
        const item = models.items.find((entry) => entry.title === title);
        const media = getPresentationItemMedia(item);

        expect(media.embeds.length).toBeGreaterThan(0);
        expect(media.links.length).toBeGreaterThan(0);
        expect(media.showPrimaryLink).toBe(false);

        const expectedEmbedCount =
          (item.embeds?.length ?? 0) + (item.embed ? 1 : 0);
        expect(media.embeds.length).toBe(expectedEmbedCount);
      }
    });

    it(`${meetupId} slide deck places the roundups first in Models & Research`, () => {
      const meetup = meetups.find((entry) => entry.id === meetupId);
      const slides = buildSlides(meetup, { includeOpenCommunitySlot: true });
      const modelsTitleIndex = slides.findIndex(
        (slide) =>
          slide.type === "track-title" && slide.track.title === "Models & Research",
      );
      expect(modelsTitleIndex).toBeGreaterThanOrEqual(0);

      const firstTopic = slides[modelsTitleIndex + 1];
      const secondTopic = slides[modelsTitleIndex + 2];
      expect(firstTopic.type).toBe("topic");
      expect(secondTopic.type).toBe("topic");
      expect(firstTopic.item.title).toBe("Closed model releases");
      expect(secondTopic.item.title).toBe("Open model releases");
      expect(firstTopic.item.releaseRoundup).toBe(true);
      expect(secondTopic.item.releaseRoundup).toBe(true);
    });
  }
});
