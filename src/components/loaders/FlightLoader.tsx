"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Plane taking off diagonally
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Plane cycles: taxi -> take off -> fly up -> reset
  const cycle = (time * 0.0008) % 4;
  const planeX = cycle < 1 ? -6 + cycle * 4 : -2 + (cycle - 1) * 4;
  const planeY = cycle < 1.5 ? 2 : 2 - (cycle - 1.5) * 4;

  const px = (x: number, y: number, a: number) => {
    const fx = Math.round(planeX + x);
    const fy = Math.round(planeY + y);
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + fx * i), Math.round(l + fy * i), i, i);
  };

  const alpha = cycle > 3.5 ? (4 - cycle) * 2 : 1;

  // Fuselage
  for (let x = -3; x <= 3; x++) px(x, 0, 0.55 * alpha);

  // Nose
  px(4, 0, 0.6 * alpha);

  // Wings
  px(-1, -1, 0.5 * alpha); px(0, -1, 0.5 * alpha); px(1, -1, 0.5 * alpha);
  px(-1, 1, 0.5 * alpha); px(0, 1, 0.5 * alpha); px(1, 1, 0.5 * alpha);
  px(0, -2, 0.4 * alpha);
  px(0, 2, 0.4 * alpha);

  // Tail
  px(-3, -1, 0.45 * alpha);
  px(-3, -2, 0.35 * alpha);

  // Engine glow
  const eng = 0.3 + 0.2 * Math.abs(Math.sin(time * 0.01));
  px(-4, 0, eng * alpha);

  // Runway
  ctx.fillStyle = hexToRgba(color, 0.08, color2);
  for (let x = -9; x <= 9; x++) {
    ctx.fillRect(Math.round(o + x * i), Math.round(l + 4 * i), i, i);
  }
  // Runway dashes
  for (let x = -8; x <= 8; x += 3) {
    ctx.fillStyle = hexToRgba(color, 0.15, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + 4 * i), i, i);
  }

  // Trail (only during flight)
  if (cycle > 1.5) {
    for (let t = 1; t <= 4; t++) {
      const tx = planeX - 3 - t * 2;
      const ty = planeY + t * 1;
      const ta = 0.15 * (1 - t / 5);
      if (ta > 0.02) {
        ctx.fillStyle = hexToRgba(color, ta, color2);
        ctx.fillRect(Math.round(o + Math.round(tx) * i), Math.round(l + Math.round(ty) * i), i, i);
      }
    }
  }
}

export default function FlightLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
