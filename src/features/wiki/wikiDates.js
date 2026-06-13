const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

function getUnit(diffMs) {
  const abs = Math.abs(diffMs);
  if (abs < MINUTE) {
    return "second";
  }
  if (abs < HOUR) {
    return "minute";
  }
  if (abs < DAY) {
    return "hour";
  }
  if (abs < WEEK) {
    return "day";
  }
  if (abs < MONTH) {
    return "week";
  }
  if (abs < YEAR) {
    return "month";
  }
  return "year";
}

function getUnitValue(diffMs, unit) {
  switch (unit) {
    case "second":
      return Math.round(diffMs / SECOND);
    case "minute":
      return Math.round(diffMs / MINUTE);
    case "hour":
      return Math.round(diffMs / HOUR);
    case "day":
      return Math.round(diffMs / DAY);
    case "week":
      return Math.round(diffMs / WEEK);
    case "month":
      return Math.round(diffMs / MONTH);
    case "year":
    default:
      return Math.round(diffMs / YEAR);
  }
}

export function formatRelativeDate(value, now = new Date()) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();

  if (Number.isNaN(time)) {
    return "";
  }

  const diffMs = time - now.getTime();
  const unit = getUnit(diffMs);
  const unitValue = getUnitValue(diffMs, unit);

  if (typeof Intl !== "undefined" && typeof Intl.RelativeTimeFormat === "function") {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(unitValue, unit);
  }

  return unitValue === 0
    ? "now"
    : `${Math.abs(unitValue)} ${unit}${Math.abs(unitValue) === 1 ? "" : "s"} ago`;
}

export function getMeetupDateFromTitle(title) {
  if (!title) {
    return null;
  }
  const match = title.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (!match) {
    return null;
  }
  const [, year, month, day] = match;
  return `${year}-${month}-${day}`;
}
