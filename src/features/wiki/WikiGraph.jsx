import ForceGraph from "force-graph";
import { useEffect, useMemo, useRef } from "react";
import { getDefaultVisibleTypes } from "./wikiGraphFilters.js";
import { updateLatestValueRef } from "./WikiGraphController.js";
import { WIKI_GRAPH_TYPE_COLORS } from "./wikiGraphTypes.js";
import {
  buildNeighborIds,
  buildNodeTooltip,
  drawNodeLabel,
  getLinkColor,
  getLinkParticleCount,
  getLinkWidth,
  getNodeColor,
  getNodeVal,
  isNeighborLink,
  shouldShowNodeLabel,
} from "./wikiGraphVisuals.js";

const FIT_PADDING = 72;
const SMALL_FOCUS_NODE_LIMIT = 6;
const TINY_FOCUS_ZOOM = 1.2;
const SMALL_FOCUS_ZOOM = 1.45;

function focusGraph(instance, duration = 450, nodeFilter) {
  instance.zoomToFit(duration, FIT_PADDING, nodeFilter);
}

function buildFocusNodeFilter(selectedId, neighborIds, visibleTypes) {
  if (!selectedId) {
    return (node) => visibleTypes.has(node.type);
  }

  return (node) =>
    visibleTypes.has(node.type) && (node.id === selectedId || neighborIds.has(node.id));
}

function focusNeighborhood(instance, selectedId, neighborIds, visibleTypes, duration = 450) {
  const nodeFilter = buildFocusNodeFilter(selectedId, neighborIds, visibleTypes);
  const graphData = instance.graphData();
  const focusNodeCount = graphData.nodes.filter(nodeFilter).length;

  if (selectedId && focusNodeCount <= SMALL_FOCUS_NODE_LIMIT) {
    const selectedNode = graphData.nodes.find((node) => node.id === selectedId);

    if (selectedNode?.x != null && selectedNode.y != null) {
      instance.centerAt(selectedNode.x, selectedNode.y, duration);
      instance.zoom(focusNodeCount <= 2 ? TINY_FOCUS_ZOOM : SMALL_FOCUS_ZOOM, duration);
      return;
    }
  }

  focusGraph(instance, duration, nodeFilter);
}

function getVisibleNodeCount(nodes, visibleTypes) {
  return nodes.filter((node) => visibleTypes.has(node.type)).length;
}

function getFocusLinkCount(links, selectedId, neighborIds) {
  if (!selectedId) {
    return links.length;
  }

  return links.filter((link) => isNeighborLink(link, selectedId, neighborIds)).length;
}

function formatGraphCount(count, singular) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

export default function WikiGraph({ graph, selectedId, onSelectPage, visibleTypes = getDefaultVisibleTypes() }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const onSelectPageRef = useRef(onSelectPage);
  const visibleTypesRef = useRef(visibleTypes);
  const selectedIdRef = useRef(selectedId);
  const neighborIdsRef = useRef(new Set());
  const hasFocusedRef = useRef(false);

  const graphData = useMemo(
    () => ({
      nodes: graph.nodes.map((node) => ({ ...node })),
      links: graph.links.map((link) => ({ ...link })),
    }),
    [graph],
  );

  const neighborIds = useMemo(
    () => buildNeighborIds(graphData.links, selectedId),
    [graphData.links, selectedId],
  );

  useEffect(() => {
    updateLatestValueRef(onSelectPageRef, onSelectPage);
  }, [onSelectPage]);

  useEffect(() => {
    visibleTypesRef.current = visibleTypes;
  }, [visibleTypes]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    neighborIdsRef.current = neighborIds;
  }, [selectedId, neighborIds]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = ForceGraph()(containerRef.current)
      .backgroundColor("rgba(0,0,0,0)")
      .nodeId("id")
      .nodeLabel((node) => buildNodeTooltip(node))
      .nodeRelSize(3.4)
      .nodeVal((node) => getNodeVal(node, selectedIdRef.current, neighborIdsRef.current))
      .nodeVisibility((node) => visibleTypesRef.current.has(node.type))
      .nodeColor((node) =>
        getNodeColor(node, selectedIdRef.current, WIKI_GRAPH_TYPE_COLORS, neighborIdsRef.current),
      )
      .nodeCanvasObject((node, ctx, globalScale) => {
        if (shouldShowNodeLabel(node, selectedIdRef.current, neighborIdsRef.current)) {
          drawNodeLabel(ctx, node, "#ffffff", globalScale);
        }
      })
      .nodeCanvasObjectMode(() => "after")
      .linkColor((link) =>
        getLinkColor(link, selectedIdRef.current, neighborIdsRef.current),
      )
      .linkWidth((link) =>
        getLinkWidth(link, selectedIdRef.current, neighborIdsRef.current),
      )
      .linkDirectionalParticles((link) =>
        getLinkParticleCount(link, selectedIdRef.current, neighborIdsRef.current),
      )
      .linkDirectionalParticleWidth(1.4)
      .linkDirectionalParticleSpeed(0.004)
      .cooldownTicks(110)
      .enableZoomInteraction(true)
      .enablePanInteraction(true)
      .onEngineStop(() => {
        if (!hasFocusedRef.current) {
          focusNeighborhood(
            instance,
            selectedIdRef.current,
            neighborIdsRef.current,
            visibleTypesRef.current,
          );
          hasFocusedRef.current = true;
        }
      })
      .onNodeClick((node) => onSelectPageRef.current(node.id));

    instance.d3Force("charge")?.strength(-95);
    instance.d3Force("link")?.distance((link) => (link.kind === "topic" ? 92 : 64));

    graphRef.current = instance;

    const resize = () => {
      const bounds = containerRef.current.getBoundingClientRect();
      instance.width(Math.max(280, bounds.width));
      instance.height(Math.max(280, bounds.height));

      if (hasFocusedRef.current) {
        focusNeighborhood(
          instance,
          selectedIdRef.current,
          neighborIdsRef.current,
          visibleTypesRef.current,
          250,
        );
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", resize);
    resize();
    const animationFrame = window.requestAnimationFrame(resize);
    const settledResize = window.setTimeout(resize, 250);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settledResize);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      instance.pauseAnimation();
      instance.graphData({ nodes: [], links: [] });
      graphRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    graphRef.current.graphData(graphData);
  }, [graphData]);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    graphRef.current
      .nodeVal((node) => getNodeVal(node, selectedId, neighborIds))
      .nodeVisibility((node) => visibleTypesRef.current.has(node.type))
      .nodeColor((node) =>
        getNodeColor(node, selectedId, WIKI_GRAPH_TYPE_COLORS, neighborIds),
      )
      .linkColor((link) => getLinkColor(link, selectedId, neighborIds))
      .linkWidth((link) => getLinkWidth(link, selectedId, neighborIds))
      .linkDirectionalParticles((link) => getLinkParticleCount(link, selectedId, neighborIds));

    focusNeighborhood(graphRef.current, selectedId, neighborIds, visibleTypesRef.current, 450);
  }, [selectedId, neighborIds, visibleTypes, graphData.nodes]);

  const visibleNodeCount = getVisibleNodeCount(graphData.nodes, visibleTypes);
  const focusNodeCount = selectedId ? neighborIds.size + 1 : visibleNodeCount;
  const focusLinkCount = getFocusLinkCount(graphData.links, selectedId, neighborIds);

  return (
    <div className="wiki-graph-frame">
      <div ref={containerRef} className="wiki-graph-canvas" aria-label="Wiki link graph" />
      <div className="wiki-graph-lens" aria-label="Graph focus">
        <span>{selectedId ? "Neighborhood" : "Full map"}</span>
        <strong>
          {formatGraphCount(focusNodeCount, "node")} / {formatGraphCount(focusLinkCount, "link")}
        </strong>
      </div>
      <div className="wiki-graph-fit-controls">
        <button
          type="button"
          aria-label="Fit selected graph neighborhood"
          onClick={() =>
            graphRef.current
              ? focusNeighborhood(graphRef.current, selectedId, neighborIds, visibleTypes, 350)
              : null
          }
        >
          Focus
        </button>
        <button
          type="button"
          aria-label="Fit all visible graph nodes"
          onClick={() =>
            graphRef.current
              ? focusGraph(graphRef.current, 350, (node) => visibleTypes.has(node.type))
              : null
          }
        >
          All
        </button>
      </div>
    </div>
  );
}
