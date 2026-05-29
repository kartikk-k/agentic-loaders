"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Smooth play<->pause morph with progress ring
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Smooth morph 0=play, 1=pause
  const cycle = (time * 0.0004) % 2;
  const t = cycle < 1
    ? Math.pow(Math.min(1, cycle / 0.3), 2)
    : 1 - Math.pow(Math.min(1, (cycle - 1) / 0.3), 2);

  // Play triangle vertices (left-pointing right arrow)
  // Morph: triangle corners slide into two bars
  for (let y = -4; y <= 4; y++) {
    // Play: triangle row width narrows toward tip
    const playW = Math.max(0, 4 - Math.abs(y));
    // Pause: two bars at x=-2..-1 and x=1..2
    const leftBarX = -2;
    const rightBarX = 1;

    for (let x = -3; x <= 3; x++) {
      let playA = 0;
      if (x >= -3 && x <= -3 + playW) playA = 0.65;

      let pauseA = 0;
      if ((x >= leftBarX && x <= leftBarX + 1) || (x >= rightBarX && x <= rightBarX + 1)) pauseA = 0.65;

      const alpha = playA * (1 - t) + pauseA * t;
      if (alpha < 0.04) continue;
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
    }
  }

  // Progress ring around the icon
  const progress = (time * 0.0008) % 1;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
    const r = 7;
    const dx = Math.round(Math.cos(a) * r);
    const dy = Math.round(Math.sin(a) * r);
    const norm = a / (Math.PI * 2);
    const filled = norm < progress;
    const alpha = filled ? 0.35 : 0.08;
    ctx.fillStyle = hexToRgba(color, alpha, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }
}

export default function PlayLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
