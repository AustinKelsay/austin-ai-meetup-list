function getOutgoingTitles(page, pagesById) {
  if (!page.outgoingIds?.length) {
    return "";
  }
  return page.outgoingIds
    .map((id) => pagesById[id]?.title ?? "")
    .filter(Boolean)
    .join(" ");
}

function getBacklinkTitles(page, pagesById) {
  if (!page.backlinkIds?.length) {
    return "";
  }
  return page.backlinkIds
    .map((id) => pagesById[id]?.title ?? "")
    .filter(Boolean)
    .join(" ");
}

function getReferencedSourceTitles(page) {
  if (!page.referencedTopicSources?.length) {
    return "";
  }
  return page.referencedTopicSources.map((reference) => reference.title).join(" ");
}

function getSourceLinkHrefs(page) {
  if (!page.sourceLinks?.length) {
    return "";
  }
  return page.sourceLinks.join(" ");
}

function getSourceReferenceContext(page) {
  if (!page.sourceReferences?.length) {
    return "";
  }
  return page.sourceReferences
    .flatMap((reference) => [reference.title, reference.section])
    .filter(Boolean)
    .join(" ");
}

function getPageSearchHaystack(page, pagesById) {
  return [
    page.title,
    page.excerpt,
    (page.tags ?? []).join(" "),
    getOutgoingTitles(page, pagesById),
    getBacklinkTitles(page, pagesById),
    getReferencedSourceTitles(page),
    getSourceLinkHrefs(page),
    getSourceReferenceContext(page),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function buildPageSearchHaystack(page, pagesById) {
  return getPageSearchHaystack(page, pagesById);
}

export function matchesPageSearch(page, normalizedQuery, pagesById) {
  if (!normalizedQuery) {
    return true;
  }

  const haystack = getPageSearchHaystack(page, pagesById);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return tokens.every((token) => haystack.includes(token));
}

export function filterPagesByQuery(pages, query, pagesById) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return pages;
  }

  return pages.filter((page) => matchesPageSearch(page, normalized, pagesById));
}
