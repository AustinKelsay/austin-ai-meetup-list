import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sessions } from "../src/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const publicDir = path.join(repoRoot, "public");
const calendarDir = path.join(publicDir, "calendar");
const outputPath = path.join(publicDir, "meetups.json");
const siteUrl = (process.env.SITE_URL ?? "https://austinai.club").replace(/\/+$/, "");

function formatTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildGoogleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatTimestamp(new Date(event.startAt))}/${formatTimestamp(new Date(event.endAt))}`,
    details: event.summary,
    location: [event.locationName, event.locationAddress].filter(Boolean).join(", "),
    ctz: event.timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsBody(event, detailsUrl) {
  const location = [event.locationName, event.locationAddress].filter(Boolean).join(", ");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Austin AI Club//Meetups//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@austinai.club`,
    `DTSTAMP:${formatTimestamp(new Date())}`,
    `DTSTART:${formatTimestamp(new Date(event.startAt))}`,
    `DTEND:${formatTimestamp(new Date(event.endAt))}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(`${event.summary}\n\nDetails: ${detailsUrl}`)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `URL:${escapeIcsText(detailsUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];

  return lines.join("\r\n");
}

function collectEvents() {
  return sessions
    .filter((session) => session.event)
    .map((session) => {
      const event = session.event;
      const detailsUrl = `${siteUrl}/#${session.id}`;
      const icsPath = `/calendar/${session.slug}.ics`;

      return {
        id: session.slug,
        sessionId: session.id,
        slug: session.slug,
        dateLabel: session.date,
        markdownHref: session.markdownHref,
        title: event.title,
        summary: event.summary,
        startAt: event.startAt,
        endAt: event.endAt,
        timezone: event.timezone,
        locationName: event.locationName,
        locationAddress: event.locationAddress,
        reminderSendHour: event.reminderSendHour,
        detailsUrl,
        googleCalendarUrl: buildGoogleCalendarUrl({
          ...event,
          id: session.slug,
        }),
        icsUrl: `${siteUrl}${icsPath}`,
        icsPath,
      };
    });
}

async function main() {
  const events = collectEvents();

  await fs.mkdir(calendarDir, { recursive: true });
  await Promise.all(
    events.map((event) =>
      fs.writeFile(
        path.join(publicDir, event.icsPath),
        buildIcsBody(event, event.detailsUrl),
        "utf8",
      )),
  );

  const payload = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    events: events.map(({ icsPath, ...event }) => event),
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
