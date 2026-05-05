import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildWikiManifest } from "./wiki-manifest.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const topicsDir = path.join(repoRoot, "public", "topics");
const outputPath = path.join(repoRoot, "public", "wiki-manifest.json");

async function readJsonIfExists(targetPath) {
  try {
    return JSON.parse(await fs.readFile(targetPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeTextIfChanged(targetPath, content) {
  try {
    const previous = await fs.readFile(targetPath, "utf8");

    if (previous === content) {
      return;
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  await fs.writeFile(targetPath, content, "utf8");
}

function withoutGeneratedAt(payload) {
  const { generatedAt, ...stablePayload } = payload;
  return stablePayload;
}

async function main() {
  const previousPayload = await readJsonIfExists(outputPath);
  const nextPayload = await buildWikiManifest({ topicsDir });
  const payload =
    previousPayload &&
    JSON.stringify(withoutGeneratedAt(previousPayload)) ===
      JSON.stringify(withoutGeneratedAt(nextPayload))
      ? { ...nextPayload, generatedAt: previousPayload.generatedAt }
      : nextPayload;

  await writeTextIfChanged(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `Generated public/wiki-manifest.json (${payload.stats.pageCount} pages, ${payload.stats.linkCount} links).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
