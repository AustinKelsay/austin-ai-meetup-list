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

function collectWikilinksFromLine(line) {
  const links = [];
  const pattern = /\[\[([^\]\n]+)\]\]/g;
  let match;

  while ((match = pattern.exec(line)) !== null) {
    const rawTarget = match[1].split("|")[0].split("#")[0].trim();

    if (rawTarget && !links.includes(rawTarget)) {
      links.push(rawTarget);
    }
  }

  return links;
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

function extractUrls(line) {
  const urls = [];
  const pattern = /https?:\/\/[^\s<>)\]]+/g;
  let match;

  while ((match = pattern.exec(line)) !== null) {
    urls.push(match[0].replace(/[.,;:!?]+$/g, ""));
  }

  return urls;
}

function collectSourceReferences(content, { sourceRecord = false } = {}) {
  const searchableContent = stripFrontmatter(content).replace(/```[\s\S]*?```/g, "");
  const references = [];
  let currentSection = "";
  let currentTitle = "";
  let currentTopicWikilinks = [];

  for (const rawLine of searchableContent.split("\n")) {
    const line = rawLine.trim();
    const headingMatch = line.match(/^(#{2,6})\s+(.+)$/);

    if (headingMatch) {
      const depth = headingMatch[1].length;
      const title = headingMatch[2].trim();

      if (sourceRecord && depth === 2) {
        currentSection = title;
        currentTitle = "";
        currentTopicWikilinks = [];
      } else if (sourceRecord && depth === 3) {
        currentTitle = title;
        currentTopicWikilinks = collectWikilinksFromLine(title);
      } else if (!sourceRecord && depth === 3) {
        currentSection = title;
        currentTitle = "";
        currentTopicWikilinks = [];
      } else if (!sourceRecord && depth > 3) {
        currentTitle = title;
        currentTopicWikilinks = collectWikilinksFromLine(title);
      } else if (!sourceRecord && depth === 2) {
        currentTitle = "";
        currentTopicWikilinks = [];
      }
    }

    const topicMatch = line.match(/^-\s+\*\*([^*]+)\*\*/);

    if (topicMatch) {
      currentTitle = topicMatch[1].trim();
      currentTopicWikilinks = collectWikilinksFromLine(line);
    } else if (currentTitle) {
      for (const wikilink of collectWikilinksFromLine(line)) {
        if (!currentTopicWikilinks.includes(wikilink)) {
          currentTopicWikilinks.push(wikilink);
        }
      }
    }

    for (const href of extractUrls(line)) {
      const reference = {
        href,
        title: currentTitle || currentSection || getSourceLinkTitle(href),
        section: currentSection,
        wikilinks: currentTopicWikilinks,
      };

      if (
        !references.some(
          (existing) =>
            existing.href === reference.href &&
            existing.title === reference.title &&
            existing.section === reference.section,
        )
      ) {
        references.push(reference);
      }
    }
  }

  return references;
}

function getSourceLinkTitle(href) {
  try {
    const url = new URL(href);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return href;
  }
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
  const sourceReferences = collectSourceReferences(content, {
    sourceRecord: tags.includes("source-record"),
  });

  return {
    id,
    title: frontmatter.title || id,
    type: frontmatter.type || "summary",
    tags,
    sources,
    sourceCount: sources.length,
    sourceLinks,
    sourceReferences,
    created: frontmatter.created || "",
    updated: frontmatter.updated || "",
    excerpt: getExcerpt(content),
    rawHref: `/topics/${relativePath}`,
    relativePath,
    outgoingIds: [],
    unresolvedLinks: [],
    backlinkIds: [],
    referencedTopicSources: [],
    wikilinks: collectWikilinks(content),
  };
}

function shouldIncludeInManifest(relativePath) {
  return !EXCLUDED_MANIFEST_PATHS.has(relativePath);
}

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
}

function addReferencedTopicSource(page, reference, sourcePage) {
  const item = {
    href: reference.href,
    title: reference.title,
    section: reference.section,
    sourcePageId: sourcePage.id,
    sourcePageTitle: sourcePage.title,
  };

  if (
    !page.referencedTopicSources.some(
      (existing) =>
        existing.href === item.href &&
        existing.title === item.title &&
        existing.section === item.section &&
        existing.sourcePageId === item.sourcePageId,
    )
  ) {
    page.referencedTopicSources.push(item);
  }
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

  const trackConcepts = pages.filter((page) => page.type === "concept" && page.tags.includes("track"));

  for (const sourcePage of pages.filter((page) => page.type === "meetup")) {
    for (const reference of sourcePage.sourceReferences) {
      const matchingConcept = trackConcepts.find(
        (page) => normalizeWikiId(reference.section) === page.id,
      );

      if (matchingConcept) {
        addReferencedTopicSource(matchingConcept, reference, sourcePage);
      }

      for (const wikilink of reference.wikilinks) {
        const targetPage = pagesById[titleToId.get(normalizeWikiId(wikilink))];

        if (targetPage) {
          addReferencedTopicSource(targetPage, reference, sourcePage);
        }
      }
    }
  }

  for (const page of pages) {
    for (const reference of page.sourceReferences) {
      delete reference.wikilinks;
    }
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
