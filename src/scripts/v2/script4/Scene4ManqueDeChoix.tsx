import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { CourtyardSet } from "../../../sets/CourtyardSet";
import { ShadeSet } from "../../../sets/Shade";
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
 * SCÈNE 4 V2 (Script 4) — Et si le problème venait du manque de choix ? (17,5 s / 525 frames)
 */
export const Scene4ManqueDeChoix: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PIVOT = 225;
  const pivotK = prog(frame, PIVOT - 16, PIVOT + 14, EASE.inOut);
  const qK = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 150 } });
  const bubbleK = frame >= PIVOT + 16 ? spring({ frame: frame - (PIVOT + 16), fps, config: { damping: 12, stiffness: 140 } }) : 0;

  const face = mixFace(EXPRESSIONS.pourquoi, EXPRESSIONS.impressionne, prog(frame, PIVOT, PIVOT + 26));
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 480, energy: 1.15, gesture: "explain" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          {pivotK < 1 ? (
            <g opacity={1 - pivotK}>
              <CourtyardSet sway={Math.sin(frame / 24) * 2} />
            </g>
          ) : null}
          {pivotK > 0 ? (
            <g opacity={pivotK}>
              <ShadeSet sway={Math.sin(frame / 28) * 2} brand={0.95} />
            </g>
          ) : null}

          {bubbleK > 0 ? (
            <g opacity={interpolate(bubbleK, [0, 1], [0, 1])}>
              <HouseBubble x={540} y={460} scale={1.05} label="À découvrir !" />
            </g>
          ) : null}

          <CharacterG
            spec={AICHA}
            x={540}
            y={1645}
            scale={1.26}
            pose={{
              ...dyn,
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
              blink: blink(frame, 3.0),
            }}
          />
        </svg>

        {pivotK < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 380,
              translate: "-50% -50%",
              scale: String(qK),
              opacity: 1 - pivotK,
              padding: "20px 38px",
              borderRadius: 28,
              background: "rgba(15,23,42,0.9)",
              border: `3px solid ${BRAND.gold}`,
              color: "#FFFFFF",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 38,
              textAlign: "center",
              maxWidth: 820,
              boxShadow: "0 20px 44px -14px rgba(0,0,0,0.45)",
            }}
          >
            Manque de choix ?
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S4-ManqueDeChoix" dark={pivotK > 0.5} />
      <Sfx name="notif" at={16} volume={0.5} />
      <Sfx name="sparkle" at={PIVOT} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
