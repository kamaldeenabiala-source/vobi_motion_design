import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { ModernSalonSet } from "../../../sets/ModernSalonSet";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, dynamicPose, walkCycle } from "../../../characters/poses";
import { EASE, blink, lerpF, prog } from "../../../motion/anim";
import { Icon, type IconName } from "../../../vobi-ui/icons";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 1 V2 — Budget & critères dans le salon moderne (10,0 s / 300 frames)
 * Personnage : Aïcha (animation dynamique continue).
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
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 135 } });
  const float = Math.sin((frame - at) / 18) * 6;
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
        background: "rgba(255,255,255,0.96)",
        border: `3px solid ${BRAND.lightGreen}`,
        boxShadow: "0 20px 44px -16px rgba(10, 61, 46, 0.3)",
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

  const PILL1 = 26;
  const PILL2 = 128;
  const PILL3 = 185;
  const WALK = 248;

  const zoom = interpolate(frame, [0, 45, 240, 300], [1.22, 1.08, 1.08, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const focusX = lerpF(frame, [0, 45, 240, 300], [520, 540, 540, 620]);

  const isWalking = frame >= WALK;
  const walk = walkCycle(frame - WALK, 0.36);
  const x = interpolate(frame, [WALK, 300], [500, 760], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  const dyn = dynamicPose(frame, {
    speaking: frame >= 15 && frame < 250,
    energy: 1.15,
    gesture: frame < PILL3 ? "explain" : "excited",
  });

  const face = mixFace(
    EXPRESSIONS.motive,
    EXPRESSIONS.confiant,
    prog(frame, PILL1, PILL1 + 20),
  );

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={zoom} focusX={focusX} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ModernSalonSet sway={Math.sin(frame / 28) * 2.5} />
          <CharacterG
            spec={AICHA}
            x={x}
            y={1645}
            scale={1.3}
            pose={{
              ...dyn,
              face,
              legL: isWalking ? walk.legL! : LIMBS.legStand,
              legR: isWalking ? walk.legR! : LIMBS.legStand,
              bob: isWalking ? walk.bob : dyn.bob,
              handL: "open",
              handR: "phone",
              blink: blink(frame, 3.0),
            }}
          />
        </svg>

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 1 - prog(frame, WALK, WALK + 20) }}>
          <CriteriaPill icon="wallet" title="Budget défini" sub="Montant mensuel calé" x={330} y={390} at={PILL1} frame={frame} fps={fps} />
          <CriteriaPill icon="bed" title="Nombre de chambres" sub="Adapté à mes besoins" x={700} y={565} at={PILL2} frame={frame} fps={fps} />
          <CriteriaPill icon="mapPin" title="Environnement idéal" sub="Quartier calme & pratique" x={440} y={740} at={PILL3} frame={frame} fps={fps} />
        </div>
      </Camera>

      <VoiceOver scene="S1-Criteres" />
      <Sfx name="pop" at={PILL1} volume={0.45} />
      <Sfx name="pop" at={PILL2} volume={0.45} />
      <Sfx name="pop" at={PILL3} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
