import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { NewHouseSet } from "../../../sets/NewHouse";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { Icon } from "../../../vobi-ui/icons";
import { blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 1 V2 — La maison qui plaît, le loyer qui pèse (9,0 s / 270 frames)
 */
export const Scene1CoupDeCoeur: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const HEART_AT = 22;
  const PRICE_AT = 112;
  const Q_AT = 195;

  const heartK = spring({ frame: frame - HEART_AT, fps, config: { damping: 10, stiffness: 170 } });
  const priceK = frame >= PRICE_AT ? spring({ frame: frame - PRICE_AT, fps, config: { damping: 10, stiffness: 185 } }) : 0;
  const qK = frame >= Q_AT ? spring({ frame: frame - Q_AT, fps, config: { damping: 12, stiffness: 155 } }) : 0;

  let face = mixFace(EXPRESSIONS.ravi, EXPRESSIONS.perplexe, prog(frame, PRICE_AT, PRICE_AT + 20));
  face = mixFace(face, EXPRESSIONS.pourquoi, prog(frame, Q_AT, Q_AT + 14));

  const dyn = dynamicPose(frame, {
    speaking: frame >= 15 && frame < 240,
    energy: 1.15,
    gesture: frame < PRICE_AT ? "excited" : "explain",
  });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.08} focusX={540} focusY={1100}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <NewHouseSet sway={Math.sin(frame / 26) * 2.5} />
          <CharacterG
            spec={AICHA}
            x={540}
            y={1645}
            scale={1.28}
            pose={{
              ...dyn,
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
              blink: blink(frame, 3.0),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 430,
            translate: "-50% -50%",
            scale: String(heartK),
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 34px",
            borderRadius: 999,
            background: "#FFFFFF",
            border: `3px solid ${BRAND.lightGreen}`,
            boxShadow: "0 20px 48px -16px rgba(11,107,79,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          <Icon name="heart" size={34} color={BRAND.debit} fill={BRAND.debit} />
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: BRAND.slate900 }}>
            Coup de cœur !
          </span>
        </div>

        {priceK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 590,
              translate: "-50% -50%",
              transform: `scale(${priceK}) rotate(-3deg)`,
              padding: "20px 40px",
              borderRadius: 24,
              background: BRAND.debit,
              color: "#FFFFFF",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 44,
              boxShadow: "0 24px 52px -16px rgba(225,29,72,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            Loyer : 110 000 FCFA / mois
          </div>
        ) : null}

        {qK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 740,
              translate: "-50% -50%",
              scale: String(qK),
              padding: "14px 32px",
              borderRadius: 999,
              background: BRAND.slate900,
              color: BRAND.gold,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 36,
              opacity: interpolate(qK, [0, 1], [0, 1]),
            }}
          >
            Que faire ?
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S1-CoupDeCoeur" />
      <Sfx name="pop" at={HEART_AT} volume={0.45} />
      <Sfx name="impact" at={PRICE_AT} volume={0.6} />
      <Sfx name="notif" at={Q_AT} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
