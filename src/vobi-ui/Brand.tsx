import React from "react";
import { Img } from "remotion";
import { ASSETS, BRAND, GRADIENTS } from "../config/brand";
import { FONT } from "../theme/fonts";

/**
 * Logo VOBI tel qu'affiché dans l'application (components/shared/AppLogo.vue) :
 * pictogramme officiel « V + clé » + mot « VOBI » font-black en dégradé
 * emerald-600 → teal-600 → emerald-500.
 */
export const VobiLogo: React.FC<{ height?: number; showText?: boolean; light?: boolean; gap?: number }> = ({ height = 40, showText = true, light = false, gap }) => (
  <div style={{ display: "flex", alignItems: "center", gap: gap ?? height * 0.28 }}>
    <Img src={ASSETS.logo} style={{ height, width: "auto" }} />
    {showText ? (
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: height * 0.72,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          ...(light
            ? { color: "#FFFFFF" }
            : { backgroundImage: GRADIENTS.wordmark, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }),
        }}
      >
        VOBI
      </span>
    ) : null}
  </div>
);

/** Badge « Vérifié » des cartes de logement (maquettes). */
export const VerifiedBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4 * scale,
      padding: `${3 * scale}px ${8 * scale}px ${3 * scale}px ${4 * scale}px`,
      borderRadius: 999,
      background: "rgba(255,255,255,0.95)",
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 11 * scale,
      color: BRAND.primary,
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    }}
  >
    <span style={{ width: 15 * scale, height: 15 * scale, borderRadius: 99, background: BRAND.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={10 * scale} height={10 * scale} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
    Vérifié
  </div>
);
