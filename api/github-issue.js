import { sessions } from "../src/data.js";
import { nextMeetupFromSessions } from "../src/meetups.js";

const DEFAULT_REPO_OWNER = "AustinKelsay";
const DEFAULT_REPO_NAME = "austin-ai-meetup-list";

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getNextMeetup() {
  return nextMeetupFromSessions(sessions);
}

function getMeetupLabel(session) {
  return `${session.date} · ${session.event.locationName}`;
}

function getMeetupLabelName(slug) {
  return `meetup-${slug}`;
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

  let githubResponse;
  try {
    githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "austin-ai-meetup-list",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(issuePayload),
    });
  } catch (error) {
    response.status(502).json({
      error: error.message || "Failed to connect to GitHub API.",
    });
    return;
  }

  if (!githubResponse.ok) {
    const details = await githubResponse.text();
    response.status(502).json({
      error: "GitHub issue creation failed.",
      details,
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
