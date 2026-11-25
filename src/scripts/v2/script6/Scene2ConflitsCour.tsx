import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { CourtyardSet } from "../../../sets/CourtyardSet";
import { CharacterG } from "../../../characters/Character";
import { KOFFI } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { Moto } from "../../../props/Objects";
import { blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 2 V2 — Cris devant la porte, linge, moto, pas de tranquillité (25,5 s / 765 frames)
 */
const IssueCard: React.FC<{
  title: string;
  sub: string;
  x: number;
  y: number;
  at: number;
  frame: number;
  fps: number;
}> = ({ title, sub, x, y, at, frame, fps }) => {
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
        padding: "18px 28px",
        borderRadius: 24,
        background: "#FFFFFF",
        border: `3px solid ${BRAND.debit}`,
        boxShadow: "0 20px 44px -16px rgba(225,29,72,0.38)",
        textAlign: "center",
        minWidth: 340,
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: BRAND.debit }}>{title}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: BRAND.slate900, marginTop: 2 }}>{sub}</div>
    </div>
  );
};

export const Scene2ConflitsCour: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const face = mixFace(EXPRESSIONS.agace, EXPRESSIONS.epuise, prog(frame, 300, 620));
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 720, energy: 1.15, gesture: "frustrated" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CourtyardSet sway={Math.sin(frame / 22) * 2.5} />

          {frame >= 460 ? (
            <g opacity={prog(frame, 460, 490)}>
              <Moto x={820} y={1570} scale={0.95} wheelRot={0} flip />
            </g>
          ) : null}

          <CharacterG
            spec={KOFFI}
            x={420}
            y={1645}
            scale={1.25}
            pose={{
              ...dyn,
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
              blink: blink(frame, 2.5),
              sweat: prog(frame, 280, 660),
            }}
          />
        </svg>

        <IssueCard title="Cris & disputes" sub="Devant ta porte chaque jour" x={540} y={390} at={28} frame={frame} fps={fps} />
        <IssueCard title="Espace linge" sub="À partager avec tous" x={300} y={590} at={415} frame={frame} fps={fps} />
        <IssueCard title="Garer la moto" sub="Aucun coin tranquille" x={770} y={690} at={505} frame={frame} fps={fps} />
      </Camera>

      <VoiceOver scene="S2-ConflitsCour" />
      <Sfx name="pop" at={28} volume={0.45} />
      <Sfx name="pop" at={415} volume={0.45} />
      <Sfx name="horn" at={505} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
