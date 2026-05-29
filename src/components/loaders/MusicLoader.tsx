"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const numBars = 7;
  const startX = -Math.floor(numBars / 2) * 2;

  for (let b = 0; b < numBars; b++) {
    const phase = time * 0.004 + b * 0.8;
    const h = 2 + Math.abs(Math.sin(phase)) * 5;
    const barH = Math.round(h);
    const bx = startX + b * 2;
    const alpha = 0.35 + 0.35 * Math.abs(Math.sin(phase));

    for (let y = 0; y < barH; y++) {
      ctx.fillStyle = hexToRgba(color, alpha * (1 - y / (barH + 2)), color2);
      ctx.fillRect(Math.round(o + bx * i), Math.round(l + (3 - y) * i), i, i);
    }
  }

  // Baseline
  ctx.fillStyle = hexToRgba(color, 0.1, color2);
  for (let x = startX - 1; x <= startX + numBars * 2; x++) {
    ctx.fillRect(Math.round(o + x * i), Math.round(l + 4 * i), i, i);
  }
}

export default function MusicLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const SC = window.devicePixelRatio || 2;
    cv.width = size * SC; cv.height = size * SC;
    const ctx = cv.getContext("2d")!;
    ctx.scale(SC, SC);
    const t0 = performance.now();
    let raf: number;
    function loop() { draw(ctx, size, performance.now() - t0, color, color2); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [size, color, color2]);
  return <canvas ref={ref} width={size} height={size} style={{ width: size, height: size, imageRendering: "pixelated" }} />;
}
