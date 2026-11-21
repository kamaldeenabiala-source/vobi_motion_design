import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

// Police officielle VOBI (charte §4.1). Chargée une seule fois, bloque le rendu
// jusqu'à disponibilité.
const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

export const FONT = fontFamily;

/** Espace fine insécable (milliers) et espace insécable. */
export const NNBSP = String.fromCharCode(0x202f);
export const NBSP = String.fromCharCode(0xa0);

// Chiffres tabulaires obligatoires pour les montants (charte §8.4).
export const TABULAR: React.CSSProperties = {
  fontVariantNumeric: "tabular-nums lining-nums",
  fontFeatureSettings: "'tnum' on, 'lnum' on",
};

/** Format français : 10 000 FCFA (espace fine insécable). */
export const fcfa = (n: number) =>
  `${Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP)}${NBSP}FCFA`;

export const groupDigits = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
