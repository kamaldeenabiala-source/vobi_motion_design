import { Easing, interpolate, spring } from "remotion";
import { noise2D } from "@remotion/noise";

/**
 * Signature de mouvement commune à toute la pub :
 * sorties rapides, arrivées douces ; rebonds élastiques réservés au ludique.
 */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  anticipate: Easing.bezier(0.36, -0.4, 0.3, 1.2),
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 entre deux frames avec easing. */
export const prog = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = EASE.out,
) => interpolate(frame, [from, to], [0, 1], { ...clamp, easing });

/** Mappe frame → valeurs avec clamp et easing. */
export const lerpF = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = EASE.inOut,
) => interpolate(frame, input, output, { ...clamp, easing });

/** Ressort élastique (rebond) démarrant à `delay`. */
export const pop = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<{ damping: number; stiffness: number; mass: number }> = {},
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 11, stiffness: 160, mass: 0.7, ...config },
  });

/** Ressort amorti sans dépassement. */
export const smooth = (frame: number, fps: number, delay = 0, durationInFrames?: number) =>
  spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames });

/** Bruit organique −1..1 (respiration, flottement, tremblement). */
export const wobble = (seed: string, frame: number, speed = 0.05, y = 0) =>
  noise2D(seed, frame * speed, y);

/** Secousse de caméra : amplitude décroissante après `at`. */
export const shake = (frame: number, at: number, duration: number, amp: number, seed = "shake") => {
  const t = frame - at;
  if (t < 0 || t > duration) return { x: 0, y: 0, r: 0 };
  const decay = 1 - t / duration;
  const a = amp * decay * decay;
  return {
    x: noise2D(seed + "x", t * 0.9, 0) * a,
    y: noise2D(seed + "y", t * 0.9, 0) * a,
    r: noise2D(seed + "r", t * 0.7, 0) * a * 0.04,
  };
};

/** Clignement des yeux naturel (renvoie 0 ouvert → 1 fermé). */
export const blink = (frame: number, seed = 0, every = 95) => {
  const offset = (seed * 37) % every;
  const t = (frame + offset) % every;
  // double clignement occasionnel
  const second = (Math.floor((frame + offset) / every) + seed) % 3 === 0;
  const one = t < 6 ? Math.sin((t / 6) * Math.PI) : 0;
  const two = second && t > 9 && t < 15 ? Math.sin(((t - 9) / 6) * Math.PI) : 0;
  return Math.max(one, two);
};

/** Respiration : −1..1 lente. */
export const breathe = (frame: number, fps: number, seed = 0) =>
  Math.sin((frame / fps) * Math.PI * 0.55 + seed);
