import { BIWEEKLY_INTERVAL_DAYS, DEFAULT_CALENDAR_EVENT_COUNT } from "../../app/constants.js";
import { buildMeetupPath } from "../../app/routes.js";
import {
  addDays,
  formatDateKey,
  formatEventDate,
} from "../../lib/meetup-ui.js";
import { nextMeetupFromMeetups } from "../../meetups.js";

function createCalendarEntry(meetup) {
  return {
    id: meetup.id,
    kind: "authored",
    slug: meetup.slug,
    date: meetup.date,
    detailsHref: buildMeetupPath(meetup.slug),
    event: meetup.event,
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
    date: formatEventDate({ ...templateEvent, startAt: startAt.toISOString() }),
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

export function buildCalendarEntries(meetupList, count = DEFAULT_CALENDAR_EVENT_COUNT) {
  const authoredMeetups = meetupList
    .filter((meetup) => meetup.event)
    .sort((a, b) => new Date(a.event.startAt).getTime() - new Date(b.event.startAt).getTime());

  if (!authoredMeetups.length) {
    return [];
  }

  const anchorEvent = authoredMeetups[0].event;
  const timeZone = anchorEvent.timezone ?? "America/Chicago";
  const authoredByDate = new Map(
    authoredMeetups.map((meetup) => [formatDateKey(meetup.event.startAt, timeZone), createCalendarEntry(meetup)]),
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

export function getNextSubmissionTarget(meetupList) {
  const nextMeetup = nextMeetupFromMeetups(meetupList);
  if (nextMeetup) {
    return {
      id: nextMeetup.id,
      kind: "authored",
      slug: nextMeetup.slug,
      date: nextMeetup.date,
      event: nextMeetup.event,
      detailsHref: buildMeetupPath(nextMeetup.slug),
    };
  }

  return buildCalendarEntries(meetupList, 1)[0] ?? null;
}
