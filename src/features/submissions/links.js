export function parseSubmissionLinks(value) {
  return String(value ?? "")
    .split("\n")
    .map((link) => link.trim())
    .filter(Boolean);
}

export function areValidSubmissionLinks(value, isValidHttpUrl) {
  const links = parseSubmissionLinks(value);
  return links.length > 0 && links.every(isValidHttpUrl);
}
