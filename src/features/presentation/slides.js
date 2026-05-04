import {
  buildSlideHash,
  getSlideRouteSlug,
  getSlideTrackRouteSlug,
  parseSlideHash,
} from "../../app/routes.js";

export function buildSlides(meetup, options = {}) {
  const { includeOpenCommunitySlot = false } = options;
  const slides = [];
  const showcases = meetup.showcases ?? [];
  const includeCommunitySlot = Boolean(showcases.length || includeOpenCommunitySlot);
  const trackTotal = meetup.tracks.length + (includeCommunitySlot ? 1 : 0);

  if (meetup.presentationIntro) {
    slides.push({
      type: "meetup-intro",
      intro: meetup.presentationIntro,
    });
  }

  meetup.tracks.forEach((track, trackIndex) => {
    slides.push({
      type: "track-title",
      track,
      trackIndex,
      trackTotal,
    });

    track.items.forEach((item, itemIndex) => {
      slides.push({
        type: "topic",
        track,
        trackIndex,
        trackTotal,
        item,
        itemIndex,
        itemTotal: track.items.length,
        isLastInTrack: itemIndex === track.items.length - 1,
      });
    });

    if (track.outro) {
      slides.push({
        type: "track-outro",
        track,
        trackIndex,
        trackTotal,
        outro: track.outro,
      });
    }
  });

  if (!includeCommunitySlot) {
    return slides;
  }

  slides.push({
    type: "community-title",
    itemTotal: showcases.length,
    trackIndex: meetup.tracks.length,
    trackTotal,
  });

  if (showcases.length) {
    showcases.forEach((item, itemIndex) => {
      slides.push({
        type: "community-topic",
        item,
        itemIndex,
        itemTotal: showcases.length,
        trackIndex: meetup.tracks.length,
        trackTotal,
        isLastInTrack: itemIndex === showcases.length - 1,
      });
    });
  }

  return slides;
}

export function findSlideIndex(meetup, route, options = {}) {
  const slides = buildSlides(meetup, options);

  return slides.findIndex(
    (slide) =>
      getSlideTrackRouteSlug(slide) === route.trackSlug &&
      getSlideRouteSlug(slide) === route.slideSlug,
  );
}

export function findTopicSlideIndex(meetup, item, options = {}) {
  const slides = buildSlides(meetup, options);

  return slides.findIndex(
    (slide) =>
      (slide.type === "topic" || slide.type === "community-topic") &&
      slide.item === item,
  );
}

export function resolvePresentationHash(meetupList, hash, options = {}) {
  const { includeOpenCommunitySlotForMeetupId = null } = options;
  const route = parseSlideHash(hash);

  if (!route) {
    return null;
  }

  const meetup = meetupList.find((candidate) => candidate.slug === route.meetupSlug);
  if (!meetup) {
    return {
      invalidHash: "",
    };
  }

  const slideIndex = findSlideIndex(meetup, route, {
    includeOpenCommunitySlot: meetup.id === includeOpenCommunitySlotForMeetupId,
  });
  if (slideIndex === -1) {
    return {
      invalidHash: "",
    };
  }

  return { meetup, slideIndex };
}

export { buildSlideHash };
