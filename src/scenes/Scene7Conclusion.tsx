import React from "react";
import { AbsoluteFill, Img, Interactive, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../motion/Camera";
import { ShadeSet } from "../sets/Shade";
import { NewHouseSet } from "../sets/NewHouse";
import { CharacterG } from "../characters/Character";
import { SENAN, ZEM } from "../characters/bible";
import { EXPRESSIONS, mixFace } from "../characters/expressions";
import { LIMBS, RIDE, SIT, mixLimb } from "../characters/poses";
import { Moto } from "../props/Objects";
import { Banknote } from "../props/Money";
import { HouseBubble } from "../props/HouseBubble";
import { Phone } from "../vobi-ui/Phone";
import { LISTINGS, ListingRow } from "../vobi-ui/Screens";
import { EASE, blink, breathe, pop, prog } from "../motion/anim";
import { VoiceOver } from "../audio/VoiceOver";
import { Sfx } from "../audio/Sfx";
import { FONT } from "../theme/fonts";
import { ASSETS, BRAND, CTA, GRADIENTS } from "../config/brand";
import { SAFE } from "../config/video";

/**
 * SCÈNE 7 — Conclusion et appel à l'action (0:51,5–1:04)
 * 7.1 Trois bénéfices en rythme : le zém passe sans Sènan · le portefeuille
 *     reste plein · le téléphone se remplit de logements (+ bulle maison cochée).
 * 7.2 Devant sa nouvelle maison, clé en main ; clin d'œil sur « ça te tente ? » ;
 *     la clé se transforme en logo VOBI.
 * 7.3 Carton final : logo, bénéfices, bouton d'appel à l'action.
 */
const B1 = [0, 62] as const;
const B2 = [62, 112] as const;
const B3 = [112, 182] as const;
const HOUSE = [182, 280] as const;
const CARD = 280;

const Benefit: React.FC<{ label: string; frame: number; fps: number; y?: number }> = ({ label, frame, fps, y = 300 }) => {
  const k = spring({ frame, fps, config: { damping: 13, stiffness: 170 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          scale: String(k),
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 34px",
          borderRadius: 999,
          background: "#FFFFFF",
          boxShadow: "0 24px 50px -20px rgba(11,107,79,0.45)",
          border: `3px solid ${BRAND.lightGreen}`,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 50,
          color: BRAND.primary,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ width: 54, height: 54, borderRadius: 99, background: BRAND.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        {label}
      </div>
    </div>
  );
};

const ShotLessTrips: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zx = interpolate(f, [4, 56], [-300, 1400]);
  const wave = prog(f, 14, 22) * (1 - prog(f, 44, 52));
  return (
    <AbsoluteFill>
      <Camera zoom={1.12} focusX={540} focusY={1200}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <ShadeSet sway={Math.sin(f / 25) * 2} />
          {/* le zém passe… sans Sènan */}
          <g opacity={0.95}>
            <Moto x={zx} y={1330} scale={0.5} wheelRot={f * 25} />
            <CharacterG spec={ZEM} x={zx + 36} y={1322} scale={0.48} shadow={false} pose={{ ...RIDE, face: { ...EXPRESSIONS.ravi, lookX: 0.4 }, armL: { a: -40, b: 40 }, armR: { a: 150, b: 20 }, handR: "thumbUp", headTurn: 0.5, blink: blink(f, 2) }} />
          </g>
          <CharacterG
            spec={SENAN}
            x={560}
            y={1720}
            scale={1.2}
            pose={{
              ...SIT,
              face: mixFace(EXPRESSIONS.soulage, EXPRESSIONS.ravi, wave),
              armR: LIMBS.armPhoneR,
              handR: "phone",
              phoneGlow: 1,
              armL: mixLimb({ a: 14, b: 20 }, LIMBS.armWave, wave),
              handL: wave > 0.5 ? "open" : "none",
              handLTilt: Math.sin(f * 0.8) * 18 * wave,
              headTurn: -0.3 * wave,
              bob: breathe(f, fps) * 1.5,
              blink: blink(f, 4),
            }}
          />
        </svg>
      </Camera>
      <Benefit label="Moins de déplacements" frame={f - 4} fps={fps} />
    </AbsoluteFill>
  );
};

const ShotFullWallet: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 0, { damping: 12 });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #E6F6EC, ${BRAND.background})` }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 1000) scale(${2.2 * k}) rotate(${Math.sin(f / 8) * 2})`}>
          {/* billets qui dépassent du portefeuille plein */}
          {[-40, -10, 22].map((dx, i) => (
            <g key={i} transform={`translate(${dx} ${-70 - i * 6 - Math.sin(f / 6 + i) * 4}) rotate(${-14 + i * 12})`}>
              <Banknote value={i === 1 ? "10000" : "5000"} tint={i === 1 ? "violet" : "teal"} />
            </g>
          ))}
          <rect x={-130} y={-60} width={260} height={150} rx={22} fill="#6B4226" />
          <rect x={-130} y={-60} width={260} height={56} rx={22} fill="#83552F" />
          <circle cx={90} cy={-30} r={10} fill={BRAND.gold} />
          <path d="M -110 60 h 220" stroke="#5A361E" strokeWidth={4} strokeDasharray="10 8" />
        </g>
        {/* étincelles */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2 + f * 0.03;
          const r = 380 + Math.sin(f / 5 + i) * 20;
          return <path key={i} d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5 Z" fill={BRAND.gold} transform={`translate(${540 + Math.cos(a) * r} ${980 + Math.sin(a) * r * 0.7}) scale(${0.8 + 0.4 * Math.sin(f / 3 + i)})`} />;
        })}
      </svg>
      <Benefit label="Moins de dépenses" frame={f - 2} fps={fps} />
    </AbsoluteFill>
  );
};

const ShotPossibilities: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [...LISTINGS, ...LISTINGS];
  const checked = spring({ frame: f - 40, fps, config: { damping: 9, stiffness: 200 } }) * (f >= 40 ? 1 : 0);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #E6F6EC, ${BRAND.background})` }}>
      <Phone x={540} y={1060} width={520}>
        <div style={{ position: "absolute", top: 110, left: 14, right: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((l, i) => {
            const k = prog(f, 4 + i * 4, 14 + i * 4, EASE.out);
            return <ListingRow key={i} l={l} heart={i === 1 ? 1 : 0} style={{ opacity: k, translate: `${(1 - k) * 120}px 0px`, scale: String(0.9 + 0.1 * k) }} />;
          })}
        </div>
      </Phone>
      <HouseBubble x={800} y={560} scale={0.75 * pop(f, fps, 22, { damping: 11 })} rotate={6} checked={checked} />
      <Benefit label="Plus de possibilités" frame={f - 2} fps={fps} />
    </AbsoluteFill>
  );
};

const ShotNewHouse: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keyUp = pop(f, fps, 6, { damping: 12 });
  const shine = prog(f, 18, 30) * (1 - prog(f, 30, 44));
  const wink = prog(f, 66, 70) * (1 - prog(f, 82, 88));
  const zoom = interpolate(f, [0, 98], [1.12, 1.34], { extrapolateRight: "clamp", easing: EASE.inOut });
  return (
    <AbsoluteFill>
      <Camera zoom={zoom} focusX={540} focusY={1150}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <NewHouseSet sway={Math.sin(f / 20) * 6} />
          <CharacterG
            spec={SENAN}
            x={540}
            y={1700}
            scale={1.3}
            pose={{
              face: mixFace(EXPRESSIONS.ravi, EXPRESSIONS.clinOeil, wink),
              armR: mixLimb(LIMBS.armRest, { a: 40, b: 128 }, keyUp),
              handR: "key",
              armL: LIMBS.armRest,
              headTilt: wink * 6,
              bob: breathe(f, fps) * 2,
              blink: wink > 0.2 ? 0 : blink(f, 8),
            }}
          />
          {/* éclat sur la clé */}
          {shine > 0.01 ? (
            <path d="M0 -60 L12 -12 L60 0 L12 12 L0 60 L-12 12 L-60 0 L-12 -12 Z" fill="#FFF6C8" transform={`translate(668 1004) scale(${shine}) rotate(${f * 4})`} />
          ) : null}
        </svg>
      </Camera>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => spring({ frame: f - d, fps, config: { damping: 14, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 38%, #138A65 0%, ${BRAND.primary} 55%, ${BRAND.primaryDeep} 100%)`, alignItems: "center" }}>
      {/* motif V discret */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <path key={i} d="M0 0 L22 40 L44 0" stroke="#FFFFFF" strokeWidth={6} fill="none" transform={`translate(${(i % 6) * 190 + 20} ${Math.floor(i / 6) * 380 + 40 + ((f * 0.6) % 380)})`} />
        ))}
      </svg>
      <div style={{ position: "absolute", top: SAFE.top + 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ scale: String(s(0)), width: 330, height: 330, borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.45), 0 0 0 14px rgba(167,227,198,0.35)" }}>
          <Img src={ASSETS.logo} style={{ width: 200, height: "auto" }} />
        </div>
        <div style={{ scale: String(s(6)), fontFamily: FONT, fontWeight: 800, fontSize: 140, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1 }}>VOBI</div>
        <div style={{ opacity: s(12), translate: `0px ${(1 - s(12)) * 30}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: BRAND.lightGreen, textAlign: "center" }}>
          <span>Moins de déplacements</span>
          <span>Moins de dépenses</span>
          <span style={{ color: BRAND.gold }}>Plus de possibilités</span>
        </div>
        <div
          style={{
            marginTop: 26,
            scale: String(s(20) * (1 + 0.03 * Math.sin(f / 6))),
            padding: "30px 64px",
            borderRadius: 24,
            background: "#FFFFFF",
            color: BRAND.primary,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 56,
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.45), 0 0 0 8px rgba(244,196,48,0.45)",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span style={{ backgroundImage: GRADIENTS.wordmark, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{CTA.button}</span>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={BRAND.primary} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
        {CTA.url ? <div style={{ opacity: s(26), fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#FFFFFF" }}>{CTA.url}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const Scene7Inner: React.FC = () => {
  const frame = useCurrentFrame();
  // morphing clé → logo
  const morph = prog(frame, HOUSE[1] - 22, CARD + 6, EASE.inOut);
  const keyX = interpolate(morph, [0, 1], [668, 540]);
  const keyY = interpolate(morph, [0, 1], [1000, SAFE.top + 335]);
  return (
    <>
      <Sequence name="7.1a Moins de déplacements" from={B1[0]} durationInFrames={B1[1] - B1[0]}>
        <ShotLessTrips />
      </Sequence>
      <Sequence name="7.1b Moins de dépenses" from={B2[0]} durationInFrames={B2[1] - B2[0]}>
        <ShotFullWallet />
      </Sequence>
      <Sequence name="7.1c Plus de possibilités" from={B3[0]} durationInFrames={B3[1] - B3[0]}>
        <ShotPossibilities />
      </Sequence>
      <Sequence name="7.2 Nouvelle maison" from={HOUSE[0]} durationInFrames={CARD + 10 - HOUSE[0]}>
        <ShotNewHouse />
      </Sequence>
      <Sequence name="7.3 Carton final" from={CARD}>
        <AbsoluteFill style={{ clipPath: `circle(${interpolate(frame, [CARD, CARD + 16], [0, 1400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out })}px at 540px ${SAFE.top + 335}px)` }}>
          <EndCard />
        </AbsoluteFill>
      </Sequence>
      {/* clé qui se transforme en logo VOBI (le V et sa clé) */}
      {morph > 0.01 && morph < 1 ? (
        <div style={{ position: "absolute", left: keyX, top: keyY, translate: "-50% -50%", scale: String(interpolate(morph, [0, 1], [0.4, 1.1])), rotate: `${(1 - morph) * -30}deg` }}>
          <div style={{ width: 300, height: 300, borderRadius: 999, background: `rgba(255,255,255,${morph})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${80 * morph}px rgba(244,196,48,${0.6 * morph})` }}>
            <Img src={ASSETS.logo} style={{ width: 190, height: "auto", opacity: morph }} />
          </div>
        </div>
      ) : null}
      {/* coupe sèche entre bénéfices : petit flash */}
      {[B2[0], B3[0], HOUSE[0]].map((c) =>
        frame >= c && frame < c + 5 ? <AbsoluteFill key={c} style={{ background: "#FFFFFF", opacity: 1 - (frame - c) / 5 }} /> : null,
      )}
      <FilmFinish vignette={0.1} />
      <VoiceOver scene="S7-Conclusion" dark={frame < CARD} />
      <Sfx name="engine" at={2} volume={0.25} />
      <Sfx name="horn" at={20} volume={0.25} />
      <Sfx name="pop" at={4} volume={0.35} />
      <Sfx name="ding" at={B2[0] + 2} volume={0.35} />
      <Sfx name="sparkle" at={B2[0] + 4} volume={0.3} />
      <Sfx name="swoosh" at={B3[0]} volume={0.35} />
      <Sfx name="check" at={B3[0] + 40} volume={0.45} />
      <Sfx name="keylock" at={HOUSE[0] + 8} volume={0.45} />
      <Sfx name="sparkle" at={HOUSE[0] + 18} volume={0.35} />
      <Sfx name="whoosh" at={HOUSE[1] - 22} volume={0.4} />
      <Sfx name="signature" at={CARD + 2} volume={0.7} />
    </>
  );
};

export const Scene7Conclusion = Interactive.create({ Component: Scene7Inner, layout: "absolute-fill" });
