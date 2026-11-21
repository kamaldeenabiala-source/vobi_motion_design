import React from "react";
import { interpolate, spring } from "remotion";
import { FONT, TABULAR, groupDigits } from "../theme/fonts";
import { BRAND } from "../config/brand";

/**
 * Compteur de dépenses (antagoniste visuel de la pub).
 * Les chiffres roulent comme une machine à sous ; chaque changement de
 * palier fait sauter et grossir l'étiquette.
 */
export type SpendStep = { at: number; value: number };

export const spendAt = (steps: SpendStep[], frame: number, rollFrames = 12) => {
  let value = 0;
  let lastChange = -999;
  let prev = 0;
  for (const s of steps) {
    if (frame >= s.at) {
      prev = value;
      value = s.value;
      lastChange = s.at;
    }
  }
  const k = Math.min(1, Math.max(0, (frame - lastChange) / rollFrames));
  const eased = 1 - Math.pow(1 - k, 3);
  return { display: prev + (value - prev) * eased, target: value, lastChange };
};

/**
 * Valeur roulante façon compteur kilométrique : chaque colonne de chiffre est
 * une bande verticale 0→9 qui défile en continu (machine à sous).
 */
export const RollingValue: React.FC<{ value: number; fontSize: number; color: string; minDigits?: number }> = ({ value, fontSize, color, minDigits = 1 }) => {
  const h = Math.round(fontSize * 1.12);
  const v = Math.max(0, value);
  const nDigits = Math.max(minDigits, Math.floor(Math.max(1, Math.round(v))).toString().length);
  // positions affichées, calculées des unités vers le haut (retenue réaliste)
  const disp: number[] = [];
  for (let p = 0; p < nDigits; p++) {
    const unit = Math.pow(10, p);
    if (p < 2) disp[p] = 0; // montants toujours ronds (multiples de 100)
    else if (p === 2) disp[p] = (v / unit) % 10;
    else disp[p] = (Math.floor(v / unit) % 10) + Math.max(0, disp[p - 1] - 9);
  }
  const cols: React.ReactNode[] = [];
  for (let p = nDigits - 1; p >= 0; p--) {
    const shown = disp[p];
    // zéro de tête : apparaît progressivement quand la colonne commence à tourner
    const leading = p > 0 && v < Math.pow(10, p);
    const colOpacity = leading ? Math.min(1, shown * 1.5) : 1;
    if (leading && colOpacity <= 0.01) continue;
    cols.push(
      <span key={p} style={{ display: "inline-block", height: h, overflow: "hidden", position: "relative", opacity: colOpacity }}>
        <span style={{ display: "flex", flexDirection: "column", translate: `0px ${-shown * h}px` }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
            <span key={i} style={{ height: h, lineHeight: `${h}px`, display: "block", textAlign: "center" }}>
              {d}
            </span>
          ))}
        </span>
      </span>,
    );
    if (p % 3 === 0 && p > 0) cols.push(<span key={`s${p}`} style={{ display: "inline-block", width: "0.26em" }} />);
  }
  return (
    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize, color, ...TABULAR, display: "inline-flex", height: h, alignItems: "flex-start", lineHeight: 1 }}>
      {cols}
    </span>
  );
};

/** Étiquette flottante « Dépensé : X FCFA » accrochée à l'épaule du héros. */
export const SpendTag: React.FC<{
  frame: number;
  fps: number;
  steps: SpendStep[];
  x: number;
  y: number;
  scale?: number;
  appearAt?: number;
  opacity?: number;
  rotate?: number;
}> = ({ frame, fps, steps, x, y, scale = 1, appearAt = 0, opacity = 1, rotate = 0 }) => {
  const { display, lastChange } = spendAt(steps, frame);
  const appear = spring({ frame: frame - appearAt, fps, config: { damping: 12, stiffness: 170 } });
  const bump = spring({ frame: frame - lastChange, fps, config: { damping: 8, stiffness: 260, mass: 0.6 } });
  const bumpScale = lastChange > 0 ? 1 + 0.22 * Math.sin(bump * Math.PI) : 1;
  // grossit avec le montant
  const grow = 1 + Math.min(0.35, display / 30000);
  if (frame < appearAt) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -100%",
        scale: String(appear * bumpScale * grow * scale),
        rotate: `${rotate + Math.sin(frame / 9) * 2}deg`,
        opacity,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 24px 14px 18px",
          borderRadius: 22,
          background: "#FFFFFF",
          boxShadow: "0 18px 40px -14px rgba(120, 20, 40, 0.45)",
          border: `3px solid ${BRAND.debit}`,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 14, background: BRAND.debit, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: BRAND.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Dépensé</span>
          <span style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <RollingValue value={display} fontSize={42} color={BRAND.debit} />
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: BRAND.debit }}>FCFA</span>
          </span>
        </div>
      </div>
      {/* pointe vers l'épaule */}
      <div style={{ position: "absolute", left: "50%", bottom: -12, width: 24, height: 24, background: "#FFFFFF", borderRight: `3px solid ${BRAND.debit}`, borderBottom: `3px solid ${BRAND.debit}`, rotate: "45deg", translate: "-50% 0" }} />
    </div>
  );
};

/** Montant débité qui jaillit (« − 2 000 ») en rose corail. */
export const DebitPop: React.FC<{ frame: number; at: number; amount: number; x: number; y: number }> = ({ frame, at, amount, x, y }) => {
  const t = frame - at;
  if (t < 0 || t > 34) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% ${interpolate(t, [0, 34], [0, -120])}px`,
        opacity: interpolate(t, [0, 4, 24, 34], [0, 1, 1, 0]),
        scale: String(interpolate(t, [0, 6, 10], [0.5, 1.25, 1], { extrapolateRight: "clamp" })),
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 64,
        color: BRAND.debit,
        ...TABULAR,
        textShadow: "0 4px 0 #FFFFFF, 0 -4px 0 #FFFFFF, 4px 0 0 #FFFFFF, -4px 0 0 #FFFFFF, 0 10px 24px rgba(0,0,0,0.25)",
        whiteSpace: "nowrap",
      }}
    >
      − {groupDigits(amount)}
    </div>
  );
};
