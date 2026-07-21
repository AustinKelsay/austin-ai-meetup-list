export function getWikiSourceLinkLabel(href) {
  try {
    const url = new URL(href);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return href;
  }
}

export function buildWikiSourceItems(page) {
  const links = page.sourceLinks ?? [];
  const references = page.sourceReferences ?? [];
  const referencedTopicSources = page.referencedTopicSources ?? [];
  const directItems =
    references.length > 0
      ? references.map((reference) => ({
          ...reference,
          provenance: "Direct",
          provenanceType: "direct",
          meetup: page.type === "meetup" ? page.title : null,
          track: reference.section === "source" ? null : reference.section,
          topicTitle: reference.title,
        }))
      : links.map((href) => ({
          href,
          title: getWikiSourceLinkLabel(href),
          section: "source",
          provenance: "Direct",
          provenanceType: "direct",
          meetup: page.type === "meetup" ? page.title : null,
          track: null,
          topicTitle: null,
        }));

  const referencedItems = referencedTopicSources.map((reference) => ({
    ...reference,
    provenance: reference.sourcePageTitle
      ? `From ${reference.sourcePageTitle}`
      : "From referenced topic",
    provenanceType: "referenced",
    meetup: reference.sourcePageTitle ?? null,
    track: reference.section === "source" ? null : reference.section,
    topicTitle: reference.title ?? null,
  }));

  return [...directItems, ...referencedItems];
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function buildWikiSourceFilterOptions(items) {
  return {
    meetups: uniqueSorted(items.map((item) => item.meetup)),
    tracks: uniqueSorted(items.map((item) => item.track)),
    topicTitles: uniqueSorted(items.map((item) => item.topicTitle)),
  };
}

export function filterWikiSourceItems(items, filters = {}) {
  return items.filter((item) => {
    if (filters.provenance && filters.provenance !== "all") {
      if (item.provenanceType !== filters.provenance) {
        return false;
      }
    }

    if (filters.meetup && item.meetup !== filters.meetup) {
      return false;
    }

    if (filters.track && item.track !== filters.track) {
      return false;
    }

    if (filters.topicTitle && item.topicTitle !== filters.topicTitle) {
      return false;
    }

    return true;
  });
}
