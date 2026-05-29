"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const cols = 16;
  const halfW = Math.floor(cols / 2);
  const t = time * 0.001;

  // Generate price line
  let minY = Infinity, maxY = -Infinity;
  const raw: number[] = [];
  for (let c = 0; c < cols; c++) {
    const phase = t * 1.2 + c * 0.35;
    const val = -(c / cols) * 4 - Math.sin(phase) * 1.5 - Math.sin(phase * 2.3 + 1) * 0.8;
    raw.push(val);
    if (val < minY) minY = val;
    if (val > maxY) maxY = val;
  }

  const range = maxY - minY || 1;
  const yCoords: number[] = [];
  for (let c = 0; c < cols; c++) {
    yCoords.push(Math.round(((raw[c] - minY) / range) * 8 - 4));
  }

  // Draw line + vertical connections
  for (let c = 0; c < cols; c++) {
    const py = yCoords[c];
    const px = c - halfW;
    const brightness = 0.5 + 0.4 * (c / cols);

    ctx.fillStyle = hexToRgba(color, brightness, color2);
    ctx.fillRect(Math.round(o + px * i), Math.round(l + py * i), i, i);

    // Connect to next point
    if (c < cols - 1) {
      const nextPy = yCoords[c + 1];
      if (nextPy !== py) {
        const dir = nextPy > py ? 1 : -1;
        for (let fill = py + dir; fill !== nextPy; fill += dir) {
          ctx.fillStyle = hexToRgba(color, brightness * 0.6, color2);
          ctx.fillRect(Math.round(o + px * i), Math.round(l + fill * i), i, i);
        }
      }
    }
  }

  // Blinking cursor
  const lastPy = yCoords[cols - 1];
  if (Math.sin(time * 0.006) > 0) {
    ctx.fillStyle = hexToRgba(color, 0.9, color2);
    ctx.fillRect(Math.round(o + halfW * i), Math.round(l + lastPy * i), i, i);
  }

  // Up-arrow
  const arrowX = halfW + 1;
  const arrowAlpha = 0.3 + 0.4 * Math.abs(Math.sin(time * 0.003));
  ctx.fillStyle = hexToRgba(color, arrowAlpha, color2);
  ctx.fillRect(Math.round(o + arrowX * i), Math.round(l + (lastPy - 1) * i), i, i);
  ctx.fillRect(Math.round(o + (arrowX - 1) * i), Math.round(l + lastPy * i), i, i);
  ctx.fillRect(Math.round(o + (arrowX + 1) * i), Math.round(l + lastPy * i), i, i);

  // Baseline
  ctx.fillStyle = hexToRgba(color, 0.1, color2);
  for (let c = -halfW; c <= halfW; c++) {
    ctx.fillRect(Math.round(o + c * i), Math.round(l + 5 * i), i, i);
  }
}

export default function UptickLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
