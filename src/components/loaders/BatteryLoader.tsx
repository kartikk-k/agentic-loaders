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

  // Battery outline
  for (let x = -6; x <= 5; x++) { px(x, -3, 0.4); px(x, 3, 0.4); }
  for (let y = -3; y <= 3; y++) { px(-6, y, 0.4); px(5, y, 0.4); }
  // Tip
  px(6, -1, 0.35); px(6, 0, 0.35); px(6, 1, 0.35);

  // Fill level
  const fill = ((time * 0.0008) % 1.5);
  const segments = Math.min(4, Math.floor(fill * 4));
  for (let seg = 0; seg < segments; seg++) {
    const sx = -5 + seg * 2.5;
    for (let x = 0; x < 2; x++) {
      for (let y = -2; y <= 2; y++) {
        px(Math.round(sx + x), y, 0.55);
      }
    }
  }

  // Charging bolt (flash when full)
  if (segments >= 4) {
    const flash = Math.sin(time * 0.006) > 0;
    if (flash) {
      px(0, -5, 0.6); px(-1, -4, 0.6); px(0, -4, 0.6);
      px(1, -4, 0.5); px(-1, -5, 0.5);
    }
  }
}

export default function BatteryLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
