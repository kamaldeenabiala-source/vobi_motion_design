import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { StreetSet } from "../../sets/Street";
import { CharacterG } from "../../characters/Character";
import { DEMARCHEUR, SENAN, ZEM } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, RIDE, mixLimb, walkCycle } from "../../characters/poses";
import { Moto } from "../../props/Objects";
import { FlyingBill } from "../../props/Money";
import { EASE, blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 3 — Visites & dépenses sans résultat (10,5 s / 315 frames)
 * Sènan contacte des démarcheurs, enchaîne les trajets en zémidjan,
 * paie des démarches… les billets s'envolent. Bilan : « 0 RÉSULTAT ».
 */
export const Scene3Boucle: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ZEM_START = 115;
  const ZEM_END = 225;
  const RESULT_AT = 240;

  const isRiding = frame >= ZEM_START && frame < ZEM_END;
  const pan = isRiding ? (frame - ZEM_START) * 9 : frame * 2.2;

  const walk = walkCycle(frame, 0.5);
  const fatigue = prog(frame, 180, 300);

  let face = mixFace(EXPRESSIONS.agace, EXPRESSIONS.epuise, fatigue);
  if (frame >= RESULT_AT) {
    face = mixFace(face, EXPRESSIONS.choque, prog(frame, RESULT_AT, RESULT_AT + 12));
  }

  const zemX = interpolate(frame, [ZEM_START, ZEM_END], [-180, 1280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const demX = interpolate(frame, [0, 30, 95, 120], [1180, 760, 760, 1220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  const resultK = frame >= RESULT_AT ? spring({ frame: frame - RESULT_AT, fps, config: { damping: 10, stiffness: 180 } }) : 0;

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.08} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={pan} sway={Math.sin(frame / 20) * 2.5} />

          {/* Plan 1 : Démarcheur + billets */}
          {frame < ZEM_START + 10 ? (
            <CharacterG
              spec={DEMARCHEUR}
              x={demX}
              y={1620}
              scale={1.25}
              pose={{
                face: EXPRESSIONS.sourireCommercial,
                legL: LIMBS.legStand,
                legR: LIMBS.legStand,
                armL: { a: -35, b: -60 },
                armR: LIMBS.armPhoneR,
                handR: "phone",
                headTurn: -0.35,
                blink: blink(frame, 3.5),
              }}
            />
          ) : null}

          {/* Plan 2 : Zémidjan qui emmène Sènan */}
          {isRiding ? (
            <g>
              <Moto x={zemX} y={1560} scale={1.1} wheelRot={frame * 28} />
              <CharacterG
                spec={ZEM}
                x={zemX + 60}
                y={1545}
                scale={1.06}
                shadow={false}
                pose={{ ...RIDE, face: EXPRESSIONS.ravi, headTurn: 0.4, blink: blink(frame, 2.5) }}
              />
              <CharacterG
                spec={SENAN}
                x={zemX - 85}
                y={1530}
                scale={1.04}
                shadow={false}
                pose={{
                  ...RIDE,
                  face: EXPRESSIONS.agace,
                  headTurn: 0.3,
                  blink: blink(frame, 2),
                  sweat: 0.6,
                }}
              />
            </g>
          ) : (
            <CharacterG
              spec={SENAN}
              x={frame < ZEM_START ? 380 : 540}
              y={1630}
              scale={1.26}
              pose={{
                face,
                legL: frame < ZEM_START ? walk.legL! : LIMBS.legStand,
                legR: frame < ZEM_START ? walk.legR! : LIMBS.legStand,
                armL: mixLimb(LIMBS.armRest, { a: 20, b: 15 }, fatigue),
                armR: frame < ZEM_START ? LIMBS.armPhoneR : LIMBS.armRest,
                handR: frame < ZEM_START ? "phone" : "none",
                headTurn: 0.15,
                blink: blink(frame, 2.4),
                sweat: fatigue,
              }}
            />
          )}

          {/* Billets qui s'envolent */}
          <FlyingBill frame={frame} start={48} duration={28} from={[440, 1180]} to={[760, 740]} value="2000" tint="teal" />
          <FlyingBill frame={frame} start={145} duration={28} from={[480, 1220]} to={[180, 680]} value="1000" tint="amber" />
          <FlyingBill frame={frame} start={190} duration={28} from={[520, 1200]} to={[860, 620]} value="2000" tint="violet" />
        </svg>

        {resultK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 520,
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
      <Sfx name="cashout" at={48} volume={0.65} />
      <Sfx name="engine" at={ZEM_START} volume={0.45} />
      <Sfx name="horn" at={ZEM_START + 24} volume={0.5} />
      <Sfx name="cashout" at={145} volume={0.6} />
      <Sfx name="cashout" at={190} volume={0.6} />
      <Sfx name="impact" at={RESULT_AT} volume={0.7} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
