// Format de diffusion : vertical 9:16 pour TikTok / Reels / Shorts / statuts.
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Zones de sécurité : ne rien placer d'important sous l'interface des réseaux
// sociaux (barre du haut, légende + boutons en bas, colonne d'actions à droite).
export const SAFE = {
  top: 220,
  bottom: 380,
  side: 72,
  rightActions: 150,
} as const;

export const sec = (s: number) => Math.round(s * VIDEO.fps);
