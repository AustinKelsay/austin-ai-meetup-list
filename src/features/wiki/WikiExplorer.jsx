import { useCallback, useEffect, useMemo, useState } from "react";
import { buildWikiPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";
import ArchiveShell from "../archive/ArchiveShell.jsx";
import WikiGraph from "./WikiGraph.jsx";

const ALL = "all";

function pluralize(count, singular) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function getPageTypeLabel(type) {
  return type.replace(/-/g, " ");
}

function getConnectedPages(manifest, ids) {
  return ids.map((id) => manifest.pagesById[id]).filter(Boolean);
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

function PageLinkList({ title, pages, emptyLabel, onOpenRoute }) {
  return (
    <section className="wiki-detail-section">
      <h3>{title}</h3>
      {pages.length > 0 ? (
        <div className="wiki-link-list">
          {pages.map((page) => (
            <RouteLink
              key={page.id}
              to={buildWikiPath(page.id)}
              onOpenRoute={onOpenRoute}
              className="wiki-relation-link"
            >
              <span>{page.title}</span>
              <small>{getPageTypeLabel(page.type)}</small>
            </RouteLink>
          ))}
        </div>
      ) : (
        <p className="wiki-empty-copy">{emptyLabel}</p>
      )}
    </section>
  );
}

function WikiDetail({ manifest, selectedPage, focusedWikiId, onOpenRoute }) {
  if (!selectedPage) {
    return (
      <aside className="wiki-detail wiki-detail--missing">
        <p className="eyebrow">Page not found</p>
        <h2>{focusedWikiId}</h2>
        <p>
          No public LLM Wiki page currently matches this route. The explorer still has the
          published catalog below.
        </p>
      </aside>
    );
  }

  const outgoingPages = getConnectedPages(manifest, selectedPage.outgoingIds);
  const backlinkPages = getConnectedPages(manifest, selectedPage.backlinkIds);

  return (
    <aside className="wiki-detail">
      <div>
        <p className="eyebrow">{getPageTypeLabel(selectedPage.type)}</p>
        <h2>{selectedPage.title}</h2>
        <p className="wiki-detail-copy">{selectedPage.excerpt || "No excerpt is available yet."}</p>
      </div>

      <div className="wiki-detail-meta">
        <span>{pluralize(selectedPage.sourceCount, "source")}</span>
        <span>{pluralize(outgoingPages.length, "outgoing link")}</span>
        <span>{pluralize(backlinkPages.length, "backlink")}</span>
      </div>

      <div className="wiki-tags" aria-label={`${selectedPage.title} tags`}>
        {selectedPage.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <PageLinkList
        title="Outgoing"
        pages={outgoingPages}
        emptyLabel="No outgoing wiki links yet."
        onOpenRoute={onOpenRoute}
      />
      <PageLinkList
        title="Backlinks"
        pages={backlinkPages}
        emptyLabel="No backlinks yet."
        onOpenRoute={onOpenRoute}
      />

      {selectedPage.unresolvedLinks.length > 0 ? (
        <section className="wiki-detail-section">
          <h3>Unresolved</h3>
          <div className="wiki-tags wiki-tags--quiet">
            {selectedPage.unresolvedLinks.map((link) => (
              <span key={link}>{link}</span>
            ))}
          </div>
        </section>
      ) : null}

      <a className="wiki-source-link" href={selectedPage.rawHref}>
        Open Markdown source
      </a>
    </aside>
  );
}

function WikiCatalogItem({ page, selected, onOpenRoute }) {
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
      <span className="wiki-catalog-counts">
        {page.outgoingIds.length + page.backlinkIds.length}
      </span>
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
    (focusedWikiId ? null : pages[0] ?? null);
  const selectedPageId = selectedPage?.id ?? selectedId;

  return (
    <ArchiveShell onOpenRoute={onOpenRoute} shellClassName="shell--wiki">
      <main className="wiki-shell">
        <section className="wiki-hero">
          <div>
            <p className="eyebrow">LLM Wiki</p>
            <h2>Connected notes from Austin AI Club</h2>
            <p>
              Browse the public knowledge layer across Meetups, entities, concepts, source
              records, and recurring questions.
            </p>
          </div>
          <div className="wiki-stats" aria-label="Wiki stats">
            <span>{pluralize(manifest.stats.pageCount, "page")}</span>
            <span>{pluralize(manifest.stats.linkCount, "wiki link")}</span>
            <span>{pluralize(manifest.rawPages.length, "source record")}</span>
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
              <p className="eyebrow">Graph</p>
              <span>{selectedPage?.title ?? "No page selected"}</span>
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
