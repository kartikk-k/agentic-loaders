"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const t = time * 0.002;

  // Wave surface
  for (let x = -8; x <= 8; x++) {
    const waveY = Math.sin(t + x * 0.5) * 2 + Math.sin(t * 1.3 + x * 0.3) * 1;
    const wy = Math.round(waveY);
    const alpha = 0.4 + 0.2 * Math.sin(t + x * 0.4);
    ctx.fillStyle = hexToRgba(color, alpha, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + wy * i), i, i);

    // Water body below the surface
    for (let fill = 1; fill <= 5; fill++) {
      const fa = 0.15 + 0.15 * (1 - fill / 6);
      ctx.fillStyle = hexToRgba(color, fa, color2);
      ctx.fillRect(Math.round(o + x * i), Math.round(l + (wy + fill) * i), i, i);
    }
  }

  // Foam/spray particles
  for (let p = 0; p < 4; p++) {
    const px2 = Math.sin(t * 1.5 + p * 2.5) * 5;
    const py = -1 + Math.sin(t + p * 1.8) * 2 - Math.abs(Math.sin(t * 2 + p)) * 1.5;
    const alpha = 0.2 * Math.max(0, Math.sin(t * 2 + p * 1.3));
    if (alpha > 0.03) {
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + Math.round(px2) * i), Math.round(l + Math.round(py) * i), i, i);
    }
  }
}

export default function WaveLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
