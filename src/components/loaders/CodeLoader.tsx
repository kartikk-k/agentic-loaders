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

  // Left bracket <
  px(-6, -1, 0.55); px(-7, 0, 0.6); px(-6, 1, 0.55);

  // Right bracket />
  px(4, -1, 0.45); px(5, 0, 0.5); px(4, 1, 0.45);
  // Slash
  px(3, -1, 0.4); px(2, 0, 0.4);

  // Scrolling dots between brackets
  const cycle = (time * 0.003) % 3;
  for (let d = 0; d < 3; d++) {
    const dx = -4 + d * 2;
    const appear = cycle - d * 0.4;
    const alpha = appear > 0 && appear < 1.5 ? 0.5 * Math.min(1, appear * 2) : 0.08;
    px(dx, 0, alpha);
  }

  // Code lines above/below (static decoration)
  for (let x = -5; x <= 0; x++) px(x, -3, 0.12);
  for (let x = -3; x <= 3; x++) px(x, -4, 0.08);
  for (let x = -4; x <= 1; x++) px(x, 3, 0.12);
  for (let x = -2; x <= 4; x++) px(x, 4, 0.08);
}

export default function CodeLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
