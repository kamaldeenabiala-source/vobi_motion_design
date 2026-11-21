import React from "react";
import { DECOR } from "../config/palette";
import { FONT } from "../theme/fonts";

/** Objets de décor en <g> — origine au sol (bas-centre) sauf mention. */

export const Fan: React.FC<{ x: number; y: number; scale?: number; spin: number }> = ({ x, y, scale = 1, spin }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={70} ry={14} fill={DECOR.shadow} />
    <ellipse cx={0} cy={-6} rx={58} ry={12} fill="#5C6670" />
    <rect x={-7} y={-330} width={14} height={326} rx={7} fill="#7C8792" />
    <g transform="translate(0 -400)">
      <circle r={86} fill="none" stroke="#8E99A4" strokeWidth={5} />
      {[0, 120, 240].map((a) => (
        <ellipse key={a} cx={0} cy={-42} rx={20} ry={44} fill="#B7D3E6" opacity={0.85} transform={`rotate(${a + spin})`} />
      ))}
      <circle r={86} fill="none" stroke="#8E99A4" strokeWidth={2} strokeDasharray="4 10" />
      <circle r={16} fill="#5C6670" />
    </g>
  </g>
);

export const Bed: React.FC<{ x: number; y: number; w?: number; withNet?: boolean }> = ({ x, y, w = 640, withNet = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={w / 2} cy={4} rx={w / 2 + 20} ry={18} fill={DECOR.shadow} />
    <rect x={10} y={-60} width={12} height={60} fill={DECOR.woodDark} />
    <rect x={w - 22} y={-60} width={12} height={60} fill={DECOR.woodDark} />
    <rect x={-6} y={-330} width={30} height={310} rx={8} fill={DECOR.woodDark} />
    <rect x={0} y={-140} width={w} height={84} rx={14} fill={DECOR.mattress} />
    <rect x={0} y={-150} width={w} height={40} rx={14} fill={DECOR.sheet} />
    <path d={`M 60 -150 q ${w * 0.3} 30 ${w * 0.7} 0 l 0 30 q ${-w * 0.35} 28 ${-w * 0.7} 0 Z`} fill="#D9CDB7" opacity={0.7} />
    <rect x={30} y={-200} width={150} height={60} rx={26} fill="#FFFFFF" />
    {withNet ? (
      <g opacity={0.22}>
        <path d={`M ${w * 0.15} -780 L ${-30} -150 L ${w + 30} -150 L ${w * 0.85} -780 Z`} fill="#FFFFFF" />
        <path d={`M ${w * 0.15} -780 L ${w * 0.85} -780`} stroke="#FFFFFF" strokeWidth={8} />
        {[0.25, 0.4, 0.55, 0.7].map((k) => (
          <path key={k} d={`M ${w * k} -780 Q ${w * k + 10} -460 ${w * k - 20} -150`} stroke="#FFFFFF" strokeWidth={3} fill="none" />
        ))}
      </g>
    ) : null}
  </g>
);

export const Suitcase: React.FC<{ x: number; y: number; open?: boolean }> = ({ x, y, open = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={2} rx={130} ry={14} fill={DECOR.shadow} />
    <rect x={-120} y={-70} width={240} height={70} rx={14} fill="#2F4858" />
    {open ? (
      <>
        <path d="M -120 -70 L -100 -230 L 120 -230 L 120 -70 Z" fill="#3B5A6E" />
        <rect x={-100} y={-62} width={200} height={40} rx={8} fill="#E6D5B8" />
        <path d="M -80 -50 q 40 -20 80 0 q 40 18 80 -4" stroke="#C0563F" strokeWidth={16} fill="none" strokeLinecap="round" />
        <rect x={-60} y={-200} width={120} height={14} rx={7} fill="#2F4858" opacity={0.6} />
      </>
    ) : null}
  </g>
);

export const PlasticChair: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#F2F2F2" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={2} rx={110} ry={14} fill={DECOR.shadow} />
    <path d="M -90 0 L -78 -170 M 90 0 L 78 -170 M -60 0 L -52 -150 M 60 0 L 52 -150" stroke={color} strokeWidth={16} strokeLinecap="round" />
    <rect x={-96} y={-190} width={192} height={34} rx={14} fill={color} />
    <path d="M -84 -190 L -92 -420 Q 0 -450 92 -420 L 84 -190 Z" fill={color} />
    <path d="M -50 -400 L 50 -400 M -55 -360 L 55 -360 M -58 -320 L 58 -320" stroke="#D6D6D6" strokeWidth={10} strokeLinecap="round" />
  </g>
);

export const Palm: React.FC<{ x: number; y: number; h?: number; sway?: number }> = ({ x, y, h = 520, sway = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M -10 0 Q ${-20 + sway * 0.3} ${-h * 0.5} ${sway} ${-h} L ${sway + 16} ${-h} Q ${-2 + sway * 0.3} ${-h * 0.5} 12 0 Z`} fill={DECOR.trunk} />
    {[-70, -35, 0, 35, 70, 110, -110].map((a, i) => (
      <path
        key={i}
        d="M 0 0 Q 70 -40 170 30 Q 80 -10 0 10 Z"
        fill={i % 2 ? DECOR.palm : DECOR.palmDark}
        transform={`translate(${sway + 8} ${-h}) rotate(${a + sway * 0.4 - 90 + 90})`}
      />
    ))}
  </g>
);

export const Moto: React.FC<{ x: number; y: number; scale?: number; wheelRot: number; flip?: boolean }> = ({ x, y, scale = 1, wheelRot, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <ellipse cx={0} cy={6} rx={240} ry={18} fill={DECOR.shadow} />
    {[-160, 165].map((cx) => (
      <g key={cx} transform={`translate(${cx} -70) rotate(${wheelRot})`}>
        <circle r={70} fill={DECOR.tire} />
        <circle r={44} fill="#C9CED4" />
        <circle r={14} fill="#5A6068" />
        {[0, 60, 120].map((a) => (
          <rect key={a} x={-2} y={-44} width={4} height={88} fill="#8E959D" transform={`rotate(${a})`} />
        ))}
      </g>
    ))}
    {/* cadre */}
    <path d="M -160 -70 L -60 -170 L 100 -170 L 165 -70" stroke="#3A3F45" strokeWidth={16} fill="none" strokeLinejoin="round" />
    <path d="M -120 -150 Q -40 -240 90 -200 L 110 -150 L -100 -130 Z" fill={DECOR.motoRed} />
    <rect x={-150} y={-215} width={210} height={34} rx={16} fill="#1F2328" />
    <path d="M 100 -170 L 150 -290" stroke="#3A3F45" strokeWidth={14} strokeLinecap="round" />
    <path d="M 120 -290 L 190 -300" stroke="#2A2E33" strokeWidth={12} strokeLinecap="round" />
    <circle cx={175} cy={-250} r={18} fill="#FFE9A8" stroke="#3A3F45" strokeWidth={5} />
    <path d="M -200 -110 L -120 -110" stroke="#9AA3AD" strokeWidth={14} strokeLinecap="round" />
    <path d="M -40 -110 q 30 20 70 0" stroke="#4A4F55" strokeWidth={10} fill="none" />
  </g>
);

export const LampPost: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 760 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-10} y={-h} width={20} height={h} fill="#6E7781" />
    <rect x={-24} y={-40} width={48} height={40} rx={6} fill="#5C646D" />
    <path d={`M 0 ${-h} q 0 -40 90 -40 l 40 0`} stroke="#6E7781" strokeWidth={14} fill="none" />
    <path d={`M 110 ${-h - 46} l 50 0 l -10 26 l -30 0 Z`} fill="#4A525B" />
    <ellipse cx={135} cy={-h - 18} rx={20} ry={8} fill="#FFE9A8" />
  </g>
);

export const Cooler: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={2} rx={110} ry={12} fill={DECOR.shadow} />
    <rect x={-100} y={-120} width={200} height={120} rx={16} fill="#2E86C1" />
    <rect x={-106} y={-140} width={212} height={34} rx={12} fill="#F2F2F2" />
    <rect x={-40} y={-152} width={80} height={16} rx={8} fill="#D0D0D0" />
  </g>
);

export const TV: React.FC<{ x: number; y: number; glow?: number }> = ({ x, y, glow = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-95} y={-150} width={190} height={130} rx={12} fill="#1C2026" />
    <rect x={-84} y={-140} width={168} height={108} rx={6} fill="#6FB7D6" opacity={0.5 + 0.5 * glow} />
    <path d="M -84 -60 q 40 -30 84 0 q 44 30 84 -10 L 84 -32 L -84 -32 Z" fill="#4E9B6B" opacity={0.8} />
    <rect x={-20} y={-20} width={40} height={20} fill="#2A2E33" />
  </g>
);

export const Goat: React.FC<{ x: number; y: number; chew: number; flip?: boolean; scale?: number }> = ({ x, y, chew, flip = false, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <ellipse cx={0} cy={2} rx={110} ry={12} fill={DECOR.shadow} />
    {[-60, -30, 40, 70].map((lx) => (
      <rect key={lx} x={lx - 7} y={-80} width={14} height={80} rx={6} fill="#8A6A4E" />
    ))}
    <ellipse cx={0} cy={-110} rx={100} ry={52} fill="#F1E9DC" />
    <ellipse cx={20} cy={-100} rx={50} ry={30} fill="#E2D6C4" />
    <path d="M -90 -120 q -10 -20 0 -40" stroke="#F1E9DC" strokeWidth={14} strokeLinecap="round" />
    <g transform={`translate(110 ${-120 + chew * 6}) rotate(${25 + chew * 10})`}>
      <ellipse cx={0} cy={20} rx={30} ry={44} fill="#F1E9DC" />
      <path d="M -10 -14 q -20 -40 -40 -40 M 10 -14 q 20 -40 30 -44" stroke="#9A8670" strokeWidth={8} fill="none" strokeLinecap="round" />
      <circle cx={10} cy={8} r={5} fill="#1A1A1A" />
      <ellipse cx={-26} cy={4} rx={16} ry={8} fill="#E2D6C4" />
      <path d="M 0 60 q 4 18 -6 28" stroke="#D8CBB7" strokeWidth={6} fill="none" />
    </g>
  </g>
);

export const Doormat: React.FC<{ x: number; y: number; bite?: number }> = ({ x, y, bite = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M -110 -36 L 110 -36 L 120 0 L ${-120 + bite * 60} 0 Z`} fill="#B5651D" />
    <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill="#F7E7C6">
      BIENVENUE
    </text>
  </g>
);

export const Tree: React.FC<{ x: number; y: number; scale?: number; sway?: number }> = ({ x, y, scale = 1, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -30 0 Q -20 -200 -40 -360 L 30 -360 Q 10 -200 30 0 Z" fill="#7A5A3E" />
    <g transform={`rotate(${sway} 0 -360)`}>
      <circle cx={-120} cy={-430} r={130} fill="#5E8C55" />
      <circle cx={90} cy={-450} r={150} fill="#4F7F4A" />
      <circle cx={-10} cy={-560} r={150} fill="#6A9A5F" />
      <circle cx={150} cy={-560} r={100} fill="#5E8C55" />
    </g>
  </g>
);

/** Panneau de rue « Akpakpa » (flèche). */
export const StreetSign: React.FC<{ x: number; y: number; label: string }> = ({ x, y, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-6} y={-420} width={12} height={420} fill="#6E7781" />
    <path d="M -110 -440 L 110 -440 L 150 -400 L 110 -360 L -110 -360 Z" fill="#1E6FB8" />
    <text x={10} y={-388} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#FFFFFF">
      {label}
    </text>
  </g>
);

/** Sachet d'eau fraîche (« pure water »). */
export const WaterSachet: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -50 -70 Q 0 -90 50 -70 L 56 60 Q 0 80 -56 60 Z" fill="#DDF1FB" stroke="#9CCDE8" strokeWidth={4} />
    <text x={0} y={6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill="#3B8DC0">
      EAU
    </text>
    <path d="M -30 -40 q 10 -6 20 0" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.8} />
  </g>
);

/** Papier tamponné « frais de dossier ». */
export const StampedPaper: React.FC<{ x: number; y: number; stamp: number; rot?: number }> = ({ x, y, stamp, rot = -6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-150} y={-190} width={300} height={380} rx={8} fill="#FFFDF6" stroke="#E2D6C0" strokeWidth={3} />
    <text x={0} y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#1A1A1A">
      FRAIS DE DOSSIER
    </text>
    {[-80, -40, 0, 40].map((ly) => (
      <rect key={ly} x={-110} y={ly} width={220} height={10} rx={5} fill="#E7E0D2" />
    ))}
    {stamp > 0.01 ? (
      <g transform={`translate(30 120) rotate(-14) scale(${1 + (1 - stamp) * 0.8})`} opacity={stamp}>
        <rect x={-110} y={-40} width={220} height={80} rx={10} fill="none" stroke="#C62839" strokeWidth={8} />
        <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C62839">
          2 000 F
        </text>
      </g>
    ) : null}
  </g>
);
