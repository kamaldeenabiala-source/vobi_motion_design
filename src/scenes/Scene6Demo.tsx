import React from "react";
import { AbsoluteFill, Interactive, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FilmFinish } from "../motion/Camera";
import { ShadeSet } from "../sets/Shade";
import { CharacterG } from "../characters/Character";
import { SENAN } from "../characters/bible";
import { EXPRESSIONS, mixFace } from "../characters/expressions";
import { LIMBS, SIT } from "../characters/poses";
import { BeninMap } from "../vobi-ui/BeninMap";
import { Phone, TapFinger } from "../vobi-ui/Phone";
import { HomeSearchScreen, LISTINGS, ListingRow, ListingsScreen, VerificationScreen, fmt, type FieldState } from "../vobi-ui/Screens";
import { HouseThumb } from "../vobi-ui/HouseThumb";
import { Icon } from "../vobi-ui/icons";
import { EASE, blink, breathe, pop, prog } from "../motion/anim";
import { VoiceOver } from "../audio/VoiceOver";
import { Sfx } from "../audio/Sfx";
import { FONT, TABULAR } from "../theme/fonts";
import { BRAND } from "../config/brand";

/**
 * SCÈNE 6 — Démonstration de VOBI (0:31–0:51,5)
 * 6.1 Carte du Bénin + pastilles de prix → plongée dans le téléphone.
 * 6.2 Ville · Quartier · Budget · Chambres (doigt de Sènan, au rythme de la voix).
 * 6.3 Résultats en cascade, cartes en éventail (CONSULTER).
 * 6.4 Favoris, cartes côte à côte (COMPARER).
 * 6.5 Vérification de terrain, coches + tampon « Vérifié » (VÉRIFIER).
 */
const T = {
  mapDraw: [8, 60],
  pinsFrom: 50,
  dive: [140, 172],
  ville: 196,
  quartier: 216,
  budget: 236,
  chambres: 262,
  tap: 298,
  list: 312,
  fanOut: [372, 396],
  fanBack: [424, 442],
  compare: [446, 520],
  verify: 520,
  checks: 548,
  stamp: 600,
} as const;

/** Étiquette de mot-clé animée (micro-étiquettes majuscules de la charte, agrandies). */
const Keyword: React.FC<{ label: string; at: number; out: number; x: number; y: number; frame: number; fps: number; icon?: Parameters<typeof Icon>[0]["name"] }> = ({ label, at, out, x, y, frame, fps, icon }) => {
  if (frame < at || frame > out + 12) return null;
  const k = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 180 } });
  const o = interpolate(frame, [out, out + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: String(k),
        opacity: o,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 24px",
        borderRadius: 999,
        background: BRAND.primary,
        color: "#FFFFFF",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 36,
        letterSpacing: "0.08em",
        boxShadow: "0 18px 40px -14px rgba(11,107,79,0.7)",
        whiteSpace: "nowrap",
      }}
    >
      {icon ? <Icon name={icon} size={34} color="#FFFFFF" stroke={2.6} /> : null}
      {label}
    </div>
  );
};

const field = (frame: number, at: number, value: string): FieldState => ({
  value: frame >= at ? value : "",
  active: interpolate(frame, [at - 10, at - 4, at + 10, at + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  filled: interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
});

/** Position logique (écran 390×844) des éléments tapés par le doigt. */
const TARGETS = {
  ville: { x: 100, y: 345 },
  quartier: { x: 285, y: 345 },
  budget: { x: 100, y: 411 },
  chambres: { x: 285, y: 411 },
  search: { x: 195, y: 578 },
};

const Scene6Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- 6.1 : coin d'ombre + carte ----------
  const intro = frame < T.dive[1] + 4;
  const diveK = prog(frame, T.dive[0], T.dive[1], EASE.in);
  const phoneInHand = { x: 600, y: 1170 };
  const stageZoom = interpolate(diveK, [0, 1], [1, 9]);
  const fadeToPhone = prog(frame, T.dive[1] - 10, T.dive[1] + 2);

  // ---------- Téléphone plein cadre ----------
  const phoneShow = frame >= T.dive[1] - 10;
  const phoneIn = spring({ frame: frame - (T.dive[1] - 6), fps, config: { damping: 18, stiffness: 120 } });
  const compareK = prog(frame, T.compare[0], T.compare[0] + 16, EASE.inOut) * (1 - prog(frame, T.compare[1] - 8, T.compare[1] + 6, EASE.inOut));
  const phoneW = interpolate(compareK, [0, 1], [600, 470]);
  const phoneY = interpolate(compareK, [0, 1], [880, 1080]);
  const orbit = Math.sin(frame / 50) * 4;
  const verifyZoom = prog(frame, T.verify + 16, T.checks - 2, EASE.inOut);

  // écran courant
  const listK = prog(frame, T.list, T.list + 12, EASE.out);
  const verifyK = prog(frame, T.verify, T.verify + 14, EASE.out);
  const reveal = (i: number) => prog(frame, T.list + 6 + i * 6, T.list + 18 + i * 6, EASE.out);
  const heart = (i: number) => prog(frame, T.compare[0] + 4 + i * 9, T.compare[0] + 14 + i * 9);
  const checks = (i: number) => prog(frame, T.checks + i * 11, T.checks + i * 11 + 8, EASE.out);
  const stamp = spring({ frame: frame - T.stamp, fps, config: { damping: 10, stiffness: 200 } }) * (frame >= T.stamp ? 1 : 0);
  const verifyScroll = interpolate(frame, [T.verify + 10, T.checks - 4], [0, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  // doigt : se déplace de cible en cible
  const fingerPath: Array<[number, { x: number; y: number }]> = [
    [T.ville - 14, TARGETS.ville],
    [T.quartier - 14, TARGETS.quartier],
    [T.budget - 14, TARGETS.budget],
    [T.chambres - 14, TARGETS.chambres],
    [T.tap - 12, TARGETS.search],
  ];
  let fx = 330;
  let fy = 900;
  for (let i = 0; i < fingerPath.length; i++) {
    const [at, p] = fingerPath[i];
    const prev = i === 0 ? { x: 330, y: 900 } : fingerPath[i - 1][1];
    const k = prog(frame, at - 10, at, EASE.inOut);
    if (frame >= at - 10) {
      fx = prev.x + (p.x - prev.x) * k;
      fy = prev.y + (p.y - prev.y) * k;
    }
  }
  const pressAt = [T.ville, T.quartier, T.budget, T.chambres, T.tap].find((a) => frame >= a - 4 && frame < a + 8);
  const press = pressAt !== undefined ? Math.sin(((frame - (pressAt - 4)) / 12) * Math.PI) : 0;
  const fingerOpacity = interpolate(frame, [T.ville - 30, T.ville - 20, T.tap + 6, T.tap + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // éventail (CONSULTER)
  const fanK = prog(frame, T.fanOut[0], T.fanOut[1], EASE.out) * (1 - prog(frame, T.fanBack[0], T.fanBack[1], EASE.in));
  const fanTargets = [
    { x: 230, y: 470, r: -9 },
    { x: 850, y: 640, r: 8 },
    { x: 250, y: 1230, r: 6 },
  ];

  // Sènan : expression
  const sFace = mixFace(EXPRESSIONS.motive, EXPRESSIONS.impressionne, prog(frame, 60, 80));

  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 55% at 50% 30%, #E3F5EA, ${BRAND.background})` }} />
      {intro ? (
        <AbsoluteFill style={{ opacity: 1 - fadeToPhone }}>
          <Camera zoom={stageZoom} focusX={phoneInHand.x} focusY={phoneInHand.y}>
            <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
              <ShadeSet sway={Math.sin(frame / 25) * 2} />
              <CharacterG
                spec={SENAN}
                x={560}
                y={1720}
                scale={1.2}
                pose={{
                  ...SIT,
                  face: { ...sFace, lookY: -0.5, lookX: -0.1 },
                  armR: LIMBS.armPhoneR,
                  handR: "phone",
                  phoneGlow: 1,
                  armL: { a: 14, b: 20 },
                  headTilt: -4 + Math.sin(frame / 18) * 2,
                  headNod: prog(frame, 80, 90) * (1 - prog(frame, 90, 100)),
                  bob: breathe(frame, fps) * 1.5,
                  blink: blink(frame, 5),
                }}
              />
            </svg>
            {/* carte « hologramme » au-dessus de Sènan */}
            <div style={{ position: "absolute", left: 300, top: 150, opacity: 1 - diveK * 1.4, scale: String(1 - diveK * 0.3), transformOrigin: "60% 100%" }}>
              <div style={{ position: "absolute", left: -40, top: -30, width: 540, height: 900, borderRadius: 40, background: "rgba(255,255,255,0.55)", border: "2px solid rgba(255,255,255,0.9)", boxShadow: "0 30px 80px -30px rgba(11,107,79,0.35)", backdropFilter: "blur(10px)", opacity: prog(frame, 0, 14) }} />
              <div style={{ position: "relative" }}>
              <BeninMap
                width={440}
                height={840}
                draw={prog(frame, T.mapDraw[0], T.mapDraw[1], EASE.inOut)}
                pin={(i) => pop(frame, fps, T.pinsFrom + i * 6, { damping: 10, stiffness: 200 })}
                highlight={prog(frame, 122, 132)}
              />
              </div>
            </div>
          </Camera>
        </AbsoluteFill>
      ) : null}

      {phoneShow ? (
        <AbsoluteFill style={{ opacity: prog(frame, T.dive[1] - 10, T.dive[1]) }}>
          {/* éléments décoratifs : halo */}
          <div style={{ position: "absolute", left: 540 - 420, top: phoneY - 420, width: 840, height: 840, borderRadius: 999, background: "radial-gradient(circle, rgba(16,185,129,0.22), transparent 65%)" }} />
          <div style={{ position: "absolute", inset: 0, scale: String(interpolate(phoneIn, [0, 1], [1.6, 1]) * (1 + 0.32 * verifyZoom)), transformOrigin: "50% 38%", rotate: `${orbit * 0.15}deg` }}>
            <Phone x={540} y={phoneY} width={phoneW} rotateY={orbit}>
              {/* 6.2 recherche */}
              {listK < 1 ? (
                <div style={{ position: "absolute", inset: 0, translate: `${-listK * 390}px 0px` }}>
                  <HomeSearchScreen
                    ville={field(frame, T.ville, "Cotonou")}
                    quartier={field(frame, T.quartier, "Akpakpa")}
                    budget={field(frame, T.budget, `${fmt(50000)} FCFA`)}
                    chambres={field(frame, T.chambres, "1 +")}
                    searchPress={prog(frame, T.tap - 4, T.tap + 8)}
                  />
                </div>
              ) : null}
              {/* 6.3 – 6.4 résultats */}
              {frame >= T.list && verifyK < 1 ? (
                <div style={{ position: "absolute", inset: 0, translate: `${(1 - listK) * 390 - verifyK * 390}px 0px` }}>
                  <ListingsScreen reveal={reveal} heart={heart} />
                </div>
              ) : null}
              {/* 6.5 vérification */}
              {frame >= T.verify ? (
                <div style={{ position: "absolute", inset: 0, translate: `${(1 - verifyK) * 390}px 0px` }}>
                  <VerificationScreen checks={checks} stamp={stamp} scroll={verifyScroll} />
                </div>
              ) : null}
              {/* doigt de Sènan */}
              {fingerOpacity > 0 ? <TapFinger x={fx} y={fy} press={press} opacity={fingerOpacity} /> : null}
            </Phone>
          </div>

          {/* 6.3 cartes en éventail autour du téléphone */}
          {fanK > 0.01
            ? LISTINGS.slice(0, 3).map((l, i) => {
                const tgt = fanTargets[i];
                const k = prog(frame, T.fanOut[0] + i * 3, T.fanOut[1] + i * 3, EASE.out) * (1 - prog(frame, T.fanBack[0], T.fanBack[1], EASE.in));
                const x = 540 + (tgt.x - 540) * k;
                const y = 900 + (tgt.y - 900) * k;
                return (
                  <div key={l.id} style={{ position: "absolute", left: x, top: y, width: 390, translate: "-50% -50%", scale: String(0.5 + 0.9 * k), rotate: `${tgt.r * k}deg`, opacity: Math.min(1, k * 2) }}>
                    <ListingRow l={l} style={{ boxShadow: "0 30px 60px -20px rgba(15,23,42,0.45)" }} />
                  </div>
                );
              })
            : null}

          {/* 6.4 comparaison côte à côte */}
          {compareK > 0.01 ? (
            <div style={{ position: "absolute", left: 0, top: 230, width: 1080, display: "flex", justifyContent: "center", gap: 18 }}>
              {[LISTINGS[1], LISTINGS[0], LISTINGS[3]].map((l, i) => {
                const k = prog(frame, T.compare[0] + 30 + i * 5, T.compare[0] + 44 + i * 5, EASE.out) * (1 - prog(frame, T.compare[1] - 8, T.compare[1], EASE.in));
                return (
                  <div
                    key={l.id}
                    style={{
                      width: 300,
                      borderRadius: 26,
                      background: "#FFFFFF",
                      boxShadow: "0 24px 50px -24px rgba(15,23,42,0.45)",
                      overflow: "hidden",
                      opacity: k,
                      translate: `0px ${(1 - k) * 80}px`,
                      fontFamily: FONT,
                      border: i === 1 ? `4px solid ${BRAND.emerald}` : `1px solid ${BRAND.border}`,
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <HouseThumb variant={l.thumb} width={300} height={150} />
                      <div style={{ position: "absolute", right: 12, top: 12, width: 40, height: 40, borderRadius: 99, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="heart" size={22} color="#E11D48" fill="#E11D48" />
                      </div>
                    </div>
                    <div style={{ padding: "14px 18px 18px" }}>
                      <div style={{ fontSize: 30, fontWeight: 800, color: BRAND.primary, ...TABULAR }}>{fmt(l.price)} F</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: BRAND.slate900, marginTop: 2 }}>{l.type}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, fontSize: 19, color: BRAND.muted, fontWeight: 600 }}>
                        {(
                          [
                            ["bed", `${l.rooms} ch. · ${l.area} m²`],
                            ["droplet", "Eau"],
                            ["zap", "Électricité"],
                          ] as const
                        ).map(([ic, t]) => (
                          <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Icon name={ic} size={20} color={BRAND.primary} /> {t}
                            {ic !== "bed" ? (
                              <span style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: 99, background: BRAND.emerald, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon name="check" size={14} color="#fff" stroke={3.4} />
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* mots-clés */}
          <Keyword label="VILLE" icon="mapPin" at={T.ville - 2} out={T.quartier - 6} x={300} y={250} frame={frame} fps={fps} />
          <Keyword label="QUARTIER" icon="building" at={T.quartier - 2} out={T.budget - 6} x={770} y={250} frame={frame} fps={fps} />
          <Keyword label="BUDGET" icon="wallet" at={T.budget - 2} out={T.chambres - 6} x={300} y={250} frame={frame} fps={fps} />
          <Keyword label="CHAMBRES" icon="bed" at={T.chambres - 2} out={T.tap} x={770} y={250} frame={frame} fps={fps} />
          <Keyword label="CONSULTER" icon="search" at={T.fanOut[0] - 6} out={T.fanBack[0]} x={760} y={1250} frame={frame} fps={fps} />
          <Keyword label="COMPARER" icon="heart" at={T.compare[0] + 10} out={T.compare[1] - 10} x={540} y={185 + 600} frame={frame} fps={fps} />
          <Keyword label="VÉRIFIER" icon="shieldCheck" at={T.checks - 6} out={615} x={720} y={1080} frame={frame} fps={fps} />
        </AbsoluteFill>
      ) : null}

      {/* fondu d'entrée depuis l'onde VOBI */}
      <AbsoluteFill style={{ background: BRAND.background, opacity: interpolate(frame, [0, 8], [1, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />
      <FilmFinish vignette={0.1} />
      <VoiceOver scene="S6-Demo" dark />
      {/* SFX interface */}
      <Sfx name="swoosh" at={T.mapDraw[0]} volume={0.3} />
      {Array.from({ length: 13 }).map((_, i) => (
        <Sfx key={i} name="pop" at={T.pinsFrom + i * 6} volume={0.18} label={`SFX pastille ${i + 1}`} />
      ))}
      <Sfx name="whoosh" at={T.dive[0] + 6} volume={0.5} />
      <Sfx name="notif" at={T.dive[1]} volume={0.35} />
      <Sfx name="tap" at={T.ville} volume={0.5} />
      <Sfx name="tick" at={T.ville + 2} volume={0.35} />
      <Sfx name="tap" at={T.quartier} volume={0.5} />
      <Sfx name="tick" at={T.quartier + 2} volume={0.35} />
      <Sfx name="tap" at={T.budget} volume={0.5} />
      <Sfx name="tick" at={T.budget + 2} volume={0.35} />
      <Sfx name="tap" at={T.chambres} volume={0.5} />
      <Sfx name="tick" at={T.chambres + 2} volume={0.35} />
      <Sfx name="tap" at={T.tap} volume={0.6} />
      <Sfx name="swoosh" at={T.list} volume={0.35} />
      <Sfx name="whoosh" at={T.fanOut[0]} volume={0.4} />
      <Sfx name="swoosh" at={T.fanBack[0]} volume={0.3} />
      <Sfx name="pop" at={T.compare[0] + 4} volume={0.35} />
      <Sfx name="pop" at={T.compare[0] + 13} volume={0.35} />
      <Sfx name="pop" at={T.compare[0] + 22} volume={0.35} />
      <Sfx name="swoosh" at={T.compare[0] + 30} volume={0.35} />
      <Sfx name="swoosh" at={T.verify} volume={0.35} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={`c${i}`} name="check" at={T.checks + i * 11} volume={0.4} label={`SFX coche ${i + 1}`} />
      ))}
      <Sfx name="stamp" at={T.stamp} volume={0.6} />
    </>
  );
};

export const Scene6Demo = Interactive.create({ Component: Scene6Inner, layout: "absolute-fill" });
