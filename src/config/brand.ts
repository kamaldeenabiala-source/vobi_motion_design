import { staticFile } from "remotion";

/**
 * Charte graphique VOBI officielle (v2.1)
 * Source : vobi_backend/docs/Guide_Modules/CHARTE_GRAPHIQUE_VOBI.md
 *          vobi_frontend/src/styles.css + components/shared/AppLogo.vue
 * Ne pas inventer de couleurs de marque : tout ce qui touche à VOBI vient d'ici.
 */
export const BRAND = {
  primary: "#0B6B4F", // Vert primaire de marque
  primaryDeep: "#0A3D2E", // Vert profond (fonds, marqueurs carte)
  emerald: "#059669", // Succès / actif
  emeraldBright: "#10B981",
  lightGreen: "#A7E3C6", // Vert clair de lumière
  mint: "#EAF7EE", // Fond accent (bg-emerald-50 des maquettes)
  gold: "#F4C430", // Or métallique
  cobalt: "#0066FF",
  background: "#F8FAFB", // Fond clair VOBI
  surface: "#F1F5F9",
  card: "#FFFFFF",
  ink: "#1A1A1A",
  slate900: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  destructive: "#EF4444", // Panneau STOP
  debit: "#E11D48", // Rose corail débit (rose-600)
} as const;

// Dégradés signature (charte §3), convertis depuis l'OKLCH d'origine.
export const GRADIENTS = {
  primary: "linear-gradient(135deg, #1FBF86 0%, #008B9A 100%)",
  wordmark: "linear-gradient(90deg, #059669 0%, #0D9488 50%, #10B981 100%)",
  sunset: "linear-gradient(135deg, #F2C14E 0%, #E8743B 100%)",
} as const;

export const SHADOWS = {
  soft: "0 8px 24px -8px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.04)",
  glow: "0 20px 60px -20px rgba(5,150,105,0.5)",
  elegant: "0 30px 80px -30px rgba(0,0,0,0.18)",
} as const;

export const RADII = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

export const ASSETS = {
  logo: staticFile("brand/vobi-logo-v-cle.png"), // logo officiel « V + clé »
  badgeVerifie: staticFile("brand/badge-verifie.png"),
} as const;

// Appel à l'action — coordonnées officielles À FOURNIR.
// Tant que `url` vaut null, le carton final n'affiche aucune adresse inventée.
export const CTA: { button: string; url: string | null } = {
  button: "Découvre VOBI",
  url: null,
};
