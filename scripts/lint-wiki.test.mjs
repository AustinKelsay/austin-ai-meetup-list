import { describe, expect, it } from "vitest";
import { checkDatedSourceLinkRecordHierarchy } from "./lint-wiki.mjs";

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
