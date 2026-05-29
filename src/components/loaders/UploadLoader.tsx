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

  const cycle = (time * 0.002) % 2;
  const arrowY = Math.round(4 - cycle * 4);
  const alpha = cycle > 1.7 ? (2 - cycle) * 3.3 : 0.7;

  // Arrow shaft going up
  for (let y = 0; y <= 3; y++) px(0, arrowY + y, alpha);
  // Arrow head
  px(-2, arrowY - 1, alpha * 0.7); px(-1, arrowY - 1, alpha * 0.8);
  px(0, arrowY - 2, alpha); px(1, arrowY - 1, alpha * 0.8); px(2, arrowY - 1, alpha * 0.7);

  // Tray
  px(-4, 4, 0.45); px(-3, 4, 0.45); px(-2, 4, 0.45); px(-1, 4, 0.45);
  px(0, 4, 0.45); px(1, 4, 0.45); px(2, 4, 0.45); px(3, 4, 0.45); px(4, 4, 0.45);
  px(-4, 3, 0.35); px(-4, 2, 0.35);
  px(4, 3, 0.35); px(4, 2, 0.35);
}

export default function UploadLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
