import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildWikiExplorerSearch,
  buildWikiPath,
  parseWikiExplorerSearch,
  WIKI_EXPLORER_SORT_DEFAULT,
  WIKI_EXPLORER_TYPE_ALL,
} from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";
import ArchiveShell from "../archive/ArchiveShell.jsx";
import { groupPagesByType } from "./wikiCatalogGroups.js";
import { getDefaultVisibleTypes, toggleVisibleType } from "./wikiGraphFilters.js";
import { WikiDetail } from "./WikiDetail.jsx";
import WikiGraph from "./WikiGraph.jsx";
import { WikiGraphLegend } from "./WikiGraphLegend.jsx";
import { WIKI_GRAPH_TYPE_COLORS } from "./wikiGraphTypes.js";
import { filterPagesByQuery } from "./wikiSearch.js";
import { pickRandomPage } from "./wikiSurprise.js";

const TYPE_LABEL_OVERRIDES = {
  meetup: "Meetups",
  entity: "Entities",
  concept: "Concepts",
  comparison: "Comparisons",
  query: "Queries",
  summary: "Source records",
};

function getGroupLabel(type) {
  return TYPE_LABEL_OVERRIDES[type] ?? getPageTypeLabel(type);
}

const ALL = WIKI_EXPLORER_TYPE_ALL;
const SEARCH_INPUT_KEY = "/";

function pluralize(count, singular) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function getPageTypeLabel(type) {
  return type.replace(/-/g, " ");
}

function getCatalogMetric(page) {
  const sourceLinkCount = page.sourceLinks?.length ?? 0;

  if (sourceLinkCount > 0) {
    return { count: sourceLinkCount, label: "links" };
  }

  const relationCount = page.outgoingIds.length + page.backlinkIds.length;

  if (relationCount > 0) {
    return { count: relationCount, label: "refs" };
  }

  return null;
}

function getPageDegree(page) {
  return page.outgoingIds.length + page.backlinkIds.length;
}

function sortPages(pages, sort) {
  const copy = [...pages];

  if (sort === "updated") {
    copy.sort((a, b) => {
      const dateDiff = (b.updated || "").localeCompare(a.updated || "");
      return dateDiff || a.title.localeCompare(b.title);
    });
    return copy;
  }

  if (sort === "connections") {
    copy.sort((a, b) => {
      const diff = getPageDegree(b) - getPageDegree(a);
      return diff || a.title.localeCompare(b.title);
    });
    return copy;
  }

  if (sort === "sources") {
    copy.sort((a, b) => {
      const diff = (b.sourceLinks?.length ?? 0) - (a.sourceLinks?.length ?? 0);
      return diff || a.title.localeCompare(b.title);
    });
    return copy;
  }

  copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
}

function WikiLoading({ onOpenRoute }) {
  return (
    <ArchiveShell onOpenRoute={onOpenRoute} shellClassName="shell--wiki">
      <main className="wiki-shell">
        <section className="wiki-loading">
          <p className="eyebrow">LLM Wiki</p>
          <h2>Loading wiki explorer</h2>
        </section>
      </main>
    </ArchiveShell>
  );
}


function WikiCatalogItem({ page, selected, onOpenRoute }) {
  const metric = getCatalogMetric(page);

  return (
    <RouteLink
      to={buildWikiPath(page.id)}
      onOpenRoute={onOpenRoute}
      className={`wiki-catalog-item ${selected ? "wiki-catalog-item--selected" : ""}`}
    >
      <span className="wiki-catalog-item-copy">
        <strong>{page.title}</strong>
        <small>{getPageTypeLabel(page.type)}</small>
      </span>
      {metric ? (
        <span
          className="wiki-catalog-counts"
          aria-label={`${metric.count} ${metric.label}`}
        >
          <strong>{metric.count}</strong>
          <small>{metric.label}</small>
        </span>
      ) : null}
    </RouteLink>
  );
}

function WikiCatalogGroup({ group, selectedPageId, onOpenRoute }) {
  const color = WIKI_GRAPH_TYPE_COLORS[group.type] ?? "#9fb8b0";
  return (
    <details className="wiki-catalog-group" open>
      <summary>
        <span
          className="wiki-catalog-group-dot"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span className="wiki-catalog-group-label">{getGroupLabel(group.type)}</span>
        <span className="wiki-catalog-group-count">{group.pages.length}</span>
      </summary>
      <div className="wiki-catalog-group-list">
        {group.pages.map((page) => (
          <WikiCatalogItem
            key={page.id}
            page={page}
            selected={page.id === selectedPageId}
            onOpenRoute={onOpenRoute}
          />
        ))}
      </div>
    </details>
  );
}

function getInitialStateFromSearch(search) {
  return parseWikiExplorerSearch(search);
}

export default function WikiExplorer({ manifest, focusedWikiId, search = "", onOpenRoute }) {
  const initial = useMemo(() => getInitialStateFromSearch(search), [search]);
  const [query, setQuery] = useState(initial.query);
  const [typeFilter, setTypeFilter] = useState(initial.typeFilter);
  const [tagFilter, setTagFilter] = useState(initial.tagFilter);
  const [sort, setSort] = useState(initial.sort);
  const [visibleTypes, setVisibleTypes] = useState(initial.visibleTypes);
  const [selectedId, setSelectedId] = useState(focusedWikiId ?? null);
  const lastSyncedSearchRef = useRef(search);
  const searchInputRef = useRef(null);
  const pages = manifest?.pages ?? [];

  useEffect(() => {
    setSelectedId(focusedWikiId ?? null);
  }, [focusedWikiId]);

  useEffect(() => {
    const next = getInitialStateFromSearch(search);
    if (search === lastSyncedSearchRef.current) {
      return;
    }
    lastSyncedSearchRef.current = search;
    setQuery(next.query);
    setTypeFilter(next.typeFilter);
    setTagFilter(next.tagFilter);
    setSort(next.sort);
    setVisibleTypes(next.visibleTypes);
  }, [search]);

  useEffect(() => {
    const nextSearch = buildWikiExplorerSearch({ query, typeFilter, tagFilter, sort, visibleTypes });
    if (nextSearch === lastSyncedSearchRef.current) {
      return;
    }
    lastSyncedSearchRef.current = nextSearch;
    onOpenRoute(buildWikiPath(focusedWikiId, nextSearch), { replace: true, search: nextSearch });
  }, [query, typeFilter, tagFilter, sort, visibleTypes, focusedWikiId, onOpenRoute]);

  const pageTypes = useMemo(
    () => [ALL, ...Array.from(new Set(pages.map((page) => page.type))).sort()],
    [pages],
  );
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(pages.flatMap((page) => page.tags))).sort()],
    [pages],
  );
  const sortedPages = useMemo(() => sortPages(pages, sort), [pages, sort]);
  const searchedPages = useMemo(
    () => filterPagesByQuery(sortedPages, query, manifest?.pagesById ?? {}),
    [sortedPages, query, manifest],
  );
  const filteredPages = useMemo(
    () =>
      searchedPages.filter((page) => {
        const matchesType = typeFilter === ALL || page.type === typeFilter;
        const matchesTag = tagFilter === ALL || page.tags.includes(tagFilter);

        return matchesType && matchesTag;
      }),
    [searchedPages, typeFilter, tagFilter],
  );
  const groupedPages = useMemo(
    () => groupPagesByType(filteredPages, new Set(pages.map((page) => page.type))),
    [filteredPages, pages],
  );

  const selectPage = useCallback((id) => {
    setSelectedId(id);
    onOpenRoute(buildWikiPath(id, lastSyncedSearchRef.current));
  }, [onOpenRoute]);

  const handleToggleType = useCallback((type) => {
    setVisibleTypes((current) => toggleVisibleType(current, type));
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setTypeFilter(ALL);
    setTagFilter(ALL);
  }, []);

  const handleSurprise = useCallback(() => {
    const pick = pickRandomPage(pages, { excludeId: selectedId });
    if (pick) {
      setSelectedId(pick.id);
      onOpenRoute(buildWikiPath(pick.id, lastSyncedSearchRef.current));
    }
  }, [pages, selectedId, onOpenRoute]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape" && (query || typeFilter !== ALL || tagFilter !== ALL)) {
        clearFilters();
        return;
      }

      if (event.key === SEARCH_INPUT_KEY && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [query, typeFilter, tagFilter, clearFilters]);

  if (!manifest) {
    return <WikiLoading onOpenRoute={onOpenRoute} />;
  }

  const selectedPage =
    (selectedId ? manifest.pagesById[selectedId] : null) ??
    (focusedWikiId ? null : pages.find((page) => page.sourceLinks?.length > 0) ?? pages[0] ?? null);
  const selectedPageId = selectedPage?.id ?? selectedId;
  const hasActiveFilters = Boolean(query) || typeFilter !== ALL || tagFilter !== ALL;

  return (
    <ArchiveShell onOpenRoute={onOpenRoute} shellClassName="shell--wiki">
      <main className="wiki-shell">
        <section className="wiki-hero">
          <div>
            <p className="eyebrow">LLM Wiki</p>
            <h2>Connected notes from Austin AI Club</h2>
            <p>
              Browse Meetup topics through their source links, recurring entities, concepts, and
              durable source records.
            </p>
          </div>
          <div className="wiki-stats" aria-label="Wiki stats">
            <span>{pluralize(manifest.stats.pageCount, "page")}</span>
            <span>{pluralize(manifest.stats.linkCount ?? 0, "wiki link")}</span>
            <span>{pluralize(manifest.stats.sourceLinkCount ?? 0, "source link")}</span>
            <span>{pluralize(manifest.stats.sourceRecordCount ?? 0, "source record")}</span>
          </div>
        </section>

        <section className="wiki-workspace">
          <div className="wiki-catalog">
            <div className="wiki-controls">
              <label className="wiki-search">
                <span className="sr-only">Search wiki</span>
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pages (press /)"
                  type="search"
                />
              </label>
              <div className="wiki-select-row">
                <label>
                  <span className="sr-only">Filter by page type</span>
                  <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                    {pageTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === ALL ? "All types" : getPageTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="sr-only">Filter by tag</span>
                  <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === ALL ? "All tags" : tag}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="sr-only">Sort catalog</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="title">Title</option>
                    <option value="updated">Updated</option>
                    <option value="connections">Connections</option>
                    <option value="sources">Source links</option>
                  </select>
                </label>
              </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  className="wiki-clear-filters"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            <div className="wiki-catalog-list" aria-label="Wiki pages">
              {groupedPages.length > 0 ? (
                groupedPages.map((group) => (
                  <WikiCatalogGroup
                    key={group.type}
                    group={group}
                    selectedPageId={selectedPageId}
                    onOpenRoute={onOpenRoute}
                  />
                ))
              ) : (
                <p className="wiki-empty-copy">No wiki pages match those filters.</p>
              )}
            </div>
          </div>

          <section className="wiki-graph-panel" aria-label="Wiki graph">
            <div className="wiki-panel-heading">
              <div>
                <p className="eyebrow">Graph</p>
                <span>{selectedPage?.title ?? "No page selected"}</span>
              </div>
              <div className="wiki-panel-actions">
                <button type="button" className="wiki-surprise" onClick={handleSurprise}>
                  Surprise me
                </button>
                <WikiGraphLegend visibleTypes={visibleTypes} onToggle={handleToggleType} />
              </div>
            </div>
            <WikiGraph
              graph={manifest.graph}
              selectedId={selectedPageId}
              onSelectPage={selectPage}
              visibleTypes={visibleTypes}
            />
          </section>

          <WikiDetail
            manifest={manifest}
            selectedPage={selectedPage}
            focusedWikiId={focusedWikiId}
            onOpenRoute={onOpenRoute}
            onTagClick={(tag) => setTagFilter(tag)}
          />
        </section>
      </main>
    </ArchiveShell>
  );
}
