import { buildWikiExplorerSearch } from "../../app/routes.js";

export function getReadableWikiText(value) {
  return String(value ?? "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeTopicTitle(value) {
  return getReadableWikiText(value).toLowerCase();
}

export function getMeetupTopicLookupKey(meetupSlug, topicTitle) {
  return `${meetupSlug}::${normalizeTopicTitle(topicTitle)}`;
}

export function buildMeetupTopicLookup(manifest) {
  const lookup = new Map();

  for (const topic of manifest?.topics ?? []) {
    lookup.set(getMeetupTopicLookupKey(topic.meetupSlug, topic.title), topic);
  }

  return lookup;
}

export function getTopicWikiPages(topic, pagesById) {
  return (topic?.wikiIds ?? []).map((id) => pagesById?.[id]).filter(Boolean);
}

export function buildTopicExplorerSearch(topic, pagesById) {
  const pages = getTopicWikiPages(topic, pagesById);
  const entityFilters = pages.filter((page) => page.type === "entity").map((page) => page.id);
  const conceptFilters = pages.filter((page) => page.type === "concept").map((page) => page.id);

  return buildWikiExplorerSearch({ entityFilters, conceptFilters });
}
