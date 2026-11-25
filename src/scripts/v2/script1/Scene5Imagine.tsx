import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { ModernSalonSet } from "../../../sets/ModernSalonSet";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { SIT, dynamicPose } from "../../../characters/poses";
import { BeninMap } from "../../../vobi-ui/BeninMap";
import { Phone } from "../../../vobi-ui/Phone";
import { VerificationScreen } from "../../../vobi-ui/Screens";
import { Icon } from "../../../vobi-ui/icons";
import { EASE, blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 5 V2 — Imagine depuis chez toi (22,0 s / 660 frames)
 * Rythme posé : 11 s pour découvrir les logements sur la carte,
 * 11 s pour inspecter et vérifier sur le téléphone avant de se déplacer.
 */
export const Scene5Imagine: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PART2 = 330;
  const inPart2 = prog(frame, PART2, PART2 + 20, EASE.inOut);

  const mapDraw = prog(frame, 20, 105);
  const pinAt = (i: number) => spring({ frame: frame - (65 + i * 20), fps, config: { damping: 12, stiffness: 150 } });

  const phoneIn = frame >= PART2 ? spring({ frame: frame - PART2, fps, config: { damping: 13, stiffness: 130 } }) : 0;
  const checkAt = (i: number) =>
    frame >= PART2 + 65 + i * 28
      ? spring({ frame: frame - (PART2 + 65 + i * 28), fps, config: { damping: 12, stiffness: 170 } })
      : 0;
  const stamp =
    frame >= PART2 + 190 ? spring({ frame: frame - (PART2 + 190), fps, config: { damping: 10, stiffness: 190 } }) : 0;

  const noFeeK =
    frame >= PART2 + 20 ? spring({ frame: frame - (PART2 + 20), fps, config: { damping: 12, stiffness: 155 } }) : 0;

  const face = mixFace(EXPRESSIONS.impressionne, EXPRESSIONS.ravi, prog(frame, 50, 160));
  const dyn = dynamicPose(frame, { speaking: true, energy: 1.0, gesture: "phone" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.04} focusX={540} focusY={980}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ModernSalonSet sway={Math.sin(frame / 28) * 2} />
          <CharacterG
            spec={AICHA}
            x={260}
            y={1700}
            scale={1.14}
            pose={{
              ...SIT,
              ...dyn,
              face,
              handR: "phone",
              headTurn: 0.25,
              blink: blink(frame, 3.4),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 580,
            top: 660,
            translate: "-50% -50%",
            opacity: 1 - inPart2,
            transform: `scale(${1 - inPart2 * 0.1})`,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.94)",
              borderRadius: 36,
              padding: "28px 32px",
              border: `3px solid ${BRAND.lightGreen}`,
              boxShadow: "0 26px 60px -20px rgba(11,107,79,0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: BRAND.primary }}>
              Depuis chez toi
            </div>
            <BeninMap width={430} height={580} draw={mapDraw} pin={pinAt} highlight={0} />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {["Ville", "Quartier", "Environnement"].map((tag, idx) => (
                <span
                  key={tag}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    background: BRAND.mint,
                    color: BRAND.primary,
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 22,
                    opacity: prog(frame, 105 + idx * 20, 125 + idx * 20),
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {frame >= PART2 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: inPart2,
              pointerEvents: "none",
            }}
          >
            {noFeeK > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: 540,
                  top: 230,
                  translate: "-50% -50%",
                  scale: String(noFeeK),
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 28px",
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: `3px solid ${BRAND.emerald}`,
                  boxShadow: "0 18px 40px -16px rgba(5,150,105,0.45)",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon name="check" size={30} color={BRAND.emerald} stroke={3} />
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: BRAND.primary }}>
                  0 FCFA de démarcheur pour chercher
                </span>
              </div>
            ) : null}

            <Phone x={670} y={880} width={interpolate(phoneIn, [0, 1], [440, 560])}>
              <VerificationScreen checks={checkAt} stamp={stamp} />
            </Phone>
          </div>
        ) : null}
      </Camera>

      <VoiceOver scene="S5-Imagine" dark />
      <Sfx name="sparkle" at={20} volume={0.45} />
      <Sfx name="pop" at={65} volume={0.4} />
      <Sfx name="pop" at={105} volume={0.4} />
      <Sfx name="whoosh" at={PART2} volume={0.5} />
      <Sfx name="check" at={PART2 + 65} volume={0.45} />
      <Sfx name="check" at={PART2 + 93} volume={0.45} />
      <Sfx name="check" at={PART2 + 121} volume={0.45} />
      <Sfx name="stamp" at={PART2 + 190} volume={0.65} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
