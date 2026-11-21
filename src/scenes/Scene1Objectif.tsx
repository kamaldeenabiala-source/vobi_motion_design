import React from "react";
import { AbsoluteFill, Interactive, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../motion/Camera";
import { RoomSet } from "../sets/Room";
import { CharacterG } from "../characters/Character";
import { SENAN } from "../characters/bible";
import { EXPRESSIONS, mixFace } from "../characters/expressions";
import { LIMBS, SIT, mixLimb, walkCycle } from "../characters/poses";
import { HouseBubble } from "../props/HouseBubble";
import { EASE, blink, breathe, lerpF, pop, prog } from "../motion/anim";
import { VoiceOver } from "../audio/VoiceOver";
import { Sfx } from "../audio/Sfx";

/**
 * SCÈNE 1 — L'objectif : 50 000 FCFA (0:00–0:04)
 * Plan 1.1 : le téléphone s'allume dans le noir, éclaire Sènan assis sur son lit.
 * Plan 1.2 : la bulle maison jaillit, « 50 000 FCFA » s'écrit ; poing « yes »,
 *            il se lève, ouvre la porte → flash de lumière chaude.
 */
const Scene1Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timings (frames, relatifs à la scène)
  const BUBBLE = 40;
  const FIST = 70;
  const STAND = 90;
  const WALK = 100;
  const DOOR = 104;

  // Caméra : gros plan téléphone → travelling arrière → légère poussée vers la porte
  const zoom = interpolate(frame, [0, 16, 58, 96, 120], [2.7, 2.6, 1.2, 1.2, 1.36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const focusX = lerpF(frame, [0, 58, 96, 120], [470, 540, 540, 800]);
  const focusY = lerpF(frame, [0, 58], [1110, 1080]);

  // Sènan
  const standK = prog(frame, STAND, STAND + 14, EASE.inOut);
  const walkK = prog(frame, WALK, WALK + 8);
  const walk = walkCycle(frame - WALK, 0.42);
  const x = interpolate(frame, [WALK, 120], [430, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in });
  const feetY = interpolate(standK, [0, 1], [1595, 1640]);
  const fist = pop(frame, fps, FIST, { damping: 9 });
  const fistDown = prog(frame, FIST + 16, STAND + 4);
  const lookUp = prog(frame, BUBBLE - 4, BUBBLE + 8);

  let face = mixFace(EXPRESSIONS.motive, { ...EXPRESSIONS.motive, lookY: 0.55, eyeOpen: 0.9 }, 1 - lookUp);
  face = mixFace(face, { ...EXPRESSIONS.motive, lookY: -0.7, lookX: 0.2, browY: -12 }, lookUp);
  face = mixFace(face, EXPRESSIONS.confiant, prog(frame, FIST, FIST + 6));
  face = mixFace(face, { ...EXPRESSIONS.motive, lookX: 0.8 }, prog(frame, STAND, STAND + 8));

  const sitPose = SIT;
  const thighScale = interpolate(standK, [0, 1], [sitPose.thighScale ?? 1, 1]);
  const legL = mixLimb(sitPose.legL!, walkK > 0 ? walk.legL! : LIMBS.legStand, standK);
  const legR = mixLimb(sitPose.legR!, walkK > 0 ? walk.legR! : LIMBS.legStand, standK);
  const armL = mixLimb(mixLimb(LIMBS.armRest, LIMBS.armFistUp, fist), { a: 12, b: 20 }, fistDown);
  const armR = LIMBS.armPhoneR;

  const phoneScreen = { x: x + 22, y: feetY - 520 * 1.35 + (1 - standK) * 160 };

  // Bulle maison : jaillit du téléphone avec un rebond élastique
  const bubbleK = spring({ frame: frame - BUBBLE, fps, config: { damping: 10, stiffness: 120, mass: 0.8 } });
  const bubbleX = interpolate(bubbleK, [0, 1], [phoneScreen.x, 560]);
  const bubbleY = interpolate(bubbleK, [0, 1], [phoneScreen.y, 470]);
  const typed = interpolate(frame, [BUBBLE + 8, BUBBLE + 36], [0, 11], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubbleExit = prog(frame, WALK, 120, EASE.in);

  // Obscurité : la chambre est éclairée par l'écran puis par l'aube
  const darkness = interpolate(frame, [0, 20, 60, DOOR, DOOR + 10], [0.94, 0.9, 0.4, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [DOOR + 6, 114, 120], [0, 0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <Camera zoom={zoom} focusX={focusX} focusY={focusY}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="s1dark" gradientUnits="userSpaceOnUse" cx={phoneScreen.x} cy={phoneScreen.y - 40} r={520}>
              <stop offset="0" stopColor="#0A0E1F" stopOpacity={0} />
              <stop offset="0.35" stopColor="#0A0E1F" stopOpacity={0.55} />
              <stop offset="1" stopColor="#0A0E1F" stopOpacity={1} />
            </radialGradient>
          </defs>
          <RoomSet fanSpin={frame * 38} doorOpen={prog(frame, DOOR, DOOR + 10)} dawn={interpolate(frame, [0, 90], [0.2, 0.7], { extrapolateRight: "clamp" })} />
          <CharacterG
            spec={SENAN}
            x={x}
            y={feetY}
            scale={1.35}
            pose={{
              face,
              thighScale,
              legL,
              legR,
              armL,
              armR,
              handL: fist > 0.3 && fistDown < 0.8 ? "fist" : "none",
              handR: "phone",
              phoneGlow: 1,
              headTilt: interpolate(lookUp, [0, 1], [6, -3]) + Math.sin(frame / 7) * 0.6,
              headTurn: interpolate(frame, [STAND, STAND + 10], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              bob: walkK > 0 ? walk.bob : breathe(frame, fps) * 2 - fist * 10 * (1 - fistDown),
              lean: interpolate(standK, [0, 0.5, 1], [0, 6, 2]),
              blink: blink(frame, 2),
              squash: 1 + fist * 0.02 * (1 - fistDown),
            }}
          />
          {/* lumière de l'écran sur le visage */}
          <circle cx={phoneScreen.x} cy={phoneScreen.y - 30} r={150} fill="#BFF3DA" opacity={0.18 * (darkness > 0.2 ? 1 : 0)} />
          <rect x={-300} y={-300} width={1700} height={2500} fill="url(#s1dark)" opacity={darkness} />
        </svg>
        {frame >= BUBBLE ? (
          <HouseBubble
            x={bubbleX}
            y={bubbleY - bubbleExit * 600}
            scale={interpolate(bubbleK, [0, 1], [0.1, 1]) * (1 - bubbleExit * 0.4)}
            rotate={Math.sin(frame / 10) * 2}
            typed={typed}
          />
        ) : null}
      </Camera>
      <FilmFinish vignette={0.3} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 85% 45%, #FFF8E6 0%, #FFE2A3 70%)", opacity: flash }} />
      <VoiceOver scene="S1-Objectif" />
      <Sfx name="notif" at={4} volume={0.35} />
      <Sfx name="squeak" at={0} volume={0.12} />
      <Sfx name="pop" at={BUBBLE} volume={0.7} />
      <Sfx name="tick" at={BUBBLE + 12} volume={0.25} />
      <Sfx name="tick" at={BUBBLE + 22} volume={0.25} />
      <Sfx name="tick" at={BUBBLE + 32} volume={0.25} />
      <Sfx name="swoosh" at={FIST - 2} volume={0.4} />
      <Sfx name="whoosh" at={STAND} volume={0.35} />
      <Sfx name="keylock" at={DOOR - 2} volume={0.4} />
      <Sfx name="flash" at={DOOR + 6} volume={0.45} />
    </>
  );
};

export const Scene1Objectif = Interactive.create({ Component: Scene1Inner, layout: "absolute-fill" });
