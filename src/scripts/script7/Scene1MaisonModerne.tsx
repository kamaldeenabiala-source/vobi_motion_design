import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { NewHouseSet } from "../../sets/NewHouse";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { HouseBubble } from "../../props/HouseBubble";
import { HouseThumb } from "../../vobi-ui/HouseThumb";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 1 — Le rêve d'une maison moderne & photos enregistrées (15,5 s / 465 frames)
 */
const FeaturePill: React.FC<{ label: string; x: number; y: number; at: number; frame: number; fps: number }> = ({
  label,
  x,
  y,
  at,
  frame,
  fps,
}) => {
  if (frame < at) return null;
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 165 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: String(k),
        padding: "14px 26px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.95)",
        border: `3px solid ${BRAND.lightGreen}`,
        color: BRAND.primary,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 30,
        boxShadow: "0 18px 40px -14px rgba(11,107,79,0.4)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

export const Scene1MaisonModerne: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PART2 = 230;
  const inPart2 = prog(frame, PART2, PART2 + 16);

  const p1 = frame >= PART2 + 24 ? spring({ frame: frame - (PART2 + 24), fps, config: { damping: 12, stiffness: 160 } }) : 0;
  const p2 = frame >= PART2 + 64 ? spring({ frame: frame - (PART2 + 64), fps, config: { damping: 12, stiffness: 160 } }) : 0;

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <NewHouseSet sway={Math.sin(frame / 28) * 2} />
          <HouseBubble x={540} y={400} scale={1.02} label="Maison moderne" />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.25}
            pose={{
              face: EXPRESSIONS.ravi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armRest,
              armR: LIMBS.armPhoneR,
              handR: "phone",
              headTurn: 0.08,
              blink: blink(frame, 3.2),
            }}
          />
        </svg>

        {inPart2 < 1 ? (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - inPart2, pointerEvents: "none" }}>
            <FeaturePill label="Beau salon" x={290} y={640} at={42} frame={frame} fps={fps} />
            <FeaturePill label="Cuisine aménagée" x={760} y={710} at={86} frame={frame} fps={fps} />
            <FeaturePill label="Belles chambres" x={450} y={840} at={130} frame={frame} fps={fps} />
          </div>
        ) : null}

        {frame >= PART2 ? (
          <div style={{ position: "absolute", inset: 0, opacity: inPart2, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                left: 310,
                top: 720,
                translate: "-50% -50%",
                transform: `rotate(-7deg) scale(${p1})`,
                background: "#FFFFFF",
                padding: 14,
                borderRadius: 20,
                boxShadow: "0 20px 44px -16px rgba(0,0,0,0.35)",
              }}
            >
              <HouseThumb variant="maisonBasse" width={340} height={220} radius={12} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 770,
                top: 760,
                translate: "-50% -50%",
                transform: `rotate(6deg) scale(${p2})`,
                background: "#FFFFFF",
                padding: 14,
                borderRadius: 20,
                boxShadow: "0 20px 44px -16px rgba(0,0,0,0.35)",
              }}
            >
              <HouseThumb variant="chambreSalon" width={340} height={220} radius={12} />
            </div>
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S1-MaisonModerne" />
      <Sfx name="sparkle" at={14} volume={0.5} />
      <Sfx name="pop" at={42} volume={0.4} />
      <Sfx name="pop" at={86} volume={0.4} />
      <Sfx name="pop" at={130} volume={0.4} />
      <Sfx name="pop" at={PART2 + 24} volume={0.45} />
      <Sfx name="pop" at={PART2 + 64} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
