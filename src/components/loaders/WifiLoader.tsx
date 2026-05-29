"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const pulse = (time * 0.001) % 2;
  const activeArcs = pulse < 1.5 ? Math.floor(pulse * 3) : 0;

  // Base dot
  ctx.fillStyle = hexToRgba(color, 0.8, color2);
  ctx.fillRect(Math.round(o), Math.round(l + 3 * i), i, i);

  // Arc rings (3 levels)
  const arcs = [2, 4, 6];
  arcs.forEach((r, idx) => {
    const active = idx < activeArcs;
    const alpha = active ? 0.5 + 0.2 * (1 - idx / 3) : 0.08;
    for (let a = -Math.PI * 0.4; a <= Math.PI * 0.4; a += Math.PI / (r * 3)) {
      const dx = Math.round(Math.cos(a - Math.PI / 2) * r);
      const dy = Math.round(Math.sin(a - Math.PI / 2) * r);
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + dx * i), Math.round(l + 3 * i + dy * i), i, i);
    }
  });
}

export default function WifiLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
