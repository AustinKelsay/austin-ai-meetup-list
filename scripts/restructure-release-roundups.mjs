/**
 * Rebuild Models & Research Topics into official Closed/Open Release Roundups.
 * Dry-run by default; pass --write to patch src/data.js meetups in place via a
 * companion rewrite of the exported array (preserves the file header comment).
 *
 * Usage:
 *   node scripts/restructure-release-roundups.mjs
 *   node scripts/restructure-release-roundups.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { meetups } from "../src/data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "src/data.js");
const shouldWrite = process.argv.includes("--write");

/** @typedef {{ title: string, bucket: "closed" | "open" | "keep" }} ClassRule */

/**
 * Per-meetup classification: every Models Topic title maps to closed, open, or keep.
 * Titles not listed for a meetup are treated as keep.
 */
const PLANS = {
  "meetup-2026-08-05": null, // already correct
  "meetup-2026-07-22": {
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
    openExtras: {
      description:
        "Thinking Machines opened the 975B/41B-active multimodal Inkling MoE; Qwen previewed Qwen3.8-Max; Bad Theory Labs shipped tool-using BTL-3; NVIDIA and Mistral pushed edge world/robot models; and Kimi K3 weights were due July 27—then the shelf filled with agent/reasoning MoEs, modality specialists, embedding models, and local GGUF/NVFP4 packaging. Open now spans frontier bases through laptop-shaped artifacts.",
      notes: "Official open-release roundup: launch posts first, then the full source catalog.",
    },
  },
  "meetup-2026-07-08": {
    closed: ["Proprietary releases split across agents and media"],
    open: ["Open model releases get specialized fast"],
    keep: [
      "Brain2Qwerty v2 gets non-invasive decoding to 61% word accuracy",
      "Should chat route local by default?",
      "Claude gets a consciousness-adjacent workspace",
    ],
    order: ["closed", "open", "keep"],
  },
  "meetup-2026-06-24": {
    closed: ["Closed model releases are a quiet week"],
    open: ["Open models are eating the frontier gap"],
    keep: [
      "AI Twitter's model-release calendar slips",
      "Research behind the open model wave",
    ],
  },
  "meetup-2026-06-10": {
    closed: ["Closed labs start the June model wave"],
    open: ["Open-weight release week turns into a firehose"],
    keep: [
      "Fable's refusals go too far",
      "World models need a taxonomy, not another demo",
    ],
  },
  "meetup-2026-05-27": {
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
  "meetup-2026-05-13": {
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
  "meetup-2026-04-15": {
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
  "meetup-2026-04-01": {
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
  "meetup-2026-03-18": {
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
 * Dedupes embeds by href.
 * @param {object[]} items Topic items
 * @returns {{ type: string, href: string }[]}
 */
function collectEmbeds(items) {
  const embeds = [];
  const seen = new Set();
  for (const item of items) {
    const list = [
      ...(Array.isArray(item.embeds) ? item.embeds : []),
      ...(item.embed ? [item.embed] : []),
    ];
    for (const embed of list) {
      if (!embed?.href || seen.has(embed.href)) continue;
      seen.add(embed.href);
      embeds.push({ type: embed.type ?? "tweet", href: embed.href });
    }
  }
  return embeds;
}

/**
 * Collects supporting links; keeps primary hrefs that are not the roundup href.
 * @param {object[]} items Topic items
 * @param {string} primaryHref Roundup primary href
 * @returns {string[]}
 */
function collectLinks(items, primaryHref) {
  const links = [];
  const seen = new Set([primaryHref]);
  for (const item of items) {
    if (item.href && !seen.has(item.href)) {
      seen.add(item.href);
      links.push(item.href);
    }
    for (const href of item.linkPair ?? []) {
      if (!href || seen.has(href)) continue;
      seen.add(href);
      links.push(href);
    }
  }
  return links;
}

/**
 * Builds a spoken roundup description from merged Topic descriptions.
 * @param {object[]} items Topics being merged
 * @param {"closed" | "open"} bucket Roundup bucket
 * @param {string | undefined} override Optional fixed description
 * @returns {string}
 */
function buildDescription(items, bucket, override) {
  if (override) return override;
  if (items.length === 1) return items[0].description;
  // Prefer the lead Topic's description; append a compact inventory of the rest.
  const lead = items[0].description?.replace(/\s+/g, " ").trim();
  const restTitles = items.slice(1).map((item) => item.title);
  if (!restTitles.length) return lead;
  const label = bucket === "closed" ? "Also in this closed wave" : "Also in this open wave";
  return `${lead} ${label}: ${restTitles.join("; ")}.`;
}

/**
 * Builds one Release Roundup Topic from source Topics.
 * @param {"closed" | "open"} bucket Roundup type
 * @param {object[]} items Source Topics in board order
 * @param {{ description?: string, notes?: string }} extras Optional overrides
 * @returns {object | null}
 */
function buildRoundup(bucket, items, extras = {}) {
  if (!items.length) return null;
  const primary = items[0];
  const embeds = collectEmbeds(items);
  const linkPair = collectLinks(items, primary.href);
  const roundup = {
    title: bucket === "closed" ? "Closed model releases" : "Open model releases",
    description: buildDescription(items, bucket, extras.description),
    chip: bucket === "closed" ? "closed releases" : "open releases",
    releaseRoundup: true,
    href: primary.href,
  };
  if (embeds.length === 1) roundup.embed = embeds[0];
  else if (embeds.length > 1) roundup.embeds = embeds;
  if (linkPair.length) roundup.linkPair = linkPair;
  if (extras.notes) roundup.notes = extras.notes;
  else if (primary.notes && items.length === 1) roundup.notes = primary.notes;
  else if (items.length > 1) {
    roundup.notes =
      bucket === "closed"
        ? "Official closed-release roundup: launch posts first, then the source catalog."
        : "Official open-release roundup: launch posts first, then the source catalog.";
  }
  if (items.some((item) => item.topStory)) roundup.topStory = true;
  return roundup;
}

/**
 * Strips presentation-only reductions from a Topic.
 * @param {object} item Topic
 * @returns {object}
 */
function stripPresentationReductions(item) {
  const next = { ...item };
  delete next.presentationEmbeds;
  delete next.presentationEmbed;
  delete next.presentationLinkPair;
  delete next.presentationImages;
  delete next.presentationImage;
  delete next.presentationNotes;
  delete next.presentationDescription;
  return next;
}

/**
 * Rebuilds one meetup's Models & Research items.
 * @param {object} meetup Meetup Data entry
 * @param {object} plan Classification plan
 * @returns {object[]}
 */
function rebuildModelsItems(meetup, plan) {
  const track = meetup.tracks.find((entry) => entry.title === "Models & Research");
  if (!track) throw new Error(`No Models track on ${meetup.id}`);
  const byTitle = new Map(track.items.map((item) => [item.title, item]));

  for (const title of [...plan.closed, ...plan.open, ...plan.keep]) {
    if (!byTitle.has(title)) throw new Error(`${meetup.id}: missing Topic "${title}"`);
  }

  const closedItems = plan.closed.map((title) => byTitle.get(title));
  const openItems = plan.open.map((title) => byTitle.get(title));
  const keepItems = plan.keep.map((title) => stripPresentationReductions(byTitle.get(title)));

  const next = [];
  const closed = buildRoundup("closed", closedItems, plan.closedExtras ?? {});
  const open = buildRoundup("open", openItems, plan.openExtras ?? {});
  if (closed) next.push(closed);
  if (open) next.push(open);
  next.push(...keepItems);

  const planned = new Set([...plan.closed, ...plan.open, ...plan.keep]);
  const leftovers = track.items.filter((item) => !planned.has(item.title));
  if (leftovers.length) {
    throw new Error(
      `${meetup.id}: unplanned Topics: ${leftovers.map((item) => item.title).join("; ")}`,
    );
  }
  return next;
}

/**
 * Pretty-prints a JS value in a repo-friendly style.
 * @param {unknown} value Value
 * @param {number} indent Indent spaces
 * @returns {string}
 */
function toJs(value, indent = 0) {
  const pad = " ".repeat(indent);
  const pad2 = " ".repeat(indent + 2);
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    const items = value.map((entry) => `${pad2}${toJs(entry, indent + 2)}`);
    return `[\n${items.join(",\n")},\n${pad}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).filter((key) => value[key] !== undefined);
    if (!keys.length) return "{}";
    const fields = keys.map((key) => `${pad2}${key}: ${toJs(value[key], indent + 2)}`);
    return `{\n${fields.join(",\n")},\n${pad}}`;
  }
  if (typeof value === "undefined") return "undefined";
  throw new Error(`Unsupported value: ${typeof value}`);
}

/**
 * Replaces a Models track items array inside data.js text for one meetup id.
 * @param {string} source File text
 * @param {string} meetupId Meetup id
 * @param {object[]} items New items
 * @returns {string}
 */
function replaceModelsItems(source, meetupId, items) {
  const idNeedle = `id: "${meetupId}"`;
  const idIndex = source.indexOf(idNeedle);
  if (idIndex < 0) throw new Error(`Meetup id not found: ${meetupId}`);

  const modelsNeedle = 'title: "Models & Research"';
  const modelsIndex = source.indexOf(modelsNeedle, idIndex);
  if (modelsIndex < 0) throw new Error(`Models track not found after ${meetupId}`);

  const itemsKey = "items: [";
  const itemsIndex = source.indexOf(itemsKey, modelsIndex);
  if (itemsIndex < 0) throw new Error(`items array not found for ${meetupId}`);

  const start = itemsIndex + itemsKey.length - 1; // points at '['
  let depth = 0;
  let end = -1;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) throw new Error(`Could not close items array for ${meetupId}`);

  const rendered = toJs(items, 10);
  return `${source.slice(0, start)}${rendered}${source.slice(end + 1)}`;
}

const summary = [];
let nextSource = fs.readFileSync(dataPath, "utf8");

for (const meetup of meetups) {
  const plan = PLANS[meetup.id];
  if (plan === null || plan === undefined) {
    if (plan === null) summary.push(`${meetup.id}: skip (already correct)`);
    continue;
  }

  const items = rebuildModelsItems(meetup, plan);
  const titles = items.map((item) => `${item.releaseRoundup ? "*" : " "}${item.title}`);
  summary.push(`${meetup.id}:`);
  for (const title of titles) summary.push(`  ${title}`);

  if (shouldWrite) nextSource = replaceModelsItems(nextSource, meetup.id, items);
}

console.log(summary.join("\n"));

if (shouldWrite) {
  fs.writeFileSync(dataPath, nextSource);
  console.log(`\nWrote ${dataPath}`);
} else {
  console.log("\nDry run only. Pass --write to patch src/data.js.");
}
