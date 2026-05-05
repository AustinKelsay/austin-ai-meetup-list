import ForceGraph from "force-graph";
import { useEffect, useMemo, useRef } from "react";

const TYPE_COLORS = {
  meetup: "#47f3aa",
  entity: "#47d4f3",
  concept: "#c47df3",
  comparison: "#f3a847",
  query: "#f37188",
};

function focusGraph(instance, duration = 450) {
  instance.zoomToFit(duration, 56);
}

export default function WikiGraph({ graph, selectedId, onSelectPage }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const graphData = useMemo(
    () => ({
      nodes: graph.nodes.map((node) => ({ ...node })),
      links: graph.links.map((link) => ({ ...link })),
    }),
    [graph],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const instance = ForceGraph()(containerRef.current)
      .backgroundColor("rgba(0,0,0,0)")
      .nodeId("id")
      .nodeLabel((node) => node.label)
      .nodeRelSize(3)
      .nodeVal((node) => (node.id === selectedId ? 5 : 2.5))
      .nodeColor((node) => (node.id === selectedId ? "#ffffff" : TYPE_COLORS[node.type] ?? "#9fb8b0"))
      .linkColor(() => "rgba(159, 184, 176, 0.3)")
      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth(1.4)
      .linkDirectionalParticleSpeed(0.004)
      .cooldownTicks(80)
      .onEngineStop(() => focusGraph(instance))
      .onNodeClick((node) => onSelectPage(node.id));

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
  }, [onSelectPage]);

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
      .nodeVal((node) => (node.id === selectedId ? 5 : 2.5))
      .nodeColor((node) =>
        node.id === selectedId ? "#ffffff" : TYPE_COLORS[node.type] ?? "#9fb8b0",
      );
  }, [selectedId]);

  return <div ref={containerRef} className="wiki-graph-canvas" aria-label="Wiki link graph" />;
}
