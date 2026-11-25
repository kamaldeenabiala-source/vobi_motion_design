import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { ShadeSet } from "../../sets/Shade";
import { BeninMap } from "../../vobi-ui/BeninMap";
import { Icon } from "../../vobi-ui/icons";
import { prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 4 — Imagine pouvoir chercher autrement ! (13,0 s / 390 frames)
 */
export const Scene4Imagine: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PART2 = 210;
  const titleK = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 160 } });
  const mapDraw = prog(frame, 24, 95);
  const pinAt = (i: number) => spring({ frame: frame - (55 + i * 16), fps, config: { damping: 11, stiffness: 160 } });

  const check1K = frame >= PART2 + 12 ? spring({ frame: frame - (PART2 + 12), fps, config: { damping: 12, stiffness: 160 } }) : 0;
  const check2K = frame >= PART2 + 56 ? spring({ frame: frame - (PART2 + 56), fps, config: { damping: 12, stiffness: 160 } }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.04} focusX={540} focusY={960}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ShadeSet sway={Math.sin(frame / 28) * 2} brand={0.95} />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 230,
            translate: "-50% -50%",
            scale: String(titleK),
            padding: "20px 38px",
            borderRadius: 28,
            background: BRAND.primary,
            color: "#FFFFFF",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 42,
            textAlign: "center",
            boxShadow: "0 20px 48px -16px rgba(11,107,79,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          Imagine chercher autrement !
        </div>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 780,
            translate: "-50% -50%",
            background: "rgba(255,255,255,0.92)",
            borderRadius: 36,
            padding: "28px 34px",
            border: `3px solid ${BRAND.lightGreen}`,
            boxShadow: "0 26px 60px -20px rgba(11,107,79,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity: 1 - prog(frame, PART2 - 12, PART2 + 8),
          }}
        >
          <BeninMap width={460} height={600} draw={mapDraw} pin={pinAt} highlight={0} />
          <div style={{ display: "flex", gap: 12 }}>
            {["Budget", "Ville", "Quartier", "Chez toi"].map((t) => (
              <span key={t} style={{ padding: "8px 18px", borderRadius: 999, background: BRAND.mint, color: BRAND.primary, fontFamily: FONT, fontWeight: 800, fontSize: 24 }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {frame >= PART2 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 760,
              translate: "-50% -50%",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              width: 820,
            }}
          >
            {[
              { k: check1K, text: "Aucune permission au travail" },
              { k: check2K, text: "Aucun jour de repos sacrifié" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  scale: String(item.k),
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "26px 34px",
                  borderRadius: 28,
                  background: "#FFFFFF",
                  border: `3px solid ${BRAND.emerald}`,
                  boxShadow: "0 22px 48px -18px rgba(5,150,105,0.4)",
                }}
              >
                <span style={{ width: 54, height: 54, borderRadius: 99, background: BRAND.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="check" size={30} color="#FFFFFF" stroke={3} />
                </span>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: BRAND.slate900 }}>{item.text}</span>
              </div>
            ))}
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S4-Imagine" dark />
      <Sfx name="sparkle" at={8} volume={0.5} />
      <Sfx name="pop" at={60} volume={0.4} />
      <Sfx name="check" at={PART2 + 12} volume={0.5} />
      <Sfx name="check" at={PART2 + 56} volume={0.5} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
