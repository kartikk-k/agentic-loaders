"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Side-view pixel car driving right with bouncing suspension
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const bounce = Math.round(Math.sin(time * 0.006) * 0.6);
  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + (y + bounce) * i), i, i);
  };

  // Lower body (wide)
  for (let x = -6; x <= 5; x++) px(x, 1, 0.55);
  for (let x = -6; x <= 5; x++) px(x, 0, 0.5);
  for (let x = -5; x <= 5; x++) px(x, -1, 0.48);

  // Cabin / roof
  for (let x = -3; x <= 2; x++) px(x, -2, 0.55);
  for (let x = -2; x <= 1; x++) px(x, -3, 0.5);

  // Windows (dimmer)
  px(-1, -2, 0.25);
  px(0, -2, 0.25);
  px(1, -2, 0.25);

  // Bumpers
  px(-7, 0, 0.35);
  px(-7, 1, 0.35);
  px(6, 0, 0.35);
  px(6, 1, 0.35);

  // Headlight (front = right side)
  const hl = 0.5 + 0.4 * Math.abs(Math.sin(time * 0.005));
  px(6, 0, hl);

  // Taillight (back = left side)
  px(-7, 0, 0.3 + 0.2 * Math.abs(Math.sin(time * 0.003)));

  // Wheels (no bounce offset — they stay on ground)
  const wheelPhase = time * 0.01;
  const drawWheel = (wx: number, wy: number) => {
    // Fixed position wheels (no bounce)
    const wpx = (x: number, y: number, a: number) => {
      ctx.fillStyle = hexToRgba(color, a, color2);
      ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
    };
    wpx(wx, wy, 0.7);
    wpx(wx - 1, wy, 0.55);
    wpx(wx + 1, wy, 0.55);
    wpx(wx, wy - 1, 0.55);
    wpx(wx, wy + 1, 0.55);
    // Spoke
    const sx = Math.round(Math.cos(wheelPhase));
    const sy = Math.round(Math.sin(wheelPhase));
    wpx(wx + sx, wy + sy, 0.8);
  };
  drawWheel(-4, 2);
  drawWheel(3, 2);

  // Road line (ground)
  ctx.fillStyle = hexToRgba(color, 0.08, color2);
  for (let x = -9; x <= 9; x++) {
    ctx.fillRect(Math.round(o + x * i), Math.round(l + 3 * i), i, i);
  }

  // Exhaust puffs (behind car)
  for (let p = 0; p < 3; p++) {
    const pt = (time * 0.004 + p * 2.0) % (Math.PI * 2);
    const ex = -8 - p * 1.5;
    const ey = 1 + Math.sin(pt) * 0.8 - p * 0.5;
    const alpha = 0.2 * (1 - p / 3);
    ctx.fillStyle = hexToRgba(color, alpha, color2);
    ctx.fillRect(Math.round(o + ex * i), Math.round(l + Math.round(ey) * i), i, i);
  }
}

export default function CarLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
