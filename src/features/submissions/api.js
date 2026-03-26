import { COMMUNITY_SLOT_LABEL, ISSUE_SUBMISSION_ENDPOINT } from "../../app/constants.js";
import { isValidHttpUrl } from "../../lib/meetup-ui.js";
import { areValidSubmissionLinks } from "./links.js";

export async function submitIssueSubmission({ kind, values, website, pageUrl }) {
  const response = await fetch(ISSUE_SUBMISSION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kind,
      pageUrl,
      website,
      ...values,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Submission failed.");
  }

  return payload;
}

export function getSubmissionIdleMessage(kind, meetupDate) {
  if (kind === "link") {
    return `This creates a GitHub issue for ${meetupDate ?? "the next meetup"} labeled link.`;
  }

  return `This creates a GitHub issue for ${meetupDate ?? "the next meetup"} labeled ${COMMUNITY_SLOT_LABEL.toLowerCase()}.`;
}

export function validateSubmissionInput(kind, values) {
  if (kind === "link" && !areValidSubmissionLinks(values.urls, isValidHttpUrl)) {
    return "Enter one or more valid http:// or https:// links, one per line.";
  }

  return "";
}
