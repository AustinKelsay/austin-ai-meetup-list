export const TRACK_CATEGORY = {
  "Local Builds & Projects": "local-builds",
  SHIPPED: "shipped",
  "Agent Infrastructure": "agent-infra",
  "Models & Research": "models",
  Security: "security",
  "Big Tech Moves": "platform",
};

export const REMINDER_SIGNUP_URL = (import.meta.env.VITE_REMINDER_SIGNUP_URL ?? "").trim();
export const REMINDER_IFRAME_NAME = "reminder-signup-sink";
export const BIWEEKLY_INTERVAL_DAYS = 14;
export const DEFAULT_CALENDAR_EVENT_COUNT = 4;
export const CALENDAR_PATH = "/calendar";
export const LINK_SUBMISSION_PATH = "/submit-link";
export const SHOWCASE_SUBMISSION_PATH = "/submit-showcase";
export const ISSUE_SUBMISSION_ENDPOINT = "/api/github-issue";
export const COMMUNITY_SLOT_LABEL = "Showcase";

export const APP_ROUTE = {
  HOME: "home",
  CALENDAR: "calendar",
  SUBMIT_LINK: "submit-link",
  SUBMIT_SHOWCASE: "submit-showcase",
};
