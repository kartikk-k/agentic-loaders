"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Mouse cursor with click ripple
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  // Cursor arrow shape
  const cursor: [number, number][] = [
    [-3, -5],
    [-3, -4], [-2, -4],
    [-3, -3], [-2, -3], [-1, -3],
    [-3, -2], [-2, -2], [-1, -2], [0, -2],
    [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1],
    [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
    [-3, 1], [-2, 1], [0, 1],
    [-3, 2], [-1, 2], [0, 2],
    [1, 3], [2, 3],
  ];
  cursor.forEach(([x, y]) => px(x, y, 0.6));

  // Fill (inner bright)
  const inner: [number, number][] = [
    [-2, -3], [-2, -2], [-1, -2], [-2, -1], [-1, -1], [0, -1],
    [-2, 0], [-1, 0], [0, 0], [1, 0],
  ];
  inner.forEach(([x, y]) => px(x, y, 0.75));

  // Click ripple
  const clickCycle = (time * 0.002) % 3;
  if (clickCycle < 1.5) {
    const rippleR = clickCycle * 3;
    const rippleAlpha = 0.3 * (1 - clickCycle / 1.5);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const rx = Math.round(Math.cos(a) * rippleR);
      const ry = Math.round(Math.sin(a) * rippleR);
      px(rx + 2, ry + 2, rippleAlpha);
    }
  }
}

export default function CursorLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
