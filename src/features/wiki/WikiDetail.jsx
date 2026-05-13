import { buildWikiPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";

function pluralize(count, singular) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function getPageTypeLabel(type) {
  return type.replace(/-/g, " ");
}

function getConnectedPages(manifest, ids) {
  return ids.map((id) => manifest.pagesById[id]).filter(Boolean);
}

function getSourceLinkLabel(href) {
  try {
    const url = new URL(href);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return href;
  }
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
              <span className="wiki-link-label">{page.title}</span>
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

function buildSourceItems({ links, references, referencedTopicSources }) {
  const directItems =
    references?.length > 0
      ? references.map((reference) => ({
          ...reference,
          provenance: "Direct",
        }))
      : links.map((href) => ({
          href,
          title: getSourceLinkLabel(href),
          section: "source",
          provenance: "Direct",
        }));

  const referencedItems = referencedTopicSources.map((reference) => ({
    ...reference,
    provenance: reference.sourcePageTitle
      ? `From ${reference.sourcePageTitle}`
      : "From referenced topic",
  }));

  return [...directItems, ...referencedItems];
}

function SourceReferenceList({ items, emptyLabel }) {
  return (
    <section className="wiki-detail-section">
      <h3>Sources</h3>
      {items.length > 0 ? (
        <div className="wiki-link-list">
          {items.map((item) => (
            <a
              key={`${item.title}-${item.href}`}
              className="wiki-relation-link wiki-source-reference"
              href={item.href}
              rel="noreferrer"
            >
              <span className="wiki-source-reference-copy">
                <span className="wiki-link-label">{item.title}</span>
                <small>{getSourceLinkLabel(item.href)}</small>
                <small>{item.provenance}</small>
              </span>
              <small>{item.section || "source"}</small>
            </a>
          ))}
        </div>
      ) : (
        <p className="wiki-empty-copy">{emptyLabel}</p>
      )}
    </section>
  );
}

export function WikiDetail({ manifest, selectedPage, focusedWikiId, onOpenRoute }) {
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
  const sourceLinks = selectedPage.sourceLinks ?? [];
  const sourceReferences = selectedPage.sourceReferences ?? [];
  const referencedTopicSources = selectedPage.referencedTopicSources ?? [];
  const sourceItems = buildSourceItems({
    links: sourceLinks,
    references: sourceReferences,
    referencedTopicSources,
  });

  return (
    <aside className="wiki-detail">
      <div>
        <p className="eyebrow">{getPageTypeLabel(selectedPage.type)}</p>
        <h2>{selectedPage.title}</h2>
        <p className="wiki-detail-copy">{selectedPage.excerpt || "No excerpt is available yet."}</p>
      </div>

      <div className="wiki-detail-meta">
        <span>{pluralize(sourceItems.length, "source")}</span>
        <span>{pluralize(outgoingPages.length, "wiki link")}</span>
        <span>{pluralize(backlinkPages.length, "backlink")}</span>
      </div>

      <div className="wiki-tags" aria-label={`${selectedPage.title} tags`}>
        {selectedPage.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <SourceReferenceList items={sourceItems} emptyLabel="No sources captured yet." />
      <PageLinkList
        title="Related Wiki Pages"
        pages={outgoingPages}
        emptyLabel="No related wiki pages yet."
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
