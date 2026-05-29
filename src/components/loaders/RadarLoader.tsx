"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Radar sweep with blips
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const sweepAngle = (time * 0.002) % (Math.PI * 2);

  // Concentric rings
  for (const r of [3, 5, 7]) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / (r * 2)) {
      const dx = Math.round(Math.cos(a) * r);
      const dy = Math.round(Math.sin(a) * r);
      ctx.fillStyle = hexToRgba(color, 0.1, color2);
      ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
    }
  }

  // Cross hairs
  for (let d = -7; d <= 7; d++) {
    ctx.fillStyle = hexToRgba(color, 0.07, color2);
    ctx.fillRect(Math.round(o + d * i), Math.round(l), i, i);
    ctx.fillRect(Math.round(o), Math.round(l + d * i), i, i);
  }

  // Sweep line with fade trail
  for (let trail = 0; trail < 12; trail++) {
    const a = sweepAngle - trail * 0.08;
    const fade = 1 - trail / 12;
    for (let d = 1; d <= 7; d++) {
      const dx = Math.round(Math.cos(a) * d);
      const dy = Math.round(Math.sin(a) * d);
      ctx.fillStyle = hexToRgba(color, 0.35 * fade * (d / 7), color2);
      ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
    }
  }

  // Blips (fixed positions that light up when swept)
  const blips: [number, number][] = [[3, -4], [-5, 2], [2, 5], [-3, -3]];
  blips.forEach(([bx, by]) => {
    const blipAngle = Math.atan2(by, bx);
    let diff = sweepAngle - blipAngle;
    if (diff < 0) diff += Math.PI * 2;
    if (diff > Math.PI * 2) diff -= Math.PI * 2;
    const brightness = diff < 0.8 ? 0.7 * (1 - diff / 0.8) : 0;
    if (brightness > 0.03) {
      ctx.fillStyle = hexToRgba(color, brightness, color2);
      ctx.fillRect(Math.round(o + bx * i), Math.round(l + by * i), i, i);
    }
  });

  // Center dot
  ctx.fillStyle = hexToRgba(color, 0.7, color2);
  ctx.fillRect(Math.round(o), Math.round(l), i, i);
}

export default function RadarLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
