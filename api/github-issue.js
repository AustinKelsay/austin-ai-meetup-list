import { sessions } from "../src/data.js";
import { nextMeetupFromSessions } from "../src/meetups.js";

const DEFAULT_REPO_OWNER = "AustinKelsay";
const DEFAULT_REPO_NAME = "austin-ai-meetup-list";
const DEFAULT_FETCH_TIMEOUT_MS = 8000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const submissionAttempts = new Map();
const LABEL_CONFIG = {
  link: {
    color: "2bc98b",
    description: "Regular meetup link submission",
  },
  showcase: {
    color: "5a92d8",
    description: "Short member-led showcase proposal",
  },
};

function getMeetupLabelName(slug) {
  return `meetup-${slug}`;
}

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getFetchTimeoutMs() {
  const value = Number.parseInt(process.env.GITHUB_API_TIMEOUT_MS ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_FETCH_TIMEOUT_MS;
}

function getNextMeetup() {
  return nextMeetupFromSessions(sessions);
}

function getMeetupLabel(session) {
  return `${session.date} · ${session.event.locationName}`;
}

function getClientKey(request) {
  const forwardedFor = trimString(request.headers?.["x-forwarded-for"]?.split(",")[0]);
  return forwardedFor || request.socket?.remoteAddress || "unknown";
}

function pruneSubmissionAttempts(now) {
  for (const [key, timestamps] of submissionAttempts.entries()) {
    const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (recentTimestamps.length === 0) {
      submissionAttempts.delete(key);
      continue;
    }
    submissionAttempts.set(key, recentTimestamps);
  }
}

function isRateLimited(request) {
  const now = Date.now();
  const key = getClientKey(request);
  pruneSubmissionAttempts(now);

  const recentAttempts = submissionAttempts.get(key) ?? [];

  if (recentAttempts.length >= RATE_LIMIT_MAX_REQUESTS) {
    submissionAttempts.set(key, recentAttempts);
    return true;
  }

  recentAttempts.push(now);
  submissionAttempts.set(key, recentAttempts);
  return false;
}

async function fetchWithTimeout(url, options, timeoutMs, timeoutMessage) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(timeoutMessage);
    }
    throw new Error(error.message || "Network request failed.");
  } finally {
    clearTimeout(timeoutId);
  }
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function buildIssuePayload(input) {
  const submittedAt = new Date().toISOString();
  const meetupLine = `Meetup: ${input.meetupLabel} (${input.meetupSlug})`;
  const meetupLabelName = getMeetupLabelName(input.meetupSlug);

  if (input.kind === "link") {
    return {
      title: `[${input.meetupSlug}] [Link] ${input.title}`,
      labels: ["link", meetupLabelName],
      body: [
        "New meetup link submission.",
        "",
        meetupLine,
        `Title: ${input.title}`,
        `URL: ${input.url}`,
        "",
        `Submitted from: ${input.pageUrl || "unknown"}`,
        `Submitted at: ${submittedAt}`,
      ].join("\n"),
    };
  }

  return {
    title: `[${input.meetupSlug}] [Showcase] ${input.title}`,
    labels: ["showcase", meetupLabelName],
    body: [
      "New showcase submission.",
      "",
      meetupLine,
      `Title: ${input.title}`,
      "",
      "Summary:",
      input.description,
      "",
      `Submitted from: ${input.pageUrl || "unknown"}`,
      `Submitted at: ${submittedAt}`,
    ].join("\n"),
  };
}

async function ensureLabel({ owner, repo, token, name }) {
  const label = LABEL_CONFIG[name] ?? (
    name.startsWith("meetup-")
      ? {
          color: "f4b400",
          description: `Submissions for ${name.replace(/^meetup-/, "")}`,
        }
      : null
  );

  if (!label) {
    return;
  }

  const labelResponse = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}/labels`,
    {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "austin-ai-meetup-list",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      name,
      color: label.color,
      description: label.description,
    }),
    },
    getFetchTimeoutMs(),
    `Timed out while ensuring label "${name}".`,
  );

  if (labelResponse.ok || labelResponse.status === 422) {
    return;
  }

  const details = await labelResponse.text();
  throw new Error(`Failed to ensure label "${name}": ${details}`);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const token = process.env.GITHUB_ISSUES_TOKEN;
  const owner = trimString(process.env.GITHUB_ISSUES_OWNER) || DEFAULT_REPO_OWNER;
  const repo = trimString(process.env.GITHUB_ISSUES_REPO) || DEFAULT_REPO_NAME;

  if (!token) {
    response.status(500).json({ error: "GITHUB_ISSUES_TOKEN is not configured." });
    return;
  }

  const payload = request.body ?? {};

  const kind = trimString(payload.kind);
  const title = trimString(payload.title);
  const url = trimString(payload.url);
  const description = trimString(payload.description);
  const pageUrl = trimString(payload.pageUrl);
  const website = trimString(payload.website);

  if (website) {
    response.status(400).json({ error: "Invalid submission." });
    return;
  }

  if (isRateLimited(request)) {
    response.status(429).json({ error: "Too many submissions. Try again later." });
    return;
  }

  if (kind !== "link" && kind !== "showcase") {
    response.status(400).json({ error: "Unsupported submission type." });
    return;
  }

  if (!title) {
    response.status(400).json({ error: "Title is required." });
    return;
  }

  const meetup = getNextMeetup();
  if (!meetup) {
    response.status(503).json({ error: "No upcoming meetup is configured." });
    return;
  }

  if (kind === "link" && !isValidHttpUrl(url)) {
    response.status(400).json({ error: "A valid link is required." });
    return;
  }

  if (kind === "showcase" && !description) {
    response.status(400).json({ error: "A short summary is required." });
    return;
  }

  const issuePayload = buildIssuePayload({
    kind,
    title,
    url,
    description,
    pageUrl,
    meetupSlug: meetup.slug,
    meetupLabel: getMeetupLabel(meetup),
  });

  try {
    await ensureLabel({ owner, repo, token, name: kind });
    await ensureLabel({ owner, repo, token, name: getMeetupLabelName(meetup.slug) });
  } catch (error) {
    response.status(502).json({
      error: error.message || "Failed to ensure GitHub label.",
    });
    return;
  }

  let githubResponse;
  try {
    githubResponse = await fetchWithTimeout(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "austin-ai-meetup-list",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify(issuePayload),
      },
      getFetchTimeoutMs(),
      "Timed out while creating the GitHub issue.",
    );
  } catch (error) {
    response.status(502).json({
      error: error.message || "Failed to connect to GitHub API.",
      details: error.message,
    });
    return;
  }

  if (!githubResponse.ok) {
    const error = await githubResponse.text();
    response.status(502).json({
      error: "GitHub issue creation failed.",
      details: error,
    });
    return;
  }

  const issue = await githubResponse.json();
  response.status(200).json({
    ok: true,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
  });
}
