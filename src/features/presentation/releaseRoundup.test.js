/**
 * Convention checks for official Closed/Open model-release roundups.
 */
import { describe, expect, it } from "vitest";
import { meetups } from "../../data.js";
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
  const meetupIds = meetups
    .filter((meetup) => meetup.tracks.some((track) => track.title === "Models & Research"))
    .map((meetup) => meetup.id);

  for (const meetupId of meetupIds) {
    it(`${meetupId} leads Models & Research with official Release Roundup Topic(s)`, () => {
      const meetup = meetups.find((entry) => entry.id === meetupId);
      const models = getModelsTrack(meetup);
      const roundups = models.items.filter((item) => item.releaseRoundup);

      expect(roundups.length).toBeGreaterThan(0);
      expect(models.items[0].releaseRoundup).toBe(true);
      expect(ROUNDUP_TITLES).toContain(models.items[0].title);

      for (const item of roundups) {
        expect(ROUNDUP_TITLES).toContain(item.title);
        expect(item.presentationEmbeds).toBeUndefined();
        expect(item.presentationLinkPair).toBeUndefined();
      }

      const closed = roundups.find((item) => item.title === "Closed model releases");
      const open = roundups.find((item) => item.title === "Open model releases");
      if (closed && open) {
        expect(models.items[0].title).toBe("Closed model releases");
        expect(models.items[1].title).toBe("Open model releases");
      }
    });

    it(`${meetupId} Presentation Mode keeps the full roundup catalog(s)`, () => {
      const meetup = meetups.find((entry) => entry.id === meetupId);
      const models = getModelsTrack(meetup);
      const roundups = models.items.filter((item) => item.releaseRoundup);

      for (const item of roundups) {
        const media = getPresentationItemMedia(item);
        expect(media.showPrimaryLink).toBeFalsy();
        // Roundups always expose a source catalog via links and/or embeds.
        expect(media.embeds.length + media.links.length).toBeGreaterThan(0);
      }
    });
  }
});
