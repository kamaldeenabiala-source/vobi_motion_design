import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { ShadeSet } from "../../sets/Shade";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { Icon } from "../../vobi-ui/icons";
import { blink } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 6 (Script 4) — Plus d'offres, plus de possibilités (5,0 s / 150 frames)
 */
export const Scene6PlusDOffres: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const b1K = spring({ frame: frame - 12, fps, config: { damping: 12, stiffness: 165 } });
  const b2K = spring({ frame: frame - 52, fps, config: { damping: 12, stiffness: 165 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ShadeSet sway={Math.sin(frame / 26) * 2} brand={1} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1640}
            scale={1.24}
            pose={{
              face: EXPRESSIONS.ravi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: { a: -25, b: -50 },
              armR: LIMBS.armPhoneR,
              handR: "phone",
              headTurn: 0.06,
              blink: blink(frame, 3.2),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 470,
            translate: "-50% -50%",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            width: 780,
          }}
        >
          {[
            { k: b1K, text: "Plus d’offres disponibles" },
            { k: b2K, text: "Plus de possibilités pour choisir" },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                scale: String(item.k),
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "24px 34px",
                borderRadius: 28,
                background: "#FFFFFF",
                border: `3px solid ${BRAND.emerald}`,
                boxShadow: "0 22px 48px -18px rgba(5,150,105,0.4)",
              }}
            >
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 99,
                  background: BRAND.emerald,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="check" size={30} color="#FFFFFF" stroke={3} />
              </span>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: BRAND.slate900 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </Camera>

      <VoiceOver scene="S6-PlusDOffres" dark />
      <Sfx name="check" at={12} volume={0.5} />
      <Sfx name="check" at={52} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
