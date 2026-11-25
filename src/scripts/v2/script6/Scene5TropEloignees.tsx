import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { CityAvenueSet } from "../../../sets/CityAvenueSet";
import { CharacterG } from "../../../characters/Character";
import { KOFFI } from "../../../characters/bible";
import { EXPRESSIONS } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { Icon, type IconName } from "../../../vobi-ui/icons";
import { blink } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 5 V2 — Maisons avec cour trop éloignées ou mauvais quartier (16,0 s / 480 frames)
 */
const FarBadge: React.FC<{
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
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 155 } });
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
        gap: 14,
        padding: "16px 26px",
        borderRadius: 24,
        background: "#FFFFFF",
        border: `3px solid ${BRAND.debit}`,
        boxShadow: "0 20px 44px -16px rgba(225,29,72,0.4)",
        whiteSpace: "nowrap",
      }}
    >
      <Icon name={icon} size={28} color={BRAND.debit} stroke={2.5} />
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: BRAND.debit }}>{title}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: BRAND.slate900 }}>{sub}</div>
      </div>
    </div>
  );
};

export const Scene5TropEloignees: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 440, energy: 1.15, gesture: "frustrated" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CityAvenueSet pan={frame * 0.4} sway={Math.sin(frame / 22) * 2} />
          <CharacterG
            spec={KOFFI}
            x={540}
            y={1645}
            scale={1.25}
            pose={{
              ...dyn,
              face: EXPRESSIONS.perplexe,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
              blink: blink(frame, 2.8),
            }}
          />
        </svg>

        <FarBadge icon="user" title="École des enfants" sub="Trop éloignée" x={310} y={480} at={95} frame={frame} fps={fps} />
        <FarBadge icon="building" title="Lieu de travail" sub="Trop loin" x={760} y={620} at={190} frame={frame} fps={fps} />
        <FarBadge icon="mapPin" title="Quartier" sub="Ne te plaît pas" x={540} y={800} at={320} frame={frame} fps={fps} />
      </Camera>

      <VoiceOver scene="S5-TropEloignees" />
      <Sfx name="pop" at={95} volume={0.45} />
      <Sfx name="pop" at={190} volume={0.45} />
      <Sfx name="stamp" at={320} volume={0.65} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
