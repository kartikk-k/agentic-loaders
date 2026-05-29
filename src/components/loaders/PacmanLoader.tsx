"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const mouthOpen = (Math.sin(time * 0.008) + 1) / 2; // 0 to 1
  const mouthAngle = mouthOpen * 0.7;

  // Pacman body
  for (let dx = -3; dx <= 3; dx++) {
    for (let dy = -3; dy <= 3; dy++) {
      if (Math.hypot(dx, dy) > 3.5) continue;
      const angle = Math.atan2(dy, dx);
      if (Math.abs(angle) < mouthAngle) continue; // mouth gap
      ctx.fillStyle = hexToRgba(color, 0.6, color2);
      ctx.fillRect(Math.round(o + (dx - 3) * i), Math.round(l + dy * i), i, i);
    }
  }

  // Eye
  ctx.fillStyle = hexToRgba(color, 0.9, color2);
  ctx.fillRect(Math.round(o + (-2) * i), Math.round(l + (-2) * i), i, i);

  // Dots being eaten (scroll right to left)
  const dotScroll = (time * 0.003) % 8;
  for (let d = 0; d < 4; d++) {
    const dx = 2 + d * 3 - dotScroll;
    if (dx < -1) continue;
    const alpha = dx < 1 ? 0.1 : 0.4;
    ctx.fillStyle = hexToRgba(color, alpha, color2);
    ctx.fillRect(Math.round(o + Math.round(dx) * i), Math.round(l), i, i);
  }
}

export default function PacmanLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
