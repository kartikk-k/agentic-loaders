"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const cycle = (time * 0.001) % 3;
  const numDots = cycle < 2 ? Math.floor(cycle * 2) : 0;

  // Prompt ">"
  ctx.fillStyle = hexToRgba(color, 0.6, color2);
  ctx.fillRect(Math.round(o - 6 * i), Math.round(l), i, i);
  ctx.fillRect(Math.round(o - 5 * i), Math.round(l + i), i, i);
  ctx.fillRect(Math.round(o - 6 * i), Math.round(l + 2 * i), i, i);

  // Dots
  for (let d = 0; d < numDots; d++) {
    ctx.fillStyle = hexToRgba(color, 0.55, color2);
    ctx.fillRect(Math.round(o + (-3 + d * 2) * i), Math.round(l + i), i, i);
  }

  // Blinking cursor
  const cursorX = -3 + numDots * 2;
  if (Math.sin(time * 0.006) > 0) {
    ctx.fillStyle = hexToRgba(color, 0.8, color2);
    ctx.fillRect(Math.round(o + cursorX * i), Math.round(l), i, i);
    ctx.fillRect(Math.round(o + cursorX * i), Math.round(l + i), i, i);
    ctx.fillRect(Math.round(o + cursorX * i), Math.round(l + 2 * i), i, i);
  }

  // Window frame
  ctx.fillStyle = hexToRgba(color, 0.12, color2);
  for (let x = -8; x <= 8; x++) {
    ctx.fillRect(Math.round(o + x * i), Math.round(l - 4 * i), i, i);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + 5 * i), i, i);
  }
  for (let y = -4; y <= 5; y++) {
    ctx.fillRect(Math.round(o - 8 * i), Math.round(l + y * i), i, i);
    ctx.fillRect(Math.round(o + 8 * i), Math.round(l + y * i), i, i);
  }
  // Title bar dots
  ctx.fillStyle = hexToRgba(color, 0.25, color2);
  ctx.fillRect(Math.round(o - 6 * i), Math.round(l - 3 * i), i, i);
  ctx.fillRect(Math.round(o - 4 * i), Math.round(l - 3 * i), i, i);
  ctx.fillRect(Math.round(o - 2 * i), Math.round(l - 3 * i), i, i);
}

export default function TerminalLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
