"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

const FACES: [number, number][][] = [
  [[0, 0]], // 1
  [[-2, -2], [2, 2]], // 2
  [[-2, -2], [0, 0], [2, 2]], // 3
  [[-2, -2], [2, -2], [-2, 2], [2, 2]], // 4
  [[-2, -2], [2, -2], [0, 0], [-2, 2], [2, 2]], // 5
  [[-2, -2], [2, -2], [-2, 0], [2, 0], [-2, 2], [2, 2]], // 6
];

function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;
  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  const cycle = (time * 0.0006) % 2;
  const rolling = cycle < 0.4;
  const faceIdx = Math.floor(((time * 0.0003) % 6));

  // Die outline
  const wobble = rolling ? Math.round(Math.sin(time * 0.02) * 0.8) : 0;
  for (let x = -4; x <= 4; x++) { px(x, -4 + wobble, 0.35); px(x, 4 + wobble, 0.35); }
  for (let y = -4; y <= 4; y++) { px(-4, y + wobble, 0.35); px(4, y + wobble, 0.35); }

  // Rounded corners
  px(-4, -4 + wobble, 0.15); px(4, -4 + wobble, 0.15);
  px(-4, 4 + wobble, 0.15); px(4, 4 + wobble, 0.15);

  // Face fill
  for (let x = -3; x <= 3; x++) {
    for (let y = -3; y <= 3; y++) {
      px(x, y + wobble, 0.12);
    }
  }

  // Dots
  if (!rolling) {
    const face = FACES[faceIdx];
    face.forEach(([dx, dy]) => {
      px(dx, dy + wobble, 0.75);
    });
  } else {
    // Blur effect while rolling
    for (let d = 0; d < 3; d++) {
      const rx = Math.round(Math.sin(time * 0.015 + d) * 2);
      const ry = Math.round(Math.cos(time * 0.015 + d * 2) * 2);
      px(rx, ry + wobble, 0.3);
    }
  }
}

export default function DiceLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
