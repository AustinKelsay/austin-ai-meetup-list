import { useEffect, useMemo, useRef, useState } from "react";
import { sessions } from "./data.js";

const TRACK_CATEGORY = {
  "Local Builds & Projects": "local-builds",
  "Agent Infrastructure": "agent-infra",
  "Models & Research": "models",
  Security: "security",
  "Big Tech Moves": "platform",
};
const REMINDER_SIGNUP_URL = (import.meta.env.VITE_REMINDER_SIGNUP_URL ?? "").trim();
const REMINDER_IFRAME_NAME = "reminder-signup-sink";
const BIWEEKLY_INTERVAL_DAYS = 14;
const DEFAULT_CALENDAR_EVENT_COUNT = 4;
const CALENDAR_PATH = "/calendar";
const LINK_SUBMISSION_PATH = "/submit-link";
const SPOTLIGHT_SUBMISSION_PATH = "/submit-spotlight";
const ISSUE_SUBMISSION_ENDPOINT = "/api/github-issue";
const COMMUNITY_SLOT_LABEL = "Showcase";

const APP_ROUTE = {
  HOME: "home",
  CALENDAR: "calendar",
  SUBMIT_LINK: "submit-link",
  SUBMIT_SPOTLIGHT: "submit-spotlight",
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTrackRouteSlug(track) {
  if (!track) {
    return "welcome";
  }
  return slugify(track.title);
}

function getSlideTrackRouteSlug(slide) {
  if (
    slide.type === "community-title" ||
    slide.type === "community-topic"
  ) {
    return "community";
  }
  return getTrackRouteSlug(slide.track);
}

function getSlideRouteSlug(slide) {
  if (slide.type === "session-intro") {
    return "intro";
  }
  if (slide.type === "track-title") {
    return "intro";
  }
  if (slide.type === "track-outro") {
    return "outro";
  }
  if (slide.type === "community-title") {
    return "intro";
  }
  if (slide.type === "community-topic") {
    return slugify(slide.item.title);
  }
  return slugify(slide.item.title);
}

function buildSlideHash(session, slide) {
  return `#/slides/${session.slug}/${getSlideTrackRouteSlug(slide)}/${getSlideRouteSlug(slide)}`;
}

function parseSlideHash(hash) {
  const normalized = (hash || "").replace(/^#\/?/, "");
  const parts = normalized.split("/").filter(Boolean);

  if (parts[0] !== "slides" || parts.length < 4) {
    return null;
  }

  const [, sessionSlug, trackSlug, slideSlug] = parts;
  return {
    sessionSlug: decodeURIComponent(sessionSlug),
    trackSlug: decodeURIComponent(trackSlug),
    slideSlug: decodeURIComponent(slideSlug),
  };
}

function isCalendarPath(pathname) {
  return pathname === CALENDAR_PATH;
}

function getAppRoute(pathname) {
  if (pathname === CALENDAR_PATH) {
    return APP_ROUTE.CALENDAR;
  }
  if (pathname === LINK_SUBMISSION_PATH) {
    return APP_ROUTE.SUBMIT_LINK;
  }
  if (pathname === SPOTLIGHT_SUBMISSION_PATH) {
    return APP_ROUTE.SUBMIT_SPOTLIGHT;
  }
  return APP_ROUTE.HOME;
}

function toGoogleCalendarTimestamp(value) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildGoogleCalendarUrl(session) {
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

function buildIcsHref(session) {
  return `/calendar/${session.slug}.ics`;
}

function formatEventDate(event) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: event.timezone,
  }).format(new Date(event.startAt));
}

function formatEventTime(event) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timezone,
    timeZoneName: "short",
  });

  return `${formatter.format(new Date(event.startAt))} - ${formatter.format(new Date(event.endAt))}`;
}

function getLocationLabel(event) {
  return [event.locationName, event.locationAddress].filter(Boolean).join(" · ");
}

function formatDateKey(value, timeZone = "America/Chicago") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(new Date(value));

  const part = (type) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function addDays(value, days) {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function createInlineIcsHref(entry) {
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

function isUpcomingSession(session) {
  if (!session.event) {
    return false;
  }
  return new Date(session.event.endAt).getTime() >= Date.now();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

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

function buildCalendarEntries(sessionList, count = DEFAULT_CALENDAR_EVENT_COUNT) {
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

// X embeds are rendered client-side by Twitter's widget script.
function TopicEmbed({ embed }) {
  if (!embed) {
    return null;
  }

  if (embed.type === "tweet") {
    return (
      <div className="embed-wrap">
        <blockquote className="twitter-tweet" data-theme="dark">
          {embed.quote ? (
            <p lang="en" dir="ltr">
              {embed.quote} <a href={embed.href}>link</a>
            </p>
          ) : null}
          {embed.author ? <>— {embed.author} </> : null}
          <a href={embed.href}>
            {embed.date ?? embed.href.replace("?ref_src=twsrc%5Etfw", "")}
          </a>
        </blockquote>
        <span className="embed-caption">
          Embedded post
          {" "}
          <a href={embed.href} target="_blank" rel="noreferrer">
            open direct
          </a>
        </span>
      </div>
    );
  }

  return null;
}

// Video embeds always keep a direct-link escape hatch in the caption.
function VideoEmbed({ video }) {
  if (!video) {
    return null;
  }

  return (
    <div className="video-embed">
      <div className="video-frame">
        <iframe
          src={video.embedHref}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <span className="video-caption">
        {video.caption}{" "}
        <a href={video.href} target="_blank" rel="noreferrer">
          open direct
        </a>
      </span>
    </div>
  );
}

// Topic is the smallest archive unit. Rich media stays in presentation mode.
function Topic({ item }) {
  return (
    <li className="topic">
      <div className="topic-main">
        <h4>
          {item.href ? (
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h4>
        <p>{item.description}</p>
      </div>
      <span className="source-chip">{item.chip}</span>
    </li>
  );
}

// Parse a URL into parts for rich link cards in presentation mode.
function parseLinkMeta(href) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");

    if (host === "github.com") {
      const parts = path.split("/").filter(Boolean);
      const owner = parts[0] || "";
      const repo = parts[1] || "";
      return { kind: "github", host, owner, repo, href };
    }
    if (host === "x.com" || host === "twitter.com") {
      return { kind: "x", host, path, href };
    }
    return { kind: "generic", host, path, href };
  } catch {
    return { kind: "generic", host: href, path: "", href };
  }
}

function LinkCard({ href }) {
  const meta = parseLinkMeta(href);

  if (meta.kind === "github") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="link-card link-card--github"
      >
        <svg className="link-card-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <div className="link-card-body">
          <span className="link-card-domain">github.com</span>
          <span className="link-card-title">{meta.owner}/{meta.repo}</span>
          <span className="link-card-hint">Open repository →</span>
        </div>
      </a>
    );
  }

  if (meta.kind === "x") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="link-card link-card--x"
      >
        <svg className="link-card-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <div className="link-card-body">
          <span className="link-card-domain">x.com</span>
          <span className="link-card-title">View post</span>
          <span className="link-card-hint">Open on X →</span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="link-card link-card--generic"
    >
      <svg className="link-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <div className="link-card-body">
        <span className="link-card-domain">{meta.host}</span>
        {meta.path ? <span className="link-card-title">{meta.path}</span> : null}
        <span className="link-card-hint">Open link →</span>
      </div>
    </a>
  );
}

function LinkPair({ links }) {
  if (!links?.length) {
    return null;
  }

  return (
    <div className="link-pair">
      {links.map((href) => (
        <LinkCard key={href} href={href} />
      ))}
    </div>
  );
}

function ReminderSignup({ nextSession, variant = "default" }) {
  const submitRef = useRef(false);
  const fallbackTimerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const pageUrl = window.location.href;

  const nextEvent = nextSession?.event ?? null;
  const nextLabel = nextEvent
    ? `${formatEventDate(nextEvent)} · ${formatEventTime(nextEvent)}`
    : "We will email you when the next meetup is posted.";
  const formConfigured = Boolean(REMINDER_SIGNUP_URL);

  const handleSubmit = (event) => {
    if (!formConfigured) {
      event.preventDefault();
      setStatus("offline");
      return;
    }

    if (!isValidEmail(email)) {
      event.preventDefault();
      setStatus("invalid");
      return;
    }

    submitRef.current = true;
    setStatus("submitting");
    clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = window.setTimeout(() => {
      submitRef.current = false;
      setEmail("");
      setStatus("success");
    }, 1200);
  };

  const handleIframeLoad = () => {
    if (!submitRef.current) {
      return;
    }

    submitRef.current = false;
    clearTimeout(fallbackTimerRef.current);
    setEmail("");
    setStatus("success");
  };

  useEffect(() => () => {
    clearTimeout(fallbackTimerRef.current);
  }, []);

  return (
    <section className={`reminder-panel reminder-panel--${variant}`} aria-label="Meetup reminders">
      <div className="reminder-copy">
        <p className="reminder-eyebrow">Meetup reminders</p>
        <h2>Subscribe once. Get one reminder on meetup days.</h2>
        <p className="reminder-blurb">
          Enter your email once and we will send a short reminder around 10:00 AM CT whenever
          Austin AI Club is meeting.
        </p>
        <p className="reminder-next">
          <span>Next up</span>
          {nextLabel}
        </p>
      </div>

      {status === "success" ? (
        <div className="reminder-success" role="status" aria-live="polite">
          <p className="reminder-success-kicker">Success</p>
          <h3>You’re subscribed.</h3>
          <p>We’ll send a reminder on meetup days around 10:00 AM CT.</p>
          <button
            type="button"
            className="reminder-reset-btn"
            onClick={() => {
              setStatus("idle");
              setEmail("");
            }}
          >
            add another email
          </button>
        </div>
      ) : (
        <>
          <form
            className="reminder-form"
            action={REMINDER_SIGNUP_URL || undefined}
            method="post"
            target={REMINDER_IFRAME_NAME}
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="reminder-email">
              Email address
            </label>
            <input
              id="reminder-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                }
              }}
              required
            />
            <input type="hidden" name="source" value="austinai.club" />
            <input type="hidden" name="pageUrl" value={pageUrl} />
            <button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "submitting..." : "notify me"}
            </button>
          </form>

          <p className="reminder-help">
            {status === "submitting"
              ? "Submitting your reminder signup..."
              : status === "invalid"
                ? "Enter a valid email address first."
                : status === "offline"
                  ? import.meta.env.DEV
                    ? "Set VITE_REMINDER_SIGNUP_URL to connect the form to Apps Script."
                    : "Reminder signup is temporarily offline."
                  : "One email on meetup days. Unsubscribe any time from the reminder email."}
          </p>
        </>
      )}
      <iframe
        title="Reminder signup"
        name={REMINDER_IFRAME_NAME}
        className="reminder-transport"
        onLoad={handleIframeLoad}
      />
    </section>
  );
}

function CalendarEventCard({ entry, onNavigateBack }) {
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
          <a
            href={entry.detailsHref}
            onClick={() => {
              onNavigateBack();
            }}
          >
            open meetup page
          </a>
        ) : null}
      </div>
    </article>
  );
}

function CalendarView({ calendarEntries, nextSession, onClose }) {
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
            <CalendarEventCard key={entry.id} entry={entry} onNavigateBack={onClose} />
          ))}
        </div>
      </main>
    </section>
  );
}

// Flatten tracks into a linear sequence so presentation mode can move one story at a time.
function buildSlides(session) {
  const slides = [];
  const showcases = session.showcases ?? [];
  if (session.presentationIntro) {
    slides.push({
      type: "session-intro",
      intro: session.presentationIntro,
    });
  }
  session.tracks.forEach((track, trackIndex) => {
    slides.push({
      type: "track-title",
      track,
      trackIndex,
      trackTotal: session.tracks.length,
    });
    track.items.forEach((item, itemIndex) => {
      slides.push({
        type: "topic",
        track,
        trackIndex,
        trackTotal: session.tracks.length,
        item,
        itemIndex,
        itemTotal: track.items.length,
        isLastInTrack: itemIndex === track.items.length - 1,
      });
    });
    if (track.outro) {
      slides.push({
        type: "track-outro",
        track,
        trackIndex,
        trackTotal: session.tracks.length,
        outro: track.outro,
      });
    }
  });
  slides.push({
    type: "community-title",
  });
  if (showcases.length) {
    showcases.forEach((item, itemIndex) => {
      slides.push({
        type: "community-topic",
        item,
        itemIndex,
        itemTotal: showcases.length,
        trackIndex: session.tracks.length,
        trackTotal: session.tracks.length + 1,
        isLastInTrack: itemIndex === showcases.length - 1,
      });
    });
  }
  return slides;
}

function findSlideIndex(session, route) {
  const slides = buildSlides(session);
  return slides.findIndex(
    (slide) =>
      getSlideTrackRouteSlug(slide) === route.trackSlug &&
      getSlideRouteSlug(slide) === route.slideSlug,
  );
}

function resolvePresentationHash(hash) {
  const route = parseSlideHash(hash);
  if (!route) {
    return null;
  }

  const session = sessions.find((candidate) => candidate.slug === route.sessionSlug);
  if (!session) {
    return {
      invalidHash: sessions[0] ? `#${sessions[0].id}` : "",
    };
  }

  const slideIndex = findSlideIndex(session, route);
  if (slideIndex === -1) {
    return {
      invalidHash: `#${session.id}`,
    };
  }

  return { session, slideIndex };
}

function setHash(hash) {
  if (window.location.hash === hash) {
    return;
  }
  window.location.hash = hash;
}

function setPathname(pathname) {
  if (window.location.pathname === pathname) {
    return;
  }
  window.history.pushState({}, "", pathname);
}

function PresentationSlide({ slide, isFinale }) {
  const trackSlug = slide.type === "session-intro"
    ? "local-builds"
    : slide.type.startsWith("community")
      ? "community"
      : TRACK_CATEGORY[slide.track.title];

  if (slide.type === "session-intro") {
    return (
      <div className="pres-slide pres-slide--session-intro" data-track={trackSlug}>
        <span className="pres-intro-eyebrow">{slide.intro.eyebrow}</span>
        <h2 className="pres-intro-title">{slide.intro.title}</h2>
        <p className="pres-intro-blurb">{slide.intro.blurb}</p>
        <a
          className="pres-intro-link"
          href={slide.intro.ctaHref}
          target="_blank"
          rel="noreferrer"
        >
          {slide.intro.ctaLabel}
        </a>
        <ul className="pres-intro-list">
          {slide.intro.bullets.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="pres-intro-note">{slide.intro.hostNote}</p>
      </div>
    );
  }

  if (slide.type === "track-title") {
    return (
      <div className="pres-slide pres-slide--track" data-track={trackSlug}>
        <span className="pres-track-num">
          Track {slide.trackIndex + 1} of {slide.trackTotal}
        </span>
        <h2 className="pres-track-title">{slide.track.title}</h2>
        {slide.track.purpose ? (
          <p className="pres-track-purpose">{slide.track.purpose}</p>
        ) : null}
        <span className="pres-topic-badge">
          {slide.track.items.length} topic{slide.track.items.length !== 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  if (slide.type === "track-outro") {
    return (
      <div className="pres-slide pres-slide--track pres-slide--outro" data-track={trackSlug}>
        <span className="pres-track-num">
          Track {slide.trackIndex + 1} of {slide.trackTotal}
        </span>
        <h2 className="pres-track-title">{slide.outro.title}</h2>
        <p className="pres-track-purpose">{slide.outro.body}</p>
        <span className="pres-topic-badge">discussion prompt</span>
      </div>
    );
  }

  if (slide.type === "community-title") {
    return (
      <div className="pres-slide pres-slide--track" data-track="community">
        <span className="pres-track-num">Final track</span>
        <h2 className="pres-track-title">{COMMUNITY_SLOT_LABEL}</h2>
        <p className="pres-track-purpose">
          Short three to five minute shares at the end of the meetup.
        </p>
        <span className="pres-topic-badge">1 slot</span>
      </div>
    );
  }

  if (slide.type === "community-topic") {
    return (
      <div className={`pres-slide pres-slide--topic${isFinale ? " pres-slide--finale" : ""}`} data-track="community">
        <h3 className="pres-topic-title">
          {slide.item.href ? (
            <a href={slide.item.href} target="_blank" rel="noreferrer">
              {slide.item.title}
            </a>
          ) : (
            slide.item.title
          )}
        </h3>
        <p className="pres-topic-desc">{slide.item.description}</p>
        <span className="source-chip">{slide.item.chip ?? "showcase"}</span>
        {slide.item.notes ? <p className="pres-notes">{slide.item.notes}</p> : null}
        {slide.item.embed ? <TopicEmbed embed={slide.item.embed} /> : null}
        {slide.item.video ? <VideoEmbed video={slide.item.video} /> : null}
        {slide.item.linkPair ? <LinkPair links={slide.item.linkPair} /> : null}
        {slide.item.href &&
        !slide.item.embed &&
        !slide.item.video &&
        !slide.item.linkPair ? (
          <LinkCard href={slide.item.href} />
        ) : null}
      </div>
    );
  }

  return (
    <div className={`pres-slide pres-slide--topic${isFinale ? " pres-slide--finale" : ""}`} data-track={trackSlug}>
      <h3 className="pres-topic-title">
        {slide.item.href ? (
          <a href={slide.item.href} target="_blank" rel="noreferrer">
            {slide.item.title}
          </a>
        ) : (
          slide.item.title
        )}
      </h3>
      <p className="pres-topic-desc">{slide.item.description}</p>
      <span className="source-chip">{slide.item.chip}</span>
      {slide.item.notes ? <p className="pres-notes">{slide.item.notes}</p> : null}
      {slide.item.embed ? <TopicEmbed embed={slide.item.embed} /> : null}
      {slide.item.video ? <VideoEmbed video={slide.item.video} /> : null}
      {slide.item.mediaPair ? (
        <div className="media-pair">
          <VideoEmbed video={slide.item.mediaPair.video} />
          <TopicEmbed embed={slide.item.mediaPair.reaction} />
        </div>
      ) : null}
      {slide.item.linkPair ? <LinkPair links={slide.item.linkPair} /> : null}
      {slide.item.href &&
      !slide.item.embed &&
      !slide.item.video &&
      !slide.item.mediaPair &&
      !slide.item.linkPair ? (
        <LinkCard href={slide.item.href} />
      ) : null}
    </div>
  );
}

function PresentationProgress({ currentIndex, totalSlides, breadcrumb, slideLabel, trackSlug }) {
  const pct = ((currentIndex + 1) / totalSlides) * 100;
  return (
    <div className="pres-bottom" data-track={trackSlug}>
      <div className="pres-bottom-meta">
        <span className="pres-bottom-label">{slideLabel}</span>
        <span className="pres-bottom-breadcrumb">{breadcrumb}</span>
      </div>
      <div className="pres-progress-track">
        <div className="pres-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="pres-bottom-counter">
        {currentIndex + 1} / {totalSlides}
      </span>
    </div>
  );
}

// Presentation mode is intentionally lightweight: URL drives the active slide.
function PresentationMode({ session, currentIndex, onNavigate, onExit }) {
  const slides = useMemo(() => buildSlides(session), [session]);
  const visitedRef = useRef(new Set());
  const touchStartRef = useRef(null);
  const slide = slides[currentIndex];
  if (!slide) {
    return null;
  }

  // Track first visits for one-time animations (e.g. finale slide).
  const isFirstVisit = !visitedRef.current.has(currentIndex);
  visitedRef.current.add(currentIndex);

  // The last topic of the final track gets a special entrance on first visit.
  const isFinale =
    isFirstVisit &&
    slide.isLastInTrack &&
    slide.trackIndex === slide.trackTotal - 1;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;

  const goNext = () => {
    if (!isLast) {
      onNavigate(currentIndex + 1);
    }
  };
  const goPrev = () => {
    if (!isFirst) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (!start || !touch) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // Keep vertical scrolling intact; only treat deliberate horizontal swipes as navigation.
    if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, isFirst, isLast, onExit, onNavigate]);

  // Twitter embed re-render
  useEffect(() => {
    if (window.twttr?.widgets?.load) {
      const timer = setTimeout(() => window.twttr.widgets.load(), 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const breadcrumb = slide.type === "topic"
    ? `${session.date} › ${slide.track.title} › Topic ${slide.itemIndex + 1} of ${slide.itemTotal}`
    : slide.type === "session-intro"
      ? `${session.date} › Welcome`
      : slide.type === "community-title"
        ? `${session.date} › ${COMMUNITY_SLOT_LABEL}`
      : slide.type === "community-topic"
        ? `${session.date} › ${COMMUNITY_SLOT_LABEL} › ${slide.itemIndex + 1} of ${slide.itemTotal}`
        : `${session.date} › ${slide.track.title}`;

  const slideLabel =
    slide.type === "session-intro"
      ? "Welcome"
      : slide.type === "topic"
      ? `Topic ${slide.itemIndex + 1} of ${slide.itemTotal}`
      : slide.type === "community-topic"
        ? `${COMMUNITY_SLOT_LABEL} ${slide.itemIndex + 1} of ${slide.itemTotal}`
      : slide.type === "community-title"
        ? `Track ${session.tracks.length + 1} of ${session.tracks.length + 1}`
      : slide.type === "track-outro"
        ? "Discussion prompt"
        : `Track ${slide.trackIndex + 1} of ${slide.trackTotal}`;

  const trackSlug = slide.type === "session-intro"
    ? "local-builds"
    : slide.type === "community-title"
      ? "community"
    : slide.type === "community-topic"
      ? "community"
    : TRACK_CATEGORY[slide.track.title];

  return (
    <div className="pres-overlay" data-track={trackSlug}>
      <div className="pres-topbar">
        <span className="pres-breadcrumb">{breadcrumb}</span>
        <button className="pres-exit-btn" onClick={onExit}>
          esc exit
        </button>
      </div>

      <div className="pres-content">
        <button
          className="pres-nav pres-nav--prev"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div
          className="pres-stage"
          key={currentIndex}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <PresentationSlide slide={slide} isFinale={isFinale} />
        </div>

        <button
          className="pres-nav pres-nav--next"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <PresentationProgress
        currentIndex={currentIndex}
        totalSlides={slides.length}
        breadcrumb={breadcrumb}
        slideLabel={slideLabel}
        trackSlug={trackSlug}
      />
      <div className="pres-mobile-controls" data-track={trackSlug}>
        <button
          className="pres-mobile-btn"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous slide"
        >
          Prev
        </button>
        <span className="pres-mobile-hint">swipe or tap to navigate</span>
        <button
          className="pres-mobile-btn"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next slide"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Track({ track, index }) {
  return (
    <details className="track" id={track.id} data-track={TRACK_CATEGORY[track.title]}>
      <summary className="track-header">
        <h3>
          <span className="track-chevron" aria-hidden="true"></span>
          <span className="track-num">{String(index + 1).padStart(2, "0")}</span>{" "}
          {track.title}
        </h3>
        <span className="track-count">
          {track.items.length} topic{track.items.length !== 1 ? "s" : ""}
        </span>
      </summary>
      <ul className="topic-list">
        {track.items.map((item) => (
          <Topic key={item.title} item={item} />
        ))}
      </ul>
    </details>
  );
}

function CommunityTrack({ index, items = [] }) {
  return (
    <details className="track" id="showcase" data-track="community">
      <summary className="track-header">
        <h3>
          <span className="track-chevron" aria-hidden="true"></span>
          <span className="track-num">{String(index + 1).padStart(2, "0")}</span>{" "}
          {COMMUNITY_SLOT_LABEL}
        </h3>
        <span className="track-count">
          {items.length ? `${items.length} slot${items.length !== 1 ? "s" : ""}` : "open"}
        </span>
      </summary>
      <div className="community-track-body">
        {items.length ? (
          <ul className="topic-list community-topic-list">
            {items.map((item) => (
              <Topic key={item.title} item={item} />
            ))}
          </ul>
        ) : (
          <p className="community-slot-blurb">
            A showcase is something you want to showcase or talk about for three to five minutes at
            the meetup.
          </p>
        )}
        <div className="community-track-footer">
          <p className="community-slot-eyebrow">
            {items.length ? "At the end of the meetup" : "Open slot at the end"}
          </p>
          <a href={SPOTLIGHT_SUBMISSION_PATH}>submit a showcase</a>
          <a href={LINK_SUBMISSION_PATH}>submit a regular link</a>
        </div>
      </div>
    </details>
  );
}

function SessionEventBar({ session }) {
  if (!session.event) {
    return null;
  }

  const event = session.event;

  return (
    <div className="session-event">
      <div className="session-event-meta">
        <span>{formatEventDate(event)}</span>
        <span>{formatEventTime(event)}</span>
        <span>{getLocationLabel(event)}</span>
      </div>
      <div className="session-event-actions">
        <a href={buildGoogleCalendarUrl(session)} target="_blank" rel="noreferrer">
          add to Google Calendar
        </a>
        <a href={buildIcsHref(session)}>
          download ICS
        </a>
      </div>
    </div>
  );
}

// Session owns summary metadata like total topic count and anchor navigation.
function Session({ session, onPresent }) {
  const topicCount = session.tracks.reduce(
    (sum, track) => sum + track.items.length,
    0,
  );
  const showcaseCount = session.showcases?.length ?? 0;
  const isUpcoming = isUpcomingSession(session);
  const totalTrackCount = session.tracks.length + 1;

  return (
    <details
      className={`session ${isUpcoming ? "session--upcoming" : "session--past"}`}
      id={session.id}
    >
      <summary className="session-header">
        <div className="session-date">
          <span className="chevron" aria-hidden="true"></span>
          <h2>{session.date}</h2>
          <button
            className="pres-enter-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPresent(session);
            }}
          >
            ▶ slideshow mode
          </button>
        </div>
        <p className="session-meta">
          {topicCount + showcaseCount} topics &middot; {totalTrackCount} tracks
        </p>
        <nav className="track-nav" aria-label={`${session.date} tracks`}>
          {session.tracks.map((track) => (
            <a key={track.id} href={`#${track.id}`} data-track={TRACK_CATEGORY[track.title]}>
              {track.title.toLowerCase()}
            </a>
          ))}
          <a href="#showcase" data-track="community">
            {COMMUNITY_SLOT_LABEL.toLowerCase()}
          </a>
        </nav>
      </summary>

      <div className="session-body">
        <SessionEventBar session={session} />
        {session.tracks.map((track, index) => (
          <Track key={track.id} track={track} index={index} />
        ))}
        <CommunityTrack index={session.tracks.length} items={session.showcases} />
      </div>
    </details>
  );
}

function SubmissionScreen({
  kind,
  title,
  eyebrow,
  description,
  fields,
  onBack,
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""])),
  );
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const pageUrl = window.location.href;

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (kind === "link" && !isValidHttpUrl(values.url)) {
      setStatus("error");
      setErrorMessage("Enter a valid http:// or https:// link.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(ISSUE_SUBMISSION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind,
          pageUrl,
          ...values,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Submission failed.");
      }

      setStatus("success");
      setValues(Object.fromEntries(fields.map((field) => [field.name, ""])));
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || "Submission failed.");
    }
  };

  return (
    <section className="submission-screen" aria-label={title}>
      <header className="submission-header">
        <div>
          <p className="submission-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="submission-blurb">{description}</p>
        </div>
        <button className="calendar-close-btn" onClick={onBack}>
          back to meetup page
        </button>
      </header>

      <div className="submission-layout">
        <form className="submission-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name} className="submission-field">
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  required={field.required}
                  rows={field.rows ?? 5}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  required={field.required}
                  inputMode={field.inputMode}
                />
              )}
            </label>
          ))}

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "submitting..." : "send to github"}
          </button>

          <p className="submission-status" data-status={status}>
            {status === "success"
              ? "Issue created. It should now be in the repo with the correct label."
              : status === "error"
                ? errorMessage
                : kind === "link"
                  ? "This creates a GitHub issue labeled link."
                  : `This creates a GitHub issue labeled ${COMMUNITY_SLOT_LABEL.toLowerCase()}.`}
          </p>

          <div className="submission-form-switch">
            {kind === "link" ? (
              <a href={SPOTLIGHT_SUBMISSION_PATH}>or propose a showcase instead →</a>
            ) : (
              <a href={LINK_SUBMISSION_PATH}>or submit a link instead →</a>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [presentationState, setPresentationState] = useState(() =>
    resolvePresentationHash(window.location.hash),
  );
  const [route, setRoute] = useState(() => getAppRoute(window.location.pathname));
  const calendarEntries = useMemo(() => buildCalendarEntries(sessions), []);
  const nextSession = useMemo(
    () => calendarEntries.find((entry) => new Date(entry.event.endAt).getTime() >= Date.now()) ?? null,
    [calendarEntries],
  );
  const openRoute = (pathname) => {
    setPathname(pathname);
    setRoute(getAppRoute(pathname));
  };
  const closeAuxRoute = () => {
    openRoute("/");
  };

  useEffect(() => {
    // Reuse the widget loader when possible so React re-renders do not pile up scripts.
    const existing = window.twttr;
    if (existing?.widgets?.load) {
      existing.widgets.load();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      setRoute(getAppRoute(window.location.pathname));
      const next = resolvePresentationHash(window.location.hash);

      if (next?.invalidHash !== undefined) {
        setPresentationState(null);
        if (next.invalidHash) {
          setHash(next.invalidHash);
        }
        return;
      }

      setPresentationState(next);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, []);

  useEffect(() => {
    if (route === APP_ROUTE.HOME) {
      return undefined;
    }

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        closeAuxRoute();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [route]);

  const openPresentation = (session, slideIndex = 0) => {
    const slides = buildSlides(session);
    const slide = slides[slideIndex];
    if (!slide) {
      return;
    }

    setHash(buildSlideHash(session, slide));
  };

  const closePresentation = (session) => {
    setHash(`#${session.id}`);
  };

  if (route === APP_ROUTE.CALENDAR) {
    return (
      <CalendarView
        calendarEntries={calendarEntries}
        nextSession={nextSession}
        onClose={closeAuxRoute}
      />
    );
  }

  if (route === APP_ROUTE.SUBMIT_LINK) {
    return (
      <SubmissionScreen
        kind="link"
        eyebrow="Submit a link"
        title="Add a meetup link"
        description="A link is simply a link you are submitting that you want to be talked about generally."
        fields={[
          {
            name: "title",
            label: "Title",
            type: "text",
            placeholder: "Short label for the link",
            required: true,
          },
          {
            name: "url",
            label: "Link",
            type: "url",
            inputMode: "url",
            placeholder: "https://example.com",
            required: true,
          },
        ]}
        onBack={closeAuxRoute}
      />
    );
  }

  if (route === APP_ROUTE.SUBMIT_SPOTLIGHT) {
    return (
      <SubmissionScreen
        kind="showcase"
        eyebrow={COMMUNITY_SLOT_LABEL}
        title="Propose a showcase"
        description="A showcase is something you want to showcase or talk about for three to five minutes at the meetup."
        fields={[
          {
            name: "title",
            label: "Topic title",
            type: "text",
            placeholder: "What you want to talk about",
            required: true,
          },
          {
            name: "description",
            label: "What you want to cover",
            type: "textarea",
            placeholder: "What do you want to showcase or talk about for three to five minutes?",
            required: true,
            rows: 6,
          },
        ]}
        onBack={closeAuxRoute}
      />
    );
  }

  const upcomingSessions = sessions.filter(isUpcomingSession);
  const pastSessions = sessions.filter((session) => !isUpcomingSession(session));

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-left">
          <div className="window-controls" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="brand">
            <span className="brand-mark">$</span>
            <div>
              <p className="eyebrow">Austin AI Club</p>
              <h1>austinai.club</h1>
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <button className="topbar-link" onClick={() => openRoute(LINK_SUBMISSION_PATH)}>
            submit link
          </button>
          <button className="topbar-link" onClick={() => openRoute(SPOTLIGHT_SUBMISSION_PATH)}>
            showcase
          </button>
          <button className="calendar-open-btn" onClick={() => openRoute(CALENDAR_PATH)}>
            calendar
          </button>
        </div>
      </header>

      <nav className="session-index" aria-label="Austin AI Club dates">
        {sessions.map((session) => (
          <a key={session.id} href={`#${session.id}`} className="index-link">
            {session.slug}
          </a>
        ))}
      </nav>

      <main className="archive">
        {upcomingSessions.map((session) => (
          <Session
            key={session.id}
            session={session}
            onPresent={(targetSession) => openPresentation(targetSession, 0)}
          />
        ))}
        {upcomingSessions.length > 0 && pastSessions.length > 0 && (
          <div className="session-divider" aria-hidden="true">
            <span>Past meetups</span>
          </div>
        )}
        {pastSessions.map((session) => (
          <Session
            key={session.id}
            session={session}
            onPresent={(targetSession) => openPresentation(targetSession, 0)}
          />
        ))}
      </main>

      {presentationState?.session && (
        <PresentationMode
          session={presentationState.session}
          currentIndex={presentationState.slideIndex}
          onNavigate={(slideIndex) => openPresentation(presentationState.session, slideIndex)}
          onExit={() => closePresentation(presentationState.session)}
        />
      )}

      <footer className="footer">
        <div className="footer-brand">
          <p className="footer-label">Austin AI Club</p>
          <p className="footer-copy">
            Local archive and presentation layer for monthly topics, demos, and discussion.
          </p>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/AustinKelsay/austin-ai-meetup-list"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a href={LINK_SUBMISSION_PATH}>Submit link</a>
          <a href={SPOTLIGHT_SUBMISSION_PATH}>{COMMUNITY_SLOT_LABEL}</a>
          <a href="./topics/README.md">Meetup notes</a>
        </div>
      </footer>
    </div>
  );
}
