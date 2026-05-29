"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Stacked layers that fan out and collapse
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const spread = Math.sin(time * 0.002) * 0.5 + 0.5; // 0 to 1
  const numLayers = 4;

  for (let layer = 0; layer < numLayers; layer++) {
    const yOff = (layer - (numLayers - 1) / 2) * (1 + spread * 2.5);
    const w = 5 - layer * 0.5;
    const h = 0;
    const depth = layer / numLayers;
    const alpha = 0.25 + 0.4 * (1 - depth);

    const ly = Math.round(yOff);

    // Diamond/rhombus shape for each layer
    const hw = Math.round(w);
    for (let x = -hw; x <= hw; x++) {
      const edgeDist = hw - Math.abs(x);
      // Top edge
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + x * i), Math.round(l + (ly + h) * i), i, i);
      // Fill with lower alpha
      if (edgeDist > 0) {
        ctx.fillStyle = hexToRgba(color, alpha * 0.5, color2);
        ctx.fillRect(Math.round(o + x * i), Math.round(l + (ly + h + 1) * i), i, i);
      }
    }

    // Side edges to give 3D feel
    ctx.fillStyle = hexToRgba(color, alpha * 0.7, color2);
    ctx.fillRect(Math.round(o + -hw * i), Math.round(l + ly * i), i, i);
    ctx.fillRect(Math.round(o + hw * i), Math.round(l + ly * i), i, i);
  }
}

export default function LayersLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
