import React from "react";
import { DECOR } from "../config/palette";
import { BRAND } from "../config/brand";
import { PlasticChair, Tree } from "../props/Objects";

/** Coin d'ombre de la démo : cour intérieure propre, arbre, chaise en plastique. */
export const ShadeSet: React.FC<{ sway?: number; brand?: number }> = ({ sway = 0, brand = 1 }) => (
  <g>
    <defs>
      <linearGradient id="shSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#EAF7EE" />
        <stop offset="1" stopColor={BRAND.background} />
      </linearGradient>
    </defs>
    <rect x={-200} y={0} width={1480} height={1400} fill="url(#shSky)" />
    <rect x={-200} y={1000} width={1480} height={400} fill={DECOR.wallCream} />
    <rect x={-200} y={985} width={1480} height={24} fill="#E2D2B2" />
    <rect x={-200} y={1380} width={1480} height={600} fill="#E9DFC9" />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-200 + i * 200} y={1380} width={3} height={600} fill="#D7C9AD" />
    ))}
    <Tree x={160} y={1420} scale={1.25} sway={sway} />
    {/* ombre de l'arbre */}
    <ellipse cx={420} cy={1600} rx={460} ry={70} fill="#5E8C55" opacity={0.18 * brand} />
    <PlasticChair x={560} y={1640} scale={1.05} />
  </g>
);
