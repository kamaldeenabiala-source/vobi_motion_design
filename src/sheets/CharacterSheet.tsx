import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Character, type Pose } from "../characters/Character";
import { DEMARCHEUR, SENAN, ZEM } from "../characters/bible";
import { EXPRESSIONS, type ExpressionName } from "../characters/expressions";
import { blink, breathe } from "../motion/anim";
import { FONT } from "../theme/fonts";
import { BRAND } from "../config/brand";

const EXPR: ExpressionName[] = ["motive", "confiant", "agace", "epuise", "choque", "flegme", "soulage", "ravi", "clinOeil"];

/** Fiche de référence (« model sheet ») : à valider avant animation. */
export const CharacterSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = breathe(frame, fps);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 60, left: 60, fontSize: 44, fontWeight: 800, color: BRAND.primary }}>
        Fiche personnages — Script 5
      </div>
      {/* Plein pied */}
      <Character spec={SENAN} x={230} y={900} scale={1.05} pose={{ face: EXPRESSIONS.confiant, bob: b * 2, blink: blink(frame, 1), handR: "phone", armR: { a: -6, b: 112 }, phoneGlow: 1 }} />
      <Character spec={DEMARCHEUR} x={560} y={900} scale={1.05} pose={{ face: EXPRESSIONS.sourireCommercial, bob: b * 2, armL: { a: 18, b: 145 }, handL: "phone", armR: { a: 40, b: 30 }, handR: "open", blink: blink(frame, 3) }} />
      <Character spec={ZEM} x={880} y={900} scale={1.05} pose={{ face: EXPRESSIONS.confiant, bob: b * 2, armR: { a: 150, b: 20 }, handR: "thumbUp", blink: blink(frame, 5) }} />
      {[
        ["Sènan", 230],
        ["Le démarcheur", 560],
        ["Le zémidjan", 880],
      ].map(([t, x]) => (
        <div key={t as string} style={{ position: "absolute", top: 930, left: (x as number) - 160, width: 320, textAlign: "center", fontSize: 30, fontWeight: 700, color: BRAND.ink }}>
          {t}
        </div>
      ))}
      {/* Expressions de Sènan */}
      {EXPR.map((e, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const pose: Pose = { face: EXPRESSIONS[e], blink: e === "clinOeil" ? 0 : blink(frame, i) };
        return (
          <div key={e} style={{ position: "absolute", left: 40 + col * 340, top: 1010 + row * 300, width: 320, height: 290 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "#FFFFFF", boxShadow: "0 8px 24px -8px rgba(0,0,0,0.12)", overflow: "hidden" }}>
              <Character spec={SENAN} x={160} y={1030} scale={1.55} pose={pose} shadow={false} />
            </div>
            <div style={{ position: "absolute", bottom: 12, width: "100%", textAlign: "center", fontSize: 24, fontWeight: 700, color: BRAND.muted }}>{e}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
