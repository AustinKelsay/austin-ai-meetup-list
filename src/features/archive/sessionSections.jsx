import {
  COMMUNITY_SLOT_LABEL,
  LINK_SUBMISSION_PATH,
  SHOWCASE_SUBMISSION_PATH,
  TRACK_CATEGORY,
} from "../../app/constants.js";
import RouteLink from "../../components/RouteLink.jsx";
import {
  buildGoogleCalendarUrl,
  buildIcsHref,
  formatEventDate,
  formatEventTime,
  getLocationLabel,
  slugify,
} from "../../lib/meetup-ui.js";
import { Topic } from "../presentation/content.jsx";

export function getSessionCounts(session) {
  const topicCount = session.tracks.reduce((sum, track) => sum + track.items.length, 0);
  const showcaseCount = session.showcases?.length ?? 0;

  return {
    topicCount,
    showcaseCount,
    totalTopicCount: topicCount + showcaseCount,
    totalTrackCount: session.tracks.length + 1,
  };
}

export function getShowcaseId(sessionId) {
  return `showcase-${sessionId}`;
}

export function getTopicId(sectionId, item) {
  return `${sectionId}-${slugify(item.title)}`;
}

export function SessionEventBar({ session }) {
  if (!session.event) {
    return null;
  }

  const event = session.event;

  return (
    <div className="session-event">
      <div className="session-event-meta">
        <span>{formatEventDate(event)}</span>
        <span>{formatEventTime(event)}</span>
        <span>{getLocationLabel(event)}</span>
      </div>
      <div className="session-event-actions">
        <a href={buildGoogleCalendarUrl(session)} target="_blank" rel="noreferrer">
          add to Google Calendar
        </a>
        <a href={buildIcsHref(session)}>download ICS</a>
      </div>
    </div>
  );
}

export function StaticTrackSection({ track, index, onOpenTopic }) {
  return (
    <section className="track track--static" id={track.id} data-track={TRACK_CATEGORY[track.title]}>
      <div className="track-header track-header--static">
        <h3>
          <span className="track-num">{String(index + 1).padStart(2, "0")}</span> {track.title}
        </h3>
        <span className="track-count">
          {track.items.length} topic{track.items.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="topic-list">
        {track.items.map((item) => (
          <Topic
            key={item.title}
            id={getTopicId(track.id, item)}
            item={item}
            onActivate={onOpenTopic ? () => onOpenTopic(item, getTopicId(track.id, item)) : undefined}
          />
        ))}
      </ul>
    </section>
  );
}

export function StaticShowcaseSection({
  index,
  sessionId,
  items = [],
  acceptsSubmissions,
  onOpenRoute,
  onOpenTopic,
}) {
  const showcaseSectionId = getShowcaseId(sessionId);

  return (
    <section className="track track--static" id={showcaseSectionId} data-track="community">
      <div className="track-header track-header--static">
        <h3>
          <span className="track-num">{String(index + 1).padStart(2, "0")}</span>{" "}
          {COMMUNITY_SLOT_LABEL}
        </h3>
        <span className="track-count">
          {items.length ? `${items.length} slot${items.length !== 1 ? "s" : ""}` : "open"}
        </span>
      </div>
      <div className="community-track-body">
        {items.length ? (
          <ul className="topic-list community-topic-list">
            {items.map((item) => (
              <Topic
                key={item.title}
                id={getTopicId(showcaseSectionId, item)}
                item={item}
                onActivate={
                  onOpenTopic
                    ? () => onOpenTopic(item, getTopicId(showcaseSectionId, item))
                    : undefined
                }
              />
            ))}
          </ul>
        ) : (
          <p className="community-slot-blurb">
            A showcase is something you want to showcase or talk about for three to five minutes at
            the meetup.
          </p>
        )}
        <div className="community-track-footer">
          <p className="community-slot-eyebrow">
            {items.length ? "At the end of the meetup" : "Open slot at the end"}
          </p>
          {acceptsSubmissions ? (
            <>
              <RouteLink to={SHOWCASE_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>
                submit a showcase
              </RouteLink>
              <RouteLink to={LINK_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>
                submit a regular link
              </RouteLink>
            </>
          ) : (
            <span>Submissions are closed for this meetup.</span>
          )}
        </div>
      </div>
    </section>
  );
}
