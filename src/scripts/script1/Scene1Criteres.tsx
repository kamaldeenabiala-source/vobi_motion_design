import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { RoomSet } from "../../sets/Room";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, SIT, mixLimb, walkCycle } from "../../characters/poses";
import { EASE, blink, lerpF, pop, prog } from "../../motion/anim";
import { Icon, type IconName } from "../../vobi-ui/icons";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 1 — Budget & critères définis (7,5 s / 225 frames)
 * Sènan dans sa chambre note son budget, le nombre de chambres et
 * l'environnement idéal. Confiant, il se lève et ouvre la porte.
 */
const CriteriaPill: React.FC<{
  icon: IconName;
  title: string;
  sub: string;
  x: number;
  y: number;
  at: number;
  frame: number;
  fps: number;
}> = ({ icon, title, sub, x, y, at, frame, fps }) => {
  if (frame < at) return null;
  const k = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 150 } });
  const float = Math.sin((frame - at) / 16) * 6;
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
        gap: 16,
        padding: "18px 28px",
        borderRadius: 24,
        background: "rgba(255,255,255,0.95)",
        border: `3px solid ${BRAND.lightGreen}`,
        boxShadow: "0 20px 44px -16px rgba(10, 61, 46, 0.35)",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          background: BRAND.mint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={30} color={BRAND.primary} stroke={2.4} />
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: BRAND.slate900 }}>{title}</div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: BRAND.muted }}>{sub}</div>
      </div>
    </div>
  );
};

export const Scene1Criteres: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PILL1 = 22;
  const PILL2 = 96;
  const PILL3 = 136;
  const STAND = 180;
  const WALK = 194;
  const DOOR = 198;

  const zoom = interpolate(frame, [0, 30, 175, 225], [1.45, 1.15, 1.15, 1.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const focusX = lerpF(frame, [0, 40, 175, 225], [500, 540, 540, 760]);
  const focusY = lerpF(frame, [0, 40], [1160, 1080]);

  const standK = prog(frame, STAND, STAND + 14, EASE.inOut);
  const walkK = prog(frame, WALK, WALK + 8);
  const walk = walkCycle(frame - WALK, 0.42);
  const x = interpolate(frame, [WALK, 225], [430, 690], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.in,
  });
  const feetY = interpolate(standK, [0, 1], [1595, 1640]);
  const fist = pop(frame, fps, PILL3 + 12, { damping: 9 });
  const fistDown = prog(frame, STAND - 6, STAND + 6);

  let face = mixFace(EXPRESSIONS.motive, EXPRESSIONS.confiant, prog(frame, PILL1, PILL1 + 12));
  face = mixFace(face, { ...EXPRESSIONS.confiant, lookY: -0.35, browY: -8 }, prog(frame, PILL2, PILL2 + 12) * (1 - standK));
  face = mixFace(face, { ...EXPRESSIONS.motive, lookX: 0.7 }, standK);

  const sitPose = SIT;
  const thighScale = interpolate(standK, [0, 1], [sitPose.thighScale ?? 1, 1]);
  const legL = mixLimb(sitPose.legL!, walkK > 0 ? walk.legL! : LIMBS.legStand, standK);
  const legR = mixLimb(sitPose.legR!, walkK > 0 ? walk.legR! : LIMBS.legStand, standK);
  const armL = mixLimb(mixLimb(LIMBS.armRest, LIMBS.armFistUp, fist), { a: 12, b: 20 }, fistDown);
  const armR = LIMBS.armPhoneR;

  const flash = interpolate(frame, [DOOR + 8, 218, 225], [0, 0.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={zoom} focusX={focusX} focusY={focusY}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RoomSet
            fanSpin={frame * 34}
            doorOpen={prog(frame, DOOR, DOOR + 12)}
            dawn={interpolate(frame, [0, 140], [0.45, 0.85], { extrapolateRight: "clamp" })}
          />
          <CharacterG
            spec={SENAN}
            x={x}
            y={feetY}
            scale={1.35}
            pose={{
              face,
              thighScale,
              legL,
              legR,
              armL,
              armR,
              handL: fist > 0.3 && fistDown < 0.8 ? "fist" : "none",
              handR: "phone",
              headTurn: interpolate(standK, [0, 1], [0.05, 0.25]),
              blink: blink(frame, 3.2),
            }}
          />
        </svg>

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 1 - standK }}>
          <CriteriaPill icon="wallet" title="Budget défini" sub="Montant mensuel calé" x={340} y={420} at={PILL1} frame={frame} fps={fps} />
          <CriteriaPill icon="bed" title="Nombre de chambres" sub="Adapté à mes besoins" x={680} y={590} at={PILL2} frame={frame} fps={fps} />
          <CriteriaPill icon="mapPin" title="Environnement idéal" sub="Quartier calme & pratique" x={420} y={760} at={PILL3} frame={frame} fps={fps} />
        </div>
      </Camera>

      {flash > 0 ? <AbsoluteFill style={{ background: `rgba(255, 246, 220, ${flash})`, pointerEvents: "none" }} /> : null}
      <VoiceOver scene="S1-Criteres" />
      <Sfx name="pop" at={PILL1} volume={0.45} />
      <Sfx name="pop" at={PILL2} volume={0.45} />
      <Sfx name="pop" at={PILL3} volume={0.45} />
      <Sfx name="flash" at={DOOR + 6} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
