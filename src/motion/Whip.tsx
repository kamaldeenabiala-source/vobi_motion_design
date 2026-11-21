import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

/**
 * Filage (whip-pan) : le plan sortant file vers la gauche, l'entrant arrive
 * de la droite, avec flou de mouvement. `local` = frame locale du plan,
 * `dur` = durée du plan (transition incluse), `t` = demi-durée du filage.
 */
export const WhipShot: React.FC<{ local: number; dur: number; t?: number; first?: boolean; last?: boolean; children: React.ReactNode }> = ({
  local,
  dur,
  t = 6,
  first = false,
  last = false,
  children,
}) => {
  const inK = first ? 1 : interpolate(local, [0, 2 * t], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outK = last ? 0 : interpolate(local, [dur - 2 * t, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const easeIn = (k: number) => 1 - Math.pow(1 - k, 3);
  const easeOut = (k: number) => k * k * k;
  const x = (1 - easeIn(inK)) * 1150 - easeOut(outK) * 1150;
  const speed = Math.abs((1 - inK) * inK * 4) + Math.abs(outK * (1 - outK) * 4);
  return (
    <AbsoluteFill
      style={{
        translate: `${x}px 0px`,
        filter: speed > 0.05 ? `blur(${speed * 16}px)` : undefined,
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
