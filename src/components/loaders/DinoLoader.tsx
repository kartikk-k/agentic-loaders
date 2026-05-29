"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Pixel T-Rex walking (chrome dino style)
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  // Head
  px(2, -5, 0.65); px(3, -5, 0.65); px(4, -5, 0.65); px(5, -5, 0.65);
  px(2, -4, 0.65); px(3, -4, 0.65); px(4, -4, 0.65); px(5, -4, 0.65);
  // Eye
  px(4, -5, 0.9);
  // Jaw (open/close)
  const jawOpen = Math.sin(time * 0.004) > 0.3;
  if (jawOpen) {
    px(3, -3, 0.55); px(4, -3, 0.55); px(5, -3, 0.55);
  } else {
    px(2, -3, 0.6); px(3, -3, 0.6); px(4, -3, 0.6); px(5, -3, 0.6);
  }

  // Neck
  px(1, -3, 0.55); px(2, -3, 0.55);
  px(1, -2, 0.55);

  // Body
  px(-1, -1, 0.5); px(0, -1, 0.55); px(1, -1, 0.55); px(2, -1, 0.55);
  px(-2, 0, 0.5); px(-1, 0, 0.55); px(0, 0, 0.55); px(1, 0, 0.55); px(2, 0, 0.5);
  px(-2, 1, 0.5); px(-1, 1, 0.55); px(0, 1, 0.55); px(1, 1, 0.5);

  // Tiny arms
  px(2, -1, 0.45); px(3, -1, 0.35);

  // Tail
  px(-3, 0, 0.45); px(-4, -1, 0.4); px(-5, -2, 0.35);

  // Legs (walking)
  const step = time * 0.007;
  const leg1 = Math.round(Math.sin(step) * 1);
  const leg2 = Math.round(Math.sin(step + Math.PI) * 1);
  // Left leg
  px(-1, 2, 0.5); px(-1, 3, 0.5); px(-1 + leg1, 4, 0.45);
  // Right leg
  px(1, 2, 0.5); px(1, 3, 0.5); px(1 + leg2, 4, 0.45);

  // Ground
  ctx.fillStyle = hexToRgba(color, 0.08, color2);
  for (let x = -8; x <= 8; x++) {
    ctx.fillRect(Math.round(o + x * i), Math.round(l + 5 * i), i, i);
  }
}

export default function DinoLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
