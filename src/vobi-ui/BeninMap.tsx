import React from "react";
import { BRAND } from "../config/brand";
import { FONT } from "../theme/fonts";

/** Contour simplifié du Bénin (lon, lat) — stylisé pour l'animation. */
const OUTLINE: Array<[number, number]> = [
  [1.63, 6.23], [1.88, 6.28], [2.3, 6.33], [2.72, 6.37], [2.71, 6.95], [2.75, 7.6], [2.73, 8.2], [2.69, 8.5], [2.85, 9.0], [3.1, 9.1],
  [3.15, 9.5], [3.35, 9.8], [3.6, 10.3], [3.65, 10.6], [3.85, 10.7], [3.6, 11.3], [3.62, 11.7], [3.3, 11.9], [2.85, 12.25], [2.45, 12.25],
  [2.38, 11.9], [2.0, 11.45], [1.45, 11.45], [1.1, 11.05], [0.9, 10.95], [0.78, 10.65], [0.8, 10.3], [1.35, 10.0], [1.4, 9.45], [1.6, 9.05],
  [1.62, 8.5], [1.63, 7.7], [1.65, 7.0], [1.6, 6.6], [1.63, 6.23],
];

export const CITIES: Array<{ name: string; lon: number; lat: number; price: string; label?: boolean }> = [
  { name: "Cotonou", lon: 2.42, lat: 6.37, price: "45 000 F", label: true },
  { name: "Abomey-Calavi", lon: 2.33, lat: 6.47, price: "40 000 F" },
  { name: "Porto-Novo", lon: 2.62, lat: 6.5, price: "35 000 F", label: true },
  { name: "Ouidah", lon: 2.08, lat: 6.38, price: "30 000 F" },
  { name: "Lokossa", lon: 1.72, lat: 6.64, price: "25 000 F" },
  { name: "Bohicon", lon: 2.07, lat: 7.18, price: "30 000 F" },
  { name: "Dassa", lon: 2.18, lat: 7.75, price: "25 000 F" },
  { name: "Savè", lon: 2.49, lat: 8.03, price: "25 000 F" },
  { name: "Parakou", lon: 2.63, lat: 9.34, price: "35 000 F", label: true },
  { name: "Djougou", lon: 1.67, lat: 9.71, price: "30 000 F" },
  { name: "Natitingou", lon: 1.38, lat: 10.3, price: "25 000 F" },
  { name: "Kandi", lon: 2.94, lat: 11.13, price: "25 000 F" },
  { name: "Malanville", lon: 3.39, lat: 11.83, price: "20 000 F" },
];

export const project = (lon: number, lat: number, w: number, h: number) => ({
  x: ((lon - 0.65) / 3.3) * w,
  y: ((12.4 - lat) / 6.3) * h,
});

/**
 * Carte du Bénin animée : `draw` 0..1 trace le contour, `pin(i)` 0..1 fait
 * pousser la pastille de prix i (marqueur pilule de la charte §8.3).
 */
export const BeninMap: React.FC<{ width: number; height: number; draw: number; pin: (i: number) => number; highlight?: number }> = ({ width, height, draw, pin, highlight = 0 }) => {
  const pts = OUTLINE.map(([lo, la]) => project(lo, la, width, height));
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <path d={d} fill={BRAND.mint} opacity={Math.max(0, draw - 0.6) * 2.5} />
      <path d={d} fill="none" stroke={BRAND.primary} strokeWidth={6} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
      {CITIES.map((c, i) => {
        const p = project(c.lon, c.lat, width, height);
        const k = pin(i);
        if (k <= 0.01) return null;
        const sel = c.name === "Cotonou" && highlight > 0.5;
        return (
          <g key={c.name} transform={`translate(${p.x} ${p.y}) scale(${k})`}>
            <circle r={sel ? 26 + 10 * Math.sin(highlight * 6) : 0} fill={BRAND.gold} opacity={0.3} />
            <g transform="translate(0 -14)">
              <rect x={-52} y={-24} width={104} height={34} rx={17} fill={sel ? BRAND.gold : BRAND.primaryDeep} />
              <path d="M -7 9 L 0 18 L 7 9 Z" fill={sel ? BRAND.gold : BRAND.primaryDeep} />
              <text x={0} y={-1} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={17} fill={sel ? BRAND.slate900 : "#FFFFFF"}>
                {c.price}
              </text>
            </g>
            {c.label ? (
              <text x={60} y={8} fontFamily={FONT} fontWeight={700} fontSize={18} fill={BRAND.primary}>
                {c.name}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};
