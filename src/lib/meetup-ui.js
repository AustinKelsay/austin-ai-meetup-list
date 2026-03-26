export function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toGoogleCalendarTimestamp(value) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl(session) {
  const event = session.event;

  if (!event) {
    return "";
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toGoogleCalendarTimestamp(event.startAt)}/${toGoogleCalendarTimestamp(event.endAt)}`,
    details: event.summary,
    location: [event.locationName, event.locationAddress].filter(Boolean).join(", "),
    ctz: event.timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsHref(session) {
  return `/calendar/${session.slug}.ics`;
}

export function formatEventDate(event) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: event.timezone,
  }).format(new Date(event.startAt));
}

export function formatEventTime(event) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timezone,
    timeZoneName: "short",
  });

  return `${formatter.format(new Date(event.startAt))} - ${formatter.format(new Date(event.endAt))}`;
}

export function getLocationLabel(event) {
  return [event.locationName, event.locationAddress].filter(Boolean).join(" · ");
}

export function formatDateKey(value, timeZone = "America/Chicago") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(new Date(value));

  const part = (type) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function addDays(value, days) {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function createInlineIcsHref(entry) {
  const { event } = entry;
  const location = [event.locationName, event.locationAddress].filter(Boolean).join(", ");
  const detailsUrl = entry.detailsHref
    ? `${window.location.origin}${entry.detailsHref}`
    : window.location.href;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Austin AI Club//Meetups//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${entry.id}@austinai.club`,
    `DTSTAMP:${toGoogleCalendarTimestamp(new Date().toISOString())}`,
    `DTSTART:${toGoogleCalendarTimestamp(event.startAt)}`,
    `DTEND:${toGoogleCalendarTimestamp(event.endAt)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.summary.replace(/\n/g, "\\n")}\\n\\nDetails: ${detailsUrl}`,
    `LOCATION:${location}`,
    `URL:${detailsUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

export function isUpcomingSession(session) {
  if (!session.event) {
    return false;
  }

  return new Date(session.event.endAt).getTime() >= Date.now();
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
