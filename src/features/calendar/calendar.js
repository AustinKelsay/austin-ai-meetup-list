import {
  BIWEEKLY_INTERVAL_DAYS,
  CALENDAR_TIMELINE_EVENT_COUNT,
  DEFAULT_CALENDAR_EVENT_COUNT,
} from "../../app/constants.js";
import { buildMeetupPath } from "../../app/routes.js";
import {
  addDays,
  formatDateKey,
  formatEventDate,
} from "../../lib/meetup-ui.js";
import { nextMeetupFromMeetups } from "../../meetups.js";

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function getZonedDateTimeParts(value, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(new Date(value));
  const part = (type) => Number(parts.find((item) => item.type === type)?.value ?? 0);

  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
    hour: part("hour"),
    minute: part("minute"),
    second: part("second"),
  };
}

function getTimeZoneOffsetMs(value, timeZone) {
  const zonedParts = getZonedDateTimeParts(value, timeZone);
  const utcTimestamp = Date.UTC(
    zonedParts.year,
    zonedParts.month - 1,
    zonedParts.day,
    zonedParts.hour,
    zonedParts.minute,
    zonedParts.second,
  );

  return utcTimestamp - new Date(value).getTime();
}

function createUtcDateFromZonedParts(parts, timeZone) {
  const utcTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const firstPass = new Date(utcTimestamp - getTimeZoneOffsetMs(new Date(utcTimestamp), timeZone));
  const secondPass = new Date(utcTimestamp - getTimeZoneOffsetMs(firstPass, timeZone));

  return secondPass;
}

function createGeneratedStartDate(templateEvent, slotStartAt) {
  const timeZone = templateEvent.timezone ?? "America/Chicago";
  const slotDateParts = getZonedDateTimeParts(slotStartAt, timeZone);
  const templateTimeParts = getZonedDateTimeParts(templateEvent.startAt, timeZone);

  return createUtcDateFromZonedParts({
    year: slotDateParts.year,
    month: slotDateParts.month,
    day: slotDateParts.day,
    hour: templateTimeParts.hour,
    minute: templateTimeParts.minute,
    second: templateTimeParts.second,
  }, timeZone);
}

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

function createGeneratedEntry(templateEvent, slotStartAt, index) {
  const startAt = createGeneratedStartDate(templateEvent, slotStartAt);
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

function getTemplateEventForSlot(authoredMeetups, slotStartAt) {
  const slotTime = slotStartAt.getTime();
  let templateEvent = authoredMeetups[0].event;

  for (const meetup of authoredMeetups) {
    if (new Date(meetup.event.startAt).getTime() > slotTime) {
      break;
    }

    templateEvent = meetup.event;
  }

  return templateEvent;
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
    const templateEvent = getTemplateEventForSlot(authoredMeetups, cursor);
    entries.push(authoredByDate.get(dateKey) ?? createGeneratedEntry(templateEvent, cursor, entries.length));
    cursor = addDays(cursor, BIWEEKLY_INTERVAL_DAYS);
  }

  return entries;
}

export function buildCalendarTimelineEntries(meetupList, futureCount = CALENDAR_TIMELINE_EVENT_COUNT) {
  const authoredEntries = meetupList
    .filter((meetup) => meetup.event)
    .map(createCalendarEntry);
  const timeZone = authoredEntries[0]?.event.timezone ?? "America/Chicago";
  const entriesByDate = new Map(
    authoredEntries.map((entry) => [formatDateKey(entry.event.startAt, timeZone), entry]),
  );

  buildCalendarEntries(meetupList, futureCount).forEach((entry) => {
    const dateKey = formatDateKey(entry.event.startAt, timeZone);
    if (!entriesByDate.has(dateKey)) {
      entriesByDate.set(dateKey, entry);
    }
  });

  return [...entriesByDate.values()].sort(
    (a, b) => new Date(a.event.startAt).getTime() - new Date(b.event.startAt).getTime(),
  );
}

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function createUtcMonthDate(monthKey, day = 1) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function getMonthKeyFromDateKey(dateKey) {
  return dateKey.slice(0, 7);
}

export function getCalendarEntryDateKey(entry, timeZone = "America/Chicago") {
  return formatDateKey(entry.event.startAt, timeZone);
}

export function getCalendarEntryMonthKey(entry, timeZone = "America/Chicago") {
  return getMonthKeyFromDateKey(getCalendarEntryDateKey(entry, timeZone));
}

export function getTodayDateKey(timeZone = "America/Chicago") {
  return formatDateKey(new Date().toISOString(), timeZone);
}

export function getCalendarMonthLabel(monthKey) {
  return MONTH_LABEL_FORMATTER.format(createUtcMonthDate(monthKey));
}

export function addCalendarMonths(monthKey, amount) {
  const [year, month] = monthKey.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1 + amount, 1, 12));
  return `${next.getUTCFullYear()}-${padDatePart(next.getUTCMonth() + 1)}`;
}

export function groupCalendarEntriesByDate(entries, timeZone = "America/Chicago") {
  return entries.reduce((groups, entry) => {
    const dateKey = getCalendarEntryDateKey(entry, timeZone);
    const current = groups.get(dateKey) ?? [];
    current.push(entry);
    groups.set(dateKey, current);
    return groups;
  }, new Map());
}

export function buildCalendarMonth(monthKey, entries, options = {}) {
  const timeZone = options.timeZone ?? entries[0]?.event.timezone ?? "America/Chicago";
  const todayKey = options.todayKey ?? getTodayDateKey(timeZone);
  const entriesByDate = groupCalendarEntriesByDate(entries, timeZone);
  const firstOfMonth = createUtcMonthDate(monthKey);
  const firstWeekday = firstOfMonth.getUTCDay();
  const daysInMonth = new Date(
    Date.UTC(firstOfMonth.getUTCFullYear(), firstOfMonth.getUTCMonth() + 1, 0, 12),
  ).getUTCDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(
      Date.UTC(
        firstOfMonth.getUTCFullYear(),
        firstOfMonth.getUTCMonth(),
        1 - firstWeekday + index,
        12,
      ),
    );
    const dateKey = formatDateKey(date.toISOString(), timeZone);
    return {
      dateKey,
      dayNumber: date.getUTCDate(),
      isCurrentMonth: getMonthKeyFromDateKey(dateKey) === monthKey,
      isToday: dateKey === todayKey,
      entries: entriesByDate.get(dateKey) ?? [],
    };
  });
}

export function getInitialCalendarEntry(entries, timeZone = "America/Chicago") {
  const now = Date.now();
  return (
    entries.find((entry) => new Date(entry.event.endAt).getTime() >= now) ??
    entries.find((entry) => getCalendarEntryDateKey(entry, timeZone) === getTodayDateKey(timeZone)) ??
    entries[entries.length - 1] ??
    null
  );
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
