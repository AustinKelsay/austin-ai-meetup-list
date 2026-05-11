export const WIKI_GRAPH_TYPES = [
  { type: "meetup", label: "Meetup", color: "#47f3aa" },
  { type: "entity", label: "Entity", color: "#47d4f3" },
  { type: "concept", label: "Concept", color: "#c47df3" },
  { type: "comparison", label: "Comparison", color: "#f3a847" },
  { type: "query", label: "Query", color: "#f37188" },
];

export const WIKI_GRAPH_TYPE_COLORS = Object.fromEntries(
  WIKI_GRAPH_TYPES.map(({ type, color }) => [type, color]),
);
