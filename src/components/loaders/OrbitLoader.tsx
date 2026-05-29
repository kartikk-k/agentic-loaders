"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // Planet (larger body at center)
  const planetPixels: [number, number][] = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1],
  ];
  planetPixels.forEach(([px, py]) => {
    ctx.fillStyle = hexToRgba(color, 0.55, color2);
    ctx.fillRect(Math.round(o + px * i), Math.round(l + py * i), i, i);
  });

  // Orbit path (elliptical ring)
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
    const dx = Math.round(Math.cos(a) * 7);
    const dy = Math.round(Math.sin(a) * 3);
    ctx.fillStyle = hexToRgba(color, 0.08, color2);
    ctx.fillRect(Math.round(o + dx * i), Math.round(l + dy * i), i, i);
  }

  // Moon orbiting
  const moonAngle = time * 0.002;
  const mx = Math.round(Math.cos(moonAngle) * 7);
  const my = Math.round(Math.sin(moonAngle) * 3);
  ctx.fillStyle = hexToRgba(color, 0.7, color2);
  ctx.fillRect(Math.round(o + mx * i), Math.round(l + my * i), i, i);

  // Moon trail
  for (let t = 1; t <= 5; t++) {
    const ta = moonAngle - t * 0.15;
    const tx = Math.round(Math.cos(ta) * 7);
    const ty = Math.round(Math.sin(ta) * 3);
    ctx.fillStyle = hexToRgba(color, 0.3 * (1 - t / 6), color2);
    ctx.fillRect(Math.round(o + tx * i), Math.round(l + ty * i), i, i);
  }
}

export default function OrbitLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
