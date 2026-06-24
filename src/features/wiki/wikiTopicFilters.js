function normalizeQuery(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getTopicHaystack(topic) {
  return [
    topic.title,
    topic.section,
    topic.meetupTitle,
    topic.meetupSlug,
    topic.searchText,
    ...(topic.sourceLinks ?? []),
    ...(topic.wikiTitles ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function topicMatchesQuery(topic, query) {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return true;
  }

  const haystack = getTopicHaystack(topic);
  return normalized.split(/\s+/).filter(Boolean).every((token) => haystack.includes(token));
}

function topicMatchesWikiFilters(topic, selectedIds) {
  if (selectedIds.length === 0) {
    return true;
  }

  const topicWikiIds = new Set(topic.wikiIds ?? []);
  return selectedIds.every((id) => topicWikiIds.has(id));
}

export function getSelectedTopicFilterIds({ entityFilters = [], conceptFilters = [] } = {}) {
  return [...entityFilters, ...conceptFilters].filter(Boolean);
}

export function filterTopicsByExplorerState(
  topics,
  { query = "", entityFilters = [], conceptFilters = [] } = {},
) {
  const selectedIds = getSelectedTopicFilterIds({ entityFilters, conceptFilters });

  return topics.filter(
    (topic) => topicMatchesWikiFilters(topic, selectedIds) && topicMatchesQuery(topic, query),
  );
}
