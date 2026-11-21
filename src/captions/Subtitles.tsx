import React from "react";
import { interpolate } from "remotion";
import { FONT, NBSP, NNBSP } from "../theme/fonts";
import { SAFE } from "../config/video";
import { EASE } from "../motion/anim";

/** Mots mis en valeur dans les sous-titres (montants, marque, mots-clés). */
const HIGHLIGHT = new RegExp(`([0-9][0-9${NNBSP}${NBSP} ]*FCFA|VOBI|STOP|rue|consulter|comparer|vérifier)`, "gi");

/**
 * Sous-titre incrusté — bandeau « glass » de la charte, 56 px SemiBold,
 * au tiers inférieur, hors des zones masquées par TikTok / Reels / Shorts.
 */
export const Subtitle: React.FC<{ text: string; localFrame: number; y?: number; dark?: boolean }> = ({ text, localFrame, y, dark = false }) => {
  // typographie française : espace insécable avant ? ! : ;
  const parts = text.replace(/ ([?!:;])/g, `${NBSP}$1`).split(HIGHLIGHT);
  const top = y ?? 1920 - SAFE.bottom - 150;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.side,
        right: SAFE.side + 40,
        top,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(localFrame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: `0px ${interpolate(localFrame, [0, 6], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out })}px`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.18,
          letterSpacing: "-0.01em",
          textAlign: "center",
          color: dark ? "#0F172A" : "#FFFFFF",
          padding: "16px 30px",
          borderRadius: 24,
          background: dark ? "rgba(255,255,255,0.82)" : "rgba(15, 23, 42, 0.58)",
          border: dark ? "1px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 12px 40px -12px rgba(0,0,0,0.35)",
          backdropFilter: "blur(14px)",
          maxWidth: 900,
        }}
      >
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <span key={i} style={{ color: dark ? "#0B6B4F" : "#F4C430" }}>
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </div>
  );
};
