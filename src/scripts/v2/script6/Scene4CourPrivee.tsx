import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { NewHouseSet } from "../../../sets/NewHouse";
import { CharacterG } from "../../../characters/Character";
import { KOFFI } from "../../../characters/bible";
import { EXPRESSIONS } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { HouseBubble } from "../../../props/HouseBubble";
import { Icon } from "../../../vobi-ui/icons";
import { blink } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 4 V2 — Le besoin d'une maison avec cour privée (16,0 s / 480 frames)
 */
export const Scene4CourPrivee: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const b1 = frame >= 180 ? spring({ frame: frame - 180, fps, config: { damping: 12, stiffness: 155 } }) : 0;
  const b2 = frame >= 270 ? spring({ frame: frame - 270, fps, config: { damping: 12, stiffness: 155 } }) : 0;
  const b3 = frame >= 360 ? spring({ frame: frame - 360, fps, config: { damping: 12, stiffness: 155 } }) : 0;
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 440, energy: 1.15, gesture: "explain" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <NewHouseSet sway={Math.sin(frame / 28) * 2.5} />
          <HouseBubble x={540} y={420} scale={1.02} label="Cour privée !" />
          <CharacterG
            spec={KOFFI}
            x={540}
            y={1645}
            scale={1.25}
            pose={{
              ...dyn,
              face: EXPRESSIONS.soulage,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
              blink: blink(frame, 3.2),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 730,
            translate: "-50% -50%",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            width: 720,
          }}
        >
          {[
            { k: b1, text: "Enfants libres de jouer" },
            { k: b2, text: "Temps calme en famille" },
            { k: b3, text: "Chacun son espace" },
          ].map((item) =>
            item.k > 0 ? (
              <div
                key={item.text}
                style={{
                  scale: String(item.k),
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 28px",
                  borderRadius: 24,
                  background: "#FFFFFF",
                  border: `3px solid ${BRAND.emerald}`,
                  boxShadow: "0 18px 40px -16px rgba(5,150,105,0.4)",
                }}
              >
                <span style={{ width: 44, height: 44, borderRadius: 99, background: BRAND.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="check" size={26} color="#FFFFFF" stroke={3} />
                </span>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: BRAND.slate900 }}>{item.text}</span>
              </div>
            ) : null,
          )}
        </div>
      </Camera>

      <VoiceOver scene="S4-CourPrivee" />
      <Sfx name="sparkle" at={16} volume={0.5} />
      <Sfx name="check" at={180} volume={0.45} />
      <Sfx name="check" at={270} volume={0.45} />
      <Sfx name="check" at={360} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
