import React from "react";
import { DECOR } from "../config/palette";

/**
 * Maison visitée « à l'ancienne » : la porte s'ouvre sur un salon sans toit
 * avec une flaque au milieu. `open` 0..1.
 */
export const HouseVisitSet: React.FC<{ open: number; frame: number }> = ({ open, frame }) => {
  const doorX = 400;
  const doorY = 760;
  const doorW = 300;
  const doorH = 600;
  return (
    <g>
      <defs>
        <linearGradient id="hvSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2D49A" />
          <stop offset="1" stopColor="#F7E8C4" />
        </linearGradient>
        <clipPath id="hvDoor">
          <rect x={doorX} y={doorY} width={doorW} height={doorH} />
        </clipPath>
      </defs>
      <rect x={-200} y={0} width={1480} height={1400} fill="url(#hvSky)" />
      <circle cx={880} cy={300} r={100} fill={DECOR.sun} opacity={0.85} />
      {/* façade */}
      <rect x={120} y={520} width={860} height={860} fill={DECOR.wallOchre} />
      <rect x={100} y={490} width={900} height={50} fill={DECOR.wallShade} />
      <rect x={180} y={640} width={150} height={150} fill="#7FA6C2" />
      <rect x={770} y={640} width={150} height={150} fill="#7FA6C2" />
      <path d="M 200 840 l 30 60 l -20 40" stroke="#B08A5A" strokeWidth={4} fill="none" />
      <path d="M 880 900 l -20 50 l 25 40 l -10 50" stroke="#B08A5A" strokeWidth={4} fill="none" />
      {/* intérieur visible par la porte */}
      <g clipPath="url(#hvDoor)">
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill="#F6DFAE" />
        {/* ciel : pas de toit ! */}
        <rect x={doorX} y={doorY} width={doorW} height={220} fill="#9FD0F0" />
        <ellipse cx={doorX + 90 + Math.sin(frame / 20) * 10} cy={doorY + 90} rx={60} ry={24} fill="#FFFFFF" opacity={0.9} />
        <rect x={doorX} y={doorY + 210} width={doorW} height={14} fill="#B08A5A" />
        <path d={`M ${doorX + 40} ${doorY + 224} l 20 70 l -16 50`} stroke="#9C7A4C" strokeWidth={4} fill="none" />
        <rect x={doorX} y={doorY + 420} width={doorW} height={180} fill="#C9A77A" />
        {/* flaque */}
        <ellipse cx={doorX + 150} cy={doorY + 520} rx={120} ry={30} fill="#7DB9DE" opacity={0.85} />
        <ellipse cx={doorX + 150} cy={doorY + 520} rx={40 + ((frame * 2) % 80)} ry={(40 + ((frame * 2) % 80)) / 4} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={1 - ((frame * 2) % 80) / 80} />
        {/* goutte */}
        <ellipse cx={doorX + 150} cy={doorY + 230 + ((frame * 9) % 290)} rx={5} ry={9} fill="#7DB9DE" />
      </g>
      {/* porte qui s'ouvre */}
      <rect x={doorX - 14} y={doorY - 14} width={doorW + 28} height={doorH + 14} fill="none" stroke="#6B4A33" strokeWidth={14} />
      <g transform={`translate(${doorX} 0) scale(${1 - open * 0.92} 1) translate(${-doorX} 0)`}>
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill="#3E6E8E" />
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={k} x={doorX + 20 + k * 56} y={doorY + 20} width={20} height={doorH - 40} fill="#FFFFFF" opacity={0.1} />
        ))}
        <circle cx={doorX + doorW - 30} cy={doorY + 320} r={12} fill="#E8C35A" />
      </g>
      {/* sol de la cour */}
      <rect x={-200} y={1380} width={1480} height={600} fill={DECOR.laterite} />
      <rect x={-200} y={1380} width={1480} height={14} fill="#B0613C" opacity={0.4} />
    </g>
  );
};
