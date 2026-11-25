import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { CourtyardSet } from "../../../sets/CourtyardSet";
import { CharacterG } from "../../../characters/Character";
import { DEMARCHEUR, KOFFI, VENDEUSE } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 1 V2 — La cour partagée avec les voisins (12,5 s / 375 frames)
 */
export const Scene1CourPartagee: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TITLE_AT = 18;
  const ACCUM_AT = 210;
  const titleK = spring({ frame: frame - TITLE_AT, fps, config: { damping: 12, stiffness: 150 } });
  const accumK = frame >= ACCUM_AT ? spring({ frame: frame - ACCUM_AT, fps, config: { damping: 11, stiffness: 160 } }) : 0;

  const face = mixFace(EXPRESSIONS.neutre, EXPRESSIONS.agace, prog(frame, ACCUM_AT, ACCUM_AT + 32));
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 340, energy: 1.1, gesture: "explain" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.05} focusX={540} focusY={1080}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CourtyardSet sway={Math.sin(frame / 24) * 2.5} />

          <CharacterG
            spec={VENDEUSE}
            x={210}
            y={1595}
            scale={1.1}
            pose={{
              ...dynamicPose(frame + 12, { speaking: true, gesture: "excited" }),
              face: EXPRESSIONS.sourireCommercial,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              headTurn: 0.35,
              blink: blink(frame, 3.0),
            }}
          />
          <CharacterG
            spec={DEMARCHEUR}
            x={870}
            y={1595}
            scale={1.12}
            pose={{
              ...dynamicPose(frame + 30, { speaking: true, gesture: "phone" }),
              face: EXPRESSIONS.ravi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handR: "phone",
              headTurn: -0.35,
              blink: blink(frame, 3.4),
            }}
          />

          <CharacterG
            spec={KOFFI}
            x={540}
            y={1645}
            scale={1.25}
            pose={{
              ...dyn,
              face,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "open",
              handR: "open",
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
