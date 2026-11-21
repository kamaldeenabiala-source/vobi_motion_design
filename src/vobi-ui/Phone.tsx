import React from "react";
import { FONT } from "../theme/fonts";
import { BRAND } from "../config/brand";
import { Icon } from "./icons";

/** Écran logique (iPhone) : 390 × 844 points, mis à l'échelle dans le cadre. */
export const SCREEN_W = 390;
export const SCREEN_H = 844;

/**
 * Smartphone stylisé (cadre + île dynamique + reflet). `width` en px vidéo.
 * Les enfants sont dessinés dans un écran logique de 390 × 844.
 */
export const Phone: React.FC<{
  x: number;
  y: number;
  width: number;
  rotateY?: number;
  rotateZ?: number;
  children: React.ReactNode;
  glare?: number;
}> = ({ x, y, width, rotateY = 0, rotateZ = 0, children, glare = 0.5 }) => {
  const bezel = width * 0.035;
  const screenW = width - bezel * 2;
  const k = screenW / SCREEN_W;
  const height = SCREEN_H * k + bezel * 2;
  return (
    <div style={{ position: "absolute", left: x - width / 2, top: y - height / 2, width, height, perspective: 2400 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: width * 0.15,
          background: "linear-gradient(145deg, #2B323C 0%, #0D1015 60%, #1E242C 100%)",
          boxShadow: `0 ${width * 0.08}px ${width * 0.2}px -${width * 0.06}px rgba(10, 40, 30, 0.55), inset 0 0 0 ${width * 0.006}px #4A535E`,
          rotate: `${rotateZ}deg`,
          transform: `rotateY(${rotateY}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: bezel,
            top: bezel,
            width: screenW,
            height: SCREEN_H * k,
            borderRadius: width * 0.12,
            overflow: "hidden",
            background: BRAND.background,
          }}
        >
          <div style={{ width: SCREEN_W, height: SCREEN_H, scale: String(k), transformOrigin: "0 0", position: "absolute", left: 0, top: 0, fontFamily: FONT, color: BRAND.slate900 }}>
            {children}
            <StatusBar />
          </div>
          {/* reflet */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 32%)", opacity: glare, pointerEvents: "none" }} />
        </div>
        {/* boutons latéraux */}
        <div style={{ position: "absolute", left: -width * 0.012, top: height * 0.2, width: width * 0.012, height: height * 0.06, background: "#1A1F26", borderRadius: 4 }} />
        <div style={{ position: "absolute", right: -width * 0.012, top: height * 0.25, width: width * 0.012, height: height * 0.1, background: "#1A1F26", borderRadius: 4 }} />
      </div>
    </div>
  );
};

const StatusBar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", fontWeight: 700, fontSize: 15, color: BRAND.slate900 }}>
    <span>9:41</span>
    <div style={{ position: "absolute", left: SCREEN_W / 2 - 62, top: 10, width: 124, height: 34, borderRadius: 20, background: "#0B0D10" }} />
    <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
      <svg width={18} height={12} viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.5} y={9 - i * 3} width={3.2} height={3 + i * 3} rx={1} fill={BRAND.slate900} />
        ))}
      </svg>
      <Icon name="wifi" size={16} stroke={2.4} />
      <svg width={26} height={13} viewBox="0 0 26 13">
        <rect x={0.5} y={0.5} width={22} height={12} rx={3.5} fill="none" stroke={BRAND.slate900} opacity={0.4} />
        <rect x={2.5} y={2.5} width={17} height={8} rx={2} fill={BRAND.slate900} />
        <rect x={23.5} y={4} width={2} height={5} rx={1} fill={BRAND.slate900} opacity={0.4} />
      </svg>
    </span>
  </div>
);

/** Barre de navigation basse (maquettes visiteur). */
export const BottomNav: React.FC<{ active: "Accueil" | "Rechercher" | "Favoris" | "Messages" | "Profil" }> = ({ active }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      width: SCREEN_W,
      height: 78,
      background: "rgba(255,255,255,0.94)",
      borderTop: `1px solid ${BRAND.border}`,
      display: "flex",
      justifyContent: "space-around",
      paddingTop: 10,
    }}
  >
    {(
      [
        ["Accueil", "home"],
        ["Rechercher", "search"],
        ["Favoris", "heart"],
        ["Messages", "message"],
        ["Profil", "user"],
      ] as const
    ).map(([label, icon]) => (
      <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active === label ? BRAND.primary : BRAND.muted, fontSize: 11, fontWeight: active === label ? 700 : 500 }}>
        <Icon name={icon} size={22} stroke={active === label ? 2.4 : 2} />
        {label}
      </div>
    ))}
  </div>
);

/** Petit doigt qui tape à l'écran (main de Sènan, coordonnées logiques). */
export const TapFinger: React.FC<{ x: number; y: number; press: number; opacity?: number }> = ({ x, y, press, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity, pointerEvents: "none" }}>
    {/* onde du tap */}
    {press > 0 ? (
      <div style={{ position: "absolute", left: -26 * (0.6 + press), top: -26 * (0.6 + press), width: 52 * (0.6 + press), height: 52 * (0.6 + press), borderRadius: 99, background: "rgba(11,107,79,0.25)", opacity: 1 - press * 0.6 }} />
    ) : null}
    <svg width={120} height={200} viewBox="0 0 120 200" style={{ position: "absolute", left: -18, top: -10 + press * 4, overflow: "visible" }}>
      <path d="M 18 10 Q 18 0 28 0 Q 38 0 38 10 L 38 70 L 70 64 Q 96 62 100 90 L 106 150 L 40 200 L 10 120 Q 6 100 18 96 Z" fill="#7A4A2E" />
      <path d="M 22 8 Q 28 3 34 8 L 34 20 L 22 20 Z" fill="#E9C2A6" opacity={0.6} />
      <path d="M 30 196 L 104 140 L 120 170 L 50 220 Z" fill="#A7E3C6" />
    </svg>
  </div>
);
