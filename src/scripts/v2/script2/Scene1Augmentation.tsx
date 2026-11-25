import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { ModernSalonSet } from "../../../sets/ModernSalonSet";
import { CharacterG } from "../../../characters/Character";
import { KOFFI } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { HouseBubble } from "../../../props/HouseBubble";
import { Icon, type IconName } from "../../../vobi-ui/icons";
import { EASE, blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 1 V2 — Salaire augmenté & cadre de vie souhaité (15,0 s / 450 frames)
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
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 150 } });
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
        gap: 12,
        padding: "14px 24px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.96)",
        border: `3px solid ${BRAND.lightGreen}`,
        boxShadow: "0 18px 40px -14px rgba(10,61,46,0.3)",
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

  const RAISE_AT = 16;
  const HOUSE_AT = 112;
  const P1 = 175;
  const P2 = 230;
  const P3 = 285;
  const P4 = 340;

  const raiseK = spring({ frame: frame - RAISE_AT, fps, config: { damping: 10, stiffness: 155 } });
  const raiseOut = prog(frame, 95, 114, EASE.inOut);
  const face = mixFace(EXPRESSIONS.ravi, EXPRESSIONS.confiant, prog(frame, HOUSE_AT, HOUSE_AT + 20));
  const dyn = dynamicPose(frame, {
    speaking: frame >= 15 && frame < 410,
    energy: 1.2,
    gesture: frame < HOUSE_AT ? "excited" : "explain",
  });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={interpolate(frame, [0, 45, 380, 450], [1.2, 1.08, 1.08, 1.15], { extrapolateRight: "clamp", easing: EASE.inOut })} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ModernSalonSet sway={Math.sin(frame / 28) * 2.5} />

          {frame >= HOUSE_AT ? (
            <g opacity={prog(frame, HOUSE_AT, HOUSE_AT + 20)}>
              <HouseBubble x={540} y={450} scale={1.0} label="Maison idéale" />
            </g>
          ) : null}

          <CharacterG
            spec={KOFFI}
            x={540}
            y={1645}
            scale={1.3}
            pose={{
              ...dyn,
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: frame < HOUSE_AT ? "thumbUp" : "open",
              handR: "phone",
              blink: blink(frame, 3.2),
            }}
          />
        </svg>

        {raiseOut < 1 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 440,
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

        <EnvPill icon="user" label="École des enfants" x={280} y={640} at={P1} frame={frame} fps={fps} />
        <EnvPill icon="mapPin" label="Route pratique" x={780} y={695} at={P2} frame={frame} fps={fps} />
        <EnvPill icon="building" label="Marchés" x={290} y={825} at={P3} frame={frame} fps={fps} />
        <EnvPill icon="wallet" label="Commerces" x={760} y={880} at={P4} frame={frame} fps={fps} />
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
