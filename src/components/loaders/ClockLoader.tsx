"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Clock face circle
  const r = 6;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    const dx = Math.round(Math.cos(a) * r);
    const dy = Math.round(Math.sin(a) * r);
    ctx.fillStyle = hexToRgba(color, 0.3, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // Hour marks (12, 3, 6, 9)
  for (let h = 0; h < 4; h++) {
    const a = (h / 4) * Math.PI * 2 - Math.PI / 2;
    const dx = Math.round(Math.cos(a) * (r - 1));
    const dy = Math.round(Math.sin(a) * (r - 1));
    ctx.fillStyle = hexToRgba(color, 0.5, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // Hour hand (slow)
  const hourAngle = time * 0.0002 - Math.PI / 2;
  for (let d = 1; d <= 3; d++) {
    const dx = Math.round(Math.cos(hourAngle) * d);
    const dy = Math.round(Math.sin(hourAngle) * d);
    ctx.fillStyle = hexToRgba(color, 0.65, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // Minute hand (faster)
  const minAngle = time * 0.002 - Math.PI / 2;
  for (let d = 1; d <= 5; d++) {
    const dx = Math.round(Math.cos(minAngle) * d);
    const dy = Math.round(Math.sin(minAngle) * d);
    ctx.fillStyle = hexToRgba(color, 0.5, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // Center dot
  ctx.fillStyle = hexToRgba(color, 0.8, color2);
  ctx.fillRect(Math.round(o), Math.round(l), i, i);
}

export default function ClockLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
