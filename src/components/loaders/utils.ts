export function hexToRgba(hex: string, alpha: number, hex2?: string): string {
  const h = hex.replace("#", "");
  const r1 = parseInt(h.substring(0, 2), 16);
  const g1 = parseInt(h.substring(2, 4), 16);
  const b1 = parseInt(h.substring(4, 6), 16);

  if (!hex2) return `rgba(${r1},${g1},${b1},${alpha})`;

  // Interpolate between color1 and color2 based on alpha (intensity)
  const h2 = hex2.replace("#", "");
  const r2 = parseInt(h2.substring(0, 2), 16);
  const g2 = parseInt(h2.substring(2, 4), 16);
  const b2 = parseInt(h2.substring(4, 6), 16);

  const t = Math.min(1, Math.max(0, alpha));
  const r = Math.round(r2 + (r1 - r2) * t);
  const g = Math.round(g2 + (g1 - g2) * t);
  const b = Math.round(b2 + (b1 - b2) * t);
  return `rgba(${r},${g},${b},1)`;
}
