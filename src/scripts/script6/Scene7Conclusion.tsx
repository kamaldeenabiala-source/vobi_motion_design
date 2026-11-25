import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { NewHouseSet } from "../../sets/NewHouse";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { VobiLogo } from "../../vobi-ui/Brand";
import { EASE, blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND, CTA, GRADIENTS } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 7 — Conclusion & signature (6,5 s / 195 frames)
 */
export const Scene7Conclusion: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CARD_AT = 104;
  const cardK = prog(frame, CARD_AT, CARD_AT + 16, EASE.inOut);
  const logoK = frame >= CARD_AT ? spring({ frame: frame - CARD_AT - 4, fps, config: { damping: 12, stiffness: 150 } }) : 0;
  const btnK = frame >= CARD_AT + 22 ? spring({ frame: frame - (CARD_AT + 22), fps, config: { damping: 11, stiffness: 170 } }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.08} focusX={540} focusY={1140}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <NewHouseSet sway={Math.sin(frame / 26) * 2} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.24}
            pose={{
              face: EXPRESSIONS.ravi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: { a: -25, b: -50 },
              armR: LIMBS.armPhoneR,
              handR: "phone",
              headTurn: 0.08,
              blink: blink(frame, 3.2),
            }}
          />
        </svg>
      </Camera>

      {cardK > 0 ? (
        <AbsoluteFill
          style={{
            backgroundColor: BRAND.background,
            opacity: cardK,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 72,
            gap: 42,
          }}
        >
          <div style={{ scale: String(logoK) }}>
            <VobiLogo height={116} />
          </div>

          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 42,
              lineHeight: 1.25,
              color: BRAND.slate900,
              textAlign: "center",
              maxWidth: 840,
              opacity: interpolate(frame, [CARD_AT + 10, CARD_AT + 26], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Découvre plus de logements
            <br />
            <span style={{ color: BRAND.primary }}>pour trouver celui qui te convient vraiment.</span>
          </div>

          <div
            style={{
              scale: String(btnK),
              padding: "24px 56px",
              borderRadius: 999,
              background: GRADIENTS.primary,
              color: "#FFFFFF",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 40,
              boxShadow: "0 20px 50px -15px rgba(5,150,105,0.55)",
            }}
          >
            {CTA.button}
          </div>

          {CTA.url ? (
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: BRAND.muted }}>{CTA.url}</div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      <VoiceOver scene="S7-Conclusion" dark />
      <Sfx name="sparkle" at={14} volume={0.5} />
      <Sfx name="swoosh" at={CARD_AT} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
