import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { StreetSet } from "../../sets/Street";
import { CharacterG } from "../../characters/Character";
import { DEMARCHEUR, SENAN, VENDEUSE } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS } from "../../characters/poses";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 1 — La cour partagée avec les voisins (9,5 s / 285 frames)
 */
export const Scene1CourPartagee: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TITLE_AT = 14;
  const ACCUM_AT = 160;
  const titleK = spring({ frame: frame - TITLE_AT, fps, config: { damping: 12, stiffness: 160 } });
  const accumK = frame >= ACCUM_AT ? spring({ frame: frame - ACCUM_AT, fps, config: { damping: 11, stiffness: 170 } }) : 0;

  const face = mixFace(EXPRESSIONS.neutre, EXPRESSIONS.agace, prog(frame, ACCUM_AT, ACCUM_AT + 30));

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.05} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={0} sway={Math.sin(frame / 26) * 2} />

          {/* Voisins dans la cour */}
          <CharacterG
            spec={VENDEUSE}
            x={210}
            y={1590}
            scale={1.1}
            pose={{
              face: EXPRESSIONS.sourireCommercial,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armWave,
              armR: LIMBS.armRest,
              headTurn: 0.35,
              blink: blink(frame, 3.0),
            }}
          />
          <CharacterG
            spec={DEMARCHEUR}
            x={870}
            y={1590}
            scale={1.12}
            pose={{
              face: EXPRESSIONS.ravi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armRest,
              armR: LIMBS.armPhoneEar,
              handR: "phone",
              headTurn: -0.35,
              blink: blink(frame, 3.4),
            }}
          />

          <CharacterG
            spec={SENAN}
            x={540}
            y={1635}
            scale={1.24}
            pose={{
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              armL: LIMBS.armRest,
              armR: LIMBS.armRest,
              headTurn: Math.sin(frame / 28) * 0.25,
              blink: blink(frame, 2.8),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 380,
            translate: "-50% -50%",
            scale: String(titleK),
            padding: "20px 38px",
            borderRadius: 28,
            background: "rgba(15,23,42,0.88)",
            color: "#FFFFFF",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 42,
            textAlign: "center",
            boxShadow: "0 20px 44px -14px rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          Cour partagée avec les voisins
        </div>

        {accumK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 520,
              translate: "-50% -50%",
              scale: String(accumK),
              padding: "16px 32px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: `3px solid ${BRAND.debit}`,
              color: BRAND.debit,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 32,
              boxShadow: "0 18px 40px -14px rgba(225,29,72,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            Les petits problèmes s’accumulent…
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S1-CourPartagee" />
      <Sfx name="pop" at={TITLE_AT} volume={0.45} />
      <Sfx name="notif" at={ACCUM_AT} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
