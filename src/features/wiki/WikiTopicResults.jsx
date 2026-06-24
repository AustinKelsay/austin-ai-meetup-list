import { buildMeetupPath, buildWikiPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";

function getSourceLinkLabel(href) {
  try {
    const url = new URL(href);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return href;
  }
}

function getPageTypeLabel(type) {
  return type.replace(/-/g, " ");
}

function TopicWikiChip({ page, onOpenRoute }) {
  return (
    <RouteLink to={buildWikiPath(page.id)} onOpenRoute={onOpenRoute} className="wiki-topic-chip">
      <span>{page.title}</span>
      <small>{getPageTypeLabel(page.type)}</small>
    </RouteLink>
  );
}

function TopicSourceLink({ href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="wiki-topic-source">
      {getSourceLinkLabel(href)}
    </a>
  );
}

export function WikiTopicResults({
  topics,
  pagesById,
  activeFilterIds = [],
  onOpenRoute,
}) {
  const activePages = activeFilterIds.map((id) => pagesById[id]).filter(Boolean);

  return (
    <section className="wiki-topic-results" aria-label="Topic Results">
      <div className="wiki-topic-results-heading">
        <div>
          <p className="eyebrow">Topic Results</p>
          <h3>{topics.length} matching Topic{topics.length === 1 ? "" : "s"}</h3>
        </div>
        {activePages.length > 0 ? (
          <div className="wiki-topic-active-filters" aria-label="Active topic filters">
            {activePages.map((page) => (
              <TopicWikiChip key={page.id} page={page} onOpenRoute={onOpenRoute} />
            ))}
          </div>
        ) : null}
      </div>

      {topics.length > 0 ? (
        <div className="wiki-topic-result-list">
          {topics.map((topic) => (
            <article key={topic.id} className="wiki-topic-result">
              <div className="wiki-topic-result-main">
                <p className="wiki-topic-result-meta">
                  <RouteLink to={buildMeetupPath(topic.meetupSlug)} onOpenRoute={onOpenRoute}>
                    {topic.meetupTitle}
                  </RouteLink>
                  <span>{topic.section}</span>
                </p>
                <h4>{topic.title}</h4>
              </div>

              <div className="wiki-topic-result-chips" aria-label={`${topic.title} wiki pages`}>
                {(topic.wikiIds ?? []).map((id) => {
                  const page = pagesById[id];
                  return page ? <TopicWikiChip key={id} page={page} onOpenRoute={onOpenRoute} /> : null;
                })}
              </div>

              <div className="wiki-topic-source-list" aria-label={`${topic.title} source links`}>
                {(topic.sourceLinks ?? []).map((href) => (
                  <TopicSourceLink key={href} href={href} />
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="wiki-empty-copy">No past Topics match those filters yet.</p>
      )}
    </section>
  );
}
