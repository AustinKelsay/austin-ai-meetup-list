/**
 * Restructure Models & Research sections in dated meetup Markdown while
 * preserving wikilinks and labeled source chains from the existing boards.
 *
 * Usage: node scripts/sync-models-roundup-boards.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { meetups } from "../src/data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const topicsDir = path.join(root, "public/topics");

/**
 * Same classification as scripts/restructure-release-roundups.mjs.
 * closed/open lists are source Topic titles to merge; keep stays as-is.
 */
const PLANS = {
  "2026-07-22": {
    closed: ["Closed model releases"],
    open: [
      "Open model releases",
      "Open agent and reasoning models fan out",
      "Open multimodal models specialize by modality",
      "Embedding models get their own open release lane",
      "Local model packaging becomes part of the release",
    ],
    keep: [
      "Frontier local inference becomes an expert-cache problem",
      "llama.garden makes model distribution a protocol",
      "AI math crosses from medals into new proofs",
      "AI 2040 writes the optimistic branch on purpose",
      "Models learn to please the grader, not the user",
    ],
    openDescription:
      "Thinking Machines opened the 975B/41B-active multimodal [[Inkling]] MoE; [[Qwen]] previewed Qwen3.8-Max; Bad Theory Labs shipped tool-using [[BTL-3]]; [[NVIDIA]] and [[Mistral]] pushed edge world/robot models; and [[Kimi]] K3 weights were due July 27—then the shelf filled with agent/reasoning MoEs, modality specialists, embedding models, and local GGUF/NVFP4 packaging. [[Open Models|Open]] now spans frontier bases through laptop-shaped artifacts.",
  },
  "2026-07-08": {
    closed: ["Proprietary releases split across agents and media"],
    open: ["Open model releases get specialized fast"],
    keep: [
      "Brain2Qwerty v2 gets non-invasive decoding to 61% word accuracy",
      "Should chat route local by default?",
      "Claude gets a consciousness-adjacent workspace",
    ],
  },
  "2026-06-24": {
    closed: ["Closed model releases are a quiet week"],
    open: ["Open models are eating the frontier gap"],
    keep: [
      "AI Twitter's model-release calendar slips",
      "Research behind the open model wave",
    ],
  },
  "2026-06-10": {
    closed: ["Closed labs start the June model wave"],
    open: ["Open-weight release week turns into a firehose"],
    keep: [
      "Fable's refusals go too far",
      "World models need a taxonomy, not another demo",
    ],
  },
  "2026-05-27": {
    closed: [],
    open: [
      "PrismML ships 1-bit image gen that runs on iPhone",
      "Epicure squeezes global cooking into 2MB",
    ],
    keep: [
      "Multi-token prediction goes mainstream",
      "DFlash beats autoregressive drafting ceiling",
      "DeepSWE exposes the real coding model hierarchy",
    ],
  },
  "2026-05-13": {
    closed: ["GPT Image 2 gets UI-ish", "SubQ goes after 12M-token context"],
    open: ["Qwen3.6-27B gets laptop-shaped", "Gemma 4 app surface"],
    keep: [
      "12 models in 37 days",
      "Attune patches the open-model tool-call boundary",
      "ProgramBench says agents still cannot rebuild software",
      "Talkie tests vintage-model generalization",
      "Red/blue button model behavior",
    ],
  },
  "2026-04-15": {
    closed: ["Qwen3.6-Plus", "Meta introduces Muse Spark"],
    open: [
      "Waypoint-1.5 brings real-time AI worlds to everyday GPUs",
      "GLM-5.1",
      "Trinity-Large-Thinking",
      "Google Gemma 4",
      "Llama 4 Scout & Maverick",
    ],
    keep: [],
  },
  "2026-04-01": {
    closed: [
      "GLM-5.1",
      "GLM-5V-Turbo",
      "MiniMax M2.7",
      "GPT-5.4 mini and nano",
      "GLM5 Turbo",
    ],
    open: [
      "Chroma Context-1",
      "Nemotron-Cascade 2",
      "Holo3 computer-use models",
      "Qwen3.5-Omni",
      "Cohere Transcribe",
      "Liquid AI LFM2.5-350M",
      "Claude-distilled Qwen models trending on HF",
    ],
    keep: [
      "Composer 2 / Kimi K2.5 drama",
      "Distillation hesitation",
      "ARC AGI benchmark #3",
      "Google TurboQuant",
      "LLM neuroanatomy / RYS layer repetition",
      "Local models getting glazed",
    ],
  },
  "2026-03-18": {
    closed: ["GPT-5.4 mini", "Xiaomi MiMo-V2-Pro", "MiniMax M2.7"],
    open: [
      "Qwen 3.5 series",
      "Nemotron v3 series",
      "Nemotron 3 VoiceChat frontier",
      "Mistral Small",
    ],
    keep: ["LMfit", "Frontier check"],
  },
};

/**
 * Parses Models & Research topic blocks from meetup Markdown.
 * @param {string} sectionBody Models section body without the heading
 * @returns {Map<string, string>} title → full topic markdown block
 */
function parseTopicBlocks(sectionBody) {
  const blocks = new Map();
  const parts = sectionBody.trim().split(/\n(?=- \*\*)/);
  for (const part of parts) {
    const match = part.match(/^- \*\*(.+?)\*\*/);
    if (!match) continue;
    blocks.set(match[1], part.trimEnd());
  }
  return blocks;
}

/**
 * Renames the bold title on a topic block.
 * @param {string} block Topic markdown
 * @param {string} newTitle New title
 * @returns {string}
 */
function renameTopic(block, newTitle) {
  return block.replace(/^- \*\*(.+?)\*\*/, `- **${newTitle}**`);
}

/**
 * Merges multiple topic blocks into one Closed/Open roundup block.
 * @param {string[]} blocks Source topic blocks in order
 * @param {string} title Roundup title
 * @param {string | undefined} descriptionOverride Optional description with wikilinks
 * @returns {string}
 */
function mergeTopics(blocks, title, descriptionOverride) {
  if (!blocks.length) return "";
  if (blocks.length === 1) return renameTopic(blocks[0], title);

  const first = blocks[0];
  const descMatch = first.match(/^- \*\*[^*]+\*\* - (.+)\n/);
  const description = descriptionOverride ?? descMatch?.[1] ?? "";
  const linkLines = [];
  const seen = new Set();
  for (const block of blocks) {
    for (const line of block.split("\n").slice(1)) {
      const trimmed = line.trimEnd();
      if (!trimmed.trim()) continue;
      const urlMatch = trimmed.match(/https?:\/\/\S+/);
      const key = urlMatch?.[0] ?? trimmed;
      if (seen.has(key)) continue;
      seen.add(key);
      linkLines.push(trimmed);
    }
  }
  return [`- **${title}** - ${description}`, ...linkLines].join("\n");
}

/**
 * Rebuilds one meetup Models section.
 * @param {string} markdown Full meetup markdown
 * @param {object} plan Classification plan
 * @returns {string}
 */
function rebuildBoard(markdown, plan) {
  const heading = "### Models & Research";
  const start = markdown.indexOf(heading);
  if (start < 0) throw new Error("Models heading missing");
  const after = start + heading.length;
  const nextHeading = markdown.slice(after).search(/\n### /);
  const end = nextHeading < 0 ? markdown.length : after + nextHeading;
  const sectionBody = markdown.slice(after, end);
  const blocks = parseTopicBlocks(sectionBody);

  for (const title of [...plan.closed, ...plan.open, ...plan.keep]) {
    if (!blocks.has(title)) throw new Error(`Missing board Topic: ${title}`);
  }

  const parts = [];
  if (plan.closed.length) {
    parts.push(
      mergeTopics(
        plan.closed.map((title) => blocks.get(title)),
        "Closed model releases",
        plan.closedDescription,
      ),
    );
  }
  if (plan.open.length) {
    parts.push(
      mergeTopics(
        plan.open.map((title) => blocks.get(title)),
        "Open model releases",
        plan.openDescription,
      ),
    );
  }
  for (const title of plan.keep) parts.push(blocks.get(title));

  const body = `\n${parts.join("\n\n")}\n`;
  let next = `${markdown.slice(0, after)}${body}${markdown.slice(end)}`;
  next = next.replace(/^updated: \d{4}-\d{2}-\d{2}$/m, "updated: 2026-08-04");
  return next;
}

let count = 0;
for (const [slug, plan] of Object.entries(PLANS)) {
  const mdPath = path.join(topicsDir, `${slug}.md`);
  const before = fs.readFileSync(mdPath, "utf8");
  // July 22 already has Closed/Open titles from prior work; allow those names.
  const after = rebuildBoard(before, plan);
  if (after !== before) {
    fs.writeFileSync(mdPath, after);
    count++;
    console.log("updated", slug);
  } else {
    console.log("unchanged", slug);
  }
}

// Spot-check: data.js Models titles should match board bold titles.
for (const meetup of meetups) {
  if (meetup.id === "meetup-2026-08-05") continue;
  const plan = PLANS[meetup.slug];
  if (!plan) continue;
  const models = meetup.tracks.find((t) => t.title === "Models & Research");
  const md = fs.readFileSync(path.join(topicsDir, `${meetup.slug}.md`), "utf8");
  const heading = "### Models & Research";
  const start = md.indexOf(heading) + heading.length;
  const nextHeading = md.slice(start).search(/\n### /);
  const end = nextHeading < 0 ? md.length : start + nextHeading;
  const boardTitles = [...md.slice(start, end).matchAll(/^- \*\*(.+?)\*\*/gm)].map((m) => m[1]);
  const dataTitles = models.items.map((item) => item.title);
  if (JSON.stringify(boardTitles) !== JSON.stringify(dataTitles)) {
    console.error("TITLE MISMATCH", meetup.slug);
    console.error(" board", boardTitles);
    console.error(" data ", dataTitles);
    process.exitCode = 1;
  }
}

console.log(`\nBoards updated: ${count}`);
