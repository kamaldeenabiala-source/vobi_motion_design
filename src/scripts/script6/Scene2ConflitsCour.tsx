import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { StreetSet } from "../../sets/Street";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { Moto } from "../../props/Objects";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 2 — Cris devant la porte, linge, moto, pas de tranquillité (19,5 s / 585 frames)
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
  const k = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 165 } });
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

  const face = mixFace(EXPRESSIONS.agace, EXPRESSIONS.epuise, prog(frame, 240, 480));

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={0} sway={Math.sin(frame / 22) * 2} />

          {/* Moto garée dans la cour encombrée */}
          {frame >= 360 ? (
            <g opacity={prog(frame, 360, 385)}>
              <Moto x={820} y={1560} scale={0.95} wheelRot={0} flip />
            </g>
          ) : null}

          <CharacterG
            spec={SENAN}
            x={420}
            y={1630}
            scale={1.25}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armSpread,
              armR: LIMBS.armRest,
              headTurn: 0.12,
              blink: blink(frame, 2.5),
              sweat: prog(frame, 220, 520),
            }}
          />
        </svg>

        <IssueCard title="Cris & disputes" sub="Devant ta porte chaque jour" x={540} y={400} at={22} frame={frame} fps={fps} />
        <IssueCard title="Espace linge" sub="À partager avec tous" x={300} y={600} at={325} frame={frame} fps={fps} />
        <IssueCard title="Garer la moto" sub="Aucun coin tranquille" x={770} y={700} at={395} frame={frame} fps={fps} />
      </Camera>

      <VoiceOver scene="S2-ConflitsCour" />
      <Sfx name="pop" at={22} volume={0.45} />
      <Sfx name="pop" at={325} volume={0.45} />
      <Sfx name="horn" at={395} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
