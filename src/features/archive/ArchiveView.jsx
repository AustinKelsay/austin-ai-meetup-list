import { buildMeetupPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";
import {
  formatEventDate,
  formatEventTime,
  getLocationLabel,
  isUpcomingMeetup,
} from "../../lib/meetup-ui.js";
import ArchiveShell from "./ArchiveShell.jsx";
import { getMeetupCounts } from "./meetupSections.jsx";

function MeetupCard({ meetup, nextMeetupId, onOpenRoute }) {
  const isUpcoming = isUpcomingMeetup(meetup);
  const { totalTopicCount, totalTrackCount } = getMeetupCounts(meetup, {
    acceptsSubmissions: meetup.id === nextMeetupId,
  });

  return (
    <article className={`meetup meetup-card ${isUpcoming ? "meetup--upcoming" : "meetup--past"}`}>
      <RouteLink
        to={buildMeetupPath(meetup.slug)}
        onOpenRoute={onOpenRoute}
        className="meetup-card-link"
      >
        <div className="meetup-header meetup-card-header">
          <div className="meetup-card-heading">
            <div>
              <p className="eyebrow meetup-card-eyebrow">
                {isUpcoming ? "Upcoming meetup" : "Past meetup"}
              </p>
              <h2>{meetup.date}</h2>
            </div>
            <span className="meetup-card-open">open meetup</span>
          </div>
          <p className="meetup-meta meetup-card-meta">
            {totalTopicCount} topics &middot; {totalTrackCount} tracks
          </p>
          {meetup.event ? (
            <div className="meetup-event-meta meetup-card-event">
              <span>{formatEventDate(meetup.event)}</span>
              <span>{formatEventTime(meetup.event)}</span>
              <span>{getLocationLabel(meetup.event)}</span>
            </div>
          ) : null}
        </div>
      </RouteLink>
    </article>
  );
}

export default function ArchiveView({ meetups, nextMeetupId, onOpenRoute }) {
  const upcomingMeetups = meetups.filter(isUpcomingMeetup);
  const pastMeetups = meetups.filter((meetup) => !isUpcomingMeetup(meetup));

  return (
    <ArchiveShell onOpenRoute={onOpenRoute}>
      <main className="archive archive--index">
        {upcomingMeetups.map((meetup) => (
          <MeetupCard
            key={meetup.id}
            meetup={meetup}
            nextMeetupId={nextMeetupId}
            onOpenRoute={onOpenRoute}
          />
        ))}
        {upcomingMeetups.length > 0 && pastMeetups.length > 0 ? (
          <div className="meetup-divider" aria-hidden="true">
            <span>Past meetups</span>
          </div>
        ) : null}
        {pastMeetups.map((meetup) => (
          <MeetupCard
            key={meetup.id}
            meetup={meetup}
            nextMeetupId={nextMeetupId}
            onOpenRoute={onOpenRoute}
          />
        ))}
      </main>
    </ArchiveShell>
  );
}
