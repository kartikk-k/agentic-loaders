"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const t = time * 0.0008;
  const numCandles = 7;
  const spacing = 3;
  const startX = -Math.floor(numCandles / 2) * spacing;

  for (let c = 0; c < numCandles; c++) {
    const phase = t + c * 0.9;
    // Open/close prices
    const mid = Math.sin(phase * 0.7 + c) * 2;
    const bodyH = 1 + Math.abs(Math.sin(phase * 1.3 + c * 2)) * 2;
    const open = mid - bodyH / 2;
    const close = mid + bodyH / 2;
    // Wicks extend beyond body
    const wickHi = close + 0.5 + Math.abs(Math.sin(phase * 1.7)) * 1.5;
    const wickLo = open - 0.5 - Math.abs(Math.sin(phase * 2.1 + 1)) * 1.5;
    // Green if close > open (trending up over time)
    const bullish = Math.sin(phase * 0.5) > -0.2;

    const cx = startX + c * spacing;
    const bodyAlpha = bullish ? 0.7 : 0.35;
    const wickAlpha = bullish ? 0.4 : 0.2;

    // Wick (1px wide center line)
    const wickTop = Math.round(wickHi);
    const wickBot = Math.round(wickLo);
    for (let wy = wickBot; wy <= wickTop; wy++) {
      ctx.fillStyle = hexToRgba(color, wickAlpha, color2);
      ctx.fillRect(Math.round(o + cx * i), Math.round(l - wy * i), i, i);
    }

    // Body (wider)
    const bTop = Math.round(Math.max(open, close));
    const bBot = Math.round(Math.min(open, close));
    for (let by = bBot; by <= bTop; by++) {
      ctx.fillStyle = hexToRgba(color, bodyAlpha, color2);
      ctx.fillRect(Math.round(o + (cx - 1) * i), Math.round(l - by * i), i, i);
      ctx.fillRect(Math.round(o + cx * i), Math.round(l - by * i), i, i);
      ctx.fillRect(Math.round(o + (cx + 1) * i), Math.round(l - by * i), i, i);
    }
  }

  // Baseline
  ctx.fillStyle = hexToRgba(color, 0.08, color2);
  const axisW = Math.floor(numCandles / 2) * spacing + 2;
  for (let x = -axisW; x <= axisW; x++) {
    ctx.fillRect(Math.round(o + x * i), Math.round(l + 6 * i), i, i);
  }
}

export default function CandleLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
