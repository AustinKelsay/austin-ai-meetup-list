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

function normalizeSearch(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getSearchTokens(normalizedQuery) {
  return normalizedQuery.split(/\s+/).filter(Boolean);
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

function scoreTextField(value, tokens, phrase, weights) {
  const text = normalizeSearch(value);

  if (!text) {
    return 0;
  }

  let score = 0;

  if (text === phrase) {
    score += weights.exact ?? 0;
  } else if (phrase && text.includes(phrase)) {
    score += weights.phrase ?? 0;
  }

  const matchingTokens = tokens.filter((token) => text.includes(token)).length;

  if (matchingTokens === tokens.length) {
    score += weights.allTokens ?? 0;
  }

  score += matchingTokens * (weights.token ?? 0);
  return score;
}

function scorePageSearch(page, normalizedQuery, pagesById) {
  const tokens = getSearchTokens(normalizedQuery);

  if (tokens.length === 0) {
    return 0;
  }

  let score = 0;

  score += scoreTextField(page.title, tokens, normalizedQuery, {
    exact: 1200,
    phrase: 760,
    allTokens: 420,
    token: 120,
  });
  score += scoreTextField(page.excerpt, tokens, normalizedQuery, {
    phrase: 180,
    allTokens: 80,
    token: 18,
  });
  score += scoreTextField((page.tags ?? []).join(" "), tokens, normalizedQuery, {
    phrase: 120,
    allTokens: 60,
    token: 20,
  });
  score += scoreTextField(getOutgoingTitles(page, pagesById), tokens, normalizedQuery, {
    phrase: 150,
    allTokens: 70,
    token: 18,
  });
  score += scoreTextField(getBacklinkTitles(page, pagesById), tokens, normalizedQuery, {
    phrase: 150,
    allTokens: 70,
    token: 18,
  });
  score += scoreTextField(getReferencedSourceTitles(page), tokens, normalizedQuery, {
    phrase: 210,
    allTokens: 110,
    token: 28,
  });
  score += scoreTextField(getSourceLinkHrefs(page), tokens, normalizedQuery, {
    phrase: 90,
    allTokens: 35,
    token: 8,
  });
  score += scoreTextField(getSourceReferenceContext(page), tokens, normalizedQuery, {
    phrase: 120,
    allTokens: 50,
    token: 14,
  });

  if (page.type === "summary") {
    score -= 80;
  } else if (page.type === "meetup") {
    score -= 25;
  }

  return score;
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
  const normalized = normalizeSearch(query);

  if (!normalized) {
    return pages;
  }

  return pages
    .map((page, index) => ({
      page,
      index,
      score: scorePageSearch(page, normalized, pagesById),
    }))
    .filter(({ page }) => matchesPageSearch(page, normalized, pagesById))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ page }) => page);
}
