"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Node graph with pulsing connections
const NODES: [number, number][] = [
  [0, 0], [-5, -4], [5, -3], [-4, 4], [6, 5], [-7, 0], [7, -1],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6], [1, 3], [2, 4],
];

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Draw edges as dotted lines
  EDGES.forEach(([a, b], idx) => {
    const [ax, ay] = NODES[a];
    const [bx, by] = NODES[b];
    const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
    for (let s = 0; s <= steps; s++) {
      const t2 = s / steps;
      const px = Math.round(ax + (bx - ax) * t2);
      const py = Math.round(ay + (by - ay) * t2);
      // Traveling pulse along edge
      const pulse = Math.sin(time * 0.003 - s * 0.5 + idx * 1.2);
      const alpha = 0.05 + 0.2 * Math.max(0, pulse);
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + px * i), Math.round(l + py * i), i, i);
    }
  });

  // Draw nodes
  NODES.forEach(([nx, ny], idx) => {
    const glow = 0.4 + 0.45 * Math.abs(Math.sin(time * 0.002 + idx * 0.9));
    ctx.fillStyle = hexToRgba(color, glow, color2);
    ctx.fillRect(Math.round(o + nx * i), Math.round(l + ny * i), i, i);
    // Make center node bigger
    if (idx === 0) {
      ctx.fillRect(Math.round(o + (nx + 1) * i), Math.round(l + ny * i), i, i);
      ctx.fillRect(Math.round(o + (nx - 1) * i), Math.round(l + ny * i), i, i);
      ctx.fillRect(Math.round(o + nx * i), Math.round(l + (ny + 1) * i), i, i);
      ctx.fillRect(Math.round(o + nx * i), Math.round(l + (ny - 1) * i), i, i);
    }
  });
}

export default function NodeLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const SC = window.devicePixelRatio || 2;
    cv.width = size * SC;
    cv.height = size * SC;
    const ctx = cv.getContext("2d")!;
    ctx.scale(SC, SC);
    const t0 = performance.now();
    let raf: number;
    function loop() {
      draw(ctx, size, performance.now() - t0, color, color2);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [size, color, color2]);
  return <canvas ref={ref} width={size} height={size} style={{ width: size, height: size, imageRendering: "pixelated" }} />;
}
