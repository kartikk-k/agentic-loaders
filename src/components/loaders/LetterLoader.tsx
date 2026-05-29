"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Envelope opening with letter sliding out
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  // Cycle: closed -> flap opens -> letter slides up -> resets
  const cycle = (time * 0.0008) % 4;

  // Envelope body
  for (let x = -5; x <= 5; x++) {
    for (let y = -1; y <= 4; y++) {
      px(x, y, 0.35);
    }
  }
  // Outline
  for (let x = -5; x <= 5; x++) { px(x, -1, 0.5); px(x, 4, 0.5); }
  for (let y = -1; y <= 4; y++) { px(-5, y, 0.5); px(5, y, 0.5); }

  // Flap (opens upward over time)
  const flapOpen = Math.min(1, Math.max(0, (cycle - 0.5) / 1));
  // Flap as V shape that rotates up
  for (let x = -4; x <= 4; x++) {
    const flapY = Math.round(-1 - Math.abs(x) * 0.5 * (1 - flapOpen) - flapOpen * 2);
    const alpha = 0.45 - flapOpen * 0.15;
    px(x, flapY, alpha);
  }

  // Letter sliding out
  const letterSlide = Math.min(1, Math.max(0, (cycle - 1.2) / 1.5));
  const letterY = Math.round(-1 - letterSlide * 6);
  if (letterSlide > 0) {
    const la = 0.55 * Math.min(1, letterSlide * 3);
    for (let x = -3; x <= 3; x++) {
      px(x, letterY, la);
      px(x, letterY + 1, la);
      px(x, letterY + 2, la * 0.8);
      px(x, letterY + 3, la * 0.6);
    }
    // Text lines on letter
    for (let x = -2; x <= 1; x++) px(x, letterY + 1, la * 0.4);
    for (let x = -2; x <= 0; x++) px(x, letterY + 2, la * 0.35);
  }
}

export default function LetterLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
