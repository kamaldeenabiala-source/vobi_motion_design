import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VobiLogo } from "./Brand";
import { FONT } from "../theme/fonts";
import { BRAND, GRADIENTS } from "../config/brand";

/**
 * Carton final V2 : logo VOBI + phrase clé + badge « VOBI bientôt disponible ».
 */
export const ConclusionCardV2: React.FC<{
  startFrame: number;
  opacity: number;
  headline: React.ReactNode;
}> = ({ startFrame, opacity, headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoK =
    frame >= startFrame
      ? spring({ frame: frame - startFrame - 4, fps, config: { damping: 12, stiffness: 140 } })
      : 0;
  const btnK =
    frame >= startFrame + 24
      ? spring({ frame: frame - (startFrame + 24), fps, config: { damping: 11, stiffness: 155 } })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.background,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 72,
        gap: 44,
      }}
    >
      <div style={{ scale: String(logoK) }}>
        <VobiLogo height={120} />
      </div>

      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 42,
          lineHeight: 1.3,
          color: BRAND.slate900,
          textAlign: "center",
          maxWidth: 860,
          opacity: interpolate(frame, [startFrame + 12, startFrame + 28], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {headline}
      </div>

      <div
        style={{
          scale: String(btnK),
          padding: "26px 56px",
          borderRadius: 999,
          background: GRADIENTS.primary,
          color: "#FFFFFF",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 40,
          letterSpacing: "0.01em",
          boxShadow: "0 20px 50px -15px rgba(5,150,105,0.55)",
          textAlign: "center",
        }}
      >
        VOBI bientôt disponible
      </div>
    </AbsoluteFill>
  );
};
