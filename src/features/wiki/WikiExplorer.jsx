import { useCallback, useEffect, useMemo, useState } from "react";
import { buildWikiPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";
import ArchiveShell from "../archive/ArchiveShell.jsx";
import { WikiDetail } from "./WikiDetail.jsx";
import WikiGraph from "./WikiGraph.jsx";
import { WikiGraphLegend } from "./WikiGraphLegend.jsx";

const ALL = "all";

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
      <span>
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

export default function WikiExplorer({ manifest, focusedWikiId, onOpenRoute }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [tagFilter, setTagFilter] = useState(ALL);
  const [selectedId, setSelectedId] = useState(focusedWikiId ?? null);
  const pages = manifest?.pages ?? [];

  useEffect(() => {
    setSelectedId(focusedWikiId ?? null);
  }, [focusedWikiId]);

  const pageTypes = useMemo(
    () => [ALL, ...Array.from(new Set(pages.map((page) => page.type))).sort()],
    [pages],
  );
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(pages.flatMap((page) => page.tags))).sort()],
    [pages],
  );
  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pages.filter((page) => {
      const matchesQuery =
        !normalizedQuery ||
        page.title.toLowerCase().includes(normalizedQuery) ||
        (page.excerpt?.toLowerCase().includes(normalizedQuery) ?? false);
      const matchesType = typeFilter === ALL || page.type === typeFilter;
      const matchesTag = tagFilter === ALL || page.tags.includes(tagFilter);

      return matchesQuery && matchesType && matchesTag;
    });
  }, [pages, query, typeFilter, tagFilter]);

  const selectPage = useCallback((id) => {
    setSelectedId(id);
    onOpenRoute(buildWikiPath(id));
  }, [onOpenRoute]);

  if (!manifest) {
    return <WikiLoading onOpenRoute={onOpenRoute} />;
  }

  const selectedPage =
    (selectedId ? manifest.pagesById[selectedId] : null) ??
    (focusedWikiId ? null : pages.find((page) => page.sourceLinks?.length > 0) ?? pages[0] ?? null);
  const selectedPageId = selectedPage?.id ?? selectedId;

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
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pages"
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
              </div>
            </div>

            <div className="wiki-catalog-list" aria-label="Wiki pages">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <WikiCatalogItem
                    key={page.id}
                    page={page}
                    selected={page.id === selectedPageId}
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
              <WikiGraphLegend />
            </div>
            <WikiGraph graph={manifest.graph} selectedId={selectedPageId} onSelectPage={selectPage} />
          </section>

          <WikiDetail
            manifest={manifest}
            selectedPage={selectedPage}
            focusedWikiId={focusedWikiId}
            onOpenRoute={onOpenRoute}
          />
        </section>
      </main>
    </ArchiveShell>
  );
}
