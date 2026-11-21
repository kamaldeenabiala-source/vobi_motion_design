import React from "react";
import { AbsoluteFill, Interactive, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../motion/Camera";
import { WhipShot } from "../motion/Whip";
import { StreetSet } from "../sets/Street";
import { HouseVisitSet } from "../sets/HouseVisit";
import { CharacterG } from "../characters/Character";
import { DEMARCHEUR, SENAN, ZEM } from "../characters/bible";
import { EXPRESSIONS, mixFace } from "../characters/expressions";
import { LIMBS, RIDE, mixLimb } from "../characters/poses";
import { FlyingBill } from "../props/Money";
import { DebitPop, SpendTag, type SpendStep } from "../props/SpendCounter";
import { Moto, StampedPaper, WaterSachet } from "../props/Objects";
import { EASE, blink, breathe, pop, prog } from "../motion/anim";
import { VoiceOver } from "../audio/VoiceOver";
import { Sfx } from "../audio/Sfx";
import { FONT } from "../theme/fonts";
import { BRAND } from "../config/brand";

/**
 * SCÈNE 2 — Les dépenses s'accumulent (0:04–0:14)
 * Décompte (storyboard §2) : démarcheur 2 000 · zém 1 500 · crédit 500 ·
 * démarcheur 2 000 · zém 1 500 · frais de dossier 2 000 · eau 500 = 10 000.
 */
export const SPEND_STEPS: SpendStep[] = [
  { at: 46, value: 2000 },
  { at: 98, value: 3500 },
  { at: 166, value: 4000 },
  { at: 190, value: 6000 },
  { at: 222, value: 7500 },
  { at: 248, value: 9500 },
  { at: 274, value: 10000 },
];

// Plans (frames de scène) : A démarcheur · B zém · C visite · D écran partagé
const A = [0, 62] as const;
const B = [62, 128] as const;
const C = [128, 206] as const;
const D = [206, 300] as const;
const W = 6; // demi-durée du filage

/** Fatigue croissante de Sènan selon la frame de scène. */
const fatigue = (sf: number) => interpolate(sf, [0, 300], [0.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const ShotDemarcheur: React.FC<{ off: number; dur: number }> = ({ off, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = f + off;
  const enter = interpolate(f, [2, 20], [1300, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  const palm = pop(f, fps, 24, { damping: 12 });
  const wallet = prog(f, 28, 36);
  const zoom = interpolate(f, [0, dur], [1.0, 1.12]);
  const sFace = mixFace(EXPRESSIONS.motive, EXPRESSIONS.perplexe, prog(f, 30, 40));
  return (
    <WhipShot local={f} dur={dur} first>
      <Camera zoom={zoom} focusX={540} focusY={1100}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={-f * 2} sky={0.05} sway={Math.sin(f / 15) * 8} />
          <CharacterG
            spec={SENAN}
            x={360}
            y={1740}
            scale={1.32}
            pose={{
              face: { ...sFace, lookX: 0.6 },
              armL: mixLimb(LIMBS.armRest, LIMBS.armWalletL, wallet),
              handL: wallet > 0.5 ? "walletOpen" : "none",
              armR: LIMBS.armRest,
              headTurn: 0.4,
              bob: breathe(f, fps) * 2,
              blink: blink(f, 1),
              wrinkle: fatigue(sf),
            }}
          />
          <CharacterG
            spec={DEMARCHEUR}
            x={enter}
            y={1740}
            scale={1.32}
            pose={{
              face: { ...EXPRESSIONS.sourireCommercial, lookX: -0.5 },
              armL: mixLimb(LIMBS.armPhoneEar, LIMBS.armPalmOut, palm),
              handL: palm > 0.5 ? "open" : "phone",
              armR: LIMBS.armPhoneEar,
              handR: "phone",
              headTurn: -0.4,
              lean: interpolate(f, [2, 20], [-12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              bob: Math.sin(f / 4) * 3,
              blink: 0,
              mouthTalk: f < 24 ? Math.abs(Math.sin(f / 2.2)) * 10 : 0,
            }}
          />
          <FlyingBill frame={f} start={40} duration={16} from={[300, 1150]} to={[610, 1130]} arc={-120} value="2000" seed="a1" />
        </svg>
        <SpendTag frame={sf} fps={fps} steps={SPEND_STEPS} appearAt={44} x={360} y={880} />
        <DebitPop frame={sf} at={46} amount={2000} x={780} y={760} />
      </Camera>
    </WhipShot>
  );
};

const ShotZem: React.FC<{ off: number; dur: number }> = ({ off, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = f + off;
  const bounce = Math.sin(f * 1.3) * 3;
  return (
    <WhipShot local={f} dur={dur}>
      <Camera zoom={1.05} focusX={540} focusY={1200} panY={bounce}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <StreetSet pan={-f * 34} sky={0.25} />
          {/* lignes de vitesse */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={((1400 - ((f * 60 + i * 290) % 1700)) as number)} y={1050 + i * 70} width={160} height={6} rx={3} fill="#FFFFFF" opacity={0.6} />
          ))}
          {/* poussière */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = ((f + i * 7) % 30) / 30;
            return <circle key={i} cx={330 - t * 260} cy={1600 - t * 60 + i * 6} r={20 + t * 40} fill="#D9A27C" opacity={0.5 * (1 - t)} />;
          })}
          <g transform={`translate(0 ${bounce})`}>
            <CharacterG
              spec={SENAN}
              x={470}
              y={1650}
              scale={1.12}
              shadow={false}
              pose={{
                ...RIDE,
                face: mixFace(EXPRESSIONS.agace, EXPRESSIONS.choque, prog(f, 22, 28) * (1 - prog(f, 40, 50))),
                armL: { a: -20, b: 70 },
                armR: { a: 30, b: 60 },
                headTilt: -6,
                lean: -6,
                blink: blink(f, 4),
                wrinkle: fatigue(sf),
                sweat: fatigue(sf) * 0.7,
              }}
            />
            <Moto x={560} y={1640} scale={1.15} wheelRot={f * 28} />
            <CharacterG
              spec={ZEM}
              x={640}
              y={1640}
              scale={1.12}
              shadow={false}
              pose={{
                ...RIDE,
                face: { ...EXPRESSIONS.confiant, lookX: 0.6 },
                armL: { a: -40, b: 40 },
                armR: { a: 62, b: 30 },
                headTurn: 0.5,
                lean: 4,
                blink: blink(f, 6),
              }}
            />
          </g>
          <FlyingBill frame={f} start={26} duration={26} from={[440, 1170]} to={[-60, 900]} arc={-160} value="1000" tint="amber" seed="z1" />
          <FlyingBill frame={f} start={32} duration={26} from={[450, 1180]} to={[60, 820]} arc={-200} value="500" tint="violet" seed="z2" />
        </svg>
        <SpendTag frame={sf} fps={fps} steps={SPEND_STEPS} appearAt={0} x={460} y={930} />
        <DebitPop frame={sf} at={98} amount={1500} x={240} y={960} />
      </Camera>
    </WhipShot>
  );
};

const ShotVisite: React.FC<{ off: number; dur: number }> = ({ off, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = f + off;
  const open = prog(f, 10, 22, EASE.out);
  const shock = prog(f, 20, 26);
  const phone = prog(f, 32, 40);
  const palm2 = pop(f, fps, 54, { damping: 12 });
  const zoom = interpolate(f, [0, 20, 30, dur], [1.0, 1.0, 1.14, 1.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  return (
    <WhipShot local={f} dur={dur}>
      <Camera zoom={zoom} focusX={560} focusY={1150}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <HouseVisitSet open={open} frame={f} />
          <CharacterG
            spec={SENAN}
            x={250}
            y={1760}
            scale={1.2}
            pose={{
              face: mixFace(mixFace(EXPRESSIONS.motive, { ...EXPRESSIONS.choque, lookX: 0.6 }, shock), EXPRESSIONS.agace, prog(f, 44, 52)),
              armL: LIMBS.armRest,
              armR: mixLimb(LIMBS.armRest, LIMBS.armPhoneR, phone),
              handR: phone > 0.5 ? "phone" : "none",
              phoneGlow: 1,
              headTurn: 0.5,
              squash: 1 - shock * 0.02 + Math.sin(f) * 0.004 * shock,
              blink: shock > 0.5 ? 0 : blink(f, 3),
              wrinkle: fatigue(sf),
              sweat: fatigue(sf) * 0.8,
            }}
          />
          <CharacterG
            spec={DEMARCHEUR}
            x={850}
            y={1760}
            scale={1.2}
            pose={{
              face: { ...EXPRESSIONS.sourireCommercial, lookX: -0.4 },
              armL: palm2 > 0.05 ? mixLimb(LIMBS.armPalmOut, LIMBS.armPalmOut, 1) : { a: 60, b: 30 },
              handL: "open",
              armR: LIMBS.armPhoneEar,
              handR: "phone",
              headTurn: -0.3,
              bob: Math.sin(f / 5) * 2,
              blink: 0,
            }}
          />
          <FlyingBill frame={f} start={56} duration={14} from={[300, 1250]} to={[720, 1170]} arc={-140} value="2000" seed="v1" />
        </svg>
        {/* recharge de crédit */}
        {f > 34 ? (
          <div
            style={{
              position: "absolute",
              left: 330,
              top: 1060,
              scale: String(pop(f, fps, 34)),
              opacity: interpolate(f, [34, 38, 60, 66], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              padding: "12px 20px",
              borderRadius: 18,
              background: "#1C232E",
              color: "#fff",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 28,
              boxShadow: "0 12px 30px -10px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            Recharge crédit <span style={{ color: BRAND.gold }}>500 F</span>
          </div>
        ) : null}
        <SpendTag frame={sf} fps={fps} steps={SPEND_STEPS} appearAt={0} x={250} y={900} />
        <DebitPop frame={sf} at={166} amount={500} x={300} y={980} />
        <DebitPop frame={sf} at={190} amount={2000} x={720} y={1000} />
      </Camera>
    </WhipShot>
  );
};

/** Écran partagé vertical en 3 cases, le soleil descend à chaque case. */
const ShotSplit: React.FC<{ off: number; dur: number }> = ({ off, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = f + off;
  const panel = (i: number) => {
    const at = 6 + i * 26;
    const k = interpolate(f, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
    return { k, x: (1 - k) * (i % 2 === 0 ? 1100 : -1100), local: f - at };
  };
  const p = [panel(0), panel(1), panel(2)];
  const tagY = sf < 236 ? 560 : sf < 262 ? 1200 : 1330;
  return (
    <WhipShot local={f} dur={dur} last>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #3A2A20, #1F1712)" }} />
      {/* Case 1 : zém */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 634, overflow: "hidden", translate: `${p[0].x}px 0px` }}>
        <svg width={1080} height={634} viewBox="0 700 1080 634">
          <StreetSet pan={-f * 30} sky={0.35} groundY={1180} height={1400} />
          <g transform="translate(0 -330)">
            <CharacterG spec={SENAN} x={470} y={1650} scale={0.95} shadow={false} pose={{ ...RIDE, face: EXPRESSIONS.epuise, armL: { a: -20, b: 70 }, armR: { a: 30, b: 60 }, wrinkle: 0.8, sweat: 0.8, blink: blink(f, 2) }} />
            <Moto x={560} y={1620} scale={1.0} wheelRot={f * 28} />
            <CharacterG spec={ZEM} x={630} y={1640} scale={0.95} shadow={false} pose={{ ...RIDE, face: EXPRESSIONS.confiant, armL: { a: -40, b: 40 }, armR: { a: 62, b: 30 }, headTurn: 0.5, blink: blink(f, 5) }} />
          </g>
        </svg>
      </div>
      {/* Case 2 : frais de dossier */}
      <div style={{ position: "absolute", left: 0, top: 643, width: 1080, height: 634, overflow: "hidden", translate: `${p[1].x}px 0px`, background: "#E9DCC3" }}>
        <svg width={1080} height={634} viewBox="0 0 1080 634">
          <rect width={1080} height={634} fill="#D8C3A0" />
          <rect y={430} width={1080} height={204} fill="#B98A5E" />
          <StampedPaper x={540} y={320} stamp={interpolate(p[1].local, [12, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          {/* tampon */}
          <g transform={`translate(600 ${interpolate(p[1].local, [6, 14, 20, 30], [-120, 360, 360, -160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`}>
            <rect x={-40} y={-200} width={80} height={140} rx={20} fill="#6B4A33" />
            <rect x={-80} y={-70} width={160} height={50} rx={10} fill="#3A2A20" />
          </g>
        </svg>
      </div>
      {/* Case 3 : eau fraîche sous le soleil */}
      <div style={{ position: "absolute", left: 0, top: 1286, width: 1080, height: 634, overflow: "hidden", translate: `${p[2].x}px 0px` }}>
        <svg width={1080} height={634} viewBox="0 840 1080 634">
          <StreetSet pan={-200} sky={0.9} groundY={1340} />
          <CharacterG
            spec={SENAN}
            x={420}
            y={1975}
            scale={1.3}
            pose={{
              face: { ...EXPRESSIONS.epuise, lookY: -0.6 },
              armR: { a: -30, b: 142 },
              handR: "fist",
              armL: LIMBS.armRest,
              headTilt: -14,
              wrinkle: 1,
              sweat: 1,
              blink: blink(f, 7),
            }}
          />
          <g transform="rotate(-25 485 1312)"><WaterSachet x={485} y={1312} scale={0.6} /></g>
        </svg>
      </div>
      <SpendTag frame={sf} fps={fps} steps={SPEND_STEPS} appearAt={0} x={780} y={tagY} scale={1.1} />
      <DebitPop frame={sf} at={222} amount={1500} x={300} y={420} />
      <DebitPop frame={sf} at={248} amount={2000} x={300} y={1060} />
      <DebitPop frame={sf} at={274} amount={500} x={720} y={1600} />
    </WhipShot>
  );
};

const Scene2Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const flashOut = interpolate(frame, [0, 8], [1, 0], { extrapolateRight: "clamp" });
  return (
    <>
      <Sequence name="2.1 Démarcheur" from={A[0]} durationInFrames={A[1] + W - A[0]}>
        <ShotDemarcheur off={A[0]} dur={A[1] + W - A[0]} />
      </Sequence>
      <Sequence name="2.2 Zém" from={B[0] - W} durationInFrames={B[1] - B[0] + 2 * W}>
        <ShotZem off={B[0] - W} dur={B[1] - B[0] + 2 * W} />
      </Sequence>
      <Sequence name="2.3 Visite" from={C[0] - W} durationInFrames={C[1] - C[0] + 2 * W}>
        <ShotVisite off={C[0] - W} dur={C[1] - C[0] + 2 * W} />
      </Sequence>
      <Sequence name="2.4 Écran partagé" from={D[0] - W} durationInFrames={D[1] - D[0] + W}>
        <ShotSplit off={D[0] - W} dur={D[1] - D[0] + W} />
      </Sequence>
      <FilmFinish vignette={0.28} warm={0.12} />
      <AbsoluteFill style={{ background: "#FFF3D6", opacity: flashOut, pointerEvents: "none" }} />
      <VoiceOver scene="S2-Depenses" />
      {/* SFX */}
      <Sfx name="swoosh" at={4} volume={0.35} />
      <Sfx name="cashout" at={42} volume={0.55} />
      <Sfx name="whip" at={A[1] - 6} volume={0.5} />
      <Sfx name="engine" at={B[0] - 4} volume={0.35} />
      <Sfx name="horn" at={B[0] + 6} volume={0.4} />
      <Sfx name="cashout" at={94} volume={0.5} />
      <Sfx name="whip" at={B[1] - 6} volume={0.5} />
      <Sfx name="squeak" at={C[0] + 2} volume={0.25} />
      <Sfx name="rumble" at={C[0] + 20} volume={0.4} />
      <Sfx name="notif" at={162} volume={0.3} />
      <Sfx name="cashout" at={186} volume={0.5} />
      <Sfx name="whip" at={C[1] - 6} volume={0.5} />
      <Sfx name="whoosh" at={D[0]} volume={0.4} />
      <Sfx name="cashout" at={220} volume={0.45} />
      <Sfx name="whoosh" at={D[0] + 26} volume={0.35} />
      <Sfx name="stamp" at={246} volume={0.7} />
      <Sfx name="paper" at={240} volume={0.3} />
      <Sfx name="whoosh" at={D[0] + 52} volume={0.35} />
      <Sfx name="cashout" at={270} volume={0.5} />
      <Sfx name="tick" at={222} volume={0.3} />
      <Sfx name="tick" at={248} volume={0.3} />
      <Sfx name="tick" at={274} volume={0.3} />
    </>
  );
};

export const Scene2Depenses = Interactive.create({ Component: Scene2Inner, layout: "absolute-fill" });

