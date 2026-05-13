import { describe, expect, it } from "vitest";
import {
  checkDatedSourceLinkRecordHierarchy,
  checkMentionedInTopicTitles,
} from "./lint-wiki.mjs";

describe("checkDatedSourceLinkRecordHierarchy", () => {
  it("rejects source bullets directly under dated source record sections", () => {
    const errors = checkDatedSourceLinkRecordHierarchy(
      "public/topics/raw/articles/2026-05-13-link-records.md",
      `# May 13, 2026 Source Link Records

## Agent Infrastructure

- Sandcastle repo: https://github.com/mattpocock/sandcastle
`,
    );

    expect(errors).toEqual([
      'public/topics/raw/articles/2026-05-13-link-records.md:5: source bullets must be nested under a Topic or Showcase heading inside "Agent Infrastructure"',
    ]);
  });

  it("accepts source bullets under Topic and Showcase headings", () => {
    const errors = checkDatedSourceLinkRecordHierarchy(
      "public/topics/raw/articles/2026-05-13-link-records.md",
      `# May 13, 2026 Source Link Records

## Agent Infrastructure

### Sandcastle

- Sandcastle repo: https://github.com/mattpocock/sandcastle

## Showcase

### Community Slot

- Signup link: https://example.com/showcase
`,
    );

    expect(errors).toEqual([]);
  });
});

describe("checkMentionedInTopicTitles", () => {
  it("rejects concept and entity Mentioned In bullets without bold topic titles", () => {
    const errors = checkMentionedInTopicTitles(
      "public/topics/concepts/coding-agents.md",
      `# Coding Agents

## Mentioned In

- [[Austin AI Club - May 13, 2026]]: Sandcastle and SubQ.
`,
      "concept",
    );

    expect(errors).toEqual([
      "public/topics/concepts/coding-agents.md:5: Mentioned In bullets for concept/entity pages must include at least one bold exact Topic Title",
    ]);
  });

  it("rejects concept and entity Mentioned In bullets without meetup wikilinks", () => {
    const errors = checkMentionedInTopicTitles(
      "public/topics/entities/openai.md",
      `# OpenAI

## Mentioned In

- May 13 meetup: **OpenAI Privacy Filter gets inverted**.
`,
      "entity",
    );

    expect(errors).toEqual([
      "public/topics/entities/openai.md:5: Mentioned In bullets for concept/entity pages must start with a meetup wikilink",
    ]);
  });

  it("accepts concept and entity Mentioned In bullets with meetup links and bold topic titles", () => {
    const errors = checkMentionedInTopicTitles(
      "public/topics/concepts/coding-agents.md",
      `# Coding Agents

## Mentioned In

- [[Austin AI Club - May 13, 2026]]: **Sandcastle** and **SubQ goes after 12M-token context**.
`,
      "concept",
    );

    expect(errors).toEqual([]);
  });
});
