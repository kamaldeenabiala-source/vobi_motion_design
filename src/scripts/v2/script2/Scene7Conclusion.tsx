import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { NewHouseSet } from "../../../sets/NewHouse";
import { CharacterG } from "../../../characters/Character";
import { KOFFI } from "../../../characters/bible";
import { EXPRESSIONS } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { ConclusionCardV2 } from "../../../vobi-ui/ConclusionCardV2";
import { EASE, blink, prog } from "../../../motion/anim";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 7 V2 — Conclusion & « VOBI bientôt disponible » (10,0 s / 300 frames)
 */
export const Scene7Conclusion: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();

  const CARD_AT = 138;
  const cardK = prog(frame, CARD_AT, CARD_AT + 18, EASE.inOut);
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < CARD_AT, energy: 1.2, gesture: "excited" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.08} focusX={540} focusY={1120}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <NewHouseSet sway={Math.sin(frame / 26) * 2.5} />
          <CharacterG
            spec={KOFFI}
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
              blink: blink(frame, 3.2),
            }}
          />
        </svg>
      </Camera>

      {cardK > 0 ? (
        <ConclusionCardV2
          startFrame={CARD_AT}
          opacity={cardK}
          headline={
            <>
              Les logements viennent à toi,
              <br />
              <span style={{ color: BRAND.primary }}>pas le contraire.</span>
            </>
          }
        />
      ) : null}

      <VoiceOver scene="S7-Conclusion" dark />
      <Sfx name="sparkle" at={14} volume={0.5} />
      <Sfx name="swoosh" at={CARD_AT} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
