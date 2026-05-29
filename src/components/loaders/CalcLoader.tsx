"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Spinning gear/cog with pulsing numbers around it
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Rotating gear teeth
  const teeth = 8;
  const innerR = 3;
  const outerR = 5;
  for (let t = 0; t < teeth; t++) {
    const angle = (t / teeth) * Math.PI * 2 + time * 0.002;
    // Inner ring
    const ix = Math.round(Math.cos(angle) * innerR);
    const iy = Math.round(Math.sin(angle) * innerR);
    ctx.fillStyle = hexToRgba(color, 0.5, color2);
    ctx.fillRect(Math.round(o + ix * i), Math.round(l + iy * i), i, i);
    // Outer tooth
    const ox = Math.round(Math.cos(angle) * outerR);
    const oy = Math.round(Math.sin(angle) * outerR);
    const pulse = 0.3 + 0.5 * Math.abs(Math.sin(time * 0.003 + t));
    ctx.fillStyle = hexToRgba(color, pulse, color2);
    ctx.fillRect(Math.round(o + ox * i), Math.round(l + oy * i), i, i);
    // Connect inner to outer
    const mx = Math.round(Math.cos(angle) * (innerR + 1));
    const my = Math.round(Math.sin(angle) * (innerR + 1));
    ctx.fillStyle = hexToRgba(color, pulse * 0.7, color2);
    ctx.fillRect(Math.round(o + mx * i), Math.round(l + my * i), i, i);
  }

  // Center dot
  ctx.fillStyle = hexToRgba(color, 0.8, color2);
  ctx.fillRect(Math.round(o), Math.round(l), i, i);

  // Floating digits around the gear
  const digits: [number, number][] = [[-7, -5], [6, -4], [-6, 5], [7, 3]];
  digits.forEach(([dx, dy], idx) => {
    const alpha = 0.15 + 0.35 * Math.abs(Math.sin(time * 0.004 + idx * 1.5));
    ctx.fillStyle = hexToRgba(color, alpha, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
    ctx.fillRect(Math.round(o + (dx + 1) * i), Math.round(l + dy * i), i, i);
  });
}

export default function CalcLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
