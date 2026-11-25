import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../motion/Camera";
import { RoomSet } from "../../sets/Room";
import { CharacterG } from "../../characters/Character";
import { SENAN } from "../../characters/bible";
import { EXPRESSIONS, mixFace } from "../../characters/expressions";
import { LIMBS, SIT } from "../../characters/poses";
import { Icon, type IconName } from "../../vobi-ui/icons";
import { blink, prog } from "../../motion/anim";
import { FONT } from "../../theme/fonts";
import { BRAND } from "../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../audio/Sfx";

/**
 * SCÈNE 2 — D'autres dépenses à gérer & calculs permanents (12,5 s / 375 frames)
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
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 170 } });
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

  const face = mixFace(EXPRESSIONS.perplexe, EXPRESSIONS.epuise, prog(frame, 180, 320));

  return (
    <AbsoluteFill style={style}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RoomSet fanSpin={frame * 30} dawn={0.55} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1620}
            scale={1.25}
            pose={{
              ...SIT,
              face,
              armL: LIMBS.armRest,
              armR: LIMBS.armPhoneR,
              handR: "phone",
              headTurn: 0.06,
              blink: blink(frame, 2.6),
              sweat: prog(frame, 200, 350),
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
            boxShadow: "0 26px 60px -20px rgba(0,0,0,0.4)",
            border: "3px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: BRAND.muted, marginBottom: 4 }}>
            CALCULS DU MOIS
          </div>
          <CalcRow icon="home" label="Loyer" amount="− 110 000 F" at={18} frame={frame} fps={fps} highlight />
          <CalcRow icon="droplet" label="Eau & Électricité" amount="− 18 000 F" at={80} frame={frame} fps={fps} />
          <CalcRow icon="wallet" label="Courses & Transport" amount="Calculer..." at={190} frame={frame} fps={fps} />
          <CalcRow icon="zap" label="Reste à vivre" amount="Serré !" at={255} frame={frame} fps={fps} highlight />
        </div>
      </Camera>

      <VoiceOver scene="S2-Calculs" />
      <Sfx name="pop" at={18} volume={0.45} />
      <Sfx name="tick" at={80} volume={0.4} />
      <Sfx name="tick" at={190} volume={0.4} />
      <Sfx name="impact" at={255} volume={0.55} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
