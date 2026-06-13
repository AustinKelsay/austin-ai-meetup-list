export const BASE_NODE_VAL = 2.5;
export const SELECTED_NODE_VAL = 5.5;
export const DEGREE_VAL_MULTIPLIER = 0.18;
export const TOPIC_LINK_COLOR = "rgba(71, 212, 243, 0.45)";
export const WIKI_LINK_COLOR = "rgba(159, 184, 176, 0.22)";

const DEFAULT_NODE_COLOR = "#9fb8b0";
const SELECTED_NODE_COLOR = "#ffffff";

export function getNodeVal(node, selectedId) {
  if (node.id === selectedId) {
    return SELECTED_NODE_VAL;
  }
  const degree = node.degree ?? 0;
  return BASE_NODE_VAL + degree * DEGREE_VAL_MULTIPLIER;
}

export function getNodeColor(node, selectedId, typeColors = {}) {
  if (node.id === selectedId) {
    return SELECTED_NODE_COLOR;
  }
  return typeColors[node.type] ?? DEFAULT_NODE_COLOR;
}

export function getLinkColor(link) {
  return link.kind === "topic" ? TOPIC_LINK_COLOR : WIKI_LINK_COLOR;
}

export function getLinkWidth(link) {
  return link.kind === "topic" ? 1 : 0.5;
}

export function getLinkParticleCount(link) {
  return link.kind === "topic" ? 1 : 0;
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
