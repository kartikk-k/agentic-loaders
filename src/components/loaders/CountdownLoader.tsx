"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// 3x5 pixel font digits
const DIGITS: Record<number, number[][]> = {
  3: [
    [1,1,1],
    [0,0,1],
    [1,1,1],
    [0,0,1],
    [1,1,1],
  ],
  2: [
    [1,1,1],
    [0,0,1],
    [1,1,1],
    [1,0,0],
    [1,1,1],
  ],
  1: [
    [0,1,0],
    [1,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1],
  ],
  0: [
    [1,1,1],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,1,1],
  ],
};

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Cycle through 3, 2, 1, 0 (go!)
  const cycle = (time * 0.0008) % 4;
  const digitIdx = Math.min(3, Math.floor(cycle));
  const digit = 3 - digitIdx; // 3, 2, 1, 0
  const phase = cycle - digitIdx; // 0 to 1 within each digit

  // Scale pulse on appear
  const scale = phase < 0.15 ? 1.3 - phase * 2 : 1;
  // Fade out near end
  const fadeAlpha = phase > 0.8 ? (1 - phase) * 5 : 1;

  const grid = DIGITS[digit];
  if (!grid) return;

  // Draw digit centered
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      if (!grid[row][col]) continue;
      const x = (col - 1) * scale;
      const y = (row - 2) * scale;
      const alpha = 0.7 * fadeAlpha;
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
    }
  }

  // Progress ring
  const ringProgress = cycle / 4;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 14) {
    const r = 6;
    const dx = Math.round(Math.cos(a - Math.PI / 2) * r);
    const dy = Math.round(Math.sin(a - Math.PI / 2) * r);
    const norm = a / (Math.PI * 2);
    const filled = norm < ringProgress;
    ctx.fillStyle = hexToRgba(color, filled ? 0.35 : 0.08, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // "GO" flash on 0
  if (digit === 0 && phase > 0.3) {
    const goAlpha = 0.3 + 0.4 * Math.abs(Math.sin(time * 0.008));
    // Small radiating dots
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const r = 3 + phase * 2;
      const dx = Math.round(Math.cos(a) * r);
      const dy = Math.round(Math.sin(a) * r);
      ctx.fillStyle = hexToRgba(color, goAlpha * fadeAlpha, color2);
      ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
    }
  }
}

export default function CountdownLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
