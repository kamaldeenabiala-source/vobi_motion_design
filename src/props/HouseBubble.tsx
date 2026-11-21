import React from "react";
import { FONT, TABULAR } from "../theme/fonts";
import { BRAND } from "../config/brand";

/**
 * « Bulle maison » : l'objectif du héros (petite maison + étiquette 50 000 FCFA).
 * HTML, centré sur (x, y). `typed` = nombre de caractères visibles de l'étiquette.
 */
export const HouseBubble: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  typed?: number;
  checked?: number; // 0..1 coche verte finale
  deflate?: number; // 0..1 dégonflage
  label?: string;
  style?: React.CSSProperties;
}> = ({ x, y, scale = 1, rotate = 0, typed = 99, checked = 0, deflate = 0, label = "50 000 FCFA", style }) => {
  const visible = label.slice(0, Math.max(0, Math.floor(typed)));
  const squashX = 1 - deflate * 0.55;
  const squashY = 1 - deflate * 0.3;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: `${scale * squashX} ${scale * squashY}`,
        rotate: `${rotate}deg`,
        ...style,
      }}
    >
      <div
        style={{
          width: 360,
          padding: "26px 26px 22px",
          borderRadius: 40,
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 30px 70px -24px rgba(11,107,79,0.45), 0 0 0 6px rgba(244,196,48,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          position: "relative",
        }}
      >
        <svg width={170} height={140} viewBox="0 0 170 140">
          <ellipse cx={85} cy={132} rx={70} ry={8} fill="rgba(0,0,0,0.08)" />
          <path d="M 22 64 L 85 14 L 148 64 Z" fill={BRAND.primary} />
          <path d="M 85 14 L 148 64 L 136 64 L 85 24 Z" fill={BRAND.primaryDeep} opacity={0.5} />
          <rect x={34} y={60} width={102} height={70} rx={6} fill="#FFF7E2" />
          <rect x={72} y={86} width={28} height={44} rx={5} fill={BRAND.primary} />
          <circle cx={94} cy={110} r={2.5} fill={BRAND.gold} />
          <rect x={44} y={74} width={20} height={20} rx={4} fill="#BFE6FF" />
          <rect x={108} y={74} width={20} height={20} rx={4} fill="#BFE6FF" />
          <rect x={118} y={28} width={14} height={26} fill="#C86B4A" />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: BRAND.primary, letterSpacing: "-0.02em", ...TABULAR, minHeight: 60, whiteSpace: "nowrap" }}>
          {visible}
          {visible.length < label.length ? <span style={{ opacity: 0.4 }}>|</span> : null}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, color: BRAND.muted, marginTop: -6 }}>par mois</div>
        {checked > 0.01 ? (
          <div
            style={{
              position: "absolute",
              right: -26,
              top: -26,
              width: 96,
              height: 96,
              borderRadius: 48,
              background: BRAND.emerald,
              border: "6px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: String(checked),
              boxShadow: "0 12px 30px -8px rgba(5,150,105,0.6)",
            }}
          >
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
        ) : null}
      </div>
      {/* queue de la bulle */}
      <div style={{ position: "absolute", left: "50%", bottom: -22, width: 44, height: 44, background: "rgba(255,255,255,0.96)", rotate: "45deg", translate: "-50% 0", borderRadius: 6, zIndex: -1 }} />
    </div>
  );
};
