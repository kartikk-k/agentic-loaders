"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

const FLAKES = Array.from({ length: 12 }, (_, idx) => ({
  x: ((idx * 7 + 3) % 15) - 7,
  speed: 0.8 + (idx % 3) * 0.4,
  drift: (idx % 5 - 2) * 0.3,
  phase: idx * 1.7,
}));

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  FLAKES.forEach(({ x, speed, drift, phase }) => {
    const t = time * 0.001;
    const fy = ((t * speed + phase) % 16) - 8;
    const fx = x + Math.sin(t * drift + phase) * 1.5;
    const alpha = 0.2 + 0.4 * (1 - Math.abs(fy) / 8);
    ctx.fillStyle = hexToRgba(color, Math.max(0.05, alpha), color2);
    ctx.fillRect(Math.round(o + fx * i), Math.round(l + fy * i), i, i);
  });
}

export default function SnowLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
