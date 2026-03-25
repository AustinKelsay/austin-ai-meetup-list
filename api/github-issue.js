const DEFAULT_REPO_OWNER = "AustinKelsay";
const DEFAULT_REPO_NAME = "austin-ai-meetup-list";
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

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
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

  if (input.kind === "link") {
    return {
      title: `[Link] ${input.title}`,
      labels: ["link"],
      body: [
        "New meetup link submission.",
        "",
        `Title: ${input.title}`,
        `URL: ${input.url}`,
        "",
        `Submitted from: ${input.pageUrl || "unknown"}`,
        `Submitted at: ${submittedAt}`,
      ].join("\n"),
    };
  }

  return {
      title: `[Showcase] ${input.title}`,
      labels: ["showcase"],
      body: [
        "New showcase submission.",
      "",
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
  const label = LABEL_CONFIG[name];
  if (!label) {
    return;
  }

  const labelResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/labels`, {
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
  });

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

  if (kind !== "link" && kind !== "showcase") {
    response.status(400).json({ error: "Unsupported submission type." });
    return;
  }

  if (!title) {
    response.status(400).json({ error: "Title is required." });
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
  });

  try {
    await ensureLabel({ owner, repo, token, name: kind });
  } catch (error) {
    response.status(502).json({
      error: error.message || "Failed to ensure GitHub label.",
    });
    return;
  }

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
      error: "Failed to connect to GitHub API.",
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
