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
`,
    });

    const manifest = await buildWikiManifest({ topicsDir });

    expect(manifest.pages.map((page) => page.id)).toEqual(["coding-agents", "openai"]);
    expect(manifest.rawPages.map((page) => page.id)).toEqual(["openai-source-records"]);

    const openai = manifest.pagesById.openai;
    expect(openai).toMatchObject({
      id: "openai",
      title: "OpenAI",
      type: "entity",
      tags: ["entity", "company", "model"],
      rawHref: "/topics/entities/openai.md",
      sourceCount: 1,
      excerpt:
        "OpenAI is a recurring Austin AI Club entity because its model releases shape builder discussions.",
      outgoingIds: ["coding-agents"],
      unresolvedLinks: ["Missing Page"],
      backlinkIds: ["coding-agents"],
    });

    expect(manifest.links).toContainEqual({ source: "openai", target: "coding-agents" });
    expect(manifest.graph.nodes).toContainEqual({
      id: "openai",
      label: "OpenAI",
      type: "entity",
      tags: ["entity", "company", "model"],
    });
    expect(manifest.graph.links).toContainEqual({ source: "openai", target: "coding-agents" });
    expect(manifest.stats).toMatchObject({
      pageCount: 2,
      rawPageCount: 1,
      linkCount: 2,
      unresolvedLinkCount: 1,
    });
  });
});
