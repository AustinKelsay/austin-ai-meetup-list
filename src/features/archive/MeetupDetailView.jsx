import { COMMUNITY_SLOT_LABEL, TRACK_CATEGORY } from "../../app/constants.js";
import RouteLink from "../../components/RouteLink.jsx";
import { isUpcomingSession } from "../../lib/meetup-ui.js";
import ArchiveShell from "./ArchiveShell.jsx";
import {
  getSessionCounts,
  getShowcaseId,
  SessionEventBar,
  StaticShowcaseSection,
  StaticTrackSection,
} from "./sessionSections.jsx";

function TrackJumpNav({ session }) {
  return (
    <nav className="track-nav" aria-label={`${session.date} tracks`}>
      {session.tracks.map((track) => (
        <a key={track.id} href={`#${track.id}`} data-track={TRACK_CATEGORY[track.title]}>
          {track.title.toLowerCase()}
        </a>
      ))}
      <a href={`#${getShowcaseId(session.id)}`} data-track="community">
        {COMMUNITY_SLOT_LABEL.toLowerCase()}
      </a>
    </nav>
  );
}

function MeetupNotFound({ meetupSlug, onOpenRoute }) {
  return (
    <ArchiveShell onOpenRoute={onOpenRoute}>
      <main className="archive archive--detail">
        <section className="session meetup-state">
          <div className="session-header meetup-detail-header meetup-state-header">
            <p className="eyebrow">Meetup not found</p>
            <h2>{meetupSlug}</h2>
            <p className="submission-blurb">
              That meetup slug does not match any published session in this archive.
            </p>
            <RouteLink to="/" onOpenRoute={onOpenRoute} className="calendar-close-btn meetup-back-link">
              back to all meetups
            </RouteLink>
          </div>
        </section>
      </main>
    </ArchiveShell>
  );
}

export default function MeetupDetailView({
  session,
  meetupSlug,
  nextMeetupId,
  onOpenRoute,
  onOpenPresentation,
  onOpenTopicPresentation,
}) {
  if (!session) {
    return <MeetupNotFound meetupSlug={meetupSlug} onOpenRoute={onOpenRoute} />;
  }

  const isUpcoming = isUpcomingSession(session);
  const { totalTopicCount, totalTrackCount } = getSessionCounts(session);

  return (
    <ArchiveShell onOpenRoute={onOpenRoute}>
      <main className="archive archive--detail">
        <article className={`session session--detail ${isUpcoming ? "session--upcoming" : "session--past"}`}>
          <div className="session-header meetup-detail-header">
            <div className="meetup-detail-toolbar">
              <RouteLink
                to="/"
                onOpenRoute={onOpenRoute}
                className="calendar-close-btn meetup-back-link"
              >
                back to all meetups
              </RouteLink>
              <button className="pres-enter-btn" onClick={() => onOpenPresentation(session)}>
                ▶ slideshow mode
              </button>
            </div>
            <div className="meetup-detail-heading">
              <div>
                <p className="eyebrow">{isUpcoming ? "Upcoming meetup" : "Meetup archive"}</p>
                <h2>{session.date}</h2>
                <p className="session-meta">
                  {totalTopicCount} topics &middot; {totalTrackCount} tracks
                </p>
              </div>
            </div>
            <TrackJumpNav session={session} />
          </div>

          <div className="session-body session-body--detail">
            <SessionEventBar session={session} />
            {session.tracks.map((track, index) => (
              <StaticTrackSection
                key={track.id}
                track={track}
                index={index}
                onOpenTopic={onOpenTopicPresentation}
              />
            ))}
            <StaticShowcaseSection
              index={session.tracks.length}
              sessionId={session.id}
              items={session.showcases}
              acceptsSubmissions={session.id === nextMeetupId}
              onOpenRoute={onOpenRoute}
              onOpenTopic={onOpenTopicPresentation}
            />
          </div>
        </article>
      </main>
    </ArchiveShell>
  );
}
