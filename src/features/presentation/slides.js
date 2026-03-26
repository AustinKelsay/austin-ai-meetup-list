import {
  buildSlideHash,
  getSlideRouteSlug,
  getSlideTrackRouteSlug,
  parseSlideHash,
} from "../../app/routes.js";

export function buildSlides(session) {
  const slides = [];
  const showcases = session.showcases ?? [];

  if (session.presentationIntro) {
    slides.push({
      type: "session-intro",
      intro: session.presentationIntro,
    });
  }

  session.tracks.forEach((track, trackIndex) => {
    slides.push({
      type: "track-title",
      track,
      trackIndex,
      trackTotal: session.tracks.length,
    });

    track.items.forEach((item, itemIndex) => {
      slides.push({
        type: "topic",
        track,
        trackIndex,
        trackTotal: session.tracks.length,
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
        trackTotal: session.tracks.length,
        outro: track.outro,
      });
    }
  });

  slides.push({
    type: "community-title",
    itemTotal: showcases.length,
    trackIndex: session.tracks.length,
    trackTotal: session.tracks.length + 1,
  });

  if (showcases.length) {
    showcases.forEach((item, itemIndex) => {
      slides.push({
        type: "community-topic",
        item,
        itemIndex,
        itemTotal: showcases.length,
        trackIndex: session.tracks.length,
        trackTotal: session.tracks.length + 1,
        isLastInTrack: itemIndex === showcases.length - 1,
      });
    });
  }

  return slides;
}

export function findSlideIndex(session, route) {
  const slides = buildSlides(session);

  return slides.findIndex(
    (slide) =>
      getSlideTrackRouteSlug(slide) === route.trackSlug &&
      getSlideRouteSlug(slide) === route.slideSlug,
  );
}

export function resolvePresentationHash(sessionList, hash) {
  const route = parseSlideHash(hash);

  if (!route) {
    return null;
  }

  const session = sessionList.find((candidate) => candidate.slug === route.sessionSlug);
  if (!session) {
    return {
      invalidHash: sessionList[0] ? `#${sessionList[0].id}` : "",
    };
  }

  const slideIndex = findSlideIndex(session, route);
  if (slideIndex === -1) {
    return {
      invalidHash: `#${session.id}`,
    };
  }

  return { session, slideIndex };
}

export { buildSlideHash };
