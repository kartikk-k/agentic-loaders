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

  // Flash cycle: build -> flash -> fade
  const cycle = (time * 0.0008) % 3;
  const flash = cycle > 1.3 && cycle < 1.6;
  const baseAlpha = flash ? 0.9 : cycle < 1.3 ? 0.15 + 0.4 * (cycle / 1.3) : Math.max(0.05, 0.9 - (cycle - 1.6) * 1.5);

  // Bolt shape
  const bolt: [number, number][] = [
    [1, -7], [0, -6], [0, -5], [-1, -4], [-1, -3],
    [0, -3], [1, -3], [2, -3],
    [1, -2], [0, -1], [0, 0], [-1, 1], [-1, 2],
    [-1, 3], [0, 4], [0, 5],
  ];
  bolt.forEach(([x, y]) => px(x, y, baseAlpha));

  // Glow around bolt during flash
  if (flash) {
    bolt.forEach(([x, y]) => {
      px(x - 1, y, 0.2); px(x + 1, y, 0.2);
    });
  }

  // Cloud at top
  const cloudPixels: [number, number][] = [
    [-3, -8], [-2, -8], [-1, -8], [0, -8], [1, -8], [2, -8], [3, -8],
    [-2, -9], [-1, -9], [0, -9], [1, -9], [2, -9],
  ];
  cloudPixels.forEach(([x, y]) => px(x, y, 0.25));
}

export default function LightningLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
