import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { ShadeSet } from "../../sets/Shade";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 4 — Pas forcément ! Le problème, ce sont les offres limitées (12,0 s / 360 frames)
 */
export const Scene4OffresLimitees: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ansK = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 185 } });
  const limK = frame >= 125 ? spring({ frame: frame - 125, fps, config: { damping: 12, stiffness: 160 } }) : 0;
  const mktK = frame >= 225 ? spring({ frame: frame - 225, fps, config: { damping: 12, stiffness: 160 } }) : 0;

  const face = mixFace(EXPRESSIONS.impressionne, EXPRESSIONS.ravi, prog(frame, 200, 260));

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ShadeSet sway={Math.sin(frame / 28) * 2} brand={0.95} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.25}
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

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 260,
            translate: "-50% -50%",
            scale: String(ansK),
            padding: "20px 44px",
            borderRadius: 999,
            background: BRAND.primary,
            color: "#FFFFFF",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 48,
            boxShadow: "0 20px 48px -16px rgba(11,107,79,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          Pas forcément !
        </div>

        {limK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 470,
              translate: "-50% -50%",
              scale: String(limK),
              padding: "18px 34px",
              borderRadius: 24,
              background: "#FFFFFF",
              border: `3px solid ${BRAND.debit}`,
              color: BRAND.slate900,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 32,
              textAlign: "center",
              boxShadow: "0 18px 40px -14px rgba(0,0,0,0.22)",
              whiteSpace: "nowrap",
            }}
          >
            Proches · Annonces · On-dit = offres limitées
          </div>
        ) : null}

        {mktK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 630,
              translate: "-50% -50%",
              scale: String(mktK),
              padding: "20px 36px",
              borderRadius: 24,
              background: BRAND.mint,
              border: `3px solid ${BRAND.emerald}`,
              color: BRAND.primary,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 34,
              textAlign: "center",
              boxShadow: "0 18px 40px -14px rgba(5,150,105,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            Le marché a déjà ce qu’il te faut !
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S4-OffresLimitees" dark />
      <Sfx name="sparkle" at={8} volume={0.55} />
      <Sfx name="pop" at={125} volume={0.45} />
      <Sfx name="check" at={225} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
