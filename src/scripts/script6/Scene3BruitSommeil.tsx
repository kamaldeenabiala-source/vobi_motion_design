import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { RoomSet } from "../../sets/Room";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS } from "../../characters/expressions";
import { SIT } from "../../characters/poses";
import { blink } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 3 — Bruits des voisins & sommeil perturbé (7,0 s / 210 frames)
 */
const SENAN_PYJAMA = {
  ...SENAN,
  outfit: { ...SENAN.outfit, ...SENAN.outfits?.pyjama },
};

export const Scene3BruitSommeil: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shake = Math.sin(frame * 1.9) * 6;
  const badgeK = spring({ frame: frame - 85, fps, config: { damping: 10, stiffness: 180 } });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.12} focusX={540 + shake} focusY={1100}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RoomSet fanSpin={frame * 24} dawn={0.12} />

          {/* Ondes sonores qui traversent le mur */}
          {[0, 1, 2].map((i) => {
            const r = ((frame * 5 + i * 70) % 240) + 40;
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
            spec={SENAN_PYJAMA}
            x={540}
            y={1610}
            scale={1.26}
            pose={{
              ...SIT,
              face: EXPRESSIONS.epuise,
              armL: { a: -35, b: -110 },
              armR: { a: 35, b: -110 },
              headTurn: 0.04,
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
      <Sfx name="rumble" at={12} volume={0.55} />
      <Sfx name="impact" at={85} volume={0.6} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
