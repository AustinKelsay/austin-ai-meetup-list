import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCalendarEntries } from "./calendar.js";

const baseEvent = {
  title: "Austin AI Club",
  summary: "Quick AI news rundown, demos, and open discussion.",
  timezone: "America/Chicago",
  locationName: "Bitcoin Park Austin",
  locationAddress: "Austin, TX",
  reminderSendHour: 10,
};

function meetup(slug, startAt, endAt) {
  return {
    id: `meetup-${slug}`,
    slug,
    date: slug,
    event: {
      ...baseEvent,
      startAt,
      endAt,
    },
  };
}

describe("buildCalendarEntries", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the most recent authored meetup time for generated future slots", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-09T12:00:00-05:00"));

    const entries = buildCalendarEntries([
      meetup("2026-03-18", "2026-03-18T17:00:00-05:00", "2026-03-18T19:00:00-05:00"),
      meetup("2026-07-08", "2026-07-08T18:00:00-05:00", "2026-07-08T20:00:00-05:00"),
    ], 1);

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      kind: "generated",
      slug: "2026-07-22",
      event: {
        startAt: "2026-07-22T23:00:00.000Z",
        endAt: "2026-07-23T01:00:00.000Z",
      },
    });
  });
});
