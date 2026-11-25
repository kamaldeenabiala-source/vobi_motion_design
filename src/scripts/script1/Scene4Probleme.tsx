import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { CrossroadSet } from "../../sets/Crossroad";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, mixLimb } from "../../characters/poses";
import { HouseBubble } from "../../props/HouseBubble";
import { EASE, blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 4 — Le manque d'informations (9,5 s / 285 frames)
 * Le logement recherché existe peut-être, mais Sènan est entouré de zones
 * d'ombre et de questions sans réponse (« ? »).
 */
const QuestionTag: React.FC<{
  text: string;
  x: number;
  y: number;
  at: number;
  frame: number;
  fps: number;
}> = ({ text, x, y, at, frame, fps }) => {
  if (frame < at) return null;
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 150 } });
  const float = Math.sin((frame - at) / 14) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        translate: "-50% -50%",
        scale: String(k),
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 24px",
        borderRadius: 999,
        background: "rgba(15, 23, 42, 0.86)",
        border: "2px solid rgba(255,255,255,0.22)",
        color: "#FFFFFF",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 30,
        boxShadow: "0 16px 36px -12px rgba(0,0,0,0.4)",
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: 99,
          background: BRAND.gold,
          color: BRAND.slate900,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
        }}
      >
        ?
      </span>
      {text}
    </div>
  );
};

export const Scene4Probleme: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const INSIGHT = 155;
  const insightK = frame >= INSIGHT ? spring({ frame: frame - INSIGHT, fps, config: { damping: 12, stiffness: 140 } }) : 0;

  const face = mixFace(
    EXPRESSIONS.epuise,
    { ...EXPRESSIONS.agace, lookX: Math.sin(frame / 22) * 0.55 },
    prog(frame, 20, 60),
  );

  const armL = mixLimb(LIMBS.armRest, { a: -30, b: -70 }, prog(frame, 40, 80));
  const armR = mixLimb(LIMBS.armRest, { a: 35, b: -65 }, prog(frame, 55, 95));

  const transitionOut = interpolate(frame, [265, 285], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CrossroadSet />

          {/* La maison idéale existe au loin, mais dans le brouillard */}
          <g opacity={interpolate(frame, [20, 70], [0.2, 0.72], { extrapolateRight: "clamp" })}>
            <HouseBubble x={540} y={430} scale={0.95} label="Maison idéale ?" />
          </g>

          <CharacterG
            spec={SENAN}
            x={540}
            y={1620}
            scale={1.26}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL,
              armR,
              headTurn: Math.sin(frame / 26) * 0.3,
              blink: blink(frame, 3),
            }}
          />
        </svg>

        <QuestionTag text="Quel quartier ?" x={270} y={660} at={35} frame={frame} fps={fps} />
        <QuestionTag text="Vrai loyer ?" x={800} y={720} at={68} frame={frame} fps={fps} />
        <QuestionTag text="Toujours dispo ?" x={310} y={850} at={102} frame={frame} fps={fps} />
        <QuestionTag text="État réel ?" x={770} y={910} at={126} frame={frame} fps={fps} />

        {insightK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 320,
              translate: "-50% -50%",
              scale: String(insightK),
              padding: "18px 34px",
              borderRadius: 24,
              background: "#FFFFFF",
              border: `3px solid ${BRAND.gold}`,
              boxShadow: "0 20px 44px -16px rgba(0,0,0,0.35)",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 34,
              color: BRAND.slate900,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            Il manque juste la bonne information
          </div>
        ) : null}
      </Camera>

      {transitionOut > 0 ? (
        <AbsoluteFill style={{ background: `rgba(248, 250, 251, ${transitionOut})`, pointerEvents: "none" }} />
      ) : null}
      <VoiceOver scene="S4-Probleme" />
      <Sfx name="pop" at={35} volume={0.35} />
      <Sfx name="pop" at={68} volume={0.35} />
      <Sfx name="pop" at={102} volume={0.35} />
      <Sfx name="notif" at={INSIGHT} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
