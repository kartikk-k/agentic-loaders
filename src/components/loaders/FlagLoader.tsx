"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Pole
  for (let y = -6; y <= 6; y++) {
    ctx.fillStyle = hexToRgba(color, 0.4, color2);
    ctx.fillRect(Math.round(o - 5 * i), Math.round(l + y * i), i, i);
  }

  // Flag waving
  const t = time * 0.003;
  for (let fx = 0; fx < 8; fx++) {
    for (let fy = 0; fy < 5; fy++) {
      const wave = Math.sin(t + fx * 0.5) * (0.5 + fx * 0.15);
      const wy = Math.round(-5 + fy + wave);
      const alpha = 0.35 + 0.3 * (1 - fx / 8);
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + (-4 + fx) * i), Math.round(l + wy * i), i, i);
    }
  }

  // Pole ball top
  ctx.fillStyle = hexToRgba(color, 0.6, color2);
  ctx.fillRect(Math.round(o - 5 * i), Math.round(l - 7 * i), i, i);
}

export default function FlagLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
