import RouteLink from "../../components/RouteLink.jsx";
import ReminderSignup from "./ReminderSignup.jsx";
import {
  buildGoogleCalendarUrl,
  buildIcsHref,
  createInlineIcsHref,
  formatEventDate,
  formatEventTime,
  getLocationLabel,
} from "../../lib/meetup-ui.js";

function CalendarEventCard({ entry, onOpenRoute }) {
  const { event } = entry;

  return (
    <article className="calendar-event-card" data-kind={entry.kind}>
      <div className="calendar-event-copy">
        <p className="calendar-event-date">{formatEventDate(event)}</p>
        <h3>{event.title}</h3>
        <p className="calendar-event-summary">{event.summary}</p>
        <div className="calendar-event-meta">
          <span>{formatEventTime(event)}</span>
          <span>{getLocationLabel(event)}</span>
        </div>
        <span className={`calendar-event-status calendar-event-status--${entry.kind}`}>
          {entry.kind === "generated" ? "tentative" : "scheduled"}
        </span>
      </div>
      <div className="calendar-event-actions">
        <a href={buildGoogleCalendarUrl({ event })} target="_blank" rel="noreferrer">
          add to Google Calendar
        </a>
        <a href={entry.kind === "authored" ? buildIcsHref({ slug: entry.slug }) : createInlineIcsHref(entry)}>
          download ICS
        </a>
        {entry.detailsHref ? (
          <RouteLink to={entry.detailsHref} onOpenRoute={onOpenRoute}>
            open meetup page
          </RouteLink>
        ) : null}
      </div>
    </article>
  );
}

export default function CalendarView({ calendarEntries, nextSession, onClose, onOpenRoute }) {
  return (
    <section className="calendar-screen" aria-label="Calendar view">
      <header className="calendar-screen-header">
        <div className="calendar-screen-brand">
          <p className="calendar-eyebrow">Calendar</p>
          <h2>Austin AI Club every two weeks</h2>
          <p className="calendar-blurb">
            The next four meetup slots stay visible here by default, and hand-authored sessions
            can replace placeholders as you lock them in.
          </p>
        </div>
        <button className="calendar-close-btn" onClick={onClose}>
          back to meetup page
        </button>
      </header>

      <main className="calendar-screen-body">
        <ReminderSignup nextSession={nextSession} variant="screen" />
        <div className="calendar-list">
          {calendarEntries.map((entry) => (
            <CalendarEventCard
              key={entry.id}
              entry={entry}
              onOpenRoute={onOpenRoute}
            />
          ))}
        </div>
      </main>
    </section>
  );
}
