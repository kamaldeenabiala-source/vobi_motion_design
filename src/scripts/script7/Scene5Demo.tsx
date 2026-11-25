import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmFinish } from "../../motion/Camera";
import { VobiLogo } from "../../vobi-ui/Brand";
import { Phone, TapFinger } from "../../vobi-ui/Phone";
import { HomeSearchScreen, ListingsScreen, type FieldState } from "../../vobi-ui/Screens";
import { EASE, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 5 — Démonstration VOBI : budget, ville, quartier, chambres & comparaison (13,5 s / 405 frames)
 */
const field = (frame: number, at: number, value: string): FieldState => ({
  value: frame >= at ? value : "",
  active: interpolate(frame, [at - 8, at - 2, at + 10, at + 16], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  filled: interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
});

export const Scene5Demo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DEMO_AT = 56;
  const LIST_AT = 205;

  const logoK = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 160 } });
  const logoOut = prog(frame, DEMO_AT - 10, DEMO_AT + 6, EASE.inOut);
  const phoneK = frame >= DEMO_AT ? spring({ frame: frame - DEMO_AT, fps, config: { damping: 13, stiffness: 140 } }) : 0;

  const tapPress =
    frame >= 188 && frame <= 202
      ? Math.sin(interpolate(frame, [188, 202], [0, Math.PI]))
      : 0;

  const revealRow = (i: number) =>
    frame >= LIST_AT + i * 16
      ? spring({ frame: frame - (LIST_AT + i * 16), fps, config: { damping: 13, stiffness: 170 } })
      : 0;

  const heartRow = (i: number) =>
    i === 0 && frame >= LIST_AT + 75
      ? spring({ frame: frame - (LIST_AT + 75), fps, config: { damping: 10, stiffness: 200 } })
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
            <VobiLogo height={116} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: BRAND.muted }}>
            Selon tes goûts et tes moyens
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= DEMO_AT ? (
        <Phone x={540} y={interpolate(phoneK, [0, 1], [1120, 900])} width={680}>
          {frame < LIST_AT ? (
            <>
              <HomeSearchScreen
                ville={field(frame, 74, "Cotonou")}
                quartier={field(frame, 102, "Haie Vive")}
                budget={field(frame, 130, "Budget adapté")}
                chambres={field(frame, 158, "2 chambres")}
                searchPress={tapPress}
              />
              {frame >= 172 && frame < LIST_AT ? (
                <TapFinger x={195} y={536} press={tapPress} opacity={prog(frame, 172, 182)} />
              ) : null}
            </>
          ) : (
            <ListingsScreen
              reveal={revealRow}
              heart={heartRow}
              scroll={interpolate(frame, [LIST_AT + 50, 390], [0, 140], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE.inOut,
              })}
            />
          )}
        </Phone>
      ) : null}

      <VoiceOver scene="S5-Demo" dark />
      <Sfx name="sparkle" at={6} volume={0.5} />
      <Sfx name="tick" at={74} volume={0.4} />
      <Sfx name="tick" at={102} volume={0.4} />
      <Sfx name="tick" at={130} volume={0.4} />
      <Sfx name="tick" at={158} volume={0.4} />
      <Sfx name="tap" at={192} volume={0.65} />
      <Sfx name="pop" at={LIST_AT} volume={0.5} />
      <Sfx name="ding" at={LIST_AT + 75} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
