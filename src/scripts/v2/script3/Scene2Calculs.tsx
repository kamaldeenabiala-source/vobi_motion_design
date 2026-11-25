import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { ModernSalonSet } from "../../../sets/ModernSalonSet";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../../characters/expressions";
import { SIT, dynamicPose } from "../../../characters/poses";
import { Icon, type IconName } from "../../../vobi-ui/icons";
import { blink, prog } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 2 V2 — D'autres dépenses à gérer & calculs permanents (16,5 s / 495 frames)
 */
const CalcRow: React.FC<{
  icon: IconName;
  label: string;
  amount: string;
  at: number;
  frame: number;
  fps: number;
  highlight?: boolean;
}> = ({ icon, label, amount, at, frame, fps, highlight }) => {
  if (frame < at) return null;
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <div
      style={{
        scale: String(k),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderRadius: 18,
        background: highlight ? "#FFF1F2" : "#F8FAFC",
        border: `2px solid ${highlight ? BRAND.debit : "#E2E8F0"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name={icon} size={26} color={highlight ? BRAND.debit : BRAND.slate900} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: BRAND.slate900 }}>{label}</span>
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: highlight ? BRAND.debit : BRAND.slate900 }}>
        {amount}
      </span>
    </div>
  );
};

export const Scene2Calculs: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const face = mixFace(EXPRESSIONS.perplexe, EXPRESSIONS.epuise, prog(frame, 240, 420));
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 450, energy: 1.05, gesture: "phone" });

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ModernSalonSet sway={Math.sin(frame / 28) * 2} />
          <CharacterG
            spec={AICHA}
            x={540}
            y={1650}
            scale={1.24}
            pose={{
              ...SIT,
              ...dyn,
              face,
              handR: "phone",
              blink: blink(frame, 2.6),
              sweat: prog(frame, 260, 460),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 560,
            width: 760,
            translate: "-50% -50%",
            background: "rgba(255,255,255,0.96)",
            borderRadius: 32,
            padding: 28,
            boxShadow: "0 26px 60px -20px rgba(0,0,0,0.35)",
            border: "3px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: BRAND.muted, marginBottom: 4 }}>
            CALCULS DU MOIS
          </div>
          <CalcRow icon="home" label="Loyer" amount="− 110 000 F" at={24} frame={frame} fps={fps} highlight />
          <CalcRow icon="droplet" label="Eau & Électricité" amount="− 18 000 F" at={105} frame={frame} fps={fps} />
          <CalcRow icon="wallet" label="Courses & Transport" amount="Calculer..." at={255} frame={frame} fps={fps} />
          <CalcRow icon="zap" label="Reste à vivre" amount="Serré !" at={345} frame={frame} fps={fps} highlight />
        </div>
      </Camera>

      <VoiceOver scene="S2-Calculs" />
      <Sfx name="pop" at={24} volume={0.45} />
      <Sfx name="tick" at={105} volume={0.4} />
      <Sfx name="tick" at={255} volume={0.4} />
      <Sfx name="impact" at={345} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
