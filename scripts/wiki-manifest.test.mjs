import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildWikiManifest } from "./wiki-manifest.mjs";

let tempDirs = [];

async function writeFile(root, relativePath, content) {
  const targetPath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content, "utf8");
}

async function createTopicsDir(files) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "wiki-manifest-"));
  tempDirs.push(root);

  for (const [relativePath, content] of Object.entries(files)) {
    await writeFile(root, relativePath, content);
  }

  return root;
}

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs = [];
});

describe("buildWikiManifest", () => {
  it("turns wiki markdown into catalog pages, links, backlinks, excerpts, and graph data", async () => {
    const topicsDir = await createTopicsDir({
      "index.md": "# Wiki Index\n\n- [[OpenAI]]\n",
      "entities/openai.md": `---
title: OpenAI
created: 2026-05-05
updated: 2026-05-05
type: entity
tags: [entity, company, model]
sources: [raw/articles/openai.md]
---

# OpenAI

OpenAI is a recurring Austin AI Club entity because its model releases shape builder discussions.

Release notes: https://openai.com/release

Duplicate reference: https://openai.com/release

## Related

- [[Coding Agents]]
- [[Missing Page]]
`,
      "concepts/coding-agents.md": `---
title: Coding Agents
created: 2026-05-05
updated: 2026-05-05
type: concept
tags: [concept, agent-infrastructure]
sources: []
---

# Coding Agents

Coding agents are tools that let models read, modify, test, or reason about codebases.

## Related

- [[OpenAI]]
`,
      "raw/articles/openai.md": `---
title: OpenAI Source Records
created: 2026-05-05
updated: 2026-05-05
type: summary
tags: [source-record]
sources: []
---

# OpenAI Source Records

Public link records for [[OpenAI]].

- Release: https://example.com/source
`,
    });

    const manifest = await buildWikiManifest({ topicsDir });

    expect(manifest.pages.map((page) => page.id)).toEqual([
      "coding-agents",
      "openai",
      "openai-source-records",
    ]);
    expect(manifest.rawPages.map((page) => page.id)).toEqual([]);

    const openai = manifest.pagesById.openai;
    expect(openai).toMatchObject({
      id: "openai",
      title: "OpenAI",
      type: "entity",
      tags: ["entity", "company", "model"],
      rawHref: "/topics/entities/openai.md",
      sourceCount: 1,
      sourceLinks: ["https://openai.com/release"],
      excerpt:
        "OpenAI is a recurring Austin AI Club entity because its model releases shape builder discussions.",
      outgoingIds: ["coding-agents"],
      unresolvedLinks: ["Missing Page"],
      backlinkIds: ["coding-agents", "openai-source-records"],
    });

    expect(manifest.links).toContainEqual({ source: "openai", target: "coding-agents" });
    expect(manifest.pagesById["openai-source-records"]).toMatchObject({
      id: "openai-source-records",
      title: "OpenAI Source Records",
      type: "summary",
      sourceLinks: ["https://example.com/source"],
      backlinkIds: [],
    });
    expect(manifest.graph.nodes).toContainEqual({
      id: "openai",
      label: "OpenAI",
      type: "entity",
      tags: ["entity", "company", "model"],
    });
    expect(manifest.graph.links).toContainEqual({ source: "openai", target: "coding-agents" });
    expect(manifest.stats).toMatchObject({
      pageCount: 3,
      rawPageCount: 0,
      linkCount: 3,
      sourceRecordCount: 1,
      sourceLinkCount: 2,
      unresolvedLinkCount: 1,
    });
  });

  it("excludes authoring templates from the public manifest", async () => {
    const topicsDir = await createTopicsDir({
      "TEMPLATE.md": `---
title: Austin AI Club - Month DD, YYYY
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: meetup
tags: [meetup, topic-board]
sources: [raw/articles/YYYY-MM-DD-link-records.md]
---

# Austin AI Club
`,
      "2026-05-13.md": `---
title: Austin AI Club - May 13, 2026
created: 2026-05-05
updated: 2026-05-11
type: meetup
tags: [meetup, topic-board]
sources: []
---

# Austin AI Club
`,
    });

    const manifest = await buildWikiManifest({ topicsDir });

    expect(manifest.pages.map((page) => page.title)).toEqual([
      "Austin AI Club - May 13, 2026",
    ]);
    expect(manifest.pagesById).not.toHaveProperty("austin-ai-club-month-dd-yyyy");
    expect(manifest.graph.nodes.map((node) => node.id)).not.toContain(
      "austin-ai-club-month-dd-yyyy",
    );
  });

  it("captures source link context from meetup topic titles", async () => {
    const topicsDir = await createTopicsDir({
      "2026-04-01.md": `---
title: Austin AI Club - April 1, 2026
created: 2026-05-05
updated: 2026-05-05
type: meetup
tags: [meetup, topic-board]
sources: [raw/articles/2026-04-01-link-records.md]
---

# Austin AI Club

## April 1, 2026

### Agent Infrastructure
- **402 Index paid API loop demo** - Ryan Gentry's demo shows service discovery.
  Post: https://x.com/RyanTheGentry/status/2039036789252390970
  Source: https://github.com/ryanthegentry/402index-mcp-server
`,
      "raw/articles/2026-04-01-link-records.md": `---
title: April 1, 2026 Source Link Records
created: 2026-05-05
updated: 2026-05-05
type: summary
tags: [source-record, meetup]
sources: []
---

# April 1, 2026 Source Link Records

## Agent Infrastructure

### 402 Index paid API loop demo

- 402 Index records:
  - https://x.com/RyanTheGentry/status/2039036789252390970
  - https://github.com/ryanthegentry/402index-mcp-server
`,
    });

    const manifest = await buildWikiManifest({ topicsDir });

    expect(manifest.pagesById["austin-ai-club-april-1-2026"].sourceReferences).toEqual([
      {
        href: "https://x.com/RyanTheGentry/status/2039036789252390970",
        title: "402 Index paid API loop demo",
        section: "Agent Infrastructure",
      },
      {
        href: "https://github.com/ryanthegentry/402index-mcp-server",
        title: "402 Index paid API loop demo",
        section: "Agent Infrastructure",
      },
    ]);
    expect(manifest.pagesById["april-1-2026-source-link-records"].sourceReferences).toEqual([
      {
        href: "https://x.com/RyanTheGentry/status/2039036789252390970",
        title: "402 Index paid API loop demo",
        section: "Agent Infrastructure",
      },
      {
        href: "https://github.com/ryanthegentry/402index-mcp-server",
        title: "402 Index paid API loop demo",
        section: "Agent Infrastructure",
      },
    ]);
  });
});
