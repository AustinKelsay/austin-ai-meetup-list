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
  shouldShowNodeLabel,
} from "./wikiGraphVisuals.js";

function focusGraph(instance, duration = 450) {
  instance.zoomToFit(duration, 56);
}

function centerOnNode(instance, node, duration = 350) {
  if (!node || node.x == null || node.y == null) {
    return;
  }

  instance.centerAt(node.x, node.y, duration);
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
      .nodeRelSize(3)
      .nodeVal((node) => getNodeVal(node, selectedIdRef.current))
      .nodeVisibility((node) => visibleTypesRef.current.has(node.type))
      .nodeColor((node) =>
        getNodeColor(node, selectedIdRef.current, WIKI_GRAPH_TYPE_COLORS, neighborIdsRef.current),
      )
      .nodeCanvasObject((node, ctx, globalScale) => {
        if (shouldShowNodeLabel(node, selectedIdRef.current)) {
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
      .linkDirectionalParticles((link) => getLinkParticleCount(link))
      .linkDirectionalParticleWidth(1.4)
      .linkDirectionalParticleSpeed(0.004)
      .cooldownTicks(80)
      .onNodeClick((node) => onSelectPageRef.current(node.id));

    graphRef.current = instance;

    const resize = () => {
      const bounds = containerRef.current.getBoundingClientRect();
      instance.width(Math.max(280, bounds.width));
      instance.height(Math.max(280, bounds.height));
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

    if (!hasFocusedRef.current) {
      focusGraph(graphRef.current, 350);
      hasFocusedRef.current = true;
    }
  }, [graphData]);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    graphRef.current
      .nodeVal((node) => getNodeVal(node, selectedId))
      .nodeVisibility((node) => visibleTypesRef.current.has(node.type))
      .nodeColor((node) =>
        getNodeColor(node, selectedId, WIKI_GRAPH_TYPE_COLORS, neighborIds),
      )
      .linkColor((link) => getLinkColor(link, selectedId, neighborIds))
      .linkWidth((link) => getLinkWidth(link, selectedId, neighborIds));

    const selectedNode = graphData.nodes.find((node) => node.id === selectedId);
    if (selectedNode) {
      centerOnNode(graphRef.current, selectedNode, 350);
    }
  }, [selectedId, neighborIds, visibleTypes, graphData.nodes]);

  return <div ref={containerRef} className="wiki-graph-canvas" aria-label="Wiki link graph" />;
}
