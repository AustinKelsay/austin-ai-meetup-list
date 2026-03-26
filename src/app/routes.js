import {
  APP_ROUTE,
  CALENDAR_PATH,
  LINK_SUBMISSION_PATH,
  SHOWCASE_SUBMISSION_PATH,
} from "./constants.js";
import { slugify } from "../lib/meetup-ui.js";

export function getTrackRouteSlug(track) {
  if (!track) {
    return "welcome";
  }

  return slugify(track.title);
}

export function getSlideTrackRouteSlug(slide) {
  if (slide.type === "community-title" || slide.type === "community-topic") {
    return "community";
  }

  return getTrackRouteSlug(slide.track);
}

export function getSlideRouteSlug(slide) {
  if (slide.type === "session-intro") {
    return "intro";
  }

  if (slide.type === "track-title") {
    return "intro";
  }

  if (slide.type === "track-outro") {
    return "outro";
  }

  if (slide.type === "community-title") {
    return "intro";
  }

  return slugify(slide.item.title);
}

export function buildSlideHash(session, slide) {
  return `#/slides/${session.slug}/${getSlideTrackRouteSlug(slide)}/${getSlideRouteSlug(slide)}`;
}

export function parseSlideHash(hash) {
  const normalized = (hash || "").replace(/^#\/?/, "");
  const parts = normalized.split("/").filter(Boolean);

  if (parts[0] !== "slides" || parts.length < 4) {
    return null;
  }

  const [, sessionSlug, trackSlug, slideSlug] = parts;

  return {
    sessionSlug: decodeURIComponent(sessionSlug),
    trackSlug: decodeURIComponent(trackSlug),
    slideSlug: decodeURIComponent(slideSlug),
  };
}

export function getAppRoute(pathname) {
  if (pathname === CALENDAR_PATH) {
    return APP_ROUTE.CALENDAR;
  }

  if (pathname === LINK_SUBMISSION_PATH) {
    return APP_ROUTE.SUBMIT_LINK;
  }

  if (pathname === SHOWCASE_SUBMISSION_PATH) {
    return APP_ROUTE.SUBMIT_SHOWCASE;
  }

  return APP_ROUTE.HOME;
}

export function setHash(hash) {
  if (window.location.hash === hash) {
    return;
  }

  window.location.hash = hash;
}

export function setPathname(pathname, options = {}) {
  const { replace = false } = options;

  if (window.location.pathname === pathname) {
    return;
  }

  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", pathname);
}
