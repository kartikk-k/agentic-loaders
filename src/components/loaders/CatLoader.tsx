"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Pixel cat with swishing tail
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  // Body (sitting cat, compact)
  const body: [number, number][] = [
    [-1, 0], [0, 0], [1, 0], [2, 0],
    [-1, 1], [0, 1], [1, 1], [2, 1],
    [-1, 2], [0, 2], [1, 2], [2, 2],
    [0, -1], [1, -1],
  ];
  body.forEach(([x, y]) => px(x, y, 0.5));

  // Head
  const head: [number, number][] = [
    [-2, -2], [-1, -2], [0, -2], [1, -2],
    [-2, -1], [-1, -1],
    [-2, -3], [-1, -3], [0, -3], [1, -3],
  ];
  head.forEach(([x, y]) => px(x, y, 0.6));

  // Ears (pointy)
  px(-3, -4, 0.55);
  px(-2, -4, 0.55);
  px(1, -4, 0.55);
  px(2, -4, 0.55);

  // Eyes (blinking)
  const blink = Math.sin(time * 0.003) > 0.9;
  if (!blink) {
    px(-2, -2, 0.9);
    px(1, -2, 0.9);
  }

  // Legs
  px(-1, 3, 0.45);
  px(0, 3, 0.45);
  px(1, 3, 0.45);
  px(2, 3, 0.45);

  // Tail swishing
  const swish = Math.sin(time * 0.004) * 3;
  const sw = Math.round(swish);
  px(3, 1, 0.45);
  px(4, 0, 0.4);
  px(5 + sw, -1, 0.35);
  px(5 + sw, -2, 0.3);
}

export default function CatLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
