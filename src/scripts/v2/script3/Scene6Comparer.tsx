import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../../../motion/Camera";
import { ShadeSet } from "../../../sets/Shade";
import { CharacterG } from "../../../characters/Character";
import { AICHA } from "../../../characters/bible";
import { EXPRESSIONS } from "../../../characters/expressions";
import { LIMBS, dynamicPose } from "../../../characters/poses";
import { HouseThumb } from "../../../vobi-ui/HouseThumb";
import { Icon } from "../../../vobi-ui/icons";
import { blink } from "../../../motion/anim";
import { FONT } from "../../../theme/fonts";
import { BRAND } from "../../../config/brand";
import { VoiceOver } from "./VoiceOver";
import { Sfx } from "../../../audio/Sfx";

/**
 * SCÈNE 6 V2 — Comparer et choisir la maison qui équilibre goût & budget (10,0 s / 300 frames)
 */
export const Scene6Comparer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const C1 = 22;
  const C2 = 58;
  const CHECK = 140;

  const c1K = spring({ frame: frame - C1, fps, config: { damping: 12, stiffness: 145 } });
  const c2K = spring({ frame: frame - C2, fps, config: { damping: 12, stiffness: 145 } });
  const checkK = frame >= CHECK ? spring({ frame: frame - CHECK, fps, config: { damping: 10, stiffness: 185 } }) : 0;
  const dyn = dynamicPose(frame, { speaking: frame >= 15 && frame < 260, energy: 1.15, gesture: "excited" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.background, ...style }}>
      <Camera zoom={1.06} focusX={540} focusY={1040}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ShadeSet sway={Math.sin(frame / 26) * 2} brand={1} />
          <CharacterG
            spec={AICHA}
            x={540}
            y={1645}
            scale={1.25}
            pose={{
              ...dyn,
              face: EXPRESSIONS.ravi,
              legL: LIMBS.legStand,
              legR: LIMBS.legStand,
              handL: "thumbUp",
              handR: "phone",
              blink: blink(frame, 3.2),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 285,
            top: 600,
            width: 410,
            translate: "-50% -50%",
            scale: String(c1K),
            opacity: checkK > 0.2 ? 0.65 : 1,
            background: "#FFFFFF",
            borderRadius: 26,
            padding: 16,
            border: "2px solid #E2E8F0",
            boxShadow: "0 18px 40px -16px rgba(0,0,0,0.22)",
          }}
        >
          <HouseThumb variant="studio" width={378} height={210} radius={16} />
          <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: BRAND.slate900 }}>
            Offre A
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: BRAND.muted }}>
            75 000 FCFA
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 795,
            top: 600,
            width: 410,
            translate: "-50% -50%",
            scale: String(c2K),
            background: "#FFFFFF",
            borderRadius: 26,
            padding: 16,
            border: `4px solid ${checkK > 0.2 ? BRAND.emerald : BRAND.lightGreen}`,
            boxShadow: "0 24px 54px -18px rgba(5,150,105,0.45)",
          }}
        >
          <HouseThumb variant="chambreSalon" width={378} height={210} radius={16} />
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: BRAND.slate900 }}>
                Coup de cœur
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: BRAND.primary }}>
                50 000 FCFA
              </div>
            </div>
            {checkK > 0 ? (
              <div
                style={{
                  scale: String(checkK),
                  width: 52,
                  height: 52,
                  borderRadius: 99,
                  background: BRAND.emerald,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="check" size={30} color="#FFFFFF" stroke={3} />
              </div>
            ) : null}
          </div>
        </div>
      </Camera>

      <VoiceOver scene="S6-Comparer" dark />
      <Sfx name="pop" at={C1} volume={0.45} />
      <Sfx name="pop" at={C2} volume={0.45} />
      <Sfx name="check" at={CHECK} volume={0.6} />
      <FilmFinish />
    </AbsoluteFill>
  );
};
