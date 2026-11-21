import React from "react";
import { AbsoluteFill, Interactive, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../motion/Camera";
import { StreetSet } from "../sets/Street";
import { CrossroadSet } from "../sets/Crossroad";
import { CharacterG } from "../characters/Character";
import { SENAN, VENDEUSE, ZEM } from "../characters/bible";
import { EXPRESSIONS, mixFace } from "../characters/expressions";
import { LIMBS, RIDE, SIT, mixLimb, walkCycle } from "../characters/poses";
import { Bed, Cooler, Doormat, Fan, Goat, LampPost, Moto, StreetSign, TV } from "../props/Objects";
import { SpendTag } from "../props/SpendCounter";
import { EASE, blink, breathe, pop, prog } from "../motion/anim";
import { VoiceOver } from "../audio/VoiceOver";
import { Sfx } from "../audio/Sfx";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

/**
 * SCÈNE 4 — La touche humoristique (0:17–0:27)
 * 4.1 Rêverie en bulle de pensée : Sènan a « emménagé » sur le terre-plein
 *     d'un carrefour, flegmatique, en pyjama, tasse à la main.
 * 4.2 « Mais sérieusement » : la bulle éclate ; retour au réel, regard caméra,
 *     bras écartés : « pourquoi ? ». Le compteur 10 000 clignote encore.
 */
const BURST = 138;

/** Contour de nuage ondulé (bulle de pensée). */
const cloudPath = (cx: number, cy: number, rx: number, ry: number, wob: number) => {
  const n = 14;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 1 + 0.06 * Math.sin(a * 3 + wob);
    const x = cx + Math.cos(a) * rx * r;
    const y = cy + Math.sin(a) * ry * r;
    if (i === 0) d += `M ${x} ${y}`;
    else {
      const am = ((i - 0.5) / n) * Math.PI * 2;
      const bulge = 1.13 + 0.03 * Math.sin(wob * 1.3 + i);
      d += ` Q ${cx + Math.cos(am) * rx * bulge} ${cy + Math.sin(am) * ry * bulge} ${x} ${y}`;
    }
  }
  return d + " Z";
};

const Reverie: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = pop(f, fps, 0, { damping: 13, stiffness: 120 });
  const wob = f * 0.08;
  // zém qui tourne autour du « salon »
  const ang = f * 0.045 + 1.2;
  const zx = 540 + Math.cos(ang) * 470;
  const zy = 1450 + Math.sin(ang) * 120;
  const zFront = Math.sin(ang) > 0;
  const zFlip = Math.cos(ang + Math.PI / 2) < 0;
  // vendeuse de bouillie qui traverse
  const vx = interpolate(f, [20, 130], [-160, 1240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vWave = prog(f, 60, 70) * (1 - prog(f, 92, 102));
  const walk = walkCycle(f, 0.3);
  const goatChew = Math.abs(Math.sin(f * 0.35));
  const zemG = (
    <g>
      <Moto x={zx} y={zy + 160} scale={0.62} wheelRot={f * 20} flip={zFlip} />
      <g transform={`translate(${zFlip ? 2 * zx : 0} 0) scale(${zFlip ? -1 : 1} 1)`}>
        <CharacterG spec={ZEM} x={zx + 40} y={zy + 166} scale={0.6} shadow={false} pose={{ ...RIDE, face: EXPRESSIONS.confiant, armL: { a: -40, b: 40 }, armR: { a: 62, b: 30 }, headTurn: 0.5, blink: blink(f, 9) }} />
      </g>
    </g>
  );
  const clip = cloudPath(540, 1000, 500, 640, wob);
  return (
    <AbsoluteFill>
      {/* fond réel assombri derrière la bulle */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, filter: "blur(6px) saturate(0.6) brightness(0.75)" }}>
        <StreetSet pan={-300} sky={0.95} />
      </svg>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="s4cloud">
            <path d={clip} />
          </clipPath>
        </defs>
        {/* petites bulles qui mènent à la pensée */}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={180 + i * 70} cy={1840 - i * 90} r={(16 + i * 12) * prog(f, i * 3, i * 3 + 8)} fill="#FFFFFF" opacity={0.95} />
        ))}
        <g transform={`translate(540 1000) scale(${open}) translate(-540 -1000)`}>
          <path d={clip} fill="#FFFFFF" />
          <g clipPath="url(#s4cloud)">
            <g transform="translate(0 -180)">
              <CrossroadSet />
              <StreetSign x={890} y={1240} label="Akpakpa" />
              <LampPost x={140} y={1300} />
              {!zFront ? zemG : null}
              {/* câble du ventilateur branché sur le lampadaire */}
              <path d="M 150 920 Q 230 1180 330 1290" stroke="#2A2A2A" strokeWidth={5} fill="none" />
              <Fan x={330} y={1330} scale={0.7} spin={f * 30} />
              <Bed x={420} y={1380} w={420} withNet={false} />
              <Cooler x={840} y={1440} />
              <TV x={840} y={1300} />
              <CharacterG
                spec={SENAN}
                x={600}
                y={1440}
                scale={0.9}
                pose={{
                  ...SIT,
                  outfit: "pyjama",
                  face: { ...EXPRESSIONS.flegme, lookX: 0.3 },
                  armR: LIMBS.armMug,
                  handR: "mug",
                  armL: { a: 14, b: 10 },
                  headTilt: Math.sin(f / 30) * 2,
                  bob: breathe(f, fps) * 1.5,
                  blink: blink(f, 4, 80),
                }}
              />
              <Doormat x={600} y={1560} bite={goatChew * 0.2 + prog(f, 0, 130) * 0.5} />
              <Goat x={380} y={1580} chew={goatChew} scale={0.7} />
              <CharacterG
                spec={VENDEUSE}
                x={vx}
                y={1760}
                scale={0.85}
                pose={{
                  face: { ...EXPRESSIONS.ravi, lookX: 0.6 },
                  legL: walk.legL,
                  legR: walk.legR,
                  bob: walk.bob,
                  armL: { a: 160, b: 10 },
                  armR: mixLimb(walk.armR!, LIMBS.armWave, vWave),
                  handR: vWave > 0.5 ? "open" : "none",
                  headTurn: 0.4,
                  blink: blink(f, 11),
                }}
              />
              {/* bassine de bouillie sur la tête */}
              <g transform={`translate(${vx} ${1760 - 640 * 0.85 + walk.bob! * 0.85 - 30})`}>
                <ellipse cx={0} cy={0} rx={90} ry={22} fill="#C9CED4" />
                <path d="M -90 0 Q 0 60 90 0" fill="#AEB4BB" />
                <ellipse cx={0} cy={-4} rx={78} ry={14} fill="#F2E3B8" />
              </g>
              {zFront ? zemG : null}
            </g>
          </g>
          <path d={clip} fill="none" stroke="#FFFFFF" strokeWidth={18} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const RealWhy: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shakeHead = prog(f, 8, 34) < 1 && f > 8 ? Math.sin(f * 1.4) * 9 * (1 - prog(f, 8, 34)) : 0;
  const spread = pop(f, fps, 40, { damping: 12 });
  const face = mixFace({ ...EXPRESSIONS.epuise, eyeOpen: 0.1 }, EXPRESSIONS.pourquoi, prog(f, 30, 42));
  const zoom = interpolate(f, [0, 40, 162], [1.15, 1.25, 1.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  const sf = 1000 + f; // compteur figé à 10 000
  return (
    <AbsoluteFill>
      <Camera zoom={zoom} focusX={540} focusY={1050}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={-300} sky={0.95} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1720}
            scale={1.35}
            pose={{
              face,
              headTilt: shakeHead,
              armL: mixLimb(LIMBS.armRest, LIMBS.armSpread, spread),
              armR: mixLimb(LIMBS.armRest, LIMBS.armSpread, spread),
              handL: spread > 0.5 ? "open" : "none",
              handR: spread > 0.5 ? "open" : "none",
              squash: 1 + spread * 0.015,
              bob: breathe(f, fps) * 2,
              wrinkle: 1,
              sweat: 0.6,
              blink: f > 42 ? blink(f, 6) : 0,
            }}
          />
        </svg>
        <SpendTag frame={sf} fps={fps} steps={[{ at: 0, value: 10000 }]} appearAt={0} x={540} y={790} opacity={0.55 + 0.45 * Math.round((Math.sin(f / 4) + 1) / 2)} />
      </Camera>
    </AbsoluteFill>
  );
};

const Scene4Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const burst = frame - BURST;
  return (
    <>
      <Sequence name="4.1 Rêverie" durationInFrames={BURST}>
        <Reverie />
      </Sequence>
      <Sequence name="4.2 Retour au réel" from={BURST}>
        <RealWhy />
      </Sequence>
      {/* éclatement de la bulle en confettis */}
      {burst >= 0 && burst < 20 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg width={1080} height={1920}>
            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i / 36) * Math.PI * 2;
              const d = 200 + burst * (28 + (i % 5) * 6);
              return (
                <circle key={i} cx={540 + Math.cos(a) * d} cy={1000 + Math.sin(a) * d * 1.2} r={14 - burst * 0.6} fill={i % 3 === 0 ? "#F4C430" : "#FFFFFF"} opacity={1 - burst / 20} />
              );
            })}
          </svg>
          <AbsoluteFill style={{ background: "#FFFFFF", opacity: interpolate(burst, [0, 3, 8], [0.9, 0.5, 0], { extrapolateRight: "clamp" }) }} />
        </AbsoluteFill>
      ) : null}
      <FilmFinish vignette={0.3} />
      <VoiceOver scene="S4-Reverie" />
      <Audio name="Musique rêverie (provisoire)" src={staticFile("audio/music/reverie.wav")} volume={0.35} durationInFrames={BURST} />
      <Sfx name="bubble" at={0} volume={0.5} />
      <Sfx name="horn" at={40} volume={0.25} />
      <Sfx name="goat" at={70} volume={0.45} />
      <Sfx name="pop" at={BURST} volume={0.8} />
      <Sfx name="sparkle" at={BURST} volume={0.35} />
      <Sfx name="swoosh" at={BURST + 10} volume={0.3} />
      <Sfx name="whoosh" at={BURST + 40} volume={0.3} />
    </>
  );
};

export const Scene4Reverie = Interactive.create({ Component: Scene4Inner, layout: "absolute-fill" });
