import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { CrossroadSet } from "../../sets/Crossroad";
import { ShadeSet } from "../../sets/Shade";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { HouseBubble } from "../../props/HouseBubble";
import { EASE, blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 4 — Le bon logement existe peut-être : s'informer avant de décider (16,5 s / 495 frames)
 */
export const Scene4Visibilite: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PIVOT = 320;
  const pivotK = prog(frame, PIVOT - 16, PIVOT + 12, EASE.inOut);
  const bubbleK = frame >= 150 ? spring({ frame: frame - 150, fps, config: { damping: 12, stiffness: 140 } }) : 0;
  const infoK = frame >= PIVOT + 12 ? spring({ frame: frame - (PIVOT + 12), fps, config: { damping: 12, stiffness: 160 } }) : 0;

  const face = mixFace(EXPRESSIONS.perplexe, EXPRESSIONS.impressionne, prog(frame, 150, PIVOT));

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          {pivotK < 1 ? (
            <g opacity={1 - pivotK}>
              <CrossroadSet />
            </g>
          ) : null}
          {pivotK > 0 ? (
            <g opacity={pivotK}>
              <ShadeSet sway={Math.sin(frame / 28) * 2} brand={0.95} />
            </g>
          ) : null}

          {bubbleK > 0 ? (
            <g opacity={interpolate(bubbleK, [0, 1], [0, 1])}>
              <HouseBubble x={540} y={470} scale={1.05} label="Loyer adapté !" />
            </g>
          ) : null}

          <CharacterG
            spec={SENAN}
            x={540}
            y={1620}
            scale={1.26}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armRest,
              armR: LIMBS.armRest,
              headTurn: 0.06,
              blink: blink(frame, 3.0),
            }}
          />
        </svg>

        {infoK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 260,
              translate: "-50% -50%",
              scale: String(infoK),
              padding: "20px 38px",
              borderRadius: 999,
              background: BRAND.primary,
              color: "#FFFFFF",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 36,
              boxShadow: "0 20px 48px -16px rgba(11,107,79,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            Bien s’informer avant de décider
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S4-Visibilite" dark={pivotK > 0.5} />
      <Sfx name="pop" at={150} volume={0.45} />
      <Sfx name="sparkle" at={PIVOT} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
