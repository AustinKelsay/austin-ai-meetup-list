import { BIWEEKLY_INTERVAL_DAYS, DEFAULT_CALENDAR_EVENT_COUNT } from "../../app/constants.js";
import {
  addDays,
  formatDateKey,
} from "../../lib/meetup-ui.js";
import { nextMeetupFromSessions } from "../../meetups.js";

function createCalendarEntry(session, eventOverride) {
  const event = eventOverride ?? session.event;

  return {
    id: session.id,
    kind: "authored",
    slug: session.slug,
    detailsHref: `/#${session.id}`,
    event,
  };
}

function createGeneratedEntry(templateEvent, startAt, index) {
  const durationMs = new Date(templateEvent.endAt).getTime() - new Date(templateEvent.startAt).getTime();
  const endAt = new Date(startAt.getTime() + durationMs);
  const dateKey = formatDateKey(startAt, templateEvent.timezone);

  return {
    id: `generated-${dateKey}`,
    kind: "generated",
    slug: dateKey,
    detailsHref: null,
    event: {
      ...templateEvent,
      summary: index === 0
        ? templateEvent.summary
        : "Biweekly Austin AI Club meetup. Full topic board and notes will land closer to the event.",
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    },
  };
}

export function buildCalendarEntries(sessionList, count = DEFAULT_CALENDAR_EVENT_COUNT) {
  const authoredSessions = sessionList
    .filter((session) => session.event)
    .sort((a, b) => new Date(a.event.startAt).getTime() - new Date(b.event.startAt).getTime());

  if (!authoredSessions.length) {
    return [];
  }

  const anchorEvent = authoredSessions[0].event;
  const timeZone = anchorEvent.timezone ?? "America/Chicago";
  const authoredByDate = new Map(
    authoredSessions.map((session) => [formatDateKey(session.event.startAt, timeZone), createCalendarEntry(session)]),
  );

  let cursor = new Date(anchorEvent.startAt);
  while (new Date(cursor.getTime() + 1).getTime() < Date.now()) {
    cursor = addDays(cursor, BIWEEKLY_INTERVAL_DAYS);
  }

  const entries = [];
  while (entries.length < count) {
    const dateKey = formatDateKey(cursor, timeZone);
    entries.push(authoredByDate.get(dateKey) ?? createGeneratedEntry(anchorEvent, cursor, entries.length));
    cursor = addDays(cursor, BIWEEKLY_INTERVAL_DAYS);
  }

  return entries;
}

export function getNextSubmissionMeetup(sessionList) {
  return nextMeetupFromSessions(sessionList);
}
