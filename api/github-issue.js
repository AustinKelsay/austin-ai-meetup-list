import { meetups } from "../src/data.js";
import { getNextSubmissionTarget } from "../src/features/calendar/calendar.js";
import { parseSubmissionLinks } from "../src/features/submissions/links.js";

const DEFAULT_REPO_OWNER = "AustinKelsay";
const DEFAULT_REPO_NAME = "austin-ai-club";

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getTargetLabel(target) {
  const dateLabel = target.date ?? new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: target.event.timezone ?? "America/Chicago",
  }).format(new Date(target.event.startAt));

  return `${dateLabel} · ${target.event.locationName}`;
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatLinksForIssue(links) {
  if (links.length === 1) {
    return [`URL: ${links[0]}`];
  }

  return [
    "Links:",
    ...links.map((link) => `- ${link}`),
  ];
}

function buildIssuePayload(input) {
  const submittedAt = new Date().toISOString();
  const targetLine = `Target: ${input.targetLabel} (${input.targetSlug}, ${input.targetKind})`;

  if (input.kind === "link") {
    return {
      title: `[${input.targetSlug}] [Link] ${input.title}`,
      labels: ["link"],
      body: [
        "New link submission.",
        "",
        targetLine,
        `Title: ${input.title}`,
        ...formatLinksForIssue(input.links),
        "",
        `Submitted from: ${input.pageUrl || "unknown"}`,
        `Submitted at: ${submittedAt}`,
      ].join("\n"),
    };
  }

  return {
      title: `[${input.targetSlug}] [Showcase] ${input.title}`,
    labels: ["showcase"],
    body: [
      "New showcase submission.",
      "",
      targetLine,
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
  const urls = trimString(payload.urls);
  const url = trimString(payload.url);
  const description = trimString(payload.description);
  const pageUrl = trimString(payload.pageUrl);
  const website = trimString(payload.website);
  const links = parseSubmissionLinks(urls || url);

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

  const target = getNextSubmissionTarget(meetups);
  if (!target) {
    response.status(503).json({ error: "No upcoming meetup or meetup slot is configured." });
    return;
  }

  if (kind === "link" && (!links.length || links.some((link) => !isValidHttpUrl(link)))) {
    response.status(400).json({ error: "One or more valid links are required." });
    return;
  }

  if (kind === "showcase" && !description) {
    response.status(400).json({ error: "A short summary is required." });
    return;
  }

  const issuePayload = buildIssuePayload({
    kind,
    title,
    links,
    description,
    pageUrl,
    targetSlug: target.slug,
    targetKind: target.kind,
    targetLabel: getTargetLabel(target),
  });

  let githubResponse;
  try {
    githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "austin-ai-club",
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
