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
 * SCÈNE 6 V2 — « Zéro temps perdu. Zéro dépense inutile. » + Démo VOBI posée (19,5 s / 585 frames)
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

  const LOGO_AT = 135;
  const DEMO_AT = 245;
  const LIST_AT = 420;

  const line1K = spring({ frame: frame - 8, fps, config: { damping: 11, stiffness: 170 } });
  const line2K = spring({ frame: frame - 52, fps, config: { damping: 11, stiffness: 170 } });
  const introOut = prog(frame, LOGO_AT - 12, LOGO_AT + 6, EASE.inOut);

  const logoK = frame >= LOGO_AT ? spring({ frame: frame - LOGO_AT, fps, config: { damping: 12, stiffness: 150 } }) : 0;
  const logoOut = prog(frame, DEMO_AT - 12, DEMO_AT + 6, EASE.inOut);

  const phoneK = frame >= DEMO_AT ? spring({ frame: frame - DEMO_AT, fps, config: { damping: 13, stiffness: 135 } }) : 0;

  const tapPress =
    frame >= 400 && frame <= 416
      ? Math.sin(interpolate(frame, [400, 416], [0, Math.PI]))
      : 0;

  const revealRow = (i: number) =>
    frame >= LIST_AT + i * 20
      ? spring({ frame: frame - (LIST_AT + i * 20), fps, config: { damping: 13, stiffness: 165 } })
      : 0;

  const heartRow = (i: number) =>
    i === 0 && frame >= LIST_AT + 85
      ? spring({ frame: frame - (LIST_AT + 85), fps, config: { damping: 10, stiffness: 195 } })
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      {introOut < 1 ? (
        <AbsoluteFill
          style={{
            background: GRADIENTS.primary,
            opacity: 1 - introOut,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: 60,
          }}
        >
          <div
            style={{
              scale: String(line1K),
              padding: "24px 44px",
              borderRadius: 28,
              background: "#FFFFFF",
              color: BRAND.primary,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 58,
              textAlign: "center",
              boxShadow: "0 24px 54px -18px rgba(0,0,0,0.28)",
            }}
          >
            ZÉRO TEMPS PERDU
          </div>
          <div
            style={{
              scale: String(line2K),
              padding: "24px 44px",
              borderRadius: 28,
              background: BRAND.primaryDeep,
              color: "#FFFFFF",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 56,
              textAlign: "center",
              boxShadow: "0 24px 54px -18px rgba(0,0,0,0.35)",
            }}
          >
            ZÉRO DÉPENSE INUTILE
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= LOGO_AT && logoOut < 1 ? (
        <AbsoluteFill
          style={{
            backgroundColor: BRAND.background,
            opacity: (1 - logoOut) * introOut,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <div style={{ scale: String(logoK) }}>
            <VobiLogo height={116} />
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 36,
              color: BRAND.muted,
              opacity: prog(frame, LOGO_AT + 18, LOGO_AT + 38),
            }}
          >
            L’information claire avant de te déplacer
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= DEMO_AT ? (
        <Phone x={540} y={interpolate(phoneK, [0, 1], [1120, 900])} width={680}>
          {frame < LIST_AT ? (
            <>
              <HomeSearchScreen
                ville={field(frame, 268, "Cotonou")}
                quartier={field(frame, 300, "Cadjèhoun")}
                budget={field(frame, 332, "50 000 FCFA")}
                chambres={field(frame, 364, "2 chambres")}
                searchPress={tapPress}
              />
              {frame >= 382 && frame < LIST_AT ? (
                <TapFinger x={195} y={536} press={tapPress} opacity={prog(frame, 382, 394)} />
              ) : null}
            </>
          ) : (
            <ListingsScreen
              reveal={revealRow}
              heart={heartRow}
              scroll={interpolate(frame, [LIST_AT + 60, 570], [0, 120], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE.inOut,
              })}
            />
          )}
        </Phone>
      ) : null}

      <VoiceOver scene="S6-Demo" dark={frame >= LOGO_AT} />
      <Sfx name="impact" at={8} volume={0.6} />
      <Sfx name="impact" at={52} volume={0.6} />
      <Sfx name="sparkle" at={LOGO_AT} volume={0.5} />
      <Sfx name="tick" at={268} volume={0.4} />
      <Sfx name="tick" at={300} volume={0.4} />
      <Sfx name="tick" at={332} volume={0.4} />
      <Sfx name="tick" at={364} volume={0.4} />
      <Sfx name="tap" at={404} volume={0.65} />
      <Sfx name="pop" at={LIST_AT} volume={0.5} />
      <Sfx name="ding" at={LIST_AT + 85} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
