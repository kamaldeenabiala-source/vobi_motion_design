import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { CityAvenueSet } from "../../../sets/CityAvenueSet";
import { CharacterG } from "../../../characters/Character";
import { AICHA, DEMARCHEUR, ZEM } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, RIDE, dynamicPose, walkCycle } from "../../../characters/poses";
import { Moto } from "../../../props/Objects";
import { FlyingBill } from "../../../props/Money";
import { EASE, blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 3 V2 — Démarcheurs, déplacements & dépenses sans résultat (13,5 s / 405 frames)
 */
export const Scene3Boucle: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ZEM_START = 148;
  const ZEM_END = 290;
  const RESULT_AT = 310;

  const isRiding = frame >= ZEM_START && frame < ZEM_END;
  const pan = isRiding ? (frame - ZEM_START) * 8 : frame * 2.0;

  const walk = walkCycle(frame, 0.42);
  const fatigue = prog(frame, 210, 360);

  let face = mixFace(EXPRESSIONS.agace, EXPRESSIONS.epuise, fatigue);
  if (frame >= RESULT_AT) {
    face = mixFace(face, EXPRESSIONS.choque, prog(frame, RESULT_AT, RESULT_AT + 14));
  }

  const zemX = interpolate(frame, [ZEM_START, ZEM_END], [-180, 1280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const demX = interpolate(frame, [0, 38, 120, 152], [1180, 760, 760, 1220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  const dyn = dynamicPose(frame, {
    speaking: frame >= 15 && frame < RESULT_AT,
    energy: 1.15,
    gesture: frame < ZEM_START ? "phone" : "frustrated",
  });

  const resultK = frame >= RESULT_AT ? spring({ frame: frame - RESULT_AT, fps, config: { damping: 11, stiffness: 165 } }) : 0;

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.08} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CityAvenueSet pan={pan} sway={Math.sin(frame / 20) * 2.5} />

          {frame < ZEM_START + 10 ? (
            <CharacterG
              spec={DEMARCHEUR}
              x={demX}
              y={1630}
              scale={1.24}
              pose={{
                ...dynamicPose(frame + 20, { speaking: true, gesture: "explain" }),
                face: EXPRESSIONS.sourireCommercial,
                legL: LIMBS.legStand,
                legR: LIMBS.legStand,
                armR: LIMBS.armPhoneR,
                handR: "phone",
                headTurn: -0.35,
                blink: blink(frame, 3.5),
              }}
            />
          ) : null}

          {isRiding ? (
            <g>
              <Moto x={zemX} y={1575} scale={1.1} wheelRot={frame * 26} />
              <CharacterG
                spec={ZEM}
                x={zemX + 60}
                y={1560}
                scale={1.06}
                shadow={false}
                pose={{ ...RIDE, face: EXPRESSIONS.ravi, headTurn: 0.4, blink: blink(frame, 2.5) }}
              />
              <CharacterG
                spec={AICHA}
                x={zemX - 85}
                y={1545}
                scale={1.04}
                shadow={false}
                pose={{
                  ...RIDE,
                  bob: Math.sin(frame * 0.4) * 5,
                  face: EXPRESSIONS.agace,
                  headTurn: 0.3,
                  blink: blink(frame, 2),
                  sweat: 0.6,
                }}
              />
            </g>
          ) : (
            <CharacterG
              spec={AICHA}
              x={frame < ZEM_START ? 380 : 540}
              y={1645}
              scale={1.25}
              pose={{
                ...dyn,
                face,
                legL: frame < ZEM_START ? walk.legL! : LIMBS.legStand,
                legR: frame < ZEM_START ? walk.legR! : LIMBS.legStand,
                bob: frame < ZEM_START ? walk.bob : dyn.bob,
                handR: frame < ZEM_START ? "phone" : "open",
                blink: blink(frame, 2.4),
                sweat: fatigue,
              }}
            />
          )}

          <FlyingBill frame={frame} start={58} duration={32} from={[440, 1180]} to={[760, 740]} value="2000" tint="teal" />
          <FlyingBill frame={frame} start={185} duration={32} from={[480, 1220]} to={[180, 680]} value="1000" tint="amber" />
          <FlyingBill frame={frame} start={240} duration={32} from={[520, 1200]} to={[860, 620]} value="2000" tint="violet" />
        </svg>

        {resultK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 500,
              translate: "-50% -50%",
              scale: String(resultK),
              padding: "24px 44px",
              borderRadius: 28,
              background: "#FFFFFF",
              border: `5px solid ${BRAND.debit}`,
              boxShadow: "0 26px 60px -18px rgba(225,29,72,0.45)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: BRAND.debit, letterSpacing: "0.02em" }}>
              0 RÉSULTAT
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: BRAND.slate900, marginTop: 4 }}>
              Temps & argent perdus
            </div>
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S3-Boucle" />
      <Sfx name="cashout" at={58} volume={0.6} />
      <Sfx name="engine" at={ZEM_START} volume={0.45} />
      <Sfx name="horn" at={ZEM_START + 30} volume={0.5} />
      <Sfx name="cashout" at={185} volume={0.6} />
      <Sfx name="cashout" at={240} volume={0.6} />
      <Sfx name="impact" at={RESULT_AT} volume={0.65} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
