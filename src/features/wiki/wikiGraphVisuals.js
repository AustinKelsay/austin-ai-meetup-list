export const BASE_NODE_VAL = 2.5;
export const SELECTED_NODE_VAL = 5.5;
export const DEGREE_VAL_MULTIPLIER = 0.18;
export const TOPIC_LINK_COLOR = "rgba(71, 212, 243, 0.45)";
export const WIKI_LINK_COLOR = "rgba(159, 184, 176, 0.22)";
export const SELECTED_TOPIC_LINK_COLOR = "rgba(71, 212, 243, 0.85)";
export const SELECTED_WIKI_LINK_COLOR = "rgba(159, 184, 176, 0.85)";
export const NON_SELECTED_TOPIC_LINK_COLOR = "rgba(71, 212, 243, 0.12)";
export const NON_SELECTED_WIKI_LINK_COLOR = "rgba(159, 184, 176, 0.12)";
export const NEIGHBOR_NODE_ALPHA = 1;
export const NON_NEIGHBOR_NODE_ALPHA = 0.35;
export const DEFAULT_LABEL_DEGREE_THRESHOLD = 8;

const DEFAULT_NODE_COLOR = "#9fb8b0";
const SELECTED_NODE_COLOR = "#ffffff";

export function getNodeVal(node, selectedId) {
  if (node.id === selectedId) {
    return SELECTED_NODE_VAL;
  }
  const degree = node.degree ?? 0;
  return BASE_NODE_VAL + degree * DEGREE_VAL_MULTIPLIER;
}

export function isSelectedNode(node, selectedId) {
  return node.id === selectedId;
}

export function isNeighborNode(node, selectedId, neighborIds) {
  return selectedId != null && node.id !== selectedId && neighborIds.has(node.id);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getNodeColor(node, selectedId, typeColors = {}, neighborIds = new Set()) {
  if (isSelectedNode(node, selectedId)) {
    return SELECTED_NODE_COLOR;
  }

  const baseColor = typeColors[node.type] ?? DEFAULT_NODE_COLOR;

  if (selectedId == null) {
    return withAlpha(baseColor, NEIGHBOR_NODE_ALPHA);
  }

  const alpha = isNeighborNode(node, selectedId, neighborIds)
    ? NEIGHBOR_NODE_ALPHA
    : NON_NEIGHBOR_NODE_ALPHA;
  return withAlpha(baseColor, alpha);
}

export function isNeighborLink(link, selectedId, neighborIds) {
  if (selectedId == null) {
    return false;
  }

  const sourceId = typeof link.source === "object" ? link.source.id : link.source;
  const targetId = typeof link.target === "object" ? link.target.id : link.target;

  return (
    (sourceId === selectedId && neighborIds.has(targetId)) ||
    (targetId === selectedId && neighborIds.has(sourceId))
  );
}

export function buildNeighborIds(links, selectedId) {
  const neighbors = new Set();

  if (selectedId == null) {
    return neighbors;
  }

  for (const link of links) {
    const sourceId = typeof link.source === "object" ? link.source.id : link.source;
    const targetId = typeof link.target === "object" ? link.target.id : link.target;

    if (sourceId === selectedId) {
      neighbors.add(targetId);
    } else if (targetId === selectedId) {
      neighbors.add(sourceId);
    }
  }

  return neighbors;
}

export function getLinkColor(link, selectedId = null, neighborIds = new Set()) {
  if (selectedId == null) {
    return link.kind === "topic" ? TOPIC_LINK_COLOR : WIKI_LINK_COLOR;
  }

  if (isNeighborLink(link, selectedId, neighborIds)) {
    return link.kind === "topic" ? SELECTED_TOPIC_LINK_COLOR : SELECTED_WIKI_LINK_COLOR;
  }

  return link.kind === "topic" ? NON_SELECTED_TOPIC_LINK_COLOR : NON_SELECTED_WIKI_LINK_COLOR;
}

export function getLinkWidth(link, selectedId = null, neighborIds = new Set()) {
  const base = link.kind === "topic" ? 1 : 0.5;

  if (selectedId != null && isNeighborLink(link, selectedId, neighborIds)) {
    return base * 2.2;
  }

  return base;
}

export function getLinkParticleCount(link) {
  return link.kind === "topic" ? 1 : 0;
}

export function shouldShowNodeLabel(node, selectedId, degreeThreshold = DEFAULT_LABEL_DEGREE_THRESHOLD) {
  if (isSelectedNode(node, selectedId)) {
    return true;
  }

  return (node.degree ?? 0) >= degreeThreshold;
}

export function drawNodeLabel(ctx, node, color, globalScale = 1) {
  const label = node.label ?? "";
  if (!label) {
    return;
  }

  const fontSize = Math.max(8, 10 / globalScale);
  ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;

  const radius = (node.val ?? BASE_NODE_VAL) * 1.6;
  ctx.fillText(label, node.x, node.y + radius + fontSize * 0.9);
}

function escapeTooltipText(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

export function buildNodeTooltip(node) {
  const degree = node.degree ?? 0;
  const type = (node.type ?? "page").replace(/-/g, " ");
  const label = escapeTooltipText(node.label ?? "");
  const typeText = escapeTooltipText(type);
  const linksLabel = degree === 1 ? "link" : "links";

  return `<div class="wiki-graph-tooltip"><strong>${label}</strong><span>${typeText} \u00b7 ${degree} ${linksLabel}</span></div>`;
}
