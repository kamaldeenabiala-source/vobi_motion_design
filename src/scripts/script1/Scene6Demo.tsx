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
 * SCÈNE 6 — Pivot « Zéro temps perdu. Zéro dépense inutile. » + Démo VOBI (14,5 s / 435 frames)
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

  const LOGO_AT = 102;
  const DEMO_AT = 180;
  const LIST_AT = 328;

  const line1K = spring({ frame: frame - 6, fps, config: { damping: 11, stiffness: 180 } });
  const line2K = spring({ frame: frame - 42, fps, config: { damping: 11, stiffness: 180 } });
  const introOut = prog(frame, LOGO_AT - 10, LOGO_AT + 6, EASE.inOut);

  const logoK = frame >= LOGO_AT ? spring({ frame: frame - LOGO_AT, fps, config: { damping: 12, stiffness: 150 } }) : 0;
  const logoOut = prog(frame, DEMO_AT - 12, DEMO_AT + 4, EASE.inOut);

  const phoneK = frame >= DEMO_AT ? spring({ frame: frame - DEMO_AT, fps, config: { damping: 13, stiffness: 140 } }) : 0;

  const tapPress =
    frame >= 312 && frame <= 326
      ? Math.sin(interpolate(frame, [312, 326], [0, Math.PI]))
      : 0;

  const revealRow = (i: number) =>
    frame >= LIST_AT + i * 16
      ? spring({ frame: frame - (LIST_AT + i * 16), fps, config: { damping: 13, stiffness: 170 } })
      : 0;

  const heartRow = (i: number) =>
    i === 0 && frame >= LIST_AT + 65
      ? spring({ frame: frame - (LIST_AT + 65), fps, config: { damping: 10, stiffness: 200 } })
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      {/* 1. Carton choc : Zéro temps perdu. Zéro dépense inutile. */}
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

      {/* 2. Révélation VOBI */}
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
            <VobiLogo height={110} />
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 36,
              color: BRAND.muted,
              opacity: prog(frame, LOGO_AT + 18, LOGO_AT + 36),
            }}
          >
            L’information claire avant de te déplacer
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 3. Démo app VOBI */}
      {frame >= DEMO_AT ? (
        <AbsoluteFill
          style={{
            backgroundColor: BRAND.background,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Phone x={540} y={interpolate(phoneK, [0, 1], [1120, 900])} width={680}>
            {frame < LIST_AT ? (
              <>
                <HomeSearchScreen
                  ville={field(frame, 198, "Cotonou")}
                  quartier={field(frame, 224, "Cadjèhoun")}
                  budget={field(frame, 252, "50 000 FCFA")}
                  chambres={field(frame, 280, "2 chambres")}
                  searchPress={tapPress}
                />
                {frame >= 295 && frame < LIST_AT ? (
                  <TapFinger x={195} y={536} press={tapPress} opacity={prog(frame, 295, 305)} />
                ) : null}
              </>
            ) : (
              <ListingsScreen
                reveal={revealRow}
                heart={heartRow}
                scroll={interpolate(frame, [LIST_AT + 50, 425], [0, 120], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EASE.inOut,
                })}
              />
            )}
          </Phone>
        </AbsoluteFill>
      ) : null}

      <VoiceOver scene="S6-Demo" dark={frame >= LOGO_AT} />
      <Sfx name="impact" at={6} volume={0.65} />
      <Sfx name="impact" at={42} volume={0.65} />
      <Sfx name="sparkle" at={LOGO_AT} volume={0.5} />
      <Sfx name="tick" at={198} volume={0.4} />
      <Sfx name="tick" at={224} volume={0.4} />
      <Sfx name="tick" at={252} volume={0.4} />
      <Sfx name="tick" at={280} volume={0.4} />
      <Sfx name="tap" at={316} volume={0.65} />
      <Sfx name="pop" at={LIST_AT} volume={0.5} />
      <Sfx name="ding" at={LIST_AT + 65} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
