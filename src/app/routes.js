import {
  APP_ROUTE,
  CALENDAR_PATH,
  LINK_SUBMISSION_PATH,
  MEETUP_PATH_PREFIX,
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

export function buildMeetupPath(slug) {
  return `${MEETUP_PATH_PREFIX}/${encodeURIComponent(slug)}`;
}

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getAppRoute(pathname) {
  const normalized = normalizePathname(pathname);

  if (normalized === CALENDAR_PATH) {
    return { name: APP_ROUTE.CALENDAR };
  }

  if (normalized === LINK_SUBMISSION_PATH) {
    return { name: APP_ROUTE.SUBMIT_LINK };
  }

  if (normalized === SHOWCASE_SUBMISSION_PATH) {
    return { name: APP_ROUTE.SUBMIT_SHOWCASE };
  }

  const meetupPrefix = `${MEETUP_PATH_PREFIX}/`;
  if (normalized.startsWith(meetupPrefix)) {
    const meetupSlug = normalized.slice(meetupPrefix.length);
    if (meetupSlug && !meetupSlug.includes("/")) {
      return {
        name: APP_ROUTE.MEETUP,
        meetupSlug: decodeURIComponent(meetupSlug),
      };
    }
  }

  return { name: APP_ROUTE.HOME };
}

export function setHash(hash) {
  if (window.location.hash === hash) {
    return;
  }

  window.location.hash = hash;
}

export function setPathname(pathname, options = {}) {
  const { replace = false, hash = window.location.hash, state = window.history.state } = options;
  const nextHash = hash
    ? hash.startsWith("#")
      ? hash
      : `#${hash}`
    : "";
  const nextUrl = `${pathname}${nextHash}`;

  if (`${window.location.pathname}${window.location.hash}` === nextUrl) {
    return;
  }

  const method = replace ? "replaceState" : "pushState";
  window.history[method](state, "", nextUrl);
}
