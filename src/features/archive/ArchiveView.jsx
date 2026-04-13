import { buildMeetupPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";
import {
  formatEventDate,
  formatEventTime,
  getLocationLabel,
  isUpcomingSession,
} from "../../lib/meetup-ui.js";
import ArchiveShell from "./ArchiveShell.jsx";
import { getSessionCounts } from "./sessionSections.jsx";

function MeetupCard({ session, onOpenRoute }) {
  const isUpcoming = isUpcomingSession(session);
  const { totalTopicCount, totalTrackCount } = getSessionCounts(session);

  return (
    <article className={`session meetup-card ${isUpcoming ? "session--upcoming" : "session--past"}`}>
      <RouteLink
        to={buildMeetupPath(session.slug)}
        onOpenRoute={onOpenRoute}
        className="meetup-card-link"
      >
        <div className="session-header meetup-card-header">
          <div className="meetup-card-heading">
            <div>
              <p className="eyebrow meetup-card-eyebrow">
                {isUpcoming ? "Upcoming meetup" : "Past meetup"}
              </p>
              <h2>{session.date}</h2>
            </div>
            <span className="meetup-card-open">open meetup</span>
          </div>
          <p className="session-meta meetup-card-meta">
            {totalTopicCount} topics &middot; {totalTrackCount} tracks
          </p>
          {session.event ? (
            <div className="session-event-meta meetup-card-event">
              <span>{formatEventDate(session.event)}</span>
              <span>{formatEventTime(session.event)}</span>
              <span>{getLocationLabel(session.event)}</span>
            </div>
          ) : null}
        </div>
      </RouteLink>
    </article>
  );
}

export default function ArchiveView({ sessions, onOpenRoute }) {
  const upcomingSessions = sessions.filter(isUpcomingSession);
  const pastSessions = sessions.filter((session) => !isUpcomingSession(session));

  return (
    <ArchiveShell onOpenRoute={onOpenRoute}>
      <main className="archive archive--index">
        {upcomingSessions.map((session) => (
          <MeetupCard key={session.id} session={session} onOpenRoute={onOpenRoute} />
        ))}
        {upcomingSessions.length > 0 && pastSessions.length > 0 ? (
          <div className="session-divider" aria-hidden="true">
            <span>Past meetups</span>
          </div>
        ) : null}
        {pastSessions.map((session) => (
          <MeetupCard key={session.id} session={session} onOpenRoute={onOpenRoute} />
        ))}
      </main>
    </ArchiveShell>
  );
}
