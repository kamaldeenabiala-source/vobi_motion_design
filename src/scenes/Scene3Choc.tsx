import React from "react";
import { AbsoluteFill, Interactive, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../motion/Camera";
import { StreetSet } from "../sets/Street";
import { CharacterG } from "../characters/Character";
import { SENAN } from "../characters/bible";
import { EXPRESSIONS } from "../characters/expressions";
import { HouseBubble } from "../props/HouseBubble";
import { RollingValue } from "../props/SpendCounter";
import { EASE, prog, shake } from "../motion/anim";
import { VoiceOver } from "../audio/VoiceOver";
import { Sfx } from "../audio/Sfx";
import { FONT } from "../theme/fonts";
import { BRAND } from "../config/brand";

/**
 * SCÈNE 3 — Le choc : 10 000 FCFA déjà dépensés (0:14–0:17)
 * 3.1 Le compteur envahit l'écran, chiffres façon machine à sous, arrêt net.
 * 3.2 Crash zoom sur Sènan, portefeuille vide (une mite s'en échappe) ;
 *     la bulle maison se dégonfle et part en tourbillonnant → ouvre la rêverie.
 */
const Scene3Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CUT = 30;
  const STOP = 22;

  // 3.1 compteur géant
  const roll = interpolate(frame, [0, STOP], [9000, 10000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing3 });
  const grow = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const stopHit = spring({ frame: frame - STOP, fps, config: { damping: 7, stiffness: 300, mass: 0.5 } });
  const sh1 = shake(frame, STOP, 14, 26, "s3a");

  // 3.2 crash zoom
  const local = frame - CUT;
  const zoom = interpolate(local, [0, 5, 60], [1.0, 1.75, 1.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  const sh2 = shake(local, 0, 18, 22, "s3b");
  const deflate = prog(local, 16, 44, EASE.inOut);
  const swirl = prog(local, 30, 60, EASE.in);
  const mothT = prog(local, 10, 50, (t) => t);

  return (
    <>
      {frame < CUT ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at 50% 45%, #5A1424 0%, #2A0A12 60%, #14050A 100%)",
            justifyContent: "center",
            alignItems: "center",
            translate: `${sh1.x}px ${sh1.y}px`,
          }}
        >
          {/* rayons */}
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.18 + stopHit * 0.12 }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <path key={i} d="M540 860 L 520 -200 L 560 -200 Z" fill="#FF7A8E" transform={`rotate(${i * 22.5 + frame * 0.8} 540 860)`} />
            ))}
          </svg>
          <div style={{ scale: String(interpolate(grow, [0, 1], [0.35, 1]) * (1 + 0.08 * Math.sin(stopHit * Math.PI))), display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: -160 }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, letterSpacing: "0.18em", color: "#FFB3C0" }}>DÉPENSÉ</div>
            <div
              style={{
                padding: "26px 44px",
                borderRadius: 40,
                background: "#FFFFFF",
                boxShadow: "0 40px 90px -30px rgba(0,0,0,0.6), 0 0 0 10px rgba(225,29,72,0.35)",
                display: "flex",
                alignItems: "baseline",
                gap: 18,
              }}
            >
              <RollingValue value={roll} fontSize={190} color={BRAND.debit} minDigits={5} />
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: BRAND.debit }}>FCFA</span>
            </div>
          </div>
        </AbsoluteFill>
      ) : (
        <>
          <Camera zoom={zoom} focusX={540} focusY={930} panX={sh2.x} panY={sh2.y} rotate={sh2.r}>
            <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
              <StreetSet pan={-300} sky={0.95} />
              <CharacterG
                spec={SENAN}
                x={540}
                y={1720}
                scale={1.35}
                pose={{
                  face: { ...EXPRESSIONS.choque, mouthOpen: 30 + Math.sin(local * 1.4) * 3 },
                  armL: { a: -10, b: 100 },
                  handL: "walletOpen",
                  armR: { a: 20, b: 20 },
                  handR: "open",
                  squash: 1 + Math.sin(local * 2.2) * 0.006,
                  wrinkle: 1,
                  sweat: 1,
                  blink: 0,
                }}
              />
              {/* mite qui s'échappe du portefeuille vide */}
              {mothT > 0 && mothT < 1 ? (
                <g transform={`translate(${480 + mothT * 160 + Math.sin(local * 0.5) * 30} ${1120 - mothT * 380})`}>
                  <ellipse cx={-14} cy={0} rx={18} ry={11 * Math.abs(Math.sin(local * 1.3))} fill="#9A9184" />
                  <ellipse cx={14} cy={0} rx={18} ry={11 * Math.abs(Math.sin(local * 1.3))} fill="#9A9184" />
                  <ellipse cx={0} cy={2} rx={5} ry={12} fill="#6C6458" />
                </g>
              ) : null}
            </svg>
          </Camera>
          {/* bulle maison qui se dégonfle et s'envole en tourbillonnant */}
          <HouseBubble
            x={interpolate(swirl, [0, 1], [540, 1300]) + Math.sin(local * 0.6) * 40 * deflate}
            y={interpolate(swirl, [0, 1], [430, -260]) + Math.cos(local * 0.6) * 30 * deflate}
            scale={0.9 - deflate * 0.25}
            rotate={deflate * 40 + swirl * 540}
            deflate={deflate}
          />
          <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, transparent 40%, rgba(60,0,10,0.35) 100%)" }} />
        </>
      )}
      <FilmFinish vignette={0.35} />
      <VoiceOver scene="S3-Choc" />
      <Sfx name="roll" at={0} volume={0.6} />
      <Sfx name="cymbal" at={STOP} volume={0.55} />
      <Sfx name="impact" at={STOP} volume={0.5} />
      <Sfx name="whip" at={CUT - 3} volume={0.5} />
      <Sfx name="rumble" at={CUT} volume={0.5} />
      <Sfx name="deflate" at={CUT + 16} volume={0.6} />
    </>
  );
};

const Easing3 = (t: number) => 1 - Math.pow(1 - t, 3);

export const Scene3Choc = Interactive.create({ Component: Scene3Inner, layout: "absolute-fill" });
