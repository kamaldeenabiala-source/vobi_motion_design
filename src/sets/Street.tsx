import React from "react";
import { DECOR } from "../config/palette";
import { FONT } from "../theme/fonts";
import { Palm } from "../props/Objects";

/**
 * Rue de quartier de Cotonou : piste en latérite, murs crépis, portails
 * métalliques peints, enseignes à la main, palmiers, câbles électriques.
 * `pan` décale les couches (parallaxe). `sky` : 0 = midi, 1 = fin d'après-midi.
 */
export const StreetSet: React.FC<{ pan?: number; sky?: number; groundY?: number; sway?: number; height?: number }> = ({ pan = 0, sky = 0, groundY = 1340, sway = 0, height = 1920 }) => {
  const mix = (a: string, b: string, t: number) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return `rgb(${r},${g},${bl})`;
  };
  const skyTop = mix("#F3D9A0", "#E9965E", sky);
  const skyBot = mix("#F8ECCB", "#F6C48E", sky);
  const far = pan * 0.25;
  const mid = pan * 0.6;
  return (
    <g>
      <defs>
        <linearGradient id="streetSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyBot} />
        </linearGradient>
        <linearGradient id="streetGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DECOR.lateriteLight} />
          <stop offset="1" stopColor={DECOR.laterite} />
        </linearGradient>
      </defs>
      <rect x={-600} y={0} width={2400} height={groundY} fill="url(#streetSky)" />
      {/* soleil */}
      <circle cx={820 - far * 0.2} cy={260 + sky * 520} r={110} fill={DECOR.sun} opacity={0.9} />
      <circle cx={820 - far * 0.2} cy={260 + sky * 520} r={170} fill={DECOR.sun} opacity={0.18} />

      {/* plan lointain : toits & palmiers */}
      <g transform={`translate(${far} 0)`}>
        {[-500, -150, 260, 640, 1000, 1380, 1760].map((bx, i) => (
          <g key={bx}>
            <rect x={bx} y={groundY - 520 - (i % 3) * 60} width={300} height={520 + (i % 3) * 60} fill={i % 2 ? "#E9D3B0" : "#E4C9A6"} />
            <rect x={bx + 40} y={groundY - 460 - (i % 3) * 60} width={60} height={60} fill="#C9AE89" />
            <rect x={bx + 180} y={groundY - 460 - (i % 3) * 60} width={60} height={60} fill="#C9AE89" />
          </g>
        ))}
        <Palm x={120} y={groundY - 330} h={480} sway={sway} />
        <Palm x={1180} y={groundY - 380} h={520} sway={-sway} />
        <Palm x={-300} y={groundY - 300} h={430} sway={sway} />
      </g>

      {/* poteaux & câbles */}
      <g transform={`translate(${mid} 0)`}>
        {[-420, 300, 1020, 1740].map((px) => (
          <g key={px}>
            <rect x={px} y={groundY - 980} width={22} height={980} fill="#7A6A58" />
            <rect x={px - 50} y={groundY - 960} width={122} height={14} fill="#6A5A48" />
          </g>
        ))}
        {[-420, 300, 1020].map((px, i) => (
          <g key={i} stroke={DECOR.cable} strokeWidth={4} fill="none" opacity={0.75}>
            <path d={`M ${px - 40} ${groundY - 950} Q ${px + 360} ${groundY - 860} ${px + 680} ${groundY - 950}`} />
            <path d={`M ${px + 60} ${groundY - 950} Q ${px + 380} ${groundY - 830} ${px + 780} ${groundY - 950}`} />
          </g>
        ))}
      </g>

      {/* murs de clôture & portails */}
      <g transform={`translate(${pan} 0)`}>
        {[-1200, -600, 0, 600, 1200, 1800].map((wx, i) => {
          const wall = [DECOR.wallCream, DECOR.wallOchre, DECOR.wallPink][((i % 3) + 3) % 3];
          const gate = i % 2 ? DECOR.gateBlue : DECOR.gateGreen;
          return (
            <g key={wx}>
              <rect x={wx} y={groundY - 330} width={600} height={330} fill={wall} />
              <rect x={wx} y={groundY - 346} width={600} height={22} fill={DECOR.wallShade} />
              <rect x={wx} y={groundY - 60} width={600} height={60} fill={DECOR.wallShade} opacity={0.5} />
              {/* portail métallique */}
              <rect x={wx + 330} y={groundY - 300} width={210} height={300} fill={gate} />
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <rect key={k} x={wx + 340 + k * 34} y={groundY - 290} width={14} height={280} fill="#FFFFFF" opacity={0.12} />
              ))}
              <rect x={wx + 432} y={groundY - 300} width={6} height={300} fill="#1A1A1A" opacity={0.3} />
              {/* enseigne peinte à la main */}
              {i % 3 === 0 ? (
                <g transform={`translate(${wx + 50} ${groundY - 290}) rotate(-2)`}>
                  <rect width={240} height={110} rx={6} fill="#FFFFFF" stroke="#1E6FB8" strokeWidth={5} />
                  <text x={120} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#C62839">
                    COIFFURE
                  </text>
                  <text x={120} y={88} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#1E6FB8">
                    Chez Mado
                  </text>
                </g>
              ) : i % 3 === 1 ? (
                <g transform={`translate(${wx + 60} ${groundY - 280}) rotate(1.5)`}>
                  <rect width={220} height={90} rx={6} fill="#F4C430" />
                  <text x={110} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#1A1A1A">
                    BOUTIQUE
                  </text>
                </g>
              ) : (
                <g transform={`translate(${wx + 70} ${groundY - 270})`}>
                  <rect width={200} height={80} rx={6} fill="#FFFFFF" />
                  <text x={100} y={52} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#2F7A4F">
                    ATELIER
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* sol en latérite */}
      <rect x={-600} y={groundY} width={2400} height={height - groundY + 200} fill="url(#streetGround)" />
      <g transform={`translate(${pan * 1.3} 0)`} fill={DECOR.lateriteDark} opacity={0.35}>
        {Array.from({ length: 28 }).map((_, i) => (
          <ellipse key={i} cx={-800 + ((i * 197) % 3200)} cy={groundY + 60 + ((i * 131) % (height - groundY - 40))} rx={18 + (i % 4) * 8} ry={5 + (i % 3) * 2} />
        ))}
      </g>
      <rect x={-600} y={groundY} width={2400} height={16} fill="#B0613C" opacity={0.35} />
    </g>
  );
};
