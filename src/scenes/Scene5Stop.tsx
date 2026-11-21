import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../motion/Camera";
import { StreetSet } from "../sets/Street";
import { CharacterG } from "../characters/Character";
import { DEMARCHEUR, SENAN } from "../characters/bible";
import { EXPRESSIONS, mixFace } from "../characters/expressions";
import { LIMBS, mixLimb } from "../characters/poses";
import { FlyingBill } from "../props/Money";
import { SpendTag } from "../props/SpendCounter";
import { EASE, blink, breathe, prog, shake } from "../motion/anim";
import { VoiceOver } from "../audio/VoiceOver";
import { Sfx } from "../audio/Sfx";
import { FONT } from "../theme/fonts";
import { ASSETS, BRAND } from "../config/brand";

/**
 * SCÈNE 5 — VOBI dit STOP (0:27–0:31)
 * 5.1 Un démarcheur tend la main, un billet s'envole… arrêt sur image,
 *     désaturation ; « STOP » s'abat et pulvérise le compteur.
 * 5.2 Le panneau pivote et révèle le logo VOBI ; une onde verte recolore tout
 *     vers le fond clair VOBI ; le billet revient dans le portefeuille.
 */
const FREEZE = 30;
const SLAM = 38;
const FLIP = 56;
const WAVE = 74;

const World: React.FC<{ f: number; vobi: boolean }> = ({ f, vobi }) => {
  const { fps } = useVideoConfig();
  // dans le monde figé, le temps s'arrête à FREEZE ; dans le monde VOBI il repart
  const t = vobi ? f : Math.min(f, FREEZE);
  const enter = interpolate(t, [0, 16], [1250, 720], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  const exit = vobi ? interpolate(f, [WAVE + 8, WAVE + 30], [0, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in }) : 0;
  const unfreeze = vobi ? prog(f, WAVE + 4, WAVE + 16) : 0;
  const sFace = vobi
    ? mixFace({ ...EXPRESSIONS.agace, mouthCurve: -8, eyeOpen: 0.7 }, EXPRESSIONS.soulage, unfreeze)
    : { ...EXPRESSIONS.agace, mouthCurve: -8, eyeOpen: 0.7 };
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {vobi ? (
        <>
          <defs>
            <radialGradient id="s5vobi" cx="0.5" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#EAF7EE" />
              <stop offset="1" stopColor={BRAND.background} />
            </radialGradient>
          </defs>
          <rect width={1080} height={1920} fill="url(#s5vobi)" />
          <ellipse cx={540} cy={1730} rx={420} ry={40} fill={BRAND.primary} opacity={0.08} />
        </>
      ) : (
        <StreetSet pan={-500} sky={0.95} />
      )}
      <CharacterG
        spec={SENAN}
        x={340}
        y={1720}
        scale={1.3}
        pose={{
          face: sFace,
          armL: LIMBS.armWalletL,
          handL: "walletOpen",
          armR: vobi ? mixLimb(LIMBS.armRest, { a: 30, b: 30 }, unfreeze) : LIMBS.armRest,
          headTurn: 0.4,
          bob: vobi ? breathe(f, fps) * 2 : 0,
          blink: vobi && f > WAVE + 10 ? blink(f, 3) : vobi && f > WAVE + 2 && f < WAVE + 8 ? 1 : 0,
          wrinkle: vobi ? 1 - unfreeze : 1,
          sweat: vobi ? 0.6 * (1 - unfreeze) : 0.6,
        }}
      />
      <CharacterG
        spec={DEMARCHEUR}
        x={enter + exit}
        y={1720}
        scale={1.3}
        pose={{
          face: vobi ? { ...EXPRESSIONS.perplexe, lookX: -0.6 } : { ...EXPRESSIONS.sourireCommercial, lookX: -0.5 },
          armL: LIMBS.armPalmOut,
          handL: "open",
          armR: LIMBS.armPhoneEar,
          handR: "phone",
          headTurn: -0.4,
          lean: vobi ? -8 * prog(f, WAVE + 8, WAVE + 20) : 0,
          blink: 0,
        }}
      />
      {vobi ? (
        // le billet revient tout seul dans le portefeuille
        <FlyingBill frame={f} start={WAVE + 6} duration={18} from={[520, 1060]} to={[300, 1180]} arc={-80} value="2000" seed="back" spin={1} />
      ) : (
        <FlyingBill frame={t} start={10} duration={36} from={[300, 1180]} to={[640, 1000]} arc={-160} value="2000" seed="s5" />
      )}
    </svg>
  );
};

const Scene5Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sh = shake(frame, SLAM + 6, 16, 34, "s5");
  const desat = prog(frame, FREEZE, FREEZE + 4);
  const slam = spring({ frame: frame - SLAM, fps, config: { damping: 9, stiffness: 220, mass: 0.9 } });
  const signY = interpolate(slam, [0, 1], [-700, 560]);
  const impact = frame >= SLAM + 6 ? Math.max(0, 1 - (frame - SLAM - 6) / 8) : 0;
  const flip = prog(frame, FLIP, FLIP + 16, EASE.inOut);
  const flipCos = Math.cos(flip * Math.PI);
  const showBack = flip > 0.5;
  const wave = prog(frame, WAVE, WAVE + 26, EASE.inOut);
  const waveR = wave * 2300;
  const logoLift = prog(frame, WAVE + 24, 120, EASE.inOut);
  const signScale = interpolate(logoLift, [0, 1], [1, 0.55]);
  const signTop = interpolate(logoLift, [0, 1], [signY, 360]);

  return (
    <>
      <Camera zoom={interpolate(frame, [FLIP, WAVE + 20], [1, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} panX={sh.x} panY={sh.y} rotate={sh.r}>
        {/* monde réel (figé puis désaturé) */}
        <AbsoluteFill style={{ filter: `grayscale(${desat * 0.85}) brightness(${1 - desat * 0.12}) contrast(${1 + desat * 0.05})` }}>
          <World f={frame} vobi={false} />
          {frame < SLAM + 6 ? <SpendTag frame={1000} fps={fps} steps={[{ at: 0, value: 10000 }]} appearAt={0} x={340} y={790} /> : null}
        </AbsoluteFill>
        {/* éclats du compteur */}
        {frame >= SLAM + 6 && frame < SLAM + 40 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 22 }).map((_, i) => {
              const t = frame - SLAM - 6;
              const a = (i / 22) * Math.PI * 2 + i;
              const sp = 14 + (i % 5) * 6;
              const x = 340 + Math.cos(a) * sp * t;
              const y = 740 + Math.sin(a) * sp * t + 0.9 * t * t;
              return <polygon key={i} points="0,-14 12,6 -10,10" transform={`translate(${x} ${y}) rotate(${t * 20 + i * 30})`} fill={i % 3 ? BRAND.debit : "#FFFFFF"} opacity={1 - t / 34} />;
            })}
          </svg>
        ) : null}
        {/* monde VOBI révélé par l'onde verte */}
        {frame >= WAVE ? (
          <AbsoluteFill style={{ clipPath: `circle(${waveR}px at 540px ${signTop}px)` }}>
            <World f={frame} vobi />
          </AbsoluteFill>
        ) : null}
        {frame >= WAVE && wave < 1 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <circle cx={540} cy={signTop} r={waveR} fill="none" stroke={BRAND.emerald} strokeWidth={36} opacity={0.6} />
            <circle cx={540} cy={signTop} r={Math.max(0, waveR - 60)} fill="none" stroke={BRAND.lightGreen} strokeWidth={14} opacity={0.7} />
          </svg>
        ) : null}
      </Camera>

      {/* panneau STOP → logo VOBI */}
      {frame >= SLAM ? (
        <div style={{ position: "absolute", left: 540, top: signTop, translate: "-50% -50%", scale: `${Math.max(0.02, Math.abs(flipCos)) * signScale * (1 + impact * 0.08)} ${signScale * (1 - impact * 0.06)}` }}>
          {!showBack ? (
            <div style={{ width: 560, height: 560, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <svg width={560} height={560} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))" }}>
                <polygon points="29,2 71,2 98,29 98,71 71,98 29,98 2,71 2,29" fill="#FFFFFF" />
                <polygon points="31,6 69,6 94,31 94,69 69,94 31,94 6,69 6,31" fill={BRAND.destructive} />
              </svg>
              <span style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: "#FFFFFF", letterSpacing: "-0.02em" }}>STOP</span>
            </div>
          ) : (
            <div style={{ width: 560, height: 560, borderRadius: 280, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 30px 80px -20px rgba(11,107,79,0.55), 0 0 0 16px rgba(167,227,198,0.6)` }}>
              <Img src={ASSETS.logo} style={{ width: 330, height: "auto" }} />
            </div>
          )}
        </div>
      ) : null}
      <FilmFinish vignette={interpolate(wave, [0, 1], [0.35, 0.12])} />
      <VoiceOver scene="S5-Stop" dark={frame > WAVE + 20} />
      <Sfx name="cashout" at={10} volume={0.4} />
      <Sfx name="riser" at={SLAM - 14} volume={0.35} />
      <Sfx name="impact" at={SLAM + 6} volume={0.85} />
      <Sfx name="glass" at={SLAM + 6} volume={0.6} />
      <Sfx name="whoosh" at={FLIP} volume={0.5} />
      <Sfx name="sparkle" at={FLIP + 10} volume={0.4} />
      <Sfx name="swoosh" at={WAVE} volume={0.4} />
      <Sfx name="pop" at={WAVE + 22} volume={0.3} />
    </>
  );
};

export const Scene5Stop = Interactive.create({ Component: Scene5Inner, layout: "absolute-fill" });
