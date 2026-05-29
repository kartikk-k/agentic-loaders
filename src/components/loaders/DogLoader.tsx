"use client";
import { useRef, useEffect } from "react";
import { hexToRgba } from "./utils";

// Pixel dog wagging its tail
function draw(ctx: CanvasRenderingContext2D, size: number, time: number, color: string, color2?: string) {
  ctx.clearRect(0, 0, size, size);
  const o = size / 2, l = size / 2;
  const i = size > 30 ? 2 : 1;

  const px = (x: number, y: number, a: number) => {
    ctx.fillStyle = hexToRgba(color, a, color2);
    ctx.fillRect(Math.round(o + x * i), Math.round(l + y * i), i, i);
  };

  // Body
  const bodyPixels: [number, number][] = [
    [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0],
    [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1],
    [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
  ];
  bodyPixels.forEach(([x, y]) => px(x, y, 0.55));

  // Head
  const headPixels: [number, number][] = [
    [-4, -1], [-3, -1], [-4, 0], [-3, 0], [-4, 1], [-3, 1],
    [-5, 0], [-5, -1], // snout
  ];
  headPixels.forEach(([x, y]) => px(x, y, 0.65));

  // Eye
  px(-4, -1, 0.9);

  // Ear (floppy, slight bounce)
  const earBob = Math.round(Math.sin(time * 0.005) * 0.5);
  px(-3, -2 + earBob, 0.5);
  px(-4, -2 + earBob, 0.5);

  // Legs (walking animation)
  const legPhase = time * 0.006;
  const frontL = Math.round(Math.sin(legPhase) * 0.8);
  const backL = Math.round(Math.sin(legPhase + Math.PI) * 0.8);
  // Front legs
  px(-2, 2, 0.5);
  px(-2, 3 + frontL, 0.45);
  px(-1, 2, 0.5);
  px(-1, 3 - frontL, 0.45);
  // Back legs
  px(2, 2, 0.5);
  px(2, 3 + backL, 0.45);
  px(3, 2, 0.5);
  px(3, 3 - backL, 0.45);

  // Tail wagging
  const tailWag = Math.sin(time * 0.008) * 2;
  const ty = Math.round(tailWag);
  px(4, -1 + ty, 0.5);
  px(5, -2 + ty, 0.4);
}

export default function DogLoader({ size = 48, color = "#949494", color2 }: { size?: number; color?: string; color2?: string }) {
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
