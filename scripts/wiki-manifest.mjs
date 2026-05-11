import fs from "node:fs/promises";
import path from "node:path";

const PRIMARY_TYPES = new Set(["entity", "concept", "comparison", "query", "meetup"]);
const EXCLUDED_MANIFEST_PATHS = new Set(["TEMPLATE.md"]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

export function normalizeWikiId(value) {
  return String(value ?? "")
    .trim()
    .replace(/\.(md|markdown)$/i, "")
    .replace(/^\.?\//, "")
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return null;
  }

  const fields = {};

  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    fields[key] = parseFrontmatterValue(rawValue);
  }

  return fields;
}

function parseFrontmatterValue(rawValue) {
  if (/^\[.*\]$/.test(rawValue)) {
    const inner = rawValue.slice(1, -1).trim();

    if (!inner) {
      return [];
    }

    return inner
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }

  return rawValue.replace(/^['"]|['"]$/g, "");
}

function collectWikilinks(content) {
  const searchableContent = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  const pattern = /\[\[([^\]\n]+)\]\]/g;
  const links = [];
  let match;

  while ((match = pattern.exec(searchableContent)) !== null) {
    const rawTarget = match[1].split("|")[0].split("#")[0].trim();

    if (rawTarget) {
      links.push(rawTarget);
    }
  }

  return [...new Set(links)];
}

function collectSourceLinks(content) {
  const searchableContent = content
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  const links = [];
  const pattern = /https?:\/\/[^\s<>)\]]+/g;
  let match;

  while ((match = pattern.exec(searchableContent)) !== null) {
    const href = match[0].replace(/[.,;:!?]+$/g, "");

    if (!links.includes(href)) {
      links.push(href);
    }
  }

  return links;
}

function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function getExcerpt(content) {
  const body = stripFrontmatter(content)
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .find((line) => !line.startsWith("#") && !line.startsWith("- ") && !line.startsWith(">"));

  if (!body) {
    return "";
  }

  return body
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

function createPage({ content, file, frontmatter, topicsDir }) {
  const relativePath = toPosix(path.relative(topicsDir, file));
  const id = normalizeWikiId(frontmatter.title || relativePath);
  const sources = Array.isArray(frontmatter.sources) ? frontmatter.sources : [];
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const sourceLinks = collectSourceLinks(content);

  return {
    id,
    title: frontmatter.title || id,
    type: frontmatter.type || "summary",
    tags,
    sources,
    sourceCount: sources.length,
    sourceLinks,
    created: frontmatter.created || "",
    updated: frontmatter.updated || "",
    excerpt: getExcerpt(content),
    rawHref: `/topics/${relativePath}`,
    relativePath,
    outgoingIds: [],
    unresolvedLinks: [],
    backlinkIds: [],
    wikilinks: collectWikilinks(content),
  };
}

function shouldIncludeInManifest(relativePath) {
  return !EXCLUDED_MANIFEST_PATHS.has(relativePath);
}

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
}

function isPublicPage(page) {
  return PRIMARY_TYPES.has(page.type) || page.relativePath.startsWith("raw/articles/");
}

export async function buildWikiManifest({ topicsDir }) {
  const files = await collectMarkdownFiles(topicsDir);
  const candidates = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const frontmatter = parseFrontmatter(content);
    const relativePath = toPosix(path.relative(topicsDir, file));

    if (!frontmatter || !shouldIncludeInManifest(relativePath)) {
      continue;
    }

    candidates.push(createPage({ content, file, frontmatter, topicsDir }));
  }

  const pages = candidates
    .filter((page) => isPublicPage(page))
    .sort(sortByTitle);
  const rawPages = candidates
    .filter((page) => !pages.some((candidate) => candidate.id === page.id))
    .sort(sortByTitle);
  const pagesById = Object.fromEntries(pages.map((page) => [page.id, page]));
  const titleToId = new Map();

  for (const page of pages) {
    for (const alias of [page.title, page.relativePath]) {
      const normalizedAlias = normalizeWikiId(alias);

      if (!titleToId.has(normalizedAlias)) {
        titleToId.set(normalizedAlias, page.id);
      }
    }
  }

  const links = [];
  const unresolvedLinks = [];

  for (const page of pages) {
    const outgoingIds = [];
    const missingLinks = [];

    for (const wikilink of page.wikilinks) {
      const targetId = titleToId.get(normalizeWikiId(wikilink));

      if (!targetId) {
        missingLinks.push(wikilink);
        unresolvedLinks.push({ source: page.id, target: wikilink });
        continue;
      }

      if (targetId !== page.id && !outgoingIds.includes(targetId)) {
        outgoingIds.push(targetId);
        links.push({ source: page.id, target: targetId });
      }
    }

    page.outgoingIds = outgoingIds.sort();
    page.unresolvedLinks = missingLinks.sort();
  }

  for (const page of pages) {
    page.backlinkIds = links
      .filter((link) => link.target === page.id)
      .map((link) => link.source)
      .sort();
    delete page.wikilinks;
  }

  const graph = {
    nodes: pages.map((page) => ({
      id: page.id,
      label: page.title,
      type: page.type,
      tags: page.tags,
    })),
    links,
  };
  const sourceLinkCount = new Set(pages.flatMap((page) => page.sourceLinks)).size;
  const sourceRecordCount = pages.filter((page) => page.tags.includes("source-record")).length;

  return {
    generatedAt: new Date().toISOString(),
    pages,
    pagesById,
    rawPages,
    links,
    unresolvedLinks,
    graph,
    stats: {
      pageCount: pages.length,
      rawPageCount: rawPages.length,
      linkCount: links.length,
      sourceRecordCount,
      sourceLinkCount,
      unresolvedLinkCount: unresolvedLinks.length,
    },
  };
}
