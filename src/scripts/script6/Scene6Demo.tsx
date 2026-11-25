import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmFinish } from "../../motion/Camera";
import { VobiLogo } from "../../vobi-ui/Brand";
import { Phone, TapFinger } from "../../vobi-ui/Phone";
import { HomeSearchScreen, ListingsScreen, type FieldState } from "../../vobi-ui/Screens";
import { EASE, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND, GRADIENTS } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 6 — VOBI : découvrir plus de logements & filtrer par critères (19,5 s / 585 frames)
 */
const field = (frame: number, at: number, value: string): FieldState => ({
  value: frame >= at ? value : "",
  active: interpolate(frame, [at - 8, at - 2, at + 10, at + 16], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  filled: interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
});

export const Scene6Demo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const LOGO_AT = 165;
  const DEMO_AT = 225;
  const LIST_AT = 375;

  const quoteK = spring({ frame: frame - 12, fps, config: { damping: 11, stiffness: 170 } });
  const quoteOut = prog(frame, LOGO_AT - 12, LOGO_AT + 6, EASE.inOut);

  const logoK = frame >= LOGO_AT ? spring({ frame: frame - LOGO_AT, fps, config: { damping: 12, stiffness: 160 } }) : 0;
  const logoOut = prog(frame, DEMO_AT - 10, DEMO_AT + 6, EASE.inOut);

  const phoneK = frame >= DEMO_AT ? spring({ frame: frame - DEMO_AT, fps, config: { damping: 13, stiffness: 140 } }) : 0;

  const tapPress =
    frame >= 358 && frame <= 372
      ? Math.sin(interpolate(frame, [358, 372], [0, Math.PI]))
      : 0;

  const revealRow = (i: number) =>
    frame >= LIST_AT + i * 16
      ? spring({ frame: frame - (LIST_AT + i * 16), fps, config: { damping: 13, stiffness: 170 } })
      : 0;

  const heartRow = (i: number) =>
    i === 0 && frame >= LIST_AT + 80
      ? spring({ frame: frame - (LIST_AT + 80), fps, config: { damping: 10, stiffness: 200 } })
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      {quoteOut < 1 ? (
        <AbsoluteFill
          style={{
            background: GRADIENTS.primary,
            opacity: 1 - quoteOut,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 64,
          }}
        >
          <div
            style={{
              scale: String(quoteK),
              padding: "32px 44px",
              borderRadius: 32,
              background: "#FFFFFF",
              color: BRAND.primary,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 48,
              lineHeight: 1.25,
              textAlign: "center",
              boxShadow: "0 24px 54px -18px rgba(0,0,0,0.28)",
            }}
          >
            On ne peut pas choisir
            <br />
            une maison qu’on ne connaît pas !
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= LOGO_AT && logoOut < 1 ? (
        <AbsoluteFill
          style={{
            backgroundColor: BRAND.background,
            opacity: (1 - logoOut) * quoteOut,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ scale: String(logoK) }}>
            <VobiLogo height={116} />
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= DEMO_AT ? (
        <Phone x={540} y={interpolate(phoneK, [0, 1], [1120, 900])} width={680}>
          {frame < LIST_AT ? (
            <>
              <HomeSearchScreen
                ville={field(frame, 245, "Cotonou")}
                quartier={field(frame, 272, "Fidjrossè")}
                budget={field(frame, 300, "Budget famille")}
                chambres={field(frame, 328, "Cour privée")}
                searchPress={tapPress}
              />
              {frame >= 342 && frame < LIST_AT ? (
                <TapFinger x={195} y={536} press={tapPress} opacity={prog(frame, 342, 352)} />
              ) : null}
            </>
          ) : (
            <ListingsScreen
              reveal={revealRow}
              heart={heartRow}
              scroll={interpolate(frame, [LIST_AT + 60, 565], [0, 140], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE.inOut,
              })}
            />
          )}
        </Phone>
      ) : null}

      <VoiceOver scene="S6-Demo" dark={frame >= LOGO_AT} />
      <Sfx name="impact" at={12} volume={0.6} />
      <Sfx name="sparkle" at={LOGO_AT} volume={0.5} />
      <Sfx name="tick" at={245} volume={0.4} />
      <Sfx name="tick" at={272} volume={0.4} />
      <Sfx name="tick" at={300} volume={0.4} />
      <Sfx name="tick" at={328} volume={0.4} />
      <Sfx name="tap" at={362} volume={0.65} />
      <Sfx name="pop" at={LIST_AT} volume={0.5} />
      <Sfx name="ding" at={LIST_AT + 80} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
