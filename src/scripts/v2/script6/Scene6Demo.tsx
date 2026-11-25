import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmFinish } from "../../../motion/Camera";
import { VobiLogo } from "../../../vobi-ui/Brand";
import { Phone, TapFinger } from "../../../vobi-ui/Phone";
import { HomeSearchScreen, ListingsScreen, type FieldState } from "../../../vobi-ui/Screens";
import { EASE, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND, GRADIENTS } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 6 V2 — VOBI : découvrir plus de logements & filtrer par critères (25,0 s / 750 frames)
 */
const field = (frame: number, at: number, value: string): FieldState => ({
  value: frame >= at ? value : "",
  active: interpolate(frame, [at - 10, at - 2, at + 12, at + 18], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  filled: interpolate(frame, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
});

export const Scene6Demo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const LOGO_AT = 205;
  const DEMO_AT = 285;
  const LIST_AT = 475;

  const quoteK = spring({ frame: frame - 14, fps, config: { damping: 11, stiffness: 160 } });
  const quoteOut = prog(frame, LOGO_AT - 14, LOGO_AT + 6, EASE.inOut);

  const logoK = frame >= LOGO_AT ? spring({ frame: frame - LOGO_AT, fps, config: { damping: 12, stiffness: 155 } }) : 0;
  const logoOut = prog(frame, DEMO_AT - 12, DEMO_AT + 6, EASE.inOut);

  const phoneK = frame >= DEMO_AT ? spring({ frame: frame - DEMO_AT, fps, config: { damping: 13, stiffness: 135 } }) : 0;

  const tapPress =
    frame >= 456 && frame <= 472
      ? Math.sin(interpolate(frame, [456, 472], [0, Math.PI]))
      : 0;

  const revealRow = (i: number) =>
    frame >= LIST_AT + i * 22
      ? spring({ frame: frame - (LIST_AT + i * 22), fps, config: { damping: 13, stiffness: 165 } })
      : 0;

  const heartRow = (i: number) =>
    i === 0 && frame >= LIST_AT + 100
      ? spring({ frame: frame - (LIST_AT + 100), fps, config: { damping: 10, stiffness: 195 } })
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
                ville={field(frame, 308, "Cotonou")}
                quartier={field(frame, 342, "Fidjrossè")}
                budget={field(frame, 376, "Budget famille")}
                chambres={field(frame, 410, "Cour privée")}
                searchPress={tapPress}
              />
              {frame >= 434 && frame < LIST_AT ? (
                <TapFinger x={195} y={536} press={tapPress} opacity={prog(frame, 434, 446)} />
              ) : null}
            </>
          ) : (
            <ListingsScreen
              reveal={revealRow}
              heart={heartRow}
              scroll={interpolate(frame, [LIST_AT + 75, 725], [0, 140], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE.inOut,
              })}
            />
          )}
        </Phone>
      ) : null}

      <VoiceOver scene="S6-Demo" dark={frame >= LOGO_AT} />
      <Sfx name="impact" at={14} volume={0.6} />
      <Sfx name="sparkle" at={LOGO_AT} volume={0.5} />
      <Sfx name="tick" at={308} volume={0.4} />
      <Sfx name="tick" at={342} volume={0.4} />
      <Sfx name="tick" at={376} volume={0.4} />
      <Sfx name="tick" at={410} volume={0.4} />
      <Sfx name="tap" at={460} volume={0.65} />
      <Sfx name="pop" at={LIST_AT} volume={0.5} />
      <Sfx name="ding" at={LIST_AT + 100} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
