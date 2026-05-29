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

  // Magnifying glass circle
  const r = 4;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
    const dx = Math.round(Math.cos(a) * r);
    const dy = Math.round(Math.sin(a) * r);
    px(dx - 1, dy - 1, 0.5);
  }

  // Handle
  px(3, 3, 0.45); px(4, 4, 0.45); px(5, 5, 0.4); px(6, 6, 0.35);

  // Scanning line rotating inside the lens
  const scanAngle = time * 0.003;
  for (let d = 0; d <= 3; d++) {
    const sx = Math.round(Math.cos(scanAngle) * d);
    const sy = Math.round(Math.sin(scanAngle) * d);
    const sa = 0.3 + 0.3 * (1 - d / 4);
    px(sx - 1, sy - 1, sa);
  }
}

export default function SearchLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
