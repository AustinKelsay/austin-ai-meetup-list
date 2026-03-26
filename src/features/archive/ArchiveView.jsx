import { COMMUNITY_SLOT_LABEL, LINK_SUBMISSION_PATH, SPOTLIGHT_SUBMISSION_PATH, TRACK_CATEGORY } from "../../app/constants.js";
import RouteLink from "../../components/RouteLink.jsx";
import {
  buildGoogleCalendarUrl,
  buildIcsHref,
  formatEventDate,
  formatEventTime,
  getLocationLabel,
  isUpcomingSession,
} from "../../lib/meetup-ui.js";
import { Topic } from "../presentation/content.jsx";

function Track({ track, index }) {
  return (
    <details className="track" id={track.id} data-track={TRACK_CATEGORY[track.title]}>
      <summary className="track-header">
        <h3>
          <span className="track-chevron" aria-hidden="true"></span>
          <span className="track-num">{String(index + 1).padStart(2, "0")}</span>{" "}
          {track.title}
        </h3>
        <span className="track-count">
          {track.items.length} topic{track.items.length !== 1 ? "s" : ""}
        </span>
      </summary>
      <ul className="topic-list">
        {track.items.map((item) => (
          <Topic key={item.title} item={item} />
        ))}
      </ul>
    </details>
  );
}

function CommunityTrack({ index, sessionId, items = [], acceptsSubmissions, onOpenRoute }) {
  const showcaseId = `showcase-${sessionId}`;

  return (
    <details className="track" id={showcaseId} data-track="community">
      <summary className="track-header">
        <h3>
          <span className="track-chevron" aria-hidden="true"></span>
          <span className="track-num">{String(index + 1).padStart(2, "0")}</span>{" "}
          {COMMUNITY_SLOT_LABEL}
        </h3>
        <span className="track-count">
          {items.length ? `${items.length} slot${items.length !== 1 ? "s" : ""}` : "open"}
        </span>
      </summary>
      <div className="community-track-body">
        {items.length ? (
          <ul className="topic-list community-topic-list">
            {items.map((item) => (
              <Topic key={item.title} item={item} />
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
              <RouteLink to={SPOTLIGHT_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>submit a showcase</RouteLink>
              <RouteLink to={LINK_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>submit a regular link</RouteLink>
            </>
          ) : (
            <span>Submissions are closed for this meetup.</span>
          )}
        </div>
      </div>
    </details>
  );
}

function SessionEventBar({ session }) {
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

function Session({ session, onPresent, onOpenRoute, nextMeetupId }) {
  const topicCount = session.tracks.reduce((sum, track) => sum + track.items.length, 0);
  const showcaseCount = session.showcases?.length ?? 0;
  const totalTrackCount = session.tracks.length + 1;
  const showcaseId = `showcase-${session.id}`;
  const isUpcoming = isUpcomingSession(session);

  return (
    <details className={`session ${isUpcoming ? "session--upcoming" : "session--past"}`} id={session.id}>
      <summary className="session-header">
        <div className="session-date">
          <span className="chevron" aria-hidden="true"></span>
          <h2>{session.date}</h2>
          <button
            className="pres-enter-btn"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onPresent(session);
            }}
          >
            ▶ slideshow mode
          </button>
        </div>
        <p className="session-meta">
          {topicCount + showcaseCount} topics &middot; {totalTrackCount} tracks
        </p>
        <nav className="track-nav" aria-label={`${session.date} tracks`}>
          {session.tracks.map((track) => (
            <a key={track.id} href={`#${track.id}`} data-track={TRACK_CATEGORY[track.title]}>
              {track.title.toLowerCase()}
            </a>
          ))}
          <a href={`#${showcaseId}`} data-track="community">
            {COMMUNITY_SLOT_LABEL.toLowerCase()}
          </a>
        </nav>
      </summary>

      <div className="session-body">
        <SessionEventBar session={session} />
        {session.tracks.map((track, index) => (
          <Track key={track.id} track={track} index={index} />
        ))}
        <CommunityTrack
          index={session.tracks.length}
          sessionId={session.id}
          items={session.showcases}
          acceptsSubmissions={session.id === nextMeetupId}
          onOpenRoute={onOpenRoute}
        />
      </div>
    </details>
  );
}

export default function ArchiveView({ sessions, nextMeetupId, onOpenRoute, onOpenPresentation }) {
  const upcomingSessions = sessions.filter(isUpcomingSession);
  const pastSessions = sessions.filter((session) => !isUpcomingSession(session));

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-left">
          <div className="window-controls" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="brand">
            <span className="brand-mark">$</span>
            <div>
              <p className="eyebrow">Austin AI Club</p>
              <h1>austinai.club</h1>
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <RouteLink to={LINK_SUBMISSION_PATH} onOpenRoute={onOpenRoute} className="topbar-link">
            submit link
          </RouteLink>
          <RouteLink to={SPOTLIGHT_SUBMISSION_PATH} onOpenRoute={onOpenRoute} className="topbar-link">
            showcase
          </RouteLink>
          <RouteLink to="/calendar" onOpenRoute={onOpenRoute} className="calendar-open-btn">
            calendar
          </RouteLink>
        </div>
      </header>

      <nav className="session-index" aria-label="Austin AI Club dates">
        {sessions.map((session) => (
          <a key={session.id} href={`#${session.id}`} className="index-link">
            {session.slug}
          </a>
        ))}
      </nav>

      <main className="archive">
        {upcomingSessions.map((session) => (
          <Session
            key={session.id}
            session={session}
            onPresent={onOpenPresentation}
            onOpenRoute={onOpenRoute}
            nextMeetupId={nextMeetupId}
          />
        ))}
        {upcomingSessions.length > 0 && pastSessions.length > 0 ? (
          <div className="session-divider" aria-hidden="true">
            <span>Past meetups</span>
          </div>
        ) : null}
        {pastSessions.map((session) => (
          <Session
            key={session.id}
            session={session}
            onPresent={onOpenPresentation}
            onOpenRoute={onOpenRoute}
            nextMeetupId={nextMeetupId}
          />
        ))}
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <p className="footer-label">Austin AI Club</p>
          <p className="footer-copy">
            Local archive and presentation layer for monthly topics, demos, and discussion.
          </p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/AustinKelsay/austin-ai-meetup-list" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <RouteLink to={LINK_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>Submit link</RouteLink>
          <RouteLink to={SPOTLIGHT_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>
            {COMMUNITY_SLOT_LABEL}
          </RouteLink>
          <a href="./topics/README.md">Meetup notes</a>
        </div>
      </footer>
    </div>
  );
}
