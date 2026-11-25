import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { CrossroadSet } from "../../sets/Crossroad";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { blink } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 3 — Faut-il forcément dépenser beaucoup d'argent ? (6,0 s / 180 frames)
 */
export const Scene3QuestionPrix: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const qK = spring({ frame: frame - 24, fps, config: { damping: 11, stiffness: 165 } });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.08} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CrossroadSet />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1620}
            scale={1.26}
            pose={{
              face: EXPRESSIONS.pourquoi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armSpread,
              armR: LIMBS.armSpread,
              headTurn: 0.05,
              blink: blink(frame, 2.8),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 460,
            translate: "-50% -50%",
            scale: String(qK),
            padding: "26px 40px",
            borderRadius: 30,
            background: "rgba(15,23,42,0.9)",
            border: `3px solid ${BRAND.gold}`,
            color: "#FFFFFF",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 40,
            lineHeight: 1.25,
            textAlign: "center",
            maxWidth: 820,
            boxShadow: "0 24px 52px -18px rgba(0,0,0,0.45)",
          }}
        >
          Faut-il forcément dépenser beaucoup ?
        </div>
      </Camera>

      <VoiceOver scene="S3-QuestionPrix" />
      <Sfx name="notif" at={24} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
