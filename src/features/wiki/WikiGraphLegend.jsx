import { WIKI_GRAPH_TYPES } from "./wikiGraphTypes.js";

export function WikiGraphLegend() {
  return (
    <div className="wiki-graph-legend" aria-label="Graph node types">
      {WIKI_GRAPH_TYPES.map((graphType) => (
        <span key={graphType.type} className="wiki-graph-legend-item">
          <span
            className="wiki-graph-legend-dot"
            style={{ backgroundColor: graphType.color }}
            aria-hidden="true"
          />
          {graphType.label}
        </span>
      ))}
    </div>
  );
}
