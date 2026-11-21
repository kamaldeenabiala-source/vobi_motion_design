import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Caméra virtuelle 2D : zoom autour d'un point focal + panoramique + rotation.
 * `focusX/focusY` en pixels du cadre 1080×1920.
 */
export const Camera: React.FC<{
  zoom?: number;
  focusX?: number;
  focusY?: number;
  panX?: number;
  panY?: number;
  rotate?: number;
  blur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ zoom = 1, focusX = 540, focusY = 960, panX = 0, panY = 0, rotate = 0, blur = 0, children, style }) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${focusX}px ${focusY}px`,
          scale: String(zoom),
          translate: `${panX}px ${panY}px`,
          rotate: `${rotate}deg`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Grain très fin + vignette douce : finition « premium ». */
export const FilmFinish: React.FC<{ vignette?: number; warm?: number }> = ({ vignette = 0.35, warm = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {warm > 0 ? (
      <AbsoluteFill style={{ background: "#FFB45A", mixBlendMode: "soft-light", opacity: warm }} />
    ) : null}
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 75% 60% at 50% 45%, transparent 55%, rgba(20,10,0,${vignette}) 100%)`,
      }}
    />
  </AbsoluteFill>
);
