import React from "react";
import { interpolate } from "remotion";
import { noise2D } from "@remotion/noise";
import { FONT } from "../theme/fonts";

/**
 * Billet stylisé (générique, ne reproduit pas un billet officiel).
 * Dessiné en <g>, centré sur (0,0), largeur ≈ 150.
 */
export const Banknote: React.FC<{ value?: string; tint?: "teal" | "amber" | "violet" }> = ({ value = "2000", tint = "teal" }) => {
  const c = {
    teal: { paper: "#BFE3D3", ink: "#3E8C70", band: "#9FD0BA" },
    amber: { paper: "#F1DDB0", ink: "#A4762A", band: "#E6C98A" },
    violet: { paper: "#D9D2EE", ink: "#6B5AA6", band: "#C3B8E3" },
  }[tint];
  return (
    <g>
      <rect x={-76} y={-38} width={152} height={76} rx={8} fill={c.paper} stroke={c.ink} strokeWidth={2.5} />
      <rect x={-76} y={-38} width={40} height={76} rx={8} fill={c.band} />
      <circle cx={-56} cy={0} r={14} fill="none" stroke={c.ink} strokeWidth={2.5} opacity={0.7} />
      <path d="M 10 -20 q 24 -10 50 0 M 10 20 q 24 10 50 0" stroke={c.ink} strokeWidth={2} fill="none" opacity={0.5} />
      <text x={34} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={c.ink}>
        {value}
      </text>
      <text x={-56} y={5} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={13} fill={c.ink}>
        F
      </text>
    </g>
  );
};

/**
 * Billet qui s'envole d'un point A vers un point B en papillonnant
 * (rotation 3D simulée par écrasement horizontal + flottement bruité).
 */
export const FlyingBill: React.FC<{
  frame: number;
  start: number;
  duration: number;
  from: [number, number];
  to: [number, number];
  arc?: number;
  value?: string;
  tint?: "teal" | "amber" | "violet";
  scale?: number;
  seed?: string;
  spin?: number;
}> = ({ frame, start, duration, from, to, arc = -220, value, tint, scale = 1, seed = "bill", spin = 2.2 }) => {
  const t = (frame - start) / duration;
  if (t < 0 || t > 1.05) return null;
  const k = Math.min(1, Math.max(0, t));
  const ease = 1 - Math.pow(1 - k, 2.2);
  const x = from[0] + (to[0] - from[0]) * ease + noise2D(seed, frame * 0.07, 0) * 30 * k;
  const y = from[1] + (to[1] - from[1]) * ease + arc * Math.sin(Math.PI * k) + noise2D(seed, 0, frame * 0.07) * 20 * k;
  const flip = Math.cos(k * Math.PI * spin * 2);
  const rot = interpolate(k, [0, 1], [-10, 35]) + noise2D(seed + "r", frame * 0.05, 1) * 25;
  const s = scale * interpolate(k, [0, 0.15, 1], [0.4, 1, 0.85]);
  const opacity = interpolate(t, [0, 0.08, 0.85, 1.05], [0, 1, 1, 0]);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * Math.max(0.12, Math.abs(flip))} ${s})`} opacity={opacity}>
      <Banknote value={value} tint={tint} />
    </g>
  );
};

/** Pièce de monnaie stylisée. */
export const Coin: React.FC<{ r?: number }> = ({ r = 18 }) => (
  <g>
    <circle r={r} fill="#E8C35A" stroke="#B8902E" strokeWidth={3} />
    <circle r={r * 0.62} fill="none" stroke="#B8902E" strokeWidth={2} opacity={0.6} />
  </g>
);
