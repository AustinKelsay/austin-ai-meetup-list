import { WIKI_GRAPH_TYPES } from "./wikiGraphTypes.js";

export const WIKI_GRAPH_TYPE_LIST = WIKI_GRAPH_TYPES.map((entry) => entry.type);

export function getDefaultVisibleTypes() {
  return new Set(WIKI_GRAPH_TYPE_LIST);
}

export function toggleVisibleType(visibleTypes, type) {
  const next = new Set(visibleTypes);

  if (next.has(type)) {
    next.delete(type);
  } else {
    next.add(type);
  }

  return next;
}

export function areAllTypesVisible(visibleTypes) {
  return WIKI_GRAPH_TYPE_LIST.every((type) => visibleTypes.has(type));
}

export function showOnlyType(visibleTypes, type) {
  return new Set([type]);
}

export function resetVisibleTypes() {
  return getDefaultVisibleTypes();
}

export function isNodeTypeVisible(visibleTypes, type) {
  return visibleTypes.has(type);
}

export function getVisibleNodeIds(nodes, visibleTypes) {
  return new Set(
    nodes.filter((node) => visibleTypes.has(node.type)).map((node) => node.id),
  );
}

export function isLinkVisible(link, visibleNodeIds) {
  return visibleNodeIds.has(link.source?.id ?? link.source) && visibleNodeIds.has(link.target?.id ?? link.target);
}

/**
 * Picks which graph node should receive focus for a selected wiki page.
 * Pages whose type is off the legend (e.g. summary) fall back to their first
 * visible neighbor so the camera does not center on a hidden node.
 *
 * @param {{ id: string, type: string, outgoingIds?: string[], backlinkIds?: string[] } | null} selectedPage
 * @param {Record<string, { id: string, type: string }>} pagesById
 * @param {Set<string>} visibleTypes
 * @returns {string | null}
 */
export function resolveGraphFocusId(selectedPage, pagesById, visibleTypes) {
  if (!selectedPage) {
    return null;
  }

  if (visibleTypes.has(selectedPage.type)) {
    return selectedPage.id;
  }

  const neighborIds = [...(selectedPage.outgoingIds ?? []), ...(selectedPage.backlinkIds ?? [])];

  for (const id of neighborIds) {
    const neighbor = pagesById[id];
    if (neighbor && visibleTypes.has(neighbor.type)) {
      return neighbor.id;
    }
  }

  return null;
}
