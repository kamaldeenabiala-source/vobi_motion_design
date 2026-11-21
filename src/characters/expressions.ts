/**
 * Expressions faciales — paramètres partagés par TOUS les personnages.
 * Une expression = sourcils + yeux + bouche. On peut interpoler entre deux.
 */
export type Face = {
  browY: number; // décalage vertical des sourcils (− = haussés)
  browAngle: number; // inclinaison (+ = intérieur relevé : inquiet / triste)
  browAngleR?: number; // sourcil droit si asymétrique
  eyeOpen: number; // 0 fermé · 1 normal · 1.35 exorbité
  eyeOpenR?: number; // œil droit si asymétrique (clin d'œil)
  pupil: number; // taille de la pupille (0.55 = choc)
  lookX: number; // −1..1
  lookY: number; // −1..1
  mouthW: number; // largeur bouche
  mouthCurve: number; // + sourire · − moue
  mouthOpen: number; // ouverture (0 = trait)
  teeth: number; // 0..1 dents visibles
  cheeks: number; // 0..1 pommettes / joues relevées
};

export const EXPRESSIONS = {
  neutre: { browY: 0, browAngle: 0, eyeOpen: 1, pupil: 1, lookX: 0, lookY: 0, mouthW: 30, mouthCurve: 3, mouthOpen: 0, teeth: 0, cheeks: 0 },
  motive: { browY: -6, browAngle: -4, eyeOpen: 1.08, pupil: 1.05, lookX: 0, lookY: 0, mouthW: 38, mouthCurve: 9, mouthOpen: 4, teeth: 0.6, cheeks: 0.5 },
  confiant: { browY: -3, browAngle: -8, browAngleR: 4, eyeOpen: 0.9, pupil: 1, lookX: 0.15, lookY: 0, mouthW: 40, mouthCurve: 10, mouthOpen: 7, teeth: 1, cheeks: 0.8 },
  agace: { browY: 4, browAngle: -12, eyeOpen: 0.78, pupil: 0.95, lookX: 0.4, lookY: 0, mouthW: 28, mouthCurve: -5, mouthOpen: 0, teeth: 0, cheeks: 0 },
  epuise: { browY: 2, browAngle: 12, eyeOpen: 0.55, pupil: 0.95, lookX: 0, lookY: 0.35, mouthW: 26, mouthCurve: -6, mouthOpen: 3, teeth: 0, cheeks: 0 },
  choque: { browY: -16, browAngle: 8, eyeOpen: 1.38, pupil: 0.55, lookX: 0, lookY: 0, mouthW: 26, mouthCurve: -2, mouthOpen: 30, teeth: 0.3, cheeks: 0 },
  flegme: { browY: -2, browAngle: 0, eyeOpen: 0.6, pupil: 1, lookX: 0.2, lookY: 0, mouthW: 30, mouthCurve: 5, mouthOpen: 0, teeth: 0, cheeks: 0.3 },
  soulage: { browY: -4, browAngle: 10, eyeOpen: 0.85, pupil: 1, lookX: 0, lookY: -0.1, mouthW: 36, mouthCurve: 9, mouthOpen: 3, teeth: 0.4, cheeks: 0.6 },
  ravi: { browY: -8, browAngle: 2, eyeOpen: 1.05, pupil: 1.05, lookX: 0, lookY: 0, mouthW: 46, mouthCurve: 13, mouthOpen: 14, teeth: 1, cheeks: 1 },
  clinOeil: { browY: -6, browAngle: 0, browAngleR: 8, eyeOpen: 1, eyeOpenR: 0.05, pupil: 1, lookX: 0, lookY: 0, mouthW: 42, mouthCurve: 12, mouthOpen: 5, teeth: 0.9, cheeks: 1 },
  pourquoi: { browY: -12, browAngle: 14, eyeOpen: 1.1, pupil: 0.9, lookX: 0, lookY: 0, mouthW: 30, mouthCurve: -4, mouthOpen: 10, teeth: 0.2, cheeks: 0 },
  impressionne: { browY: -12, browAngle: -2, browAngleR: 8, eyeOpen: 1.1, pupil: 1, lookX: 0, lookY: 0.2, mouthW: 30, mouthCurve: 6, mouthOpen: 6, teeth: 0.2, cheeks: 0.4 },
  sourireCommercial: { browY: -4, browAngle: -2, eyeOpen: 0.95, pupil: 1, lookX: 0, lookY: 0, mouthW: 50, mouthCurve: 13, mouthOpen: 10, teeth: 1, cheeks: 1 },
  perplexe: { browY: -2, browAngle: -10, browAngleR: 12, eyeOpen: 0.9, pupil: 0.9, lookX: -0.4, lookY: 0, mouthW: 24, mouthCurve: -3, mouthOpen: 0, teeth: 0, cheeks: 0 },
} satisfies Record<string, Face>;

export type ExpressionName = keyof typeof EXPRESSIONS;

/** Mélange deux expressions (t = 0 → a, 1 → b). */
export const mixFace = (a: Face, b: Face, t: number): Face => {
  const k = Math.max(0, Math.min(1, t));
  const m = (x: number, y: number) => x + (y - x) * k;
  return {
    browY: m(a.browY, b.browY),
    browAngle: m(a.browAngle, b.browAngle),
    browAngleR: m(a.browAngleR ?? a.browAngle, b.browAngleR ?? b.browAngle),
    eyeOpen: m(a.eyeOpen, b.eyeOpen),
    eyeOpenR: m(a.eyeOpenR ?? a.eyeOpen, b.eyeOpenR ?? b.eyeOpen),
    pupil: m(a.pupil, b.pupil),
    lookX: m(a.lookX, b.lookX),
    lookY: m(a.lookY, b.lookY),
    mouthW: m(a.mouthW, b.mouthW),
    mouthCurve: m(a.mouthCurve, b.mouthCurve),
    mouthOpen: m(a.mouthOpen, b.mouthOpen),
    teeth: m(a.teeth, b.teeth),
    cheeks: m(a.cheeks, b.cheeks),
  };
};

export const face = (name: ExpressionName): Face => EXPRESSIONS[name];
