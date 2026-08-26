import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCalendarEntries, getNextSubmissionTarget } from "./calendar.js";

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

describe("getNextSubmissionTarget", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const cadence = [
    meetup("2026-03-18", "2026-03-18T17:00:00-05:00", "2026-03-18T19:00:00-05:00"),
    meetup("2026-08-05", "2026-08-05T18:00:00-05:00", "2026-08-05T20:00:00-05:00"),
  ];

  it("targets the next authored meetup when one has not ended yet", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-25T13:08:00-05:00"));

    const target = getNextSubmissionTarget([
      ...cadence,
      meetup("2026-08-26", "2026-08-26T18:00:00-05:00", "2026-08-26T20:00:00-05:00"),
    ]);

    expect(target).toMatchObject({
      id: "meetup-2026-08-26",
      kind: "authored",
      slug: "2026-08-26",
    });
  });

  it("targets the default biweekly Meetup Slot after the last authored meetup", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T12:00:00-05:00"));

    const target = getNextSubmissionTarget(cadence);

    expect(target).toMatchObject({
      kind: "generated",
      slug: "2026-08-19",
      event: {
        startAt: "2026-08-19T23:00:00.000Z",
        endAt: "2026-08-20T01:00:00.000Z",
      },
    });
  });

  it("targets the next Wednesday when the biweekly slot passed unauthored", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-25T13:08:00-05:00"));

    const target = getNextSubmissionTarget(cadence);

    expect(target).toMatchObject({
      kind: "generated",
      slug: "2026-08-26",
      event: {
        startAt: "2026-08-26T23:00:00.000Z",
        endAt: "2026-08-27T01:00:00.000Z",
      },
    });
  });

  it("targets the following Wednesday after that slipped meeting has already ended", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-26T21:00:00-05:00"));

    const target = getNextSubmissionTarget(cadence);

    expect(target).toMatchObject({
      kind: "generated",
      slug: "2026-09-02",
    });
  });
});
