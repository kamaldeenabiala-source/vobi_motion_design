import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { ModernSalonSet } from "../../../sets/ModernSalonSet";
import { CharacterG } from "../../../characters/Character";
import { KOFFI } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { SIT, dynamicPose } from "../../../characters/poses";
import { Phone } from "../../../vobi-ui/Phone";
import { ListingsScreen } from "../../../vobi-ui/Screens";
import { EASE, blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 5 V2 — Consulter & comparer tranquillement depuis chez soi (17,0 s / 510 frames)
 */
const KOFFI_PYJAMA = {
  ...KOFFI,
  outfit: { ...KOFFI.outfit, ...KOFFI.outfits?.pyjama },
};

export const Scene5DepuisTonLit: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({ frame: frame - 16, fps, config: { damping: 13, stiffness: 135 } });
  const badgeK = frame >= 310 ? spring({ frame: frame - 310, fps, config: { damping: 12, stiffness: 155 } }) : 0;

  const revealRow = (i: number) =>
    frame >= 36 + i * 22
      ? spring({ frame: frame - (36 + i * 22), fps, config: { damping: 13, stiffness: 160 } })
      : 0;

  const heartRow = (i: number) =>
    i === 0 && frame >= 190
      ? spring({ frame: frame - 190, fps, config: { damping: 10, stiffness: 195 } })
      : 0;

  const face = mixFace(EXPRESSIONS.soulage, EXPRESSIONS.ravi, prog(frame, 70, 220));
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 460, energy: 0.95, gesture: "phone" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.05} focusX={540} focusY={1020}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ModernSalonSet sway={Math.sin(frame / 28) * 2} />
          <CharacterG
            spec={KOFFI_PYJAMA}
            x={260}
            y={1650}
            scale={1.16}
            pose={{
              ...SIT,
              ...dyn,
              face,
              handR: "phone",
              headTurn: 0.25,
              blink: blink(frame, 3.4),
            }}
          />
        </svg>

        <Phone x={670} y={880} width={interpolate(phoneIn, [0, 1], [440, 560])}>
          <ListingsScreen
            reveal={revealRow}
            heart={heartRow}
            scroll={interpolate(frame, [130, 440], [0, 160], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE.inOut,
            })}
          />
        </Phone>

        {badgeK > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 210,
              translate: "-50% -50%",
              scale: String(badgeK),
              padding: "16px 32px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: `3px solid ${BRAND.emerald}`,
              color: BRAND.primary,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 32,
              boxShadow: "0 18px 40px -14px rgba(5,150,105,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            Plusieurs offres en quelques heures
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S5-DepuisTonLit" />
      <Sfx name="pop" at={36} volume={0.45} />
      <Sfx name="pop" at={58} volume={0.45} />
      <Sfx name="ding" at={190} volume={0.55} />
      <Sfx name="sparkle" at={310} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
