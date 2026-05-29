"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Spinning tire/wheel
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const rot = time * 0.003;

  // Outer tire ring
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    const r = 6;
    const dx = Math.round(Math.cos(a) * r);
    const dy = Math.round(Math.sin(a) * r);
    const tread = 0.35 + 0.25 * Math.abs(Math.sin(a * 4 + rot));
    ctx.fillStyle = hexToRgba(color, tread, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // Mid ring
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    const r = 4;
    const dx = Math.round(Math.cos(a) * r);
    const dy = Math.round(Math.sin(a) * r);
    ctx.fillStyle = hexToRgba(color, 0.45, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // Spokes (rotating)
  const numSpokes = 5;
  for (let s = 0; s < numSpokes; s++) {
    const angle = (s / numSpokes) * Math.PI * 2 + rot;
    for (let d = 1; d <= 4; d++) {
      const dx = Math.round(Math.cos(angle) * d);
      const dy = Math.round(Math.sin(angle) * d);
      const alpha = 0.3 + 0.35 * (1 - d / 5);
      ctx.fillStyle = hexToRgba(color, alpha, color2);
      ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
    }
  }

  // Hub
  ctx.fillStyle = hexToRgba(color, 0.75, color2);
  ctx.fillRect(Math.round(o), Math.round(l), i, i);
}

export default function TireLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
