import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { ModernSalonSet } from "../../../sets/ModernSalonSet";
import { CharacterG } from "../../../characters/Character";
import { KOFFI } from "../../../characters/bible";
import { EXPRESSIONS } from "../../../characters/expressions";
import { SIT, dynamicPose } from "../../../characters/poses";
import { blink } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 3 V2 — Bruits des voisins & sommeil perturbé (9,5 s / 285 frames)
 */
const KOFFI_PYJAMA = {
  ...KOFFI,
  outfit: { ...KOFFI.outfit, ...KOFFI.outfits?.pyjama },
};

export const Scene3BruitSommeil: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shake = Math.sin(frame * 1.8) * 5;
  const badgeK = spring({ frame: frame - 110, fps, config: { damping: 11, stiffness: 170 } });
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 250, energy: 1.0, gesture: "frustrated" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.1} focusX={540 + shake} focusY={1100}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ModernSalonSet sway={Math.sin(frame / 28) * 2} />

          {[0, 1, 2].map((i) => {
            const r = ((frame * 4.5 + i * 70) % 240) + 40;
            return (
              <circle
                key={i}
                cx={180}
                cy={760}
                r={r}
                fill="none"
                stroke={BRAND.debit}
                strokeWidth={5}
                opacity={Math.max(0, 1 - r / 280) * 0.7}
              />
            );
          })}

          <CharacterG
            spec={KOFFI_PYJAMA}
            x={540}
            y={1650}
            scale={1.25}
            pose={{
              ...SIT,
              ...dyn,
              face: EXPRESSIONS.epuise,
              blink: blink(frame, 2.0),
              sweat: 0.7,
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 460,
            translate: "-50% -50%",
            scale: String(badgeK),
            padding: "22px 40px",
            borderRadius: 28,
            background: "#FFFFFF",
            border: `4px solid ${BRAND.debit}`,
            color: BRAND.debit,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 40,
            textAlign: "center",
            boxShadow: "0 24px 52px -18px rgba(225,29,72,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          Même le sommeil est perturbé !
        </div>
      </Camera>

      <VoiceOver scene="S3-BruitSommeil" />
      <Sfx name="rumble" at={14} volume={0.55} />
      <Sfx name="impact" at={110} volume={0.6} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
