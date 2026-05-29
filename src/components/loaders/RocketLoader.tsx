"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;
  const shake = Math.round(Math.sin(time * 0.02) * 0.4);

  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + (x + shake) * i), Math.round(l + y * i), i, i);
  };

  // Nose cone
  px(0, -6, 0.7);
  px(-1, -5, 0.6); px(0, -5, 0.7); px(1, -5, 0.6);

  // Body
  for (let y = -4; y <= 2; y++) {
    px(-1, y, 0.55); px(0, y, 0.6); px(1, y, 0.55);
  }

  // Window
  px(0, -2, 0.3);

  // Fins
  px(-2, 1, 0.45); px(-2, 2, 0.45);
  px(2, 1, 0.45); px(2, 2, 0.45);

  // Exhaust flame (flickering)
  for (let f = 0; f < 4; f++) {
    const flicker = Math.sin(time * 0.015 + f * 1.5);
    const fw = f < 2 ? 1 : 0;
    const alpha = 0.6 - f * 0.12 + flicker * 0.15;
    px(0, 3 + f, Math.max(0.05, alpha));
    if (fw > 0) {
      px(-1, 3 + f, Math.max(0.05, alpha * 0.6));
      px(1, 3 + f, Math.max(0.05, alpha * 0.6));
    }
  }

  // Particles / sparks
  for (let p = 0; p < 5; p++) {
    const py = 5 + ((time * 0.008 + p * 3) % 6);
    const pxOff = Math.sin(time * 0.005 + p * 2) * 2;
    const alpha = 0.3 * (1 - ((py - 5) / 6));
    if (alpha > 0.03) {
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + (Math.round(pxOff) + shake) * i), Math.round(l + Math.round(py) * i), i, i);
    }
  }
}

export default function RocketLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
