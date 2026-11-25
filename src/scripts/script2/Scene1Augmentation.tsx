import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { RoomSet } from "../../sets/Room";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, mixLimb } from "../../characters/poses";
import { HouseBubble } from "../../props/HouseBubble";
import { Icon, type IconName } from "../../vobi-ui/icons";
import { EASE, blink, pop, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 1 — Salaire augmenté & cadre de vie souhaité (11,5 s / 345 frames)
 */
const EnvPill: React.FC<{
  icon: IconName;
  label: string;
  x: number;
  y: number;
  at: number;
  frame: number;
  fps: number;
}> = ({ icon, label, x, y, at, frame, fps }) => {
  if (frame < at) return null;
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 160 } });
  const float = Math.sin((frame - at) / 15) * 6;
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
        background: "rgba(255,255,255,0.95)",
        border: `3px solid ${BRAND.lightGreen}`,
        boxShadow: "0 18px 40px -14px rgba(10,61,46,0.35)",
        whiteSpace: "nowrap",
      }}
    >
      <Icon name={icon} size={28} color={BRAND.primary} stroke={2.4} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: BRAND.slate900 }}>{label}</span>
    </div>
  );
};

export const Scene1Augmentation: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const RAISE_AT = 12;
  const HOUSE_AT = 88;
  const P1 = 140;
  const P2 = 185;
  const P3 = 230;
  const P4 = 272;

  const raiseK = spring({ frame: frame - RAISE_AT, fps, config: { damping: 10, stiffness: 160 } });
  const raiseOut = prog(frame, 75, 92, EASE.inOut);
  const fist = pop(frame, fps, RAISE_AT + 4, { damping: 9 });
  const fistDown = prog(frame, 68, 86);

  const face = mixFace(
    EXPRESSIONS.ravi,
    EXPRESSIONS.confiant,
    prog(frame, HOUSE_AT, HOUSE_AT + 16),
  );

  const armL = mixLimb(mixLimb(LIMBS.armRest, LIMBS.armFistUp, fist), LIMBS.armRest, fistDown);

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={interpolate(frame, [0, 35, 290, 345], [1.22, 1.1, 1.1, 1.18], { extrapolateRight: "clamp", easing: EASE.inOut })} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RoomSet fanSpin={frame * 32} dawn={0.75} />

          {frame >= HOUSE_AT ? (
            <g opacity={prog(frame, HOUSE_AT, HOUSE_AT + 18)}>
              <HouseBubble x={540} y={470} scale={1.0} label="Maison idéale" />
            </g>
          ) : null}

          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.32}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL,
              armR: LIMBS.armPhoneR,
              handL: fist > 0.3 && fistDown < 0.8 ? "fist" : "none",
              handR: "phone",
              headTurn: 0.08,
              blink: blink(frame, 3.2),
            }}
          />
        </svg>

        {raiseOut < 1 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 460,
              translate: "-50% -50%",
              scale: String(raiseK),
              opacity: 1 - raiseOut,
              padding: "22px 42px",
              borderRadius: 28,
              background: BRAND.emerald,
              color: "#FFFFFF",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 48,
              boxShadow: "0 24px 52px -16px rgba(5,150,105,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            + SALAIRE AUGMENTÉ !
          </div>
        ) : null}

        <EnvPill icon="user" label="École des enfants" x={280} y={660} at={P1} frame={frame} fps={fps} />
        <EnvPill icon="mapPin" label="Route pratique" x={780} y={710} at={P2} frame={frame} fps={fps} />
        <EnvPill icon="building" label="Marchés" x={290} y={840} at={P3} frame={frame} fps={fps} />
        <EnvPill icon="wallet" label="Commerces" x={760} y={890} at={P4} frame={frame} fps={fps} />
      </Camera>

      <VoiceOver scene="S1-Augmentation" />
      <Sfx name="sparkle" at={RAISE_AT} volume={0.55} />
      <Sfx name="pop" at={HOUSE_AT} volume={0.45} />
      <Sfx name="pop" at={P1} volume={0.4} />
      <Sfx name="pop" at={P2} volume={0.4} />
      <Sfx name="pop" at={P3} volume={0.4} />
      <Sfx name="pop" at={P4} volume={0.4} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
