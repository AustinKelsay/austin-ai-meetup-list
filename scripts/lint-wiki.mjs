import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { meetups } from "../src/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const topicsDir = path.join(repoRoot, "public", "topics");

const requiredPaths = [
  "SCHEMA.md",
  "README.md",
  "index.md",
  "log.md",
  "raw/articles",
  "raw/papers",
  "raw/transcripts",
  "raw/assets",
  "entities",
  "concepts",
  "comparisons",
  "queries",
];

const requiredFrontmatter = ["title", "created", "updated", "type", "tags", "sources"];
const validTypes = new Set(["entity", "concept", "comparison", "query", "summary", "meetup"]);
const errors = [];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function normalizeWikiId(value) {
  return value
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

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
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

function parseFrontmatter(content) {
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
    fields[key] = rawValue;
  }

  return fields;
}

function checkFrontmatter(file, frontmatter) {
  const rel = toPosix(path.relative(repoRoot, file));

  for (const field of requiredFrontmatter) {
    if (!frontmatter[field]) {
      errors.push(`${rel}: missing frontmatter field "${field}"`);
    }
  }

  if (frontmatter.type && !validTypes.has(frontmatter.type)) {
    errors.push(`${rel}: invalid frontmatter type "${frontmatter.type}"`);
  }

  for (const listField of ["tags", "sources"]) {
    if (frontmatter[listField] && !/^\[.*\]$/.test(frontmatter[listField])) {
      errors.push(`${rel}: frontmatter field "${listField}" must use inline array syntax`);
    }
  }
}

function collectWikilinks(content) {
  const links = [];
  const searchableContent = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  const pattern = /\[\[([^\]\n]+)\]\]/g;
  let match;

  while ((match = pattern.exec(searchableContent)) !== null) {
    const rawTarget = match[1].split("|")[0].split("#")[0].trim();

    if (rawTarget) {
      links.push(rawTarget);
    }
  }

  return links;
}

async function checkRawRecords() {
  const rawDir = path.join(topicsDir, "raw");
  const files = await collectMarkdownFiles(rawDir);

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const rel = toPosix(path.relative(repoRoot, file));
    const body = content.replace(/^---\n[\s\S]*?\n---\n?/, "");
    const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
    const urlCount = (body.match(/https?:\/\//g) ?? []).length;

    if (wordCount > 800 && urlCount < 4) {
      errors.push(`${rel}: raw records should be link metadata, not full copied source text`);
    }
  }
}

async function main() {
  for (const requiredPath of requiredPaths) {
    const absolutePath = path.join(topicsDir, requiredPath);

    if (!(await pathExists(absolutePath))) {
      errors.push(`missing required wiki path: public/topics/${requiredPath}`);
    }
  }

  for (const meetup of meetups) {
    if (!meetup.markdownHref) {
      errors.push(`${meetup.slug}: missing markdownHref`);
      continue;
    }

    const markdownPath = meetup.markdownHref.replace(/^\.\//, "");
    const absolutePath = path.join(repoRoot, "public", markdownPath);

    if (!(await pathExists(absolutePath))) {
      errors.push(`${meetup.slug}: markdownHref target does not exist: public/${markdownPath}`);
    }
  }

  const markdownFiles = await collectMarkdownFiles(topicsDir);
  const wikiIds = new Set();
  const fileContents = new Map();

  for (const file of markdownFiles) {
    const content = await fs.readFile(file, "utf8");
    const relFromTopics = toPosix(path.relative(topicsDir, file));
    const frontmatter = parseFrontmatter(content);

    fileContents.set(file, content);
    wikiIds.add(normalizeWikiId(relFromTopics));

    if (frontmatter) {
      checkFrontmatter(file, frontmatter);
      wikiIds.add(normalizeWikiId(frontmatter.title ?? ""));
    }
  }

  for (const [file, content] of fileContents) {
    const rel = toPosix(path.relative(repoRoot, file));

    for (const link of collectWikilinks(content)) {
      if (!wikiIds.has(normalizeWikiId(link))) {
        errors.push(`${rel}: unresolved wikilink [[${link}]]`);
      }
    }
  }

  await checkRawRecords();

  if (errors.length) {
    console.error("Wiki lint failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Wiki lint passed (${markdownFiles.length} markdown files checked).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
