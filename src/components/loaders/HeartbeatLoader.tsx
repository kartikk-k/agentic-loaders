"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  // ECG line scrolling left
  const cols = 18;
  const half = Math.floor(cols / 2);
  const t = time * 0.003;

  for (let c = 0; c < cols; c++) {
    const phase = (t + c * 0.15) % (Math.PI * 2);
    let y = 0;
    // Flat line with periodic spike
    const p = phase % (Math.PI * 2);
    if (p > 4.5 && p < 4.8) y = -4;
    else if (p > 4.8 && p < 5.0) y = 3;
    else if (p > 5.0 && p < 5.2) y = -2;
    else if (p > 5.2 && p < 5.4) y = 1;

    const px = c - half;
    const brightness = 0.3 + 0.4 * (c / cols);
    ctx.fillStyle = hexToRgba(color, brightness, color2);
    ctx.fillRect(Math.round(o + px * i), Math.round(l + y * i), i, i);

    // Connect vertically to next column
    if (c < cols - 1) {
      const nextPhase = (t + (c + 1) * 0.15) % (Math.PI * 2);
      let ny = 0;
      const np = nextPhase % (Math.PI * 2);
      if (np > 4.5 && np < 4.8) ny = -4;
      else if (np > 4.8 && np < 5.0) ny = 3;
      else if (np > 5.0 && np < 5.2) ny = -2;
      else if (np > 5.2 && np < 5.4) ny = 1;
      if (ny !== y) {
        const dir = ny > y ? 1 : -1;
        for (let fill = y + dir; fill !== ny; fill += dir) {
          ctx.fillStyle = hexToRgba(color, brightness * 0.5, color2);
          ctx.fillRect(Math.round(o + px * i), Math.round(l + fill * i), i, i);
        }
      }
    }
  }

  // Baseline
  ctx.fillStyle = hexToRgba(color, 0.06, color2);
  for (let x = -half; x <= half; x++) {
    ctx.fillRect(Math.round(o + x * i), Math.round(l), i, i);
  }
}

export default function HeartbeatLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
