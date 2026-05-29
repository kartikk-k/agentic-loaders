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

  // Key turning animation
  const rotation = Math.sin(time * 0.002) * 0.3;

  // Key head (circle)
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
    const dx = Math.round(Math.cos(a + rotation) * 3);
    const dy = Math.round(Math.sin(a + rotation) * 3);
    px(dx - 3, dy, 0.5);
  }
  // Key head center hole
  px(-3, 0, 0.15);

  // Key shaft
  for (let x = 0; x <= 5; x++) px(x, 0, 0.55);

  // Key teeth
  px(3, 1, 0.5); px(3, 2, 0.45);
  px(5, 1, 0.5); px(5, 2, 0.45);

  // Lock outline
  const lockAlpha = 0.2 + 0.15 * Math.abs(Math.sin(time * 0.003));
  for (let y = -2; y <= 3; y++) { px(7, y, lockAlpha); px(11, y, lockAlpha); }
  for (let x = 7; x <= 11; x++) { px(x, -2, lockAlpha); px(x, 3, lockAlpha); }
  // Shackle
  px(8, -3, lockAlpha * 0.8); px(9, -4, lockAlpha * 0.8); px(10, -3, lockAlpha * 0.8);

  // Keyhole
  px(9, 0, lockAlpha + 0.1); px(9, 1, lockAlpha);
}

export default function KeyLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
