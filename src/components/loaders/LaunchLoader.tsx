"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Arrow launching upward with trail
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Arrow cycles up and resets
  const cycle = (time * 0.002) % 3;
  const yOff = cycle < 2 ? -cycle * 5 : -(2 * 5) + (cycle - 2) * 10; // rise then snap back

  // Arrowhead
  const arrowY = Math.round(yOff);
  const alpha = cycle < 2.5 ? 0.7 : 0.7 * (3 - cycle) * 2;

  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  // Arrow tip
  px(0, arrowY - 3, alpha);
  px(-1, arrowY - 2, alpha * 0.8); px(0, arrowY - 2, alpha); px(1, arrowY - 2, alpha * 0.8);
  px(-2, arrowY - 1, alpha * 0.6); px(0, arrowY - 1, alpha); px(2, arrowY - 1, alpha * 0.6);

  // Shaft
  for (let s = 0; s < 5; s++) {
    const sa = alpha * (1 - s * 0.15);
    px(0, arrowY + s, sa);
  }

  // Trail particles
  for (let t = 0; t < 6; t++) {
    const ty = arrowY + 5 + t * 1.5;
    const tx = Math.sin(time * 0.008 + t * 1.2) * 1.5;
    const ta = 0.3 * (1 - t / 6) * (cycle < 2.5 ? 1 : 0);
    if (ta > 0.03) px(Math.round(tx), Math.round(ty), ta);
  }

  // Launch pad base
  px(-3, 6, 0.2); px(-2, 6, 0.2); px(-1, 6, 0.2);
  px(0, 6, 0.2); px(1, 6, 0.2); px(2, 6, 0.2); px(3, 6, 0.2);
}

export default function LaunchLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
