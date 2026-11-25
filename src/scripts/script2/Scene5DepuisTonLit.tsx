import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { RoomSet } from "../../sets/Room";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, SIT } from "../../characters/poses";
import { Phone } from "../../vobi-ui/Phone";
import { ListingsScreen } from "../../vobi-ui/Screens";
import { EASE, blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 5 — Consulter & comparer depuis son lit après le travail (13,0 s / 390 frames)
 */
const SENAN_PYJAMA = {
  ...SENAN,
  outfit: { ...SENAN.outfit, ...SENAN.outfits?.pyjama },
};

export const Scene5DepuisTonLit: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({ frame: frame - 14, fps, config: { damping: 13, stiffness: 140 } });
  const badgeK = frame >= 245 ? spring({ frame: frame - 245, fps, config: { damping: 12, stiffness: 160 } }) : 0;

  const revealRow = (i: number) =>
    frame >= 30 + i * 18
      ? spring({ frame: frame - (30 + i * 18), fps, config: { damping: 13, stiffness: 165 } })
      : 0;

  const heartRow = (i: number) =>
    i === 0 && frame >= 150
      ? spring({ frame: frame - 150, fps, config: { damping: 10, stiffness: 200 } })
      : 0;

  const face = mixFace(EXPRESSIONS.soulage, EXPRESSIONS.ravi, prog(frame, 60, 180));

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.05} focusX={540} focusY={1020}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RoomSet fanSpin={frame * 26} dawn={0.32} />
          <CharacterG
            spec={SENAN_PYJAMA}
            x={260}
            y={1620}
            scale={1.18}
            pose={{
              ...SIT,
              face,
              armL: LIMBS.armRest,
              armR: LIMBS.armPhoneR,
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
            scroll={interpolate(frame, [100, 340], [0, 160], {
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
      <Sfx name="pop" at={30} volume={0.45} />
      <Sfx name="pop" at={48} volume={0.45} />
      <Sfx name="ding" at={150} volume={0.55} />
      <Sfx name="sparkle" at={245} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
