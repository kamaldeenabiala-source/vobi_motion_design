import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { StreetSet } from "../../sets/Street";
import { CharacterG } from "../../characters/Character";
import { DEMARCHEUR, SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, walkCycle } from "../../characters/poses";
import { EASE, blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 3 — Heures de travail & jours de repos sacrifiés sans résultat (10,5 s / 315 frames)
 */
const TimeBadge: React.FC<{
  title: string;
  sub: string;
  x: number;
  y: number;
  at: number;
  frame: number;
  fps: number;
}> = ({ title, sub, x, y, at, frame, fps }) => {
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
        padding: "16px 28px",
        borderRadius: 24,
        background: "rgba(15,23,42,0.9)",
        border: `3px solid ${BRAND.gold}`,
        color: "#FFFFFF",
        textAlign: "center",
        boxShadow: "0 20px 44px -14px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: BRAND.gold }}>{title}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, marginTop: 2 }}>{sub}</div>
    </div>
  );
};

export const Scene3EmploiDuTemps: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const RESULT_AT = 235;
  const walk = walkCycle(frame, 0.48);
  const fatigue = prog(frame, 120, 260);
  const face = mixFace(
    mixFace(EXPRESSIONS.agace, EXPRESSIONS.epuise, fatigue),
    EXPRESSIONS.choque,
    prog(frame, RESULT_AT, RESULT_AT + 12),
  );

  const demX = interpolate(frame, [0, 35, 110, 145], [1160, 770, 770, 1220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  const resultK = frame >= RESULT_AT ? spring({ frame: frame - RESULT_AT, fps, config: { damping: 10, stiffness: 180 } }) : 0;

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.08} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={frame * 2.5} sway={Math.sin(frame / 20) * 2} />
          {frame < 150 ? (
            <CharacterG
              spec={DEMARCHEUR}
              x={demX}
              y={1620}
              scale={1.24}
              pose={{
                face: EXPRESSIONS.sourireCommercial,
                legL: LIMBS.legStand,
                legR: LIMBS.legStand,
                armL: { a: -25, b: -50 },
                armR: LIMBS.armPhoneR,
                handR: "phone",
                headTurn: -0.35,
                blink: blink(frame, 3.2),
              }}
            />
          ) : null}

          <CharacterG
            spec={SENAN}
            x={420}
            y={1630}
            scale={1.26}
            pose={{
              face,
              legL: frame < RESULT_AT ? walk.legL! : LIMBS.legStand,
              legR: frame < RESULT_AT ? walk.legR! : LIMBS.legStand,
              armL: LIMBS.armRest,
              armR: frame < 140 ? LIMBS.armPhoneR : LIMBS.armRest,
              handR: frame < 140 ? "phone" : "none",
              headTurn: 0.15,
              blink: blink(frame, 2.2),
              sweat: fatigue,
            }}
          />
        </svg>

        <TimeBadge title="HEURES DE TRAVAIL" sub="Prises pour visiter" x={340} y={480} at={75} frame={frame} fps={fps} />
        <TimeBadge title="JOURS DE REPOS" sub="Sacrifiés sans succès" x={720} y={660} at={150} frame={frame} fps={fps} />

        {resultK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 460,
              translate: "-50% -50%",
              scale: String(resultK),
              padding: "24px 44px",
              borderRadius: 28,
              background: "#FFFFFF",
              border: `5px solid ${BRAND.debit}`,
              boxShadow: "0 24px 60px -18px rgba(225,29,72,0.45)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: BRAND.debit }}>0 RÉSULTAT</div>
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S3-EmploiDuTemps" />
      <Sfx name="pop" at={75} volume={0.45} />
      <Sfx name="pop" at={150} volume={0.45} />
      <Sfx name="impact" at={RESULT_AT} volume={0.7} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
