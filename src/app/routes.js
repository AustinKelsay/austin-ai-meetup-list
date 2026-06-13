import {
  APP_ROUTE,
  CALENDAR_PATH,
  LINK_SUBMISSION_PATH,
  MEETUP_PATH_PREFIX,
  SHOWCASE_SUBMISSION_PATH,
  WIKI_EXPLORER_SORT_DEFAULT,
  WIKI_EXPLORER_SORT_KEYS,
  WIKI_EXPLORER_TYPE_ALL,
  WIKI_PATH_PREFIX,
} from "./constants.js";
import { slugify } from "../lib/meetup-ui.js";
import {
  getDefaultVisibleTypes,
  WIKI_GRAPH_TYPE_LIST,
} from "../features/wiki/wikiGraphFilters.js";

export { WIKI_EXPLORER_TYPE_ALL, WIKI_EXPLORER_SORT_DEFAULT, WIKI_EXPLORER_SORT_KEYS };

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
  if (slide.type === "meetup-intro") {
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

export function buildSlideHash(meetup, slide) {
  return `#/slides/${meetup.slug}/${getSlideTrackRouteSlug(slide)}/${getSlideRouteSlug(slide)}`;
}

export function parseSlideHash(hash) {
  const normalized = (hash || "").replace(/^#\/?/, "");
  const parts = normalized.split("/").filter(Boolean);

  if (parts[0] !== "slides" || parts.length < 4) {
    return null;
  }

  const [, meetupSlug, trackSlug, slideSlug] = parts;

  return {
    meetupSlug: decodeURIComponent(meetupSlug),
    trackSlug: decodeURIComponent(trackSlug),
    slideSlug: decodeURIComponent(slideSlug),
  };
}

export function buildMeetupPath(slug) {
  return `${MEETUP_PATH_PREFIX}/${encodeURIComponent(slug)}`;
}

export function buildWikiPath(id, search = "") {
  const base = id ? `${WIKI_PATH_PREFIX}/${encodeURIComponent(id)}` : WIKI_PATH_PREFIX;

  if (!search) {
    return base;
  }

  return `${base}?${search.replace(/^\?/, "")}`;
}

function sortParamsByKey(entries) {
  return entries.sort(([a], [b]) => a.localeCompare(b));
}

export function buildWikiExplorerSearch({
  query = "",
  typeFilter = WIKI_EXPLORER_TYPE_ALL,
  tagFilter = WIKI_EXPLORER_TYPE_ALL,
  sort = WIKI_EXPLORER_SORT_DEFAULT,
  visibleTypes = getDefaultVisibleTypes(),
} = {}) {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  if (typeFilter !== WIKI_EXPLORER_TYPE_ALL) {
    params.set("type", typeFilter);
  }

  if (tagFilter !== WIKI_EXPLORER_TYPE_ALL) {
    params.set("tag", tagFilter);
  }

  if (sort !== WIKI_EXPLORER_SORT_DEFAULT) {
    params.set("sort", sort);
  }

  const knownVisible = new Set(WIKI_GRAPH_TYPE_LIST);
  const hiddenTypes = WIKI_GRAPH_TYPE_LIST.filter((type) => !visibleTypes.has(type) && knownVisible.has(type));

  if (hiddenTypes.length > 0 && hiddenTypes.length < WIKI_GRAPH_TYPE_LIST.length) {
    params.set("types", hiddenTypes.map((type) => `-${type}`).join(","));
  }

  const sorted = sortParamsByKey([...params.entries()]);
  const rebuilt = new URLSearchParams();

  for (const [key, value] of sorted) {
    rebuilt.set(key, value);
  }

  const serialized = rebuilt.toString();

  return serialized ? `?${serialized}` : "";
}

export function parseWikiExplorerSearch(search = "") {
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  const query = params.get("q")?.trim() ?? "";
  const typeFilter = params.get("type")?.trim() || WIKI_EXPLORER_TYPE_ALL;
  const tagFilter = params.get("tag")?.trim() || WIKI_EXPLORER_TYPE_ALL;
  const sortParam = params.get("sort")?.trim();
  const sort =
    sortParam && WIKI_EXPLORER_SORT_KEYS.has(sortParam) ? sortParam : WIKI_EXPLORER_SORT_DEFAULT;

  const visibleTypes = getDefaultVisibleTypes();
  const typesParam = params.get("types");

  if (typesParam) {
    for (const rawToken of typesParam.split(",")) {
      const token = rawToken.trim();
      if (!token) {
        continue;
      }

      const isHidden = token.startsWith("-");
      const type = isHidden ? token.slice(1) : token.startsWith("+") ? token.slice(1) : token;

      if (!WIKI_GRAPH_TYPE_LIST.includes(type)) {
        continue;
      }

      if (isHidden) {
        visibleTypes.delete(type);
      } else {
        visibleTypes.add(type);
      }
    }
  }

  return {
    query,
    typeFilter,
    tagFilter,
    sort,
    visibleTypes,
  };
}

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getAppRoute(pathnameOrUrl) {
  let normalizedPath = pathnameOrUrl;
  let search = "";

  if (typeof pathnameOrUrl === "string") {
    const queryIndex = pathnameOrUrl.indexOf("?");

    if (queryIndex !== -1) {
      normalizedPath = pathnameOrUrl.slice(0, queryIndex);
      search = pathnameOrUrl.slice(queryIndex);
    }
  }

  const normalized = normalizePathname(normalizedPath);

  if (normalized === CALENDAR_PATH) {
    return { name: APP_ROUTE.CALENDAR };
  }

  if (normalized === WIKI_PATH_PREFIX) {
    return { name: APP_ROUTE.WIKI, wikiId: null, search };
  }

  const wikiPrefix = `${WIKI_PATH_PREFIX}/`;
  if (normalized.startsWith(wikiPrefix)) {
    const wikiId = normalized.slice(wikiPrefix.length);
    if (wikiId && !wikiId.includes("/")) {
      try {
        return {
          name: APP_ROUTE.WIKI,
          wikiId: decodeURIComponent(wikiId),
          search,
        };
      } catch {
        return { name: APP_ROUTE.HOME };
      }
    }
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
      try {
        return {
          name: APP_ROUTE.MEETUP,
          meetupSlug: decodeURIComponent(meetupSlug),
        };
      } catch {
        return { name: APP_ROUTE.HOME };
      }
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
  const {
    replace = false,
    hash = window.location.hash,
    search = window.location.search,
    state = null,
  } = options;
  const nextHash = hash
    ? hash.startsWith("#")
      ? hash
      : `#${hash}`
    : "";
  const nextSearch = search || "";
  const nextUrl = `${pathname}${nextSearch}${nextHash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (currentUrl === nextUrl && window.history.state === state) {
    return;
  }

  const method = replace ? "replaceState" : "pushState";
  window.history[method](state, "", nextUrl);
}
