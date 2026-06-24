import { useState } from "react";
import { buildWikiPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";
import { formatRelativeDate } from "./wikiDates.js";

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

function groupSourcesBySection(items) {
  const groups = new Map();

  for (const item of items) {
    const section = item.section || "source";
    if (!groups.has(section)) {
      groups.set(section, []);
    }
    groups.get(section).push(item);
  }

  const preferredOrder = [
    "source",
    "Local Builds & Projects",
    "Agent Infrastructure",
    "Models & Research",
    "Security",
    "Big Tech Moves",
  ];

  return [...groups.entries()].sort(([a], [b]) => {
    const aIndex = preferredOrder.indexOf(a);
    const bIndex = preferredOrder.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) {
      return -1;
    }

    if (bIndex !== -1) {
      return 1;
    }

    return a.localeCompare(b);
  });
}

function getSectionLabel(section) {
  if (section === "source") {
    return "Direct sources";
  }

  return section;
}

function SourceReferenceLink({ item }) {
  return (
    <a
      className="wiki-relation-link wiki-source-reference"
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="wiki-source-reference-copy">
        <span className="wiki-link-label">{item.title}</span>
        <small>{getSourceLinkLabel(item.href)}</small>
        <small>{item.provenance}</small>
      </span>
      <small>{item.section || "source"}</small>
    </a>
  );
}

function SourceReferenceList({ items, emptyLabel }) {
  if (items.length === 0) {
    return (
      <section className="wiki-detail-section">
        <h3>Sources</h3>
        <p className="wiki-empty-copy">{emptyLabel}</p>
      </section>
    );
  }

  const grouped = groupSourcesBySection(items);

  return (
    <section className="wiki-detail-section">
      <h3>Sources</h3>
      <div className="wiki-source-groups">
        {grouped.map(([section, sectionItems]) => (
          <div key={section} className="wiki-source-group">
            <h4 className="wiki-source-group-title">{getSectionLabel(section)}</h4>
            <div className="wiki-link-list">
              {sectionItems.map((item) => (
                <SourceReferenceLink key={`${item.title}-${item.href}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MentionedInSection({ meetups, emptyLabel, onOpenRoute }) {
  return (
    <section className="wiki-detail-section">
      <h3>Mentioned In</h3>
      {meetups.length > 0 ? (
        <div className="wiki-link-list">
          {meetups.map((meetup) => (
            <RouteLink
              key={meetup.id}
              to={buildWikiPath(meetup.id)}
              onOpenRoute={onOpenRoute}
              className="wiki-relation-link"
            >
              <span className="wiki-link-label">{meetup.title}</span>
              <small>{getPageTypeLabel(meetup.type)}</small>
            </RouteLink>
          ))}
        </div>
      ) : (
        <p className="wiki-empty-copy">{emptyLabel}</p>
      )}
    </section>
  );
}

function CopyLinkButton({ page }) {
  const [copied, setCopied] = useState(false);

  if (!page) {
    return null;
  }

  const handleCopy = async () => {
    if (typeof window === "undefined") {
      return;
    }
    const url = `${window.location.origin}${buildWikiPath(page.id)}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      className={`wiki-source-link wiki-copy-link ${copied ? "wiki-copy-link--copied" : ""}`}
      onClick={handleCopy}
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}

export function WikiDetail({
  manifest,
  selectedPage,
  focusedWikiId,
  onOpenRoute,
  onTagClick,
  onTopicFilterClick,
  activeTag = null,
}) {
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
  const meetupBacklinks = backlinkPages.filter((page) => page.type === "meetup");
  const sourceLinks = selectedPage.sourceLinks ?? [];
  const sourceReferences = selectedPage.sourceReferences ?? [];
  const referencedTopicSources = selectedPage.referencedTopicSources ?? [];
  const sourceItems = buildSourceItems({
    links: sourceLinks,
    references: sourceReferences,
    referencedTopicSources,
  });

  const updatedLabel = formatRelativeDate(selectedPage.updated || selectedPage.created);

  return (
    <aside className="wiki-detail">
      <div>
        <p className="eyebrow">{getPageTypeLabel(selectedPage.type)}</p>
        <h2>{selectedPage.title}</h2>
        <p className="wiki-detail-copy">{selectedPage.excerpt || "No excerpt is available yet."}</p>
        {updatedLabel ? (
          <p className="wiki-detail-freshness" aria-label={`Last updated ${updatedLabel}`}>
            Updated {updatedLabel}
          </p>
        ) : null}
      </div>

      <div className="wiki-detail-meta">
        <span>{pluralize(sourceItems.length, "source")}</span>
        <span>{pluralize(outgoingPages.length, "wiki link")}</span>
        <span>{pluralize(backlinkPages.length, "backlink")}</span>
      </div>

      <div className="wiki-tags" aria-label={`${selectedPage.title} tags`}>
        {selectedPage.tags.map((tag) =>
          onTagClick ? (
            <button
              key={tag}
              type="button"
              className={`wiki-tag wiki-tag--clickable ${tag === activeTag ? "wiki-tag--active" : ""}`}
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </button>
          ) : (
            <span key={tag} className="wiki-tag">
              {tag}
            </span>
          ),
        )}
      </div>

      {onTopicFilterClick && ["entity", "concept"].includes(selectedPage.type) ? (
        <button
          type="button"
          className="wiki-source-link wiki-topic-filter-button"
          onClick={() => onTopicFilterClick(selectedPage)}
        >
          Show matching Topics
        </button>
      ) : null}

      <SourceReferenceList items={sourceItems} emptyLabel="No sources captured yet." />
      <MentionedInSection
        meetups={meetupBacklinks}
        emptyLabel="Not mentioned in a meetup yet."
        onOpenRoute={onOpenRoute}
      />
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
      <CopyLinkButton page={selectedPage} />
    </aside>
  );
}
