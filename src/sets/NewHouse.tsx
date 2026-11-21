import React from "react";
import { BRAND } from "../config/brand";
import { DECOR } from "../config/palette";
import { Palm } from "../props/Objects";

/** Nouvelle maison : façade simple et accueillante, porte verte VOBI. */
export const NewHouseSet: React.FC<{ sway?: number }> = ({ sway = 0 }) => (
  <g>
    <defs>
      <linearGradient id="nhSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#CFEFE0" />
        <stop offset="1" stopColor={BRAND.background} />
      </linearGradient>
    </defs>
    <rect x={-200} y={0} width={1480} height={1400} fill="url(#nhSky)" />
    <circle cx={880} cy={330} r={90} fill="#FFE7A0" opacity={0.9} />
    <Palm x={60} y={1340} h={700} sway={sway} />
    {/* façade */}
    <rect x={150} y={640} width={780} height={760} fill="#FFF7E6" />
    <path d="M 100 660 L 540 400 L 980 660 Z" fill={BRAND.primary} />
    <path d="M 540 400 L 980 660 L 930 660 L 540 430 Z" fill={BRAND.primaryDeep} opacity={0.4} />
    <rect x={220} y={760} width={170} height={170} rx={12} fill="#BFE6FF" stroke="#E7DCC4" strokeWidth={10} />
    <rect x={690} y={760} width={170} height={170} rx={12} fill="#BFE6FF" stroke="#E7DCC4" strokeWidth={10} />
    {/* porte verte VOBI */}
    <rect x={430} y={900} width={220} height={500} rx={16} fill={BRAND.primary} />
    <rect x={455} y={930} width={170} height={200} rx={10} fill="#0E7A5A" />
    <rect x={455} y={1160} width={170} height={200} rx={10} fill="#0E7A5A" />
    <circle cx={620} cy={1160} r={12} fill={BRAND.gold} />
    {/* plantes */}
    <ellipse cx={330} cy={1390} rx={90} ry={50} fill="#5E8C55" />
    <ellipse cx={760} cy={1390} rx={90} ry={50} fill="#5E8C55" />
    <rect x={-200} y={1380} width={1480} height={600} fill={DECOR.lateriteLight} />
    <path d="M 430 1380 L 650 1380 L 760 1960 L 320 1960 Z" fill="#EAD9BC" />
  </g>
);
