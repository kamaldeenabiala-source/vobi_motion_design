import type { Limb, Pose } from "./Character";

/** Bibliothèque de poses réutilisables (mêmes gestes d'une scène à l'autre). */

const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
export const mixLimb = (a: Limb, b: Limb, t: number): Limb => ({ a: lerp(a.a, b.a, t), b: lerp(a.b, b.b, t) });

export const LIMBS = {
  armRest: { a: 8, b: 6 },
  armPhoneR: { a: -4, b: 118 }, // téléphone devant la poitrine (main droite écran)
  armPhoneEar: { a: 20, b: 150 }, // téléphone à l'oreille
  armFistUp: { a: 38, b: -128 }, // poing « yes » levé
  armWalletL: { a: -12, b: 96 }, // portefeuille tenu devant
  armOnShoulder: { a: 70, b: 40 }, // bras posé sur l'épaule du voisin
  armPalmOut: { a: 52, b: 40 }, // main tendue paume ouverte
  armSpread: { a: 62, b: -10 }, // bras écartés « pourquoi ? »
  armWave: { a: 150, b: 30 },
  armMug: { a: -8, b: 120 },
  armKey: { a: 30, b: 120 },
  legStand: { a: 3, b: 0 },
  legSit: { a: 10, b: -4 },
} satisfies Record<string, Limb>;

/** Marche « face caméra » : alternance des jambes + rebond. */
export const walkCycle = (frame: number, speed = 0.34): Pick<Pose, "legL" | "legR" | "bob" | "armL" | "armR"> => {
  const ph = frame * speed;
  const s = Math.sin(ph);
  return {
    legL: { a: 3 + s * 6, b: Math.max(0, s) * 26 },
    legR: { a: 3 - s * 6, b: Math.max(0, -s) * 26 },
    bob: -Math.abs(Math.cos(ph)) * 10,
    armL: { a: 10 - s * 10, b: 12 },
    armR: { a: 10 + s * 10, b: 12 },
  };
};

/** Position assise vue de face (cuisses en raccourci). */
export const SIT: Pick<Pose, "thighScale" | "legL" | "legR"> = {
  thighScale: 0.32,
  legL: { a: 12, b: -6 },
  legR: { a: 12, b: -6 },
};

/** Passager / conducteur de zém, vu de profil (jambes vers l'avant). */
export const RIDE: Pick<Pose, "thighScale" | "legL" | "legR"> = {
  thighScale: 0.85,
  legL: { a: -78, b: -88 },
  legR: { a: 78, b: 88 },
};
