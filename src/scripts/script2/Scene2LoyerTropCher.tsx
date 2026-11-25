import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { StreetSet } from "../../sets/Street";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, mixLimb } from "../../characters/poses";
import { HouseThumb } from "../../vobi-ui/HouseThumb";
import { Icon, type IconName } from "../../vobi-ui/icons";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 2 — Loyers trop chers & pression sur les autres dépenses (21,5 s / 645 frames)
 */
const ExpenseChip: React.FC<{
  icon: IconName;
  label: string;
  x: number;
  y: number;
  at: number;
  frame: number;
  fps: number;
}> = ({ icon, label, x, y, at, frame, fps }) => {
  if (frame < at) return null;
  const k = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 170 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: String(k),
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 24px",
        borderRadius: 20,
        background: "#FFFFFF",
        border: `3px solid ${BRAND.debit}`,
        boxShadow: "0 18px 36px -14px rgba(225,29,72,0.35)",
        whiteSpace: "nowrap",
      }}
    >
      <Icon name={icon} size={28} color={BRAND.debit} stroke={2.4} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: BRAND.slate900 }}>{label}</span>
    </div>
  );
};

export const Scene2LoyerTropCher: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CARD_AT = 20;
  const STAMP_AT = 95;
  const EXPENSES_AT = 210;
  const GOAL_AT = 460;

  const cardK = spring({ frame: frame - CARD_AT, fps, config: { damping: 12, stiffness: 140 } });
  const stampK = frame >= STAMP_AT ? spring({ frame: frame - STAMP_AT, fps, config: { damping: 9, stiffness: 210 } }) : 0;
  const cardOut = prog(frame, EXPENSES_AT - 18, EXPENSES_AT);

  const goalK = frame >= GOAL_AT ? spring({ frame: frame - GOAL_AT, fps, config: { damping: 12, stiffness: 150 } }) : 0;

  let face = mixFace(EXPRESSIONS.motive, EXPRESSIONS.agace, prog(frame, STAMP_AT, STAMP_AT + 16));
  face = mixFace(face, EXPRESSIONS.pourquoi, prog(frame, EXPENSES_AT, EXPENSES_AT + 24));
  face = mixFace(face, EXPRESSIONS.soulage, prog(frame, GOAL_AT, GOAL_AT + 24));

  const armL = mixLimb(LIMBS.armRest, { a: -42, b: -80 }, prog(frame, STAMP_AT, STAMP_AT + 14) * (1 - prog(frame, GOAL_AT, GOAL_AT + 20)));

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={frame * 0.4} sway={Math.sin(frame / 24) * 2} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.28}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL,
              armR: LIMBS.armRest,
              headTurn: 0.05,
              blink: blink(frame, 2.8),
              sweat: prog(frame, EXPENSES_AT, GOAL_AT) * (1 - prog(frame, GOAL_AT, GOAL_AT + 20)),
            }}
          />
        </svg>

        {/* Carte loyer trop cher */}
        {cardOut < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 560,
              width: 500,
              translate: "-50% -50%",
              scale: String(cardK),
              opacity: 1 - cardOut,
              borderRadius: 28,
              background: "#FFFFFF",
              padding: 20,
              boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35)",
              border: `3px solid ${stampK > 0.2 ? BRAND.debit : "#E2E8F0"}`,
            }}
          >
            <div style={{ position: "relative" }}>
              <HouseThumb variant="maisonBasse" width={460} height={260} radius={18} />
              {stampK > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(15,23,42,0.3)",
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      transform: `rotate(-10deg) scale(${interpolate(stampK, [0, 1], [1.6, 1])})`,
                      padding: "10px 26px",
                      borderRadius: 12,
                      border: `5px solid ${BRAND.debit}`,
                      background: "rgba(255,255,255,0.95)",
                      color: BRAND.debit,
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: 40,
                    }}
                  >
                    TROP CHER
                  </div>
                </div>
              ) : null}
            </div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: BRAND.slate900 }}>Loyer mensuel</span>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: BRAND.debit }}>120 000 FCFA</span>
            </div>
          </div>
        ) : null}

        {/* Dépenses essentielles menacées */}
        {frame >= EXPENSES_AT && frame < GOAL_AT ? (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <ExpenseChip icon="droplet" label="Eau" x={280} y={420} at={275} frame={frame} fps={fps} />
            <ExpenseChip icon="zap" label="Électricité" x={760} y={470} at={310} frame={frame} fps={fps} />
            <ExpenseChip icon="wallet" label="Nourriture" x={300} y={620} at={345} frame={frame} fps={fps} />
            <ExpenseChip icon="mapPin" label="Transport" x={760} y={670} at={380} frame={frame} fps={fps} />
          </div>
        ) : null}

        {/* Objectif : bien vivre sans compter chaque franc */}
        {goalK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 500,
              translate: "-50% -50%",
              scale: String(goalK),
              padding: "24px 40px",
              borderRadius: 28,
              background: "#FFFFFF",
              border: `4px solid ${BRAND.primary}`,
              boxShadow: "0 24px 54px -18px rgba(11,107,79,0.4)",
              textAlign: "center",
              maxWidth: 820,
            }}
          >
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: BRAND.primary }}>
              Adaptée à mes moyens
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: BRAND.slate900, marginTop: 6 }}>
              Bien vivre sans compter chaque franc
            </div>
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S2-LoyerTropCher" />
      <Sfx name="pop" at={CARD_AT} volume={0.45} />
      <Sfx name="stamp" at={STAMP_AT} volume={0.7} />
      <Sfx name="pop" at={275} volume={0.4} />
      <Sfx name="pop" at={310} volume={0.4} />
      <Sfx name="pop" at={345} volume={0.4} />
      <Sfx name="pop" at={380} volume={0.4} />
      <Sfx name="notif" at={GOAL_AT} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
