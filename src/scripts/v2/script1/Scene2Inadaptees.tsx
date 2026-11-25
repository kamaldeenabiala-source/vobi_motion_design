import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { CityAvenueSet } from "../../../sets/CityAvenueSet";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { HouseThumb } from "../../../vobi-ui/HouseThumb";
import { blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { DECOR } from "../../../config/palette";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 2 V2 — Offres hors budget ou inadaptées (11,5 s / 345 frames)
 */
const OfferCard: React.FC<{
  title: string;
  price: string;
  badge: string;
  badgeColor: string;
  variant: "maisonBasse" | "entreeCouche";
  at: number;
  stampAt: number;
  x: number;
  y: number;
  frame: number;
  fps: number;
  cracked?: boolean;
}> = ({ title, price, badge, badgeColor, variant, at, stampAt, x, y, frame, fps, cracked }) => {
  if (frame < at) return null;
  const enter = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 130 } });
  const stampK = frame >= stampAt ? spring({ frame: frame - stampAt, fps, config: { damping: 10, stiffness: 200 } }) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 440,
        translate: "-50% -50%",
        scale: String(enter),
        borderRadius: 28,
        background: "#FFFFFF",
        padding: 18,
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.32)",
        border: `3px solid ${stampK > 0.2 ? badgeColor : "#E2E8F0"}`,
      }}
    >
      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
        <HouseThumb variant={variant} width={400} height={240} radius={18} />
        {cracked ? (
          <svg width={400} height={240} viewBox="0 0 400 240" style={{ position: "absolute", inset: 0 }}>
            <path d="M90 10 L118 75 L96 125 L130 190" stroke="#334155" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M295 25 L270 85 L300 130" stroke="#334155" strokeWidth={4} fill="none" strokeLinecap="round" />
            <ellipse cx={210} cy={205} rx={68} ry={16} fill="rgba(59,130,246,0.45)" />
          </svg>
        ) : null}
        {stampK > 0 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: `rotate(-11deg) scale(${interpolate(stampK, [0, 1], [1.65, 1])})`,
                padding: "10px 22px",
                borderRadius: 12,
                border: `5px solid ${badgeColor}`,
                background: "rgba(255,255,255,0.95)",
                color: badgeColor,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 34,
                letterSpacing: "0.06em",
              }}
            >
              {badge}
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: BRAND.slate900 }}>{title}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: stampK > 0.2 ? badgeColor : BRAND.primary }}>{price}</div>
      </div>
    </div>
  );
};

export const Scene2Inadaptees: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CARD1 = 28;
  const STAMP1 = 100;
  const CARD2 = 165;
  const STAMP2 = 240;

  let face = mixFace(EXPRESSIONS.motive, EXPRESSIONS.agace, prog(frame, STAMP1, STAMP1 + 16));
  face = mixFace(face, EXPRESSIONS.pourquoi, prog(frame, STAMP2, STAMP2 + 18));

  const dyn = dynamicPose(frame, {
    speaking: frame >= 15 && frame < 290,
    energy: 1.2,
    gesture: frame >= STAMP1 ? "frustrated" : "explain",
  });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CityAvenueSet pan={frame * 0.5} sway={Math.sin(frame / 22) * 2} />
          <CharacterG
            spec={AICHA}
            x={540}
            y={1645}
            scale={1.26}
            pose={{
              ...dyn,
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
              blink: blink(frame, 2.8),
              sweat: prog(frame, STAMP2, 340),
            }}
          />
        </svg>

        <OfferCard
          title="Belle villa"
          price="110 000 F"
          badge="HORS BUDGET"
          badgeColor={BRAND.debit}
          variant="maisonBasse"
          at={CARD1}
          stampAt={STAMP1}
          x={290}
          y={530}
          frame={frame}
          fps={fps}
        />
        <OfferCard
          title="Dans le budget…"
          price="50 000 F"
          badge="INADAPTÉE"
          badgeColor={DECOR.motoRed}
          variant="entreeCouche"
          at={CARD2}
          stampAt={STAMP2}
          x={790}
          y={675}
          frame={frame}
          fps={fps}
          cracked
        />
      </Camera>

      <VoiceOver scene="S2-Inadaptees" />
      <Sfx name="pop" at={CARD1} volume={0.45} />
      <Sfx name="stamp" at={STAMP1} volume={0.7} />
      <Sfx name="pop" at={CARD2} volume={0.45} />
      <Sfx name="stamp" at={STAMP2} volume={0.7} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
