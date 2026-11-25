import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { NewHouseSet } from "../../../sets/NewHouse";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { ConclusionCardV2 } from "../../../vobi-ui/ConclusionCardV2";
import { Icon } from "../../../vobi-ui/icons";
import { EASE, blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 7 V2 — Conclusion & « VOBI bientôt disponible » (12,0 s / 360 frames)
 */
export const Scene7Conclusion: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CARD_AT = 205;
  const cardK = prog(frame, CARD_AT, CARD_AT + 18, EASE.inOut);
  const pillK = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 155 } });
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < CARD_AT, energy: 1.25, gesture: "excited" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.08} focusX={540} focusY={1120}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <NewHouseSet sway={Math.sin(frame / 26) * 2.5} />
          <CharacterG
            spec={AICHA}
            x={540}
            y={1645}
            scale={1.26}
            pose={{
              ...dyn,
              face: EXPRESSIONS.ravi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "thumbUp",
              handR: "phone",
              blink: blink(frame, 3.0),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 290,
            translate: "-50% -50%",
            scale: String(pillK),
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 32px",
            borderRadius: 999,
            background: "#FFFFFF",
            border: `3px solid ${BRAND.lightGreen}`,
            boxShadow: "0 20px 44px -16px rgba(11,107,79,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 99,
              background: BRAND.emerald,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="check" size={26} color="#FFFFFF" stroke={3} />
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: BRAND.primary }}>
            Zéro déplacement inutile
          </span>
        </div>
      </Camera>

      {cardK > 0 ? (
        <ConclusionCardV2
          startFrame={CARD_AT}
          opacity={cardK}
          headline={
            <>
              Zéro temps perdu.
              <br />
              <span style={{ color: BRAND.primary }}>Zéro dépense inutile.</span>
            </>
          }
        />
      ) : null}

      <VoiceOver scene="S7-Conclusion" dark />
      <Sfx name="sparkle" at={20} volume={0.5} />
      <Sfx name="swoosh" at={CARD_AT} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
