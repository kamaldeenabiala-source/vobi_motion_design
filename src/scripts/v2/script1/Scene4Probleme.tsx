import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { CourtyardSet } from "../../../sets/CourtyardSet";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { HouseBubble } from "../../../props/HouseBubble";
import { EASE, blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 4 V2 — Le manque d'informations (12,5 s / 375 frames)
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
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 145 } });
  const float = Math.sin((frame - at) / 16) * 8;
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
        background: "rgba(15, 23, 42, 0.88)",
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

  const INSIGHT = 200;
  const insightK = frame >= INSIGHT ? spring({ frame: frame - INSIGHT, fps, config: { damping: 12, stiffness: 140 } }) : 0;

  const face = mixFace(EXPRESSIONS.epuise, EXPRESSIONS.pourquoi, prog(frame, 30, 80));
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 320, energy: 1.15, gesture: "explain" });
  const transitionOut = interpolate(frame, [350, 375], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CourtyardSet sway={Math.sin(frame / 24) * 2} />

          <g opacity={interpolate(frame, [24, 90], [0.2, 0.78], { extrapolateRight: "clamp" })}>
            <HouseBubble x={540} y={420} scale={0.95} label="Maison idéale ?" />
          </g>

          <CharacterG
            spec={AICHA}
            x={540}
            y={1645}
            scale={1.25}
            pose={{
              ...dyn,
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
              blink: blink(frame, 3),
            }}
          />
        </svg>

        <QuestionTag text="Quel quartier ?" x={270} y={640} at={42} frame={frame} fps={fps} />
        <QuestionTag text="Vrai loyer ?" x={800} y={700} at={86} frame={frame} fps={fps} />
        <QuestionTag text="Toujours dispo ?" x={310} y={830} at={130} frame={frame} fps={fps} />
        <QuestionTag text="État réel ?" x={770} y={890} at={165} frame={frame} fps={fps} />

        {insightK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 300,
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
      <Sfx name="pop" at={42} volume={0.35} />
      <Sfx name="pop" at={86} volume={0.35} />
      <Sfx name="pop" at={130} volume={0.35} />
      <Sfx name="notif" at={INSIGHT} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
