import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { StreetSet } from "../../sets/Street";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, mixLimb } from "../../characters/poses";
import { HouseThumb } from "../../vobi-ui/HouseThumb";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { DECOR } from "../../config/palette";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 2 — Offres hors budget ou inadaptées (8,5 s / 255 frames)
 * 1) Maisons dont le loyer dépasse le budget -> tampon rouge « HORS BUDGET ».
 * 2) Maisons dans le budget mais qui ne répondent pas aux attentes -> tampon « INADAPTÉE ».
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
  const enter = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 140 } });
  const stampK = frame >= stampAt ? spring({ frame: frame - stampAt, fps, config: { damping: 9, stiffness: 220 } }) : 0;

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
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35)",
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
                transform: `rotate(-11deg) scale(${interpolate(stampK, [0, 1], [1.7, 1])})`,
                padding: "10px 22px",
                borderRadius: 12,
                border: `5px solid ${badgeColor}`,
                background: "rgba(255,255,255,0.94)",
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

  const CARD1 = 22;
  const STAMP1 = 76;
  const CARD2 = 128;
  const STAMP2 = 182;

  const shake =
    (frame >= STAMP1 && frame < STAMP1 + 10 ? Math.sin(frame * 2.4) * 8 : 0) +
    (frame >= STAMP2 && frame < STAMP2 + 10 ? Math.sin(frame * 2.4) * 8 : 0);

  let face = mixFace(EXPRESSIONS.motive, EXPRESSIONS.agace, prog(frame, STAMP1, STAMP1 + 12));
  face = mixFace(face, EXPRESSIONS.pourquoi, prog(frame, STAMP2, STAMP2 + 16));

  const armL = mixLimb(LIMBS.armRest, { a: -50, b: -85 }, prog(frame, STAMP1, STAMP1 + 14));
  const armR = mixLimb(LIMBS.armPhoneR, { a: 45, b: -75 }, prog(frame, STAMP2, STAMP2 + 14));

  const flashIn = interpolate(frame, [0, 8], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540 + shake} focusY={1020}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={frame * 0.3} sway={Math.sin(frame / 22) * 2} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.28}
            pose={{
              face,
              armL,
              armR,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              headTurn: interpolate(frame, [CARD1, CARD2], [-0.2, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              blink: blink(frame, 2.8),
              sweat: prog(frame, STAMP2, 255),
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
          y={540}
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
          y={680}
          frame={frame}
          fps={fps}
          cracked
        />
      </Camera>

      {flashIn > 0 ? <AbsoluteFill style={{ background: `rgba(255,246,220,${flashIn})`, pointerEvents: "none" }} /> : null}
      <VoiceOver scene="S2-Inadaptees" />
      <Sfx name="pop" at={CARD1} volume={0.45} />
      <Sfx name="stamp" at={STAMP1} volume={0.75} />
      <Sfx name="pop" at={CARD2} volume={0.45} />
      <Sfx name="stamp" at={STAMP2} volume={0.75} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
