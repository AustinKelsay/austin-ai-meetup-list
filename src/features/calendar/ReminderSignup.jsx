import { useEffect, useRef, useState } from "react";
import {
  REMINDER_IFRAME_NAME,
  REMINDER_SIGNUP_URL,
} from "../../app/constants.js";
import {
  formatEventDate,
  formatEventTime,
  isValidEmail,
} from "../../lib/meetup-ui.js";

export default function ReminderSignup({ nextSession, variant = "default" }) {
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
          <h3>You&apos;re subscribed.</h3>
          <p>We&apos;ll send a reminder on meetup days around 10:00 AM CT.</p>
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
