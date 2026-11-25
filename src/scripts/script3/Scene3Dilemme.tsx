import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { StreetSet } from "../../sets/Street";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { HouseThumb } from "../../vobi-ui/HouseThumb";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 3 — Le dilemme : accepter et se priver, ou continuer à chercher ? (13,5 s / 405 frames)
 */
export const Scene3Dilemme: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const LEFT_AT = 18;
  const RIGHT_AT = 180;

  const leftK = spring({ frame: frame - LEFT_AT, fps, config: { damping: 12, stiffness: 150 } });
  const rightK = frame >= RIGHT_AT ? spring({ frame: frame - RIGHT_AT, fps, config: { damping: 12, stiffness: 150 } }) : 0;

  const face = mixFace(
    EXPRESSIONS.agace,
    EXPRESSIONS.pourquoi,
    prog(frame, RIGHT_AT, RIGHT_AT + 24),
  );

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={frame * 0.25} sway={Math.sin(frame / 24) * 2} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.26}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armSpread,
              armR: LIMBS.armSpread,
              headTurn: Math.sin(frame / 20) * 0.25,
              blink: blink(frame, 2.8),
            }}
          />
        </svg>

        {/* Option A : Moins chère mais ne plaît pas */}
        <div
          style={{
            position: "absolute",
            left: 280,
            top: 600,
            width: 420,
            translate: "-50% -50%",
            scale: String(leftK),
            background: "#FFFFFF",
            borderRadius: 26,
            padding: 16,
            border: `3px solid ${BRAND.muted}`,
            boxShadow: "0 20px 44px -16px rgba(0,0,0,0.35)",
          }}
        >
          <HouseThumb variant="entreeCouche" width={388} height={220} radius={16} />
          <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: BRAND.slate900 }}>
            Moins chère…
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: BRAND.debit }}>
            Mais ne te plaît pas
          </div>
        </div>

        {/* Option B : Plaît mais coûte trop cher */}
        {rightK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 800,
              top: 600,
              width: 420,
              translate: "-50% -50%",
              scale: String(rightK),
              background: "#FFFFFF",
              borderRadius: 26,
              padding: 16,
              border: `3px solid ${BRAND.debit}`,
              boxShadow: "0 20px 44px -16px rgba(225,29,72,0.35)",
            }}
          >
            <HouseThumb variant="maisonBasse" width={388} height={220} radius={16} />
            <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: BRAND.slate900 }}>
              Elle te plaît…
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: BRAND.debit }}>
              Mais il faut se priver
            </div>
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S3-Dilemme" />
      <Sfx name="pop" at={LEFT_AT} volume={0.45} />
      <Sfx name="pop" at={RIGHT_AT} volume={0.45} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
