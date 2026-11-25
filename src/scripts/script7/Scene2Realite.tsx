import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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
 * SCÈNE 2 — Maisons de tes goûts trop chères, ou dans ton budget mais décevantes (11,0 s / 330 frames)
 */
export const Scene2Realite: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const C1 = 96;
  const C2 = 195;
  const c1K = frame >= C1 ? spring({ frame: frame - C1, fps, config: { damping: 11, stiffness: 165 } }) : 0;
  const c2K = frame >= C2 ? spring({ frame: frame - C2, fps, config: { damping: 11, stiffness: 165 } }) : 0;

  const face = mixFace(EXPRESSIONS.perplexe, EXPRESSIONS.agace, prog(frame, C1, C2));

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1060}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={frame * 0.3} sway={Math.sin(frame / 24) * 2} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1630}
            scale={1.25}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armSpread,
              armR: LIMBS.armRest,
              headTurn: interpolate(frame, [C1, C2], [-0.2, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              blink: blink(frame, 2.8),
            }}
          />
        </svg>

        {c1K > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 280,
              top: 610,
              width: 420,
              translate: "-50% -50%",
              scale: String(c1K),
              background: "#FFFFFF",
              borderRadius: 26,
              padding: 16,
              border: `4px solid ${BRAND.debit}`,
              boxShadow: "0 20px 44px -16px rgba(225,29,72,0.4)",
            }}
          >
            <HouseThumb variant="maisonBasse" width={388} height={220} radius={16} />
            <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: BRAND.slate900 }}>
              À tes goûts…
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: BRAND.debit }}>
              TROP CHÈRE
            </div>
          </div>
        ) : null}

        {c2K > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 800,
              top: 610,
              width: 420,
              translate: "-50% -50%",
              scale: String(c2K),
              background: "#FFFFFF",
              borderRadius: 26,
              padding: 16,
              border: `4px solid ${BRAND.muted}`,
              boxShadow: "0 20px 44px -16px rgba(0,0,0,0.35)",
            }}
          >
            <HouseThumb variant="entreeCouche" width={388} height={220} radius={16} />
            <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: BRAND.slate900 }}>
              Dans ton budget…
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: BRAND.debit }}>
              LOIN DU RÊVE
            </div>
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S2-Realite" />
      <Sfx name="stamp" at={C1} volume={0.6} />
      <Sfx name="stamp" at={C2} volume={0.6} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
