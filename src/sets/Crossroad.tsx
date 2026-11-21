import React from "react";
import { DECOR } from "../config/palette";

/** Carrefour de la rêverie : asphalte, terre-plein central, marquages. */
export const CrossroadSet: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="crSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F6D9A6" />
        <stop offset="1" stopColor="#FBEFD6" />
      </linearGradient>
    </defs>
    <rect x={-200} y={0} width={1480} height={1000} fill="url(#crSky)" />
    {/* immeubles lointains */}
    {[-60, 200, 430, 690, 900].map((bx, i) => (
      <rect key={bx} x={bx} y={600 - (i % 3) * 90} width={200} height={420 + (i % 3) * 90} fill={i % 2 ? "#E4C9A6" : "#EAD6B6"} />
    ))}
    {/* chaussée */}
    <rect x={-200} y={980} width={1480} height={1000} fill="#5E6268" />
    <rect x={-200} y={980} width={1480} height={20} fill="#4E5258" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={-120 + i * 230} y={1700} width={130} height={16} rx={6} fill="#F2F2F2" opacity={0.85} />
    ))}
    {/* terre-plein central */}
    <path d="M 60 1180 Q 540 1080 1020 1180 L 1060 1520 Q 540 1640 20 1520 Z" fill="#CBB79A" />
    <path d="M 60 1180 Q 540 1080 1020 1180 L 1024 1210 Q 540 1110 56 1210 Z" fill="#F2F2F2" />
    <path d="M 20 1520 Q 540 1640 1060 1520 L 1060 1550 Q 540 1670 20 1550 Z" fill="#9E8E78" />
    <ellipse cx={240} cy={1260} rx={90} ry={22} fill="#7FA86E" opacity={0.6} />
    <ellipse cx={860} cy={1290} rx={70} ry={18} fill="#7FA86E" opacity={0.6} />
    <rect x={-200} y={980} width={1480} height={1000} fill={DECOR.shadow} opacity={0.0} />
  </g>
);
