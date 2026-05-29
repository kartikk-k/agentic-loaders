"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const r = 5;
  const phase = (time * 0.0005) % 1; // 0 to 1 = full cycle
  const shadowX = Math.cos(phase * Math.PI * 2) * r * 1.2;

  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      const dist = Math.hypot(dx, dy);
      if (dist > r + 0.5) continue;
      // Shadow circle offset
      const shadowDist = Math.hypot(dx - shadowX, dy);
      const inShadow = shadowDist < r;
      const alpha = inShadow ? 0.06 : 0.35 + 0.3 * (1 - dist / r);
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
    }
  }

  // Stars
  const stars: [number, number][] = [[-8, -6], [7, -5], [-7, 4], [8, 6], [6, -8], [-6, 7]];
  stars.forEach(([sx, sy], idx) => {
    const twinkle = 0.1 + 0.2 * Math.abs(Math.sin(time * 0.003 + idx * 1.5));
    ctx.fillStyle = hexToRgba(color, twinkle, color2);
    ctx.fillRect(Math.round(o + sx * i), Math.round(l + sy * i), i, i);
  });
}

export default function MoonLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
