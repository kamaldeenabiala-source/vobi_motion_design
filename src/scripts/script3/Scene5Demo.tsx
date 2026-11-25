import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmFinish } from "../../motion/Camera";
import { VobiLogo } from "../../vobi-ui/Brand";
import { Phone } from "../../vobi-ui/Phone";
import { ListingsScreen } from "../../vobi-ui/Screens";
import { EASE, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 5 — Démonstration VOBI : découvrir les offres & voir les loyers (11,5 s / 345 frames)
 */
export const Scene5Demo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PHONE_AT = 56;
  const logoK = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 160 } });
  const logoOut = prog(frame, PHONE_AT - 10, PHONE_AT + 6, EASE.inOut);
  const phoneK = frame >= PHONE_AT ? spring({ frame: frame - PHONE_AT, fps, config: { damping: 13, stiffness: 140 } }) : 0;

  const revealRow = (i: number) =>
    frame >= PHONE_AT + 18 + i * 18
      ? spring({ frame: frame - (PHONE_AT + 18 + i * 18), fps, config: { damping: 13, stiffness: 170 } })
      : 0;

  const heartRow = (i: number) =>
    (i === 0 && frame >= 180) || (i === 2 && frame >= 225)
      ? spring({ frame: frame - (i === 0 ? 180 : 225), fps, config: { damping: 10, stiffness: 200 } })
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      {logoOut < 1 ? (
        <AbsoluteFill
          style={{
            backgroundColor: BRAND.background,
            opacity: 1 - logoOut,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div style={{ scale: String(logoK) }}>
            <VobiLogo height={110} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: BRAND.muted }}>
            Découvre les offres et vois les loyers
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= PHONE_AT ? (
        <Phone x={540} y={interpolate(phoneK, [0, 1], [1120, 900])} width={680}>
          <ListingsScreen
            reveal={revealRow}
            heart={heartRow}
            scroll={interpolate(frame, [130, 325], [0, 180], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE.inOut,
            })}
          />
        </Phone>
      ) : null}

      <VoiceOver scene="S5-Demo" dark />
      <Sfx name="sparkle" at={6} volume={0.5} />
      <Sfx name="pop" at={PHONE_AT + 18} volume={0.45} />
      <Sfx name="ding" at={180} volume={0.55} />
      <Sfx name="ding" at={225} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
