import ForceGraph from "force-graph";
import { useEffect, useMemo, useRef } from "react";
import { getDefaultVisibleTypes } from "./wikiGraphFilters.js";
import { updateLatestValueRef } from "./WikiGraphController.js";
import { WIKI_GRAPH_TYPE_COLORS } from "./wikiGraphTypes.js";
import {
  buildNodeTooltip,
  getLinkColor,
  getLinkParticleCount,
  getLinkWidth,
  getNodeColor,
  getNodeVal,
} from "./wikiGraphVisuals.js";

function focusGraph(instance, duration = 450) {
  instance.zoomToFit(duration, 56);
}

export default function WikiGraph({ graph, selectedId, onSelectPage, visibleTypes = getDefaultVisibleTypes() }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const onSelectPageRef = useRef(onSelectPage);
  const visibleTypesRef = useRef(visibleTypes);
  const graphData = useMemo(
    () => ({
      nodes: graph.nodes.map((node) => ({ ...node })),
      links: graph.links.map((link) => ({ ...link })),
    }),
    [graph],
  );

  useEffect(() => {
    updateLatestValueRef(onSelectPageRef, onSelectPage);
  }, [onSelectPage]);

  useEffect(() => {
    visibleTypesRef.current = visibleTypes;
  }, [visibleTypes]);

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
      .nodeColor((node) => getNodeColor(node, selectedIdRef.current, WIKI_GRAPH_TYPE_COLORS))
      .linkColor((link) => getLinkColor(link))
      .linkWidth((link) => getLinkWidth(link))
      .linkDirectionalParticles((link) => getLinkParticleCount(link))
      .linkDirectionalParticleWidth(1.4)
      .linkDirectionalParticleSpeed(0.004)
      .cooldownTicks(80)
      .onEngineStop(() => focusGraph(instance))
      .onNodeClick((node) => onSelectPageRef.current(node.id));

    graphRef.current = instance;

    const resize = () => {
      const bounds = containerRef.current.getBoundingClientRect();
      instance.width(Math.max(280, bounds.width));
      instance.height(Math.max(280, bounds.height));
      focusGraph(instance, 250);
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

  const selectedIdRef = useRef(selectedId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    graphRef.current.graphData(graphData);
    focusGraph(graphRef.current, 350);
  }, [graphData]);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    graphRef.current
      .nodeVal((node) => getNodeVal(node, selectedId))
      .nodeVisibility((node) => visibleTypesRef.current.has(node.type))
      .nodeColor((node) => getNodeColor(node, selectedId, WIKI_GRAPH_TYPE_COLORS))
      .linkColor((link) => getLinkColor(link))
      .linkWidth((link) => getLinkWidth(link));
  }, [selectedId, visibleTypes]);

  return <div ref={containerRef} className="wiki-graph-canvas" aria-label="Wiki link graph" />;
}
