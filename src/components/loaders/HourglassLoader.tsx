"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;
  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  const cycle = (time * 0.0006) % 2;
  const fill = cycle < 1 ? cycle : 1;
  const flipped = cycle >= 1;

  // Frame top and bottom
  for (let x = -4; x <= 4; x++) { px(x, -6, 0.5); px(x, 6, 0.5); }

  // Glass outline — top triangle
  for (let row = 0; row < 5; row++) {
    const w = 4 - row;
    px(-w, -5 + row, 0.3); px(w, -5 + row, 0.3);
  }
  // Bottom triangle
  for (let row = 0; row < 5; row++) {
    const w = 4 - row;
    px(-w, 5 - row, 0.3); px(w, 5 - row, 0.3);
  }
  // Neck
  px(0, 0, 0.3);

  // Sand in top (empties) — fill rows from bottom of top half
  const topSand = flipped ? 5 : Math.round((1 - fill) * 4);
  for (let row = 0; row < topSand; row++) {
    const y = -1 - row;
    const w = Math.min(row + 1, 3);
    for (let x = -w; x <= w; x++) px(x, y, 0.5);
  }

  // Sand in bottom (fills) — fill rows from bottom of bottom half
  const botSand = flipped ? 0 : Math.round(fill * 4);
  for (let row = 0; row < botSand; row++) {
    const y = 5 - row;
    const w = Math.min(4 - row, 3);
    for (let x = -w; x <= w; x++) px(x, y, 0.5);
  }

  // Falling grain through neck
  if (!flipped && fill < 0.95) {
    const grainY = Math.round(Math.sin(time * 0.01) * 0.5);
    px(0, grainY, 0.65);
  }
}

export default function HourglassLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
