import { afterEach, describe, expect, it } from "vitest";
import { createInlineIcsHref, escapeIcsText } from "./meetup-ui.js";

const originalWindow = globalThis.window;

describe("escapeIcsText", () => {
  it("escapes text characters that have special meaning in ICS fields", () => {
    expect(escapeIcsText("A, B; C\\D\nE")).toBe("A\\, B\\; C\\\\D\\nE");
  });
});

describe("createInlineIcsHref", () => {
  afterEach(() => {
    globalThis.window = originalWindow;
  });

  it("escapes generated ICS text fields", () => {
    globalThis.window = {
      location: {
        href: "https://austinai.club/calendar",
        origin: "https://austinai.club",
      },
    };

    const href = createInlineIcsHref({
      id: "generated-2026-07-22",
      detailsHref: null,
      event: {
        title: "Austin, AI; Club",
        summary: "Quick AI news rundown,\nwith demos; and back\\slashes.",
        startAt: "2026-07-22T23:00:00.000Z",
        endAt: "2026-07-23T01:00:00.000Z",
        timezone: "America/Chicago",
        locationName: "Bitcoin Park Austin",
        locationAddress: "Austin, TX",
      },
    });
    const body = decodeURIComponent(href.replace(/^data:text\/calendar;charset=utf-8,/, ""));

    expect(body).toContain("SUMMARY:Austin\\, AI\\; Club");
    expect(body).toContain("DESCRIPTION:Quick AI news rundown\\,\\nwith demos\\; and back\\\\slashes.");
    expect(body).toContain("Details: https://austinai.club/calendar");
    expect(body).toContain("LOCATION:Bitcoin Park Austin\\, Austin\\, TX");
  });
});
